# Fase 2 — Detección y análisis de errores

## Caso 1: El recaudo se marcó como pagado, pero el comercio nunca recibió el dinero

**Causa raíz:** acá el bug es simple pero peligroso — la app decide que algo está
"Pagado" con la condición `state != "created"`, en vez de preguntar directamente si
`state === "paid"`. El problema es que `minimum_paid` también pasa esa prueba. En este
caso puntual, el comercio esperaba $50.000 (`total_maximum_amount`) y solo le habían
llegado $20.000 (`paid_amount`) — pero como el estado ya no era `"created"`, la UI lo
marcó como cerrado antes de tiempo.

**Referencia en la documentación:** `GET /api/v1/collections/{id}` documenta seis
estados posibles para un recaudo (`created`, `ready`, `minimum_paid`, `paid`,
`discarded`, `failed`). `minimum_paid` es un punto intermedio, no el cierre — son cosas
distintas aunque suenen parecido.

**Corrección:** hay que comparar explícitamente contra `"paid"`, no solo contra
`"created"`. Mientras esté en `minimum_paid`, mostrar algo como "Pago parcial recibido"
y seguir aceptando pagos hasta llegar al máximo o hasta que expire.

## Caso 2: Una transferencia aparece como "exitosa" y minutos después figura como fallida

**Causa raíz:** acá el problema es de expectativas: la app ve un `202 Accepted` en
`POST /api/v1/outgoing_transfers` y ya la marca como "Transferencia exitosa". Pero
ese 202 solo dice que Bre-B *aceptó* la solicitud (`state: "processing"`) — todavía no
confirma que el dinero llegó. El resultado real llega después, de forma asíncrona; en
este caso puntual, el webhook `outgoing_transfer.failed` reportó
`state_reason: "provider_unavailable"` minutos más tarde.

**Referencia en la documentación:** el ciclo de vida completo de una transferencia
tiene diez estados posibles (`created`, `processing`, `target_resolved`, `held`,
`sent_to_breb_provider`, `successful`, `failed`, `canceled`, `reversed`, `reapplied`).
Solo `successful` y `failed` son terminales — `processing` es apenas el punto de
partida. `provider_unavailable` está documentado como uno de los motivos posibles de
`state_reason`.

**Corrección:** nunca dar por exitosa una transferencia solo por la respuesta síncrona
del POST. Hay que esperar a un estado terminal real (`successful`, `failed`, `canceled`
o `reversed`), ya sea consultando `GET /api/v1/outgoing_transfers/{id}` o escuchando el
webhook, y recién ahí actualizar lo que se muestra o se concilia en contabilidad.

## Caso 3: Todas las peticiones responden 401

**Causa raíz:** el error dice `invalid_token`, con el mensaje "Authorization header is
missing or invalid" — eso casi siempre significa que el token ya venció (en sandbox
dura `expires_in: 1800` segundos, media hora) y la integración lo sigue usando como si
nada, en vez de pedir uno nuevo cuando el servidor le dice que ya no sirve.

**Referencia en la documentación:** `POST /api/v1/oauth/token` documenta que la
respuesta trae `expires_in`. Y el formato de error es el mismo en cualquier endpoint:
`{code, message, id, errors: [{error_code: "invalid_token", ...}]}` — así que un 401
con ese código siempre apunta a lo mismo.

**Corrección:** guardar el token junto con su fecha de expiración y renovarlo antes de
que se venza (o, mínimo, detectar el primer 401, pedir un token nuevo y reintentar esa
misma petición una vez) — en vez de dejar que todas las llamadas siguientes fallen en
cadena.

## Caso 4: Se quería cobrar $50.000, pero al cliente le cobraron $500

**Causa raíz:** este es el clásico error de unidades — en la API de Bre-B los montos
van en **centavos**, no en pesos. La integración mandó
`"total_maximum_amount": {"amount": 50000, "currency": "COP"}` pensando que eso eran
$50.000, pero 50.000 centavos son en realidad $500. El sistema hizo exactamente lo que
se le pidió; el problema fue lo que se le pidió.

**Referencia en la documentación:** el campo `total_maximum_amount.amount` en
`POST /api/v1/collections` está documentado como "Amount of money in `cents`". Para
representar $50.000 COP el valor correcto era `5000000` (50.000 × 100), no `50000`.

**Corrección:** convertir siempre de pesos a centavos (`pesos * 100`) antes de mandar
cualquier campo `amount` a la API. Vale la pena además agregar una prueba unitaria que
fije ese factor de conversión, para que este error no se repita más adelante sin que
nadie lo note.

## Caso 5: Una transferencia nunca llega a su destino

**Causa raíz:** la llave que se mandó, `MN1234567890`, se resolvió como
`format: "plain_key"` y Bre-B la rechazó con `state_reason: "invalid_key_format"`.
Comparándola con los ejemplos reales de la documentación (`@MONO1A2B3C4D5E`,
`@MNDESTINATARIO`, `@MNCLIENTE123`, `@MNPROVEEDOR6`, incluso el ejemplo del propio
sandbox, `@MN1234567890`), la diferencia salta a la vista: a esta llave le falta el `@`
al inicio. Sin ese símbolo, Bre-B no la reconoce como un alias válido.

**Referencia en la documentación:** `POST /api/v1/targets/resolve` técnicamente acepta
cualquier texto sin espacios como `plain_key` (`pattern: ^\S+$`) — esa validación es
solo de forma. La que realmente exige el `@` para llaves alfanuméricas es la red Bre-B
misma. `invalid_key_format` está documentado como uno de los `state_reason` tanto para
el webhook `target_resolution.failed` como para transferencias.

**Corrección:** validar del lado del cliente, antes de llamar a `/targets/resolve`,
que las llaves alfanuméricas empiecen con `@`. De paso, mostrar ese requisito
directamente en el formulario de transferencias para que nadie pueda mandar una llave
mal formada desde un principio.

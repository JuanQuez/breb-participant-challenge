# Bre-B Participant Challenge

Integración con la API de **Bre-B Participant** de Mono (recaudos y transferencias
salientes) para el reto técnico de Tech Support Internship.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS (paleta de marca Mono)
- Vitest + Testing Library para pruebas unitarias
- Sin base de datos: el sandbox de Bre-B es la única fuente de verdad para listar/consultar.

## Requisitos

- Node.js 20+
- Credenciales de sandbox de Bre-B Participant (`client_id`, `client_secret`, `tenant_account_id`)

## Configuración

1. Instala dependencias:

   ```bash
   npm install
   ```

2. Copia `.env.example` a `.env.local` y completa los valores:

   ```bash
   cp .env.example .env.local
   ```

   | Variable | Descripción |
   |---|---|
   | `MONO_BREB_BASE_URL` | Base URL del sandbox (`https://breb-participant.sandbox.mono.la`) |
   | `MONO_BREB_CLIENT_ID` | Client ID de OAuth 2.0 |
   | `MONO_BREB_CLIENT_SECRET` | Client secret de OAuth 2.0 |
   | `MONO_BREB_TENANT_ACCOUNT_ID` | Cuenta tenant que crea los recaudos/transferencias |

   Estas credenciales nunca llegan al navegador: solo se usan en los route handlers de
   servidor (`src/app/api/**`).

## Ejecutar en desarrollo

```bash
npm run dev
```

Abre http://localhost:3000. Desde ahí puedes ir a **Recaudos** o **Transferencias**.

## Pruebas

```bash
npm test
```

## Build de producción

```bash
npm run build
npm start
```

## Endpoints implementados

| Ruta local | Método | Llama a Bre-B |
|---|---|---|
| `/api/collections` | GET, POST | `GET/POST /api/v1/collections` |
| `/api/collections/[id]` | GET | `GET /api/v1/collections/{id}` |
| `/api/targets/resolve` | POST | `POST /api/v1/targets/resolve` |
| `/api/transfers` | GET, POST | `GET/POST /api/v1/outgoing_transfers` |
| `/api/transfers/[id]` | GET | `GET /api/v1/outgoing_transfers/{id}` |

## Arquitectura

- `src/lib/mono/` — cliente de la API de Bre-B, sin dependencias de React: manejo de auth
  (OAuth `client_credentials` con cache y refresh en 401), normalización de errores, y
  funciones tipadas por dominio (`collections.ts`, `transfers.ts`).
- `src/app/api/**` — route handlers delgados: parsean el request, llaman a `lib/mono`,
  devuelven JSON.
- `src/components/` — componentes de UI, separados en `ui/` (primitivas reutilizables) y
  por dominio (`collections/`, `transfers/`).
- `src/hooks/usePolling.ts` — hook genérico que hace polling de un recurso hasta que llega
  a un estado terminal (usado para mostrar el ciclo de vida real de recaudos y
  transferencias, sin depender de webhooks/ngrok).

## Notas de diseño

- **Polling en vez de webhooks**: decisión deliberada para que cualquiera pueda correr el
  proyecto localmente sin exponer un endpoint público.
- **Sin base de datos propia**: list/detail siempre reflejan el estado real en Bre-B.
- Ver `docs/fase2-diagnostico.md` para el análisis de la Fase 2 (diagnóstico de errores).
- Ver `PROMPTS.md` para la evidencia de uso de IA durante el desarrollo.

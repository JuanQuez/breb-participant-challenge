# Evidencia de uso de IA

Este proyecto se construyó como un flujo de trabajo colaborativo entre el desarrollador
(**Juan Quéz**) y **Claude Code** (Anthropic): el desarrollador dirigió los requisitos,
tomó las decisiones de producto/arquitectura de alto nivel y aprobó cada fase antes de
avanzar; Claude Code ejecutó la implementación, la investigación de la documentación de
Bre-B y la verificación (tests, build, curl contra el sandbox real).

## Dirección y decisiones del desarrollador

- **Requisitos no negociables definidos por el desarrollador**: buenas prácticas de
  desarrollo, código limpio, estructura de proyecto organizada, convenciones de
  nomenclatura y **modularidad**, bajo un flujo de **git flow completo** (`main` +
  `develop` + una rama `feature/*` por bloque de trabajo, con el primer push conteniendo
  el scaffold y el sistema de diseño listo para usar). El desarrollador creó y gestionó
  personalmente el repositorio remoto en GitHub.
- **Identidad visual y de marca**: el desarrollador definió usar la paleta e identidad de
  Mono manteniendo un diseño minimalista; Claude Code extrajo los valores hexadecimales
  reales revisando el CSS público de mono.la bajo esa dirección. El desarrollador curó y
  aportó personalmente los recursos gráficos reales del proyecto (favicon, isotipo de
  Mono, logo de Bre-B).
- **Decisiones y aprobaciones en el diseño técnico**: stack (Next.js + TypeScript), manejo
  de estado asíncrono (polling en vez de webhooks, para no depender de ngrok), y alcance
  del git flow (completo, no simplificado). El desarrollador aprobó el plan de
  implementación completo —incluyendo pruebas unitarias con Vitest y TDD— antes de que se
  escribiera código.
- **Gestión de credenciales**: el desarrollador obtuvo y proporcionó personalmente las
  credenciales del sandbox de Bre-B (vía Bitwarden Send), y validó que quedaran fuera del
  control de versiones.
- **Dirección de la fase de refinamiento de UI**: el desarrollador propuso la estrategia
  de rama (`feature/refine-uix`) para el pulido visual, organizó y aportó los recursos
  gráficos de marca, y dirigió su ubicación en la interfaz (logo en el header, acento en
  el hero) revisando y ajustando manualmente cada propuesta antes de aceptarla. El bloque
  de metadatos de íconos y el ajuste de título en `layout.tsx`/`page.tsx` fueron escritos
  directamente por el desarrollador, con apoyo de GitHub Copilot CLI para ese cambio
  puntual.
- **Control de calidad del entregable**: el desarrollador solicitó la auditoría manual
  final, preguntó explícitamente sobre el bloqueo del sandbox. Revisó y aprobó la solución planteada por el agente.

## Lo que ejecutó Claude Code (bajo esa dirección)

1. **Comprensión del challenge**: lectura completa del PDF (contexto, Fase 1, Fase 2,
   entregables) antes de proponer cualquier enfoque; el desarrollador leyó el documento
   completo y participó activamente en la interpretación de sus requisitos a lo largo de
   todo el proceso.
2. **Investigación de la documentación real de Bre-B**: en vez de asumir la forma de la
   API, se extrajeron endpoints, campos, estados y códigos de error reales desde
   `docs.mono.la/docs/api-reference/breb-participant`. El desarrollador conoce y validó
   los endpoints resultantes de la integración.
3. **Diseño técnico dirigido por skills** (`superpowers:brainstorming`,
   `superpowers:writing-plans`): arquitectura por capas (`lib/mono/` sin dependencias de
   React, rutas API delgadas, componentes de UI separados por dominio), presentada en
   preguntas dirigidas en cada punto de control, con el desarrollador decidiendo y
   aprobando antes de avanzar a la siguiente fase. A través de este proceso, el
   desarrollador adquirió conocimiento directo del flujo de trabajo basado en skills de
   Claude Code, al participar activamente en cada punto de control durante la
   construcción del proyecto.
4. **Implementación dirigida por subagentes** (`superpowers:subagent-driven-development`):
   un subagente implementador por tarea siguiendo TDD, un revisor de spec/calidad por
   tarea, y una revisión final de rama completa antes de cerrar.
5. **Implementación**: cada módulo (`lib/mono/*`, rutas API, componentes de UI) escrito
   siguiendo TDD, con pruebas unitarias en Vitest antes de la implementación.
6. **Diagnóstico de la Fase 2**: los 5 casos de `docs/fase2-diagnostico.md` fueron
   explicados por Claude Code al desarrollador, citando directamente los campos/estados
   confirmados en la documentación oficial, hasta que el desarrollador comprendió cómo se
   manejaba cada uno.

## Herramienta

- Claude Code (Sonnet 5), CLI oficial de Anthropic para desarrollo asistido por IA.

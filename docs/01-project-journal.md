# Taxi Finance — Project Journal

## Objetivo del proyecto

Taxi Finance es una aplicación pensada para ayudar a conductores de taxi a registrar su jornada diaria, viajes, gastos, combustible y liquidaciones mensuales.

El objetivo principal es reemplazar el uso manual de WhatsApp, calculadora y cuaderno por una herramienta rápida, clara y confiable.

---

## Sprint 1 — Base inicial del proyecto

**Objetivo:** crear la base técnica de Taxi Finance.

**Trabajo realizado:**
- Creación del repositorio local.
- Conexión con GitHub.
- Configuración inicial de Node.js y Express.
- Creación del endpoint `/health`.
- Primeras pruebas con Thunder Client.

**Resultado:** API inicial funcionando.

**Aprendizaje clave:** estructura básica de una API Express y flujo Git/GitHub.

---

## Sprint 2 — Jornadas de trabajo

**Objetivo:** registrar jornadas laborales.

**Trabajo realizado:**
- Creación de tabla `work_days`.
- Endpoint `POST /work-days`.
- Endpoint `GET /work-days`.
- Validaciones iniciales de fecha, kilómetros y gasolina.

**Resultado:** el sistema puede guardar y listar jornadas.

**Aprendizaje clave:** conexión entre Express, MySQL y Thunder Client.

---

## Sprint 3 — Resumen mensual inicial

**Objetivo:** empezar a calcular información mensual.

**Trabajo realizado:**
- Creación de módulo de resumen mensual.
- Endpoint con parámetro `month`.
- Primeras reglas de negocio: efectivo, datáfono, gasolina.

**Resultado:** primer cálculo financiero mensual.

**Aprendizaje clave:** diferencia entre guardar datos y generar información útil.

---

## Sprint 4 — Gestión de viajes

**Objetivo:** registrar viajes individuales dentro de una jornada.

**Trabajo realizado:**
- Creación de tabla `trips`.
- Relación `trips.work_day_id` con `work_days.id`.
- Endpoint `POST /trips`.
- Endpoint `GET /trips?workDayId=...`.
- Endpoint `PUT /trips/:id`.
- Endpoint `DELETE /trips/:id`.

**Resultado:** CRUD completo de viajes funcionando.

**Aprendizaje clave:** construcción completa de un módulo con crear, leer, actualizar y eliminar.

---

## Sprint 5 — Refactor de arquitectura

**Objetivo:** mejorar la estructura del backend.

**Trabajo realizado:**
- Creación de carpeta `repositories`.
- Movimiento de archivos de acceso a MySQL desde `services` hacia `repositories`.
- Separación clara de responsabilidades:
  - Routes: URLs.
  - Controllers: petición y respuesta HTTP.
  - Services: reglas de negocio.
  - Repositories: consultas SQL.

**Resultado:** arquitectura más limpia y mantenible.

**Aprendizaje clave:** importancia de la separación de responsabilidades.

---

## Sprint 6 — Resumen inteligente de jornada

**Objetivo:** calcular automáticamente el resumen financiero de una jornada.

**Trabajo realizado:**
- Eliminación de `cash` y `card` de `work_days`.
- Los totales se calculan desde `trips`.
- Creación de:
  - `workDaySummaryRepository`
  - `workDaySummaryService`
  - `workDaySummaryController`
  - `workDaySummaryRoutes`
- Endpoint `GET /work-days/:id/summary`.

**Resultado:** la API calcula automáticamente:
- kilómetros trabajados;
- cantidad de viajes;
- efectivo;
- datáfono;
- facturación total;
- gasolina propia;
- gasolina José;
- efectivo a rendir;
- promedio por viaje.

**Aprendizaje clave:** evitar duplicación de datos y calcular información desde la fuente real.

---

## Estado actual

Taxi Finance ya tiene:

- Backend Express funcionando.
- Base de datos MySQL.
- Arquitectura por capas.
- CRUD completo de viajes.
- Jornadas de trabajo.
- Resumen inteligente de jornada.
- Primeras reglas reales de negocio del taxi.

---

## Próximo objetivo

Empezar el frontend en React para visualizar:

- jornadas;
- viajes;
- resumen diario;
- futuros cierres mensuales.
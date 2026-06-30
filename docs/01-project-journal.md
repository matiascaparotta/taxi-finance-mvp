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
---

## Sprint 7 — Frontend React (MVP)

**Objetivo:** construir la primera interfaz de Taxi Finance.

### Trabajo realizado

- Creación del cliente React con Vite.
- Integración con Tailwind CSS.
- Diseño inicial responsive orientado a móvil.
- Creación de componentes reutilizables:
  - Button
  - Card
  - SectionTitle
  - Stat
  - WorkDayCard
- Conexión del frontend con la API Express.
- Visualización de jornadas desde MySQL.
- Creación de la pantalla Home.
- Creación de la pantalla Nueva Jornada.

### Resultado

Taxi Finance deja de ser solamente una API y pasa a tener una interfaz moderna y funcional.

### Aprendizaje clave

Separación entre frontend y backend, reutilización de componentes y consumo de APIs desde React.

---

## Sprint 8 — Jornadas activas

**Objetivo:** adaptar la aplicación al flujo real de trabajo de un taxista.

### Trabajo realizado

- Se incorporó el estado de jornada:
  - OPEN
  - CLOSED
- Se modificó la base de datos para permitir jornadas abiertas.
- Se implementó la regla de negocio:
  - Un conductor solo puede tener una jornada OPEN.
- Creación del endpoint:

GET /work-days/open

- El frontend consulta automáticamente la jornada activa.
- La Home cambia dinámicamente según el estado de la jornada.
- Se añadió la pantalla "Jornada activa".
- Se impide iniciar una segunda jornada mientras exista otra abierta.

### Resultado

Taxi Finance comienza a comportarse como una aplicación real de gestión diaria y no solamente como un sistema de registro.

### Aprendizaje clave

Modelar correctamente el negocio antes que la interfaz.

---

## Estado actual

Actualmente Taxi Finance dispone de:

### Backend

- Express
- MySQL
- Arquitectura por capas
- CRUD de viajes
- Jornadas
- Resúmenes automáticos
- Reglas de negocio

### Frontend

- React + Vite
- Tailwind CSS
- Home responsive
- Nueva jornada
- Componentes reutilizables
- Detección automática de jornada activa

### Flujo actual

Iniciar jornada

↓

Jornada OPEN

↓

Home cambia automáticamente

↓

Registrar viajes (próximo paso)

↓

Cerrar jornada

↓

Liquidación automática

---

## Próximo Sprint

### Sprint 9

Registro de viajes en tiempo real durante una jornada activa.

Posteriormente:

- cierre de jornada;
- liquidación automática;
- estadísticas;
- historial mensual;
- exportación PDF;
- dashboard financiero.
---

## Sprint 9 — Gestión de viajes en tiempo real

**Objetivo:** permitir registrar viajes durante una jornada activa y visualizar la información en tiempo real.

### Trabajo realizado

- Creación de la pantalla `NewTripPage`.
- Navegación desde la Home para registrar viajes.
- Integración con la API para crear viajes.
- Consulta automática de la jornada activa.
- Visualización del resumen de la jornada activa.
- Creación del componente de resumen reutilizable (inicio de la refactorización).
- Visualización de los últimos viajes registrados.
- Orden cronológico de los viajes (más reciente primero).

### Mejoras de UX definidas

- Futuro teclado numérico optimizado para conductores.
- Flujo rápido de registro de viajes.
- Confirmación antes de eliminar un viaje.
- Posibilidad de editar viajes.
- Separación entre resumen operativo y resumen personal.

### Resultado

Taxi Finance ya permite trabajar durante una jornada activa registrando viajes y viendo la evolución de la facturación en tiempo real.

### Aprendizaje clave

La interfaz debe adaptarse al flujo real de trabajo del conductor y mostrar siempre el estado actual de la jornada.

---

## Sprint 10 — Cierre completo de jornada

**Objetivo:** completar el flujo real de finalización de una jornada de trabajo.

### Trabajo realizado

- Creación del endpoint `PUT /work-days/:id/close`.
- Implementación de `closeWorkDayRepository`.
- Implementación de `closeWorkDayService`.
- Implementación de `closeWorkDayController`.
- Creación de la pantalla `CloseWorkDayPage`.
- Creación del componente reutilizable `WorkDaySummaryCard`.
- Integración del resumen de la jornada antes del cierre.
- Validación del kilometraje final.
- Validación del combustible (permitiendo 0 €).
- Cálculo en tiempo real de los kilómetros trabajados.
- Confirmación antes de cerrar la jornada.
- Cambio automático del estado de `OPEN` a `CLOSED`.
- Regreso automático al Dashboard tras finalizar la jornada.

### Mejoras de UX

- Visualización del kilometraje inicial.
- Cálculo inmediato de kilómetros trabajados mientras el usuario escribe.
- Mensajes de error claros.
- Confirmación antes de ejecutar una acción irreversible.

### Resultado

Taxi Finance ya permite completar el ciclo completo de una jornada:

- iniciar turno;
- registrar viajes;
- consultar el resumen en tiempo real;
- finalizar la jornada;
- guardar combustible;
- registrar kilometraje final;
- cerrar la jornada correctamente.

### Aprendizaje clave

Separar la lógica de negocio en Repository, Service y Controller facilita añadir nuevas funcionalidades sin romper las existentes. Además, diseñar la interfaz siguiendo el flujo real de trabajo del conductor mejora significativamente la experiencia de uso.

---

## Sprint 11 — Ticket de jornada

**Objetivo:** mostrar un resumen final de la jornada una vez cerrado el turno.

### Trabajo realizado

- Creación del componente reutilizable `WorkDayTicket`.
- Creación de la pantalla `WorkDayClosedPage`.
- Creación del endpoint `GET /work-days/:id`.
- Integración del ticket con datos reales de la jornada cerrada.
- Integración del ticket con el resumen de jornada.
- Navegación automática desde el cierre de jornada hacia el ticket final.
- Visualización de:
  - fecha;
  - viajes;
  - kilómetros trabajados;
  - facturación;
  - efectivo;
  - datáfono;
  - combustible.

### Resultado

Al cerrar una jornada, Taxi Finance muestra un ticket final con la información operativa del turno.

### Aprendizaje clave

Una misma vista de resumen puede reutilizarse en varias partes de la aplicación: cierre de jornada, historial, PDF y compartir.
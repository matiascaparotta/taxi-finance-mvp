# Taxi Finance — Architecture Decisions

---

## ADR-001

### Eliminar cash y card de work_days

Fecha:

30/06/2026

Motivo:

Evitar duplicación de datos.

Decisión:

Los importes de efectivo y datáfono se calcularán siempre a partir de la tabla trips.

Beneficio:

Existe una única fuente de verdad.

---

## ADR-002

### Crear la capa Repositories

Fecha:

30/06/2026

Motivo:

Separar las consultas SQL de las reglas de negocio.

Decisión:

Toda consulta a MySQL debe realizarse desde la carpeta repositories.

Beneficio:

Código más limpio y mantenible.

---

## ADR-003

### Arquitectura por capas

Fecha:

30/06/2026

Decisión:

El backend seguirá la estructura:

Routes

↓

Controllers

↓

Services

↓

Repositories

↓

MySQL

Beneficio:

Separación clara de responsabilidades.

---

## ADR-004

### Resumen inteligente

Fecha:

30/06/2026

Decisión:

Los resúmenes diarios no almacenarán resultados en la base de datos.

Siempre se calcularán en tiempo real.

Beneficio:

Los datos siempre estarán sincronizados con los viajes registrados.

---

## ADR-005

### Modo Trabajo y Modo Gestión

Fecha:

30/06/2026

Decisión:

Taxi Finance tendrá dos modos principales de uso:

- Modo Trabajo: cuando hay una jornada activa.
- Modo Gestión: cuando no hay una jornada activa.

Motivo:

El conductor no necesita lo mismo mientras está trabajando que cuando está en casa revisando datos.

En jornada activa, la aplicación debe priorizar acciones rápidas:

- registrar viaje;
- ver último viaje;
- ver resumen del día;
- registrar gasolina;
- finalizar jornada.

Fuera de jornada, la aplicación debe priorizar gestión:

- ver jornadas anteriores;
- consultar estadísticas;
- revisar liquidaciones;
- generar PDF;
- analizar el mes.

Criterio técnico:

El modo de la aplicación se decidirá según el estado de la jornada:

- Si existe una jornada abierta → Modo Trabajo.
- Si no existe una jornada abierta → Modo Gestión.

Beneficio:

La interfaz será más simple, rápida e intuitiva, especialmente para taxistas que no están acostumbrados a usar tecnología.
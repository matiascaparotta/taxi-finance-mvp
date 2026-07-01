
# Taxi Finance — Architecture Decisions (ADR)

## ¿Qué es un ADR?

Un Architecture Decision Record (ADR) documenta una decisión técnica importante tomada durante el desarrollo del proyecto.

Su objetivo es explicar:

- qué decisión se tomó;
- por qué se tomó;
- qué alternativas existían;
- qué beneficios aporta.

De esta forma, cualquier desarrollador que participe en el proyecto podrá entender el razonamiento detrás de la arquitectura.

---

## Cómo utilizar este documento

Cada ADR representa una decisión arquitectónica importante del proyecto.

Cuando una decisión afecte a la arquitectura, las reglas de negocio o la evolución del producto, deberá documentarse aquí antes o al mismo tiempo que se implemente.

Cada ADR seguirá la siguiente estructura:

- Contexto o problema.
- Alternativas consideradas (cuando corresponda).
- Decisión tomada.
- Beneficios.
- Impacto futuro.

---

# ADR-001

## Eliminar `cash` y `card` de `work_days`

**Fecha:** 30/06/2026

### Problema

Inicialmente la tabla `work_days` almacenaba los importes de efectivo y datáfono.

Esto provocaba duplicación de datos, ya que la misma información también existía en la tabla `trips`.

### Decisión

Eliminar ambas columnas y calcular siempre los totales a partir de los viajes registrados.

### Beneficios

- Una única fuente de verdad.
- Menor riesgo de inconsistencias.
- Cualquier modificación de un viaje actualiza automáticamente el resumen.

### Impacto futuro

Todos los nuevos cálculos financieros deberán obtener sus datos desde `trips` y no duplicar información en `work_days`.

---

# ADR-002

## Crear la capa Repositories

**Fecha:** 30/06/2026

### Problema

Las consultas SQL estaban mezcladas con la lógica de negocio.

### Decisión

Toda consulta a MySQL debe vivir exclusivamente en la carpeta `repositories`.

### Beneficios

- Separación de responsabilidades.
- Código más limpio.
- Mayor facilidad para realizar pruebas y mantenimiento.

### Impacto futuro

Ningún Service deberá ejecutar consultas SQL directamente; cualquier acceso a la base de datos deberá realizarse mediante un Repository.

---

# ADR-003

## Arquitectura por capas

**Fecha:** 30/06/2026

### Decisión

El backend seguirá la siguiente estructura:

```text
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
MySQL
```

### Beneficios

- Código desacoplado.
- Escalabilidad.
- Mayor facilidad para incorporar nuevas funcionalidades.

### Impacto futuro

Las nuevas funcionalidades deberán respetar la arquitectura por capas para mantener la coherencia del proyecto.

---

# ADR-004

## Resumen inteligente

**Fecha:** 30/06/2026

### Decisión

Los resúmenes diarios no se almacenan en la base de datos.

Siempre se calculan en tiempo real utilizando la información registrada en `trips`.

### Beneficios

- Datos siempre sincronizados.
- No existen resúmenes desactualizados.
- Se elimina la duplicación de información.

### Impacto futuro

Cualquier nuevo resumen deberá calcularse dinámicamente siempre que sea posible, evitando almacenar datos derivados.

---

# ADR-005

## Modo Trabajo y Modo Gestión

**Fecha:** 30/06/2026

### Decisión

La aplicación funciona en dos modos:

- **Modo Trabajo** cuando existe una jornada `OPEN`.
- **Modo Gestión** cuando no existe ninguna jornada abierta.

### Motivo

El conductor necesita herramientas diferentes según el momento del día.

Durante la jornada se prioriza la rapidez.

Fuera de la jornada se prioriza el análisis y la gestión.

### Beneficios

- Interfaz más simple.
- Menos distracciones.
- Flujo adaptado al trabajo real del taxista.

### Impacto futuro

Las futuras pantallas deberán adaptarse al modo de trabajo o de gestión según el estado de la jornada activa.

---

## Próximos ADR previstos

Las siguientes decisiones probablemente requerirán un ADR específico:

- ADR-006 — Edición de viajes.
- ADR-007 — Estrategia de eliminación de viajes (eliminación física o lógica).
- ADR-008 — Generación y almacenamiento de PDF.
- ADR-009 — Soporte para múltiples conductores.
- ADR-010 — Estrategia de autenticación y autorización.
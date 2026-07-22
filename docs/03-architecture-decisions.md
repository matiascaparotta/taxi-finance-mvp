
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

# ADR-006

## Edición y eliminación de viajes

**Fecha:** 08/07/2026

### Problema

Durante una jornada real, el conductor puede equivocarse al cargar un viaje: importe incorrecto, método de pago incorrecto o nota incompleta.

Además, algunos viajes pueden ser cargados por error y necesitan eliminarse para que el resumen diario sea correcto.

### Alternativas consideradas

- Editar viajes directamente desde un modal.
- Crear una pantalla independiente para editar cada viaje.
- Permitir solo eliminación y volver a cargar el viaje.

### Decisión

Crear una pantalla independiente de edición de viaje mediante la ruta:

```text
/trips/:id/edit
```

Desde esa pantalla se puede:

- consultar los datos del viaje;
- modificar importe, método de pago y nota;
- eliminar el viaje con confirmación previa.

### Beneficios

- Flujo más claro y escalable.
- Mejor experiencia en móvil.
- Permite agregar más campos en el futuro sin saturar la interfaz.
- Mantiene el resumen siempre sincronizado porque los totales se calculan desde `trips`.

### Impacto futuro

La edición de cualquier entidad importante deberá evaluarse como pantalla propia cuando el flujo pueda crecer en complejidad.

---

# ADR-007

## Reutilización del ticket de jornada

**Fecha:** 08/07/2026

### Problema

El resumen de una jornada se mostraba en más de una pantalla:

- al cerrar una jornada;
- al consultar una jornada histórica.

Mantener dos diseños separados podía generar duplicación de código e inconsistencias visuales.

### Decisión

Crear y reutilizar el componente:

```text
WorkDayTicket
```

Este componente muestra el resumen interno de una jornada con información detallada:

- total facturado;
- efectivo;
- datáfono;
- cantidad de viajes;
- combustible;
- km inicial;
- km final;
- km trabajados.

### Beneficios

- Menos duplicación de código.
- Interfaz consistente.
- Más fácil de mantener.
- Base reutilizable para futuros PDF o reportes.

### Impacto futuro

Cualquier cambio visual importante en el ticket deberá hacerse en `WorkDayTicket` para que impacte automáticamente en todas las pantallas que lo usan.

---

# ADR-008

## Separar resumen interno de resumen para WhatsApp

**Fecha:** 08/07/2026

### Problema

La aplicación necesita mostrar información detallada para el usuario, pero el resumen enviado al jefe debe ser breve y operativo.

Un texto con demasiados datos, emojis o branding puede ser menos profesional y menos práctico para enviar por WhatsApp.

### Decisión

Separar dos responsabilidades:

- `WorkDayTicket` muestra el resumen completo dentro de la aplicación.
- `buildWorkDaySummaryText()` genera el texto corto para WhatsApp.

El formato para WhatsApp será:

```text
DÍA DD/MM

KILÓMETROS: 000

EFECTIVO: 00,00 €
DATÁFONO: 00,00 €
TOTAL: 00,00 €

GASOLINA: 00,00 €
```

### Beneficios

- La app puede mostrar más detalle sin afectar el mensaje enviado.
- El resumen para el jefe se mantiene claro, corto y profesional.
- Se evita mezclar necesidades internas con comunicación externa.

### Impacto futuro

Si en el futuro existen varios formatos de salida, deberán implementarse como funciones separadas, por ejemplo:

- resumen para jefe;
- resumen personal;
- resumen para PDF;
- resumen mensual.

---

# ADR-009

## Regla de jornada nocturna

**Fecha:** 08/07/2026

### Problema

El conductor suele cerrar la jornada después de medianoche, pero esa jornada pertenece operativamente al día anterior.

Usar directamente la fecha del reloj puede registrar una jornada con el día incorrecto.

### Decisión

Al crear una jornada, si la hora local es anterior a las 06:00, la fecha por defecto se asigna al día anterior.

Ejemplo:

```text
Martes 07/07 a las 17:00 → jornada 07/07
Miércoles 08/07 a las 02:30 → jornada 07/07
Miércoles 08/07 a las 06:30 → jornada 08/07
```

### Beneficios

- Refleja mejor el trabajo real del taxi.
- Evita errores de fecha en jornadas nocturnas.
- Reduce correcciones manuales posteriores.

### Impacto futuro

El corte horario debería convertirse en una configuración editable cuando la aplicación soporte más conductores o distintos turnos.

---

# ADR-010

## Ordenar jornadas por última carga

**Fecha:** 08/07/2026

### Problema

Ordenar jornadas solo por fecha puede resultar confuso cuando el usuario carga una jornada atrasada o cuando una jornada nocturna queda asignada al día anterior.

En la Home, la sección “Última jornada” debe representar la última jornada cargada en la aplicación, no necesariamente la fecha más reciente.

### Decisión

Ordenar las jornadas por `id` descendente para representar el orden real de carga.

```text
id más alto = última jornada cargada
```

### Beneficios

- La Home muestra la última carga real.
- El historial refleja mejor el orden de trabajo reciente dentro de la app.
- Evita confusión entre fecha operativa y orden de registro.

### Impacto futuro

Si se agrega un campo `createdAt` confiable para jornadas, se podrá ordenar por fecha de creación real en lugar de depender del `id`.

---

# ADR-011

## Registro rápido de viajes con QuickTripForm

**Fecha:** 22/07/2026

### Problema

Durante una jornada activa el conductor registra entre 20 y 30 viajes.

El formulario tradicional obligaba a realizar varias acciones para cada viaje, reduciendo la velocidad de carga durante el turno.

### Alternativas consideradas

- Mantener un único formulario para alta y edición.
- Crear un formulario específico para el registro rápido.

### Decisión

Crear un componente independiente llamado `QuickTripForm`, optimizado exclusivamente para registrar viajes durante una jornada activa.

Sus principales características son:

- teclado numérico propio;
- importe grande;
- coma decimal;
- botón borrar;
- botones independientes para guardar en efectivo o datáfono;
- nota opcional desplegable;
- confirmación visual después de guardar;
- limpieza automática del formulario.

Además, la pantalla permanece abierta después de registrar un viaje para facilitar la carga consecutiva de múltiples viajes.

### Beneficios

- Menor cantidad de pulsaciones.
- Registro mucho más rápido.
- Mejor experiencia de uso en móvil.
- Flujo adaptado al trabajo diario de un taxista.

### Impacto futuro

Las futuras mejoras del flujo de carga rápida deberán implementarse sobre `QuickTripForm`, manteniendo `TripForm` exclusivamente para edición.
# Taxi Finance — Release Notes

## Objetivo

Este documento registra las funcionalidades incorporadas en cada versión de Taxi Finance desde la perspectiva del usuario.

---

# v0.1.0

## Backend inicial

### Novedades

- Creación del proyecto.
- API Express.
- Base de datos MySQL.
- CRUD de jornadas.
- CRUD de viajes.
- Resumen inteligente de jornada.

---

# v0.2.0

## Primer Frontend

### Novedades

- Interfaz desarrollada con React y Vite.
- Home responsive.
- Creación de jornadas.
- Detección automática de jornada activa.
- Registro de viajes.

---

# v0.3.0

## Cierre de jornada

### Novedades

- Cierre completo de jornada.
- Ticket profesional.
- Pantalla de jornada finalizada.

---

# v0.4.0

## Calidad y experiencia de usuario

### Novedades

- Formato monetario unificado.
- Compartir resumen al portapapeles.
- Resumen listo para WhatsApp.
- Mejoras de experiencia de usuario.

---
# v0.5.0

## Gestión completa de viajes

### Novedades

- Edición de viajes desde la aplicación.
- Eliminación de viajes con confirmación.
- Nuevo componente reutilizable `TripForm`.
- Refactorización de `NewTripPage`.
- Nueva pantalla `EditTripPage`.
- Navegación directa desde la Home para editar viajes.
- CRUD de viajes completado de extremo a extremo.
- Recalculo automático del resumen tras editar o eliminar un viaje.

---

# v0.6.0

## Historial y detalle de jornadas

### Novedades

- Nueva pantalla de historial de jornadas.
- Nueva ruta `/history`.
- Botón de acceso al historial desde la Home.
- Nueva pantalla de detalle de jornada.
- Nueva ruta `/work-days/:id`.
- Consulta de jornadas históricas.
- Visualización de viajes de una jornada pasada.
- Reutilización del componente `WorkDayTicket`.
- Ticket interno más completo con:
  - total facturado;
  - efectivo;
  - datáfono;
  - cantidad de viajes;
  - combustible;
  - km inicial;
  - km final;
  - km trabajados.
- Botón para copiar resumen de jornada para WhatsApp.
- Separación entre resumen interno completo y resumen externo para enviar al jefe.
- Formato limpio para WhatsApp sin emojis ni branding.
- Corrección del formato de moneda para evitar espacios raros al copiar texto.
- Ajuste de fecha para jornadas nocturnas:
  - antes de las 06:00, la jornada se asigna al día anterior.
- Mejora de la Home con:
  - última jornada cargada;
  - jornadas anteriores;
  - tarjetas de jornada con total, efectivo, datáfono, kilómetros y gasolina.
- Ordenamiento de jornadas por última carga usando `id` descendente.

### Valor para el usuario

El usuario puede consultar jornadas anteriores, revisar el detalle completo de cada turno y reenviar un resumen limpio por WhatsApp sin recalcular manualmente los datos.

---

## Próxima versión

### v0.7.0

Funcionalidades previstas:

- Registro rápido de viajes.
- Interfaz tipo calculadora.
- Teclado numérico propio.
- Botones grandes para efectivo y datáfono.
- Carga más rápida durante la jornada activa.
- Nota opcional más accesible.
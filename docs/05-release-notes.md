# Taxi Finance — Release Notes

**Versión:** 2.0

**Última actualización:** 24/07/2026

**Estado actual:** Beta 1.0

---

# Objetivo

Este documento registra la evolución funcional de Taxi Finance desde la perspectiva del usuario.

Cada versión resume las principales funcionalidades incorporadas, las mejoras realizadas y el valor que aportan al flujo de trabajo del conductor.

A diferencia del **Project Journal**, que documenta el proceso de desarrollo, las **Release Notes** describen únicamente el resultado final de cada versión.

---

# Cómo utilizar este documento

Cada versión incluye:

- principales novedades;
- mejoras relevantes;
- impacto para el usuario.

Las versiones siguen un orden cronológico y muestran la evolución del producto desde sus primeras funcionalidades hasta la Beta 1.0.

---

# v0.1.0

## Fundación del proyecto

### Novedades

- Creación del proyecto.
- Configuración inicial del backend.
- API desarrollada con Express.
- Base de datos MySQL.
- CRUD de jornadas.
- CRUD de viajes.
- Primera versión del cálculo automático del resumen de jornada.

### Valor para el usuario

Esta primera versión establece la base técnica sobre la que se desarrollará toda la aplicación.

Aunque todavía no dispone de interfaz gráfica, ya permite gestionar jornadas y viajes mediante la API.

---

# v0.2.0

## Primer Frontend

### Novedades

- Interfaz desarrollada con React y Vite.
- Home responsive.
- Creación de jornadas.
- Detección automática de jornada activa.
- Registro de viajes desde la aplicación.

### Valor para el usuario

Taxi Finance deja de ser únicamente una API y pasa a disponer de una interfaz gráfica que permite comenzar a utilizar la aplicación durante una jornada real.

---

# v0.3.0

## Cierre de jornada

### Novedades

- Sistema completo de cierre de jornada.
- Ticket interno de jornada.
- Pantalla de jornada finalizada.
- Flujo completo desde la apertura hasta el cierre del turno.

### Valor para el usuario

El conductor puede completar una jornada de trabajo de principio a fin utilizando la aplicación, obteniendo un resumen claro al finalizar el turno.

---

# v0.4.0

## Calidad y experiencia de usuario

### Novedades

- Formato monetario unificado.
- Copiar resumen al portapapeles.
- Resumen optimizado para compartir por WhatsApp.
- Mejoras generales en la experiencia de usuario.
- Ajustes visuales en distintas pantallas.

### Valor para el usuario

La aplicación resulta más cómoda de utilizar y facilita compartir el resumen diario sin necesidad de editar manualmente el texto.

# v0.5.0

## Gestión completa de viajes

### Novedades

- Edición de viajes desde la aplicación.
- Eliminación de viajes con confirmación previa.
- Nuevo componente reutilizable `TripForm`.
- Refactorización de `NewTripPage`.
- Nueva pantalla `EditTripPage`.
- Navegación directa desde la Home para editar un viaje.
- CRUD de viajes completado de extremo a extremo.
- Recalculo automático del resumen tras editar o eliminar un viaje.

### Valor para el usuario

Los errores de carga pueden corregirse sin necesidad de eliminar y volver a registrar una jornada completa.

El resumen diario permanece siempre sincronizado gracias al recálculo automático de todos los totales.

---

# v0.6.0

## Historial y detalle de jornadas

### Novedades

- Nueva pantalla de historial de jornadas.
- Nueva ruta `/history`.
- Acceso directo al historial desde la Home.
- Nueva pantalla de detalle de jornada.
- Nueva ruta `/work-days/:id`.
- Consulta completa de jornadas anteriores.
- Visualización de todos los viajes pertenecientes a una jornada.
- Creación del componente reutilizable `WorkDayTicket`.
- Ticket interno ampliado con:
  - total facturado;
  - efectivo;
  - datáfono;
  - cantidad de viajes;
  - combustible;
  - kilómetros iniciales;
  - kilómetros finales;
  - kilómetros recorridos.
- Copiar resumen al portapapeles.
- Separación entre el resumen interno y el resumen preparado para compartir.
- Formato optimizado para WhatsApp.
- Corrección del formato monetario al copiar texto.
- Ajuste automático de la fecha para jornadas nocturnas.
- Ordenación de jornadas por última carga.
- Mejoras generales en la Home para consultar rápidamente la actividad reciente.

### Valor para el usuario

El conductor puede consultar cualquier jornada anterior, revisar todos los viajes realizados y compartir un resumen limpio sin necesidad de recalcular manualmente la información.

Además, la aplicación refleja con mayor precisión la realidad del trabajo diario gracias al soporte para jornadas nocturnas.

---

# v0.7.0

## Registro rápido de viajes

### Novedades

- Nuevo componente `QuickTripForm`.
- Interfaz optimizada para registrar viajes durante una jornada activa.
- Teclado numérico integrado.
- Botón para coma decimal.
- Botón de borrado rápido.
- Importe mostrado con mayor tamaño para mejorar la visibilidad.
- Botones independientes para guardar viajes en efectivo o datáfono.
- Nota opcional desplegable.
- Comisión opcional.
- Propina opcional.
- Confirmación visual después de registrar un viaje.
- Limpieza automática del formulario.
- Registro consecutivo de múltiples viajes sin abandonar la pantalla.
- Acceso directo a la jornada activa.
- Acceso directo al cierre de jornada.
- `TripForm` pasa a utilizarse exclusivamente para la edición de viajes.

### Valor para el usuario

El proceso de registrar viajes se simplifica considerablemente.

La aplicación reduce el número de acciones necesarias durante una jornada y adapta el flujo de trabajo al ritmo real de un conductor de taxi, permitiendo registrar múltiples servicios de forma rápida y continua.

---

# v1.0.0-beta

## Beta funcional y estabilización previa al deploy

### Novedades

- Cierre de jornada con confirmación de hoy o ayer.
- Registro y reparto automático del combustible.
- Continuidad del kilometraje con reinicio explícito por cambio de vehículo.
- Comisión y propina editables mediante el teclado rápido.
- Restricción de una única jornada por fecha y fechas siempre posteriores.
- Historial filtrable por mes y por día.
- Importación y validación de 70 jornadas históricas.
- Detalle completo de viajes con comisión, propina, método de pago e importe.
- Tarjeta visual con resumen principal y páginas de hasta 15 viajes.
- Opciones para compartir, guardar imágenes y copiar texto.
- Listas compactas con controles para mostrar más o menos viajes.
- Protección frente a dobles toques en operaciones sensibles.
- Reintento y recuperación en las pantallas que dependen de datos remotos.
- Carga bajo demanda de los resúmenes visibles del historial.

### Valor para el usuario

Taxi Finance puede gestionar una jornada completa y conservar el historial
real del conductor. Las mejoras reducen errores durante el uso móvil, mantienen
el foco visual en los importes importantes y permiten rendir cuentas mediante
imagen o texto.

### Estado de publicación

La versión está funcionalmente terminada, pero aún no fue desplegada. El
primer deploy será privado y requiere configurar producción, migración de
datos, acceso restringido y copias de seguridad.

---

# Estado actual

Con la versión **v1.0.0-beta**, Taxi Finance alcanza el hito funcional
correspondiente a la **Beta 1.0** y se encuentra en estabilización previa al
deploy privado.

La aplicación ya permite gestionar una jornada de trabajo completa de principio a fin, incluyendo el registro de viajes, el cierre de la jornada y la consulta del historial.

En este punto, el proyecto dispone de:

- Arquitectura por capas consolidada.
- API REST completamente funcional.
- Gestión completa de jornadas.
- Gestión completa de viajes.
- Registro rápido optimizado mediante `QuickTripForm`.
- Historial de jornadas.
- Consulta detallada de jornadas anteriores.
- Resumen preparado para compartir.
- Documentación técnica y funcional alineada con el desarrollo del proyecto.

La Beta 1.0 proporciona una base sólida sobre la que continuar incorporando nuevas funcionalidades sin necesidad de realizar cambios estructurales importantes.

---

# Próximas versiones

A partir de este punto, el desarrollo seguirá las fases definidas en el Roadmap oficial del proyecto.

## Sprint 17 — Estabilización

Objetivo principal:

- Corrección de errores detectados durante el uso diario.
- Mejoras de rendimiento.
- Optimización de la experiencia de usuario.
- Ajustes menores de la interfaz.

---

## Sprint 18 — Liquidación mensual

Objetivo principal:

- Resumen mensual.
- Liquidación mensual.
- Histórico mensual.
- Comparación entre meses.

---

## Sprint 19 — Dashboard

Objetivo principal:

- Dashboard financiero.
- Indicadores diarios.
- Indicadores mensuales.
- Estadísticas generales.
- Comparativas.

---

## Sprint 20 — Reportes y exportación

Objetivo principal:

- Exportación en PDF.
- Reportes mensuales.
- Reportes anuales.
- Mejoras en la generación y compartición de informes.

---

## Sprint 21 — Usuarios y roles

Objetivo principal:

- Sistema de autenticación.
- Gestión de usuarios.
- Roles y permisos.
- Preparación para múltiples conductores.

---

## Sprint 22 — Panel del jefe

Objetivo principal:

- Gestión de conductores.
- Consulta de jornadas.
- Estadísticas por conductor.
- Herramientas orientadas a la gestión empresarial.

---

# Conclusión

Las **Release Notes** documentan la evolución funcional de Taxi Finance desde la perspectiva del usuario final.

Cada versión representa una mejora incremental sobre la anterior, incorporando nuevas funcionalidades, optimizando el flujo de trabajo y reforzando la estabilidad del proyecto.

A medida que Taxi Finance continúe evolucionando, este documento seguirá registrando de forma cronológica las novedades de cada versión, proporcionando un historial claro de la evolución del producto y de las mejoras incorporadas en cada fase de desarrollo.

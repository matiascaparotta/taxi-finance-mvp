# TaxFin — Release Notes

**Versión:** 2.1

**Última actualización:** 25/07/2026

**Estado actual:** Beta 1.0 — base multiusuario en desarrollo

---

# Objetivo

Este documento registra la evolución funcional de Lic249 desde la perspectiva del usuario.

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

# Próxima versión — Base multiusuario

## En desarrollo

- Base de organizaciones independientes.
- Cuentas personales con nombre de usuario y contraseña.
- Propietarios que pueden conducir o dedicarse solo a gestionar.
- Conductores con acceso exclusivo a sus propios datos.
- Vehículos compartidos entre turnos.
- Configuración de combustible por carga real o tarifa por kilómetro.
- Aprovisionamiento seguro de las cuentas iniciales de Lic249.
- Asignación protegida de las jornadas existentes a su conductor y vehículo.
- Inicio de sesión individual compatible con el acceso privado actual.
- Cambio obligatorio y seguro de la contraseña temporal.
- Jornadas aisladas por conductor y organización.
- Consulta de jornadas de conductores para el propietario en modo lectura.
- Identificación del conductor en el historial y el detalle.
- Continuidad del cuentakilómetros entre turnos del vehículo compartido.
- Nueva marca de aplicación `TaxFin`, manteniendo `Lic249` en las tarjetas de
  la organización inicial.
- Seguimiento para propietarios de conductores en servicio, con actualización
  automática y detalle reciente de viajes.
- Creación, suspensión y reactivación segura de conductores por parte del
  propietario.
- Contraseña temporal mostrada una sola vez e invalidación inmediata de
  sesiones suspendidas.
- Restablecimiento de contraseña por el propietario, con nueva clave temporal
  y cambio obligatorio incluso en sesiones que ya estaban abiertas.

La primera entrega es interna y no cambia todavía la experiencia ni el acceso
de producción.

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

Lic249 deja de ser únicamente una API y pasa a disponer de una interfaz gráfica que permite comenzar a utilizar la aplicación durante una jornada real.

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

## Beta funcional y primer deploy privado

### Novedades

- Nueva marca visible `Lic249` en toda la aplicación, tarjetas y archivos compartidos.
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

Lic249 puede gestionar una jornada completa y conservar el historial
real del conductor. Las mejoras reducen errores durante el uso móvil, mantienen
el foco visual en los importes importantes y permiten rendir cuentas mediante
imagen o texto.

### Estado de publicación

La versión fue desplegada de forma privada en Railway el 24/07/2026. Frontend
y API funcionan bajo el mismo dominio HTTPS, MySQL utiliza almacenamiento
persistente y el acceso está protegido mediante contraseña y sesión firmada.

Se restauraron y verificaron 70 jornadas, 1.203 viajes y 70 resúmenes
mensuales. La validación integral en móviles y la estrategia de respaldos
automáticos compatible con el plan Hobby continúan dentro del Sprint 17.

---

# Estado actual

Con la versión **v1.0.0-beta**, Lic249 alcanza el hito funcional
correspondiente a la **Beta 1.0** y se encuentra publicada de forma privada y
en estabilización mediante uso real.

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

## Sprint 18 — Base multiusuario

Objetivo principal:

- Organizaciones independientes.
- Usuarios y acceso individual.
- Propietarios y conductores.
- Vehículos compartidos.
- Migración segura de los datos existentes.

### Base compatible publicada

- Se desplegaron las entidades de organizaciones, usuarios, membresías y
  vehículos.
- El acceso privado anterior continúa funcionando durante la transición.
- Las jornadas históricas permanecen sin asignar hasta el aprovisionamiento
  controlado de Lic249.
- TaxFin conserva las 71 jornadas y 1.221 viajes existentes.
- Lic249, Matías, José y el vehículo compartido ya fueron creados de forma
  segura en producción.
- Las cuentas personales exigen reemplazar su contraseña temporal durante el
  primer acceso.

---

## Sprint 19 — Panel del propietario

Objetivo principal:

- Gestión de conductores.
- Consulta de jornadas activas.
- Consulta y exportación de jornadas ajenas en modo lectura.
- Separación de datos entre organizaciones.

---

## Sprint 20 — Liquidaciones configurables

Objetivo principal:

- Liquidación mensual.
- Liquidación diaria.
- Acuerdos configurables por conductor.
- Combustible real o calculado por kilómetros.

---

## Sprint 21 — Dashboard

Objetivo principal:

- Dashboard financiero.
- Indicadores diarios y mensuales.
- Estadísticas y comparativas.

---

## Sprint 22 — Reportes y exportación

Objetivo principal:

- Exportación en PDF.
- Reportes mensuales y anuales.
- Mejoras en la generación y compartición de informes.
- Estadísticas por conductor.
- Herramientas orientadas a la gestión empresarial.

---

# Conclusión

Las **Release Notes** documentan la evolución funcional de Lic249 desde la perspectiva del usuario final.

Cada versión representa una mejora incremental sobre la anterior, incorporando nuevas funcionalidades, optimizando el flujo de trabajo y reforzando la estabilidad del proyecto.

A medida que Lic249 continúe evolucionando, este documento seguirá registrando de forma cronológica las novedades de cada versión, proporcionando un historial claro de la evolución del producto y de las mejoras incorporadas en cada fase de desarrollo.

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
- Las 71 jornadas históricas y sus 1.221 viajes ya pertenecen a Matías; las
  jornadas nuevas de otros conductores se conservan sin alteraciones.
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
- Seguimiento completo de todos los viajes activos, con acumulados privados de
  comisión y propina para el propietario.
- Las imágenes compartidas omiten comisiones y propinas aunque los datos se
  conserven dentro de TaxFin.
- Sección `Mis conductores` y filtro de historial por conductor para consultar
  jornadas ajenas con claridad.
- Historial del propietario dividido entre `Mis jornadas` y las jornadas de
  cada conductor, sin listas combinadas.
- Etiqueta genérica para el reparto 50/50 de combustible, sin mostrar el
  nombre de José en el formulario del conductor.
- Corrección del reconocimiento del rol propietario, compatible con sesiones
  personales que ya estaban abiertas.
- Cierre simplificado para propietarios: la gasolina se guarda íntegramente
  como gasto propio y desaparece la opción de reparto.
- Corrección segura de viajes propios después del cierre mediante contraseña,
  motivo y auditoría de valores anteriores y resultantes.
- Las jornadas históricas importadas y las jornadas ajenas permanecen
  protegidas frente a esa corrección.
- Eliminación segura de viajes propios después del cierre, con contraseña,
  motivo, confirmación explícita y auditoría transaccional.
- Publicación de la eliminación segura en producción mediante `5b0d5d9`, sin
  cambios en los 78 cierres ni en los 1.344 viajes existentes.
- Corrección segura de combustible y kilometraje en jornadas propias cerradas,
  respetando la continuidad del vehículo y las reglas de reparto.
- Publicación de esa corrección en producción mediante `9e6fa03`, con API
  saludable, 78 jornadas, 1.344 viajes, 70 importaciones protegidas y cero
  auditorías previas.
- Corrección segura de la fecha, sin duplicados para el mismo conductor y con
  validación de la continuidad kilométrica en su nueva posición cronológica.
- Eliminación completa reforzada de jornadas propias creadas en TaxFin: motivo,
  contraseña, confirmación escrita y auditoría de la jornada y sus viajes.
- Publicación del bloque completo mediante `1cdd5d6`. Antes del despliegue se
  generó y verificó un respaldo nuevo; Railway aplicó las migraciones, mantuvo
  la API saludable y conservó 79 jornadas, 1.354 viajes y 70 importaciones
  protegidas sin ejecutar correcciones ni eliminaciones de prueba.
- Compatibilidad con pestañas abiertas antes del despliegue: si el formulario
  anterior no envía fecha, se conserva la fecha almacenada. Las fechas ISO se
  normalizan sin desplazamientos de zona horaria y la confirmación `ELIMINAR`
  se valida también en el servidor.
- Inicio de la aplicación instalada configurado en la Home mediante el
  manifiesto web de TaxFin. La marca del encabezado también funciona como
  acceso directo al inicio.
- Icono propio de TaxFin para pantalla de inicio, preparado en tamaños de 180,
  192 y 512 píxeles para iPhone y Android.
- Primera PWA completa: interfaz disponible sin conexión, aviso de estado de
  red y actualización controlada desde la propia aplicación.
- Las operaciones financieras continúan requiriendo internet y TaxFin informa
  expresamente cuando no guardó un cambio; no existe sincronización offline en
  esta etapa.
- Publicación de la PWA mediante `1ae3285`: Railway completó las migraciones,
  `/api/health` permaneció saludable y el worker quedó versionado como
  `taxfin-app-shell-1ae3285a1f98`, sin el marcador de build. El manifiesto, los
  iconos, el inicio en `/`, la actualización segura y la sesión real de José se
  verificaron sin modificar datos. Las jornadas de Matías continúan en modo de
  solo lectura y el acceso legacy permanece activo.
- Cabecera profesional personalizada por sesión mediante `1f49f4a`: icono de
  TaxFin con regreso a Inicio, nombre, rol, iniciales y cierre de sesión
  secundario. Matías dispone de Inicio, Mi jornada e Historial; José añade Mis
  conductores. El build `1f49f4a521b3`, la actualización PWA, la sesión real de
  José y el acceso de solo lectura a Matías se verificaron en producción sin
  modificar datos ni retirar el acceso legacy.
- Acumulado compacto durante el registro rápido mediante `95e4dab`:
  facturación total, efectivo y datáfono, con número de viajes total y por
  medio de pago. Los recuentos aparecen también de forma secundaria en la Home
  activa y en el seguimiento del propietario. El build `95e4dab6ed2a`, la
  actualización PWA y la salud de la API se verificaron sin crear jornadas ni
  viajes de prueba.
- Nueva estructura publicada mediante `310d3f5`: Inicio ofrece el resumen y Mi
  jornada concentra todas las acciones del turno, con navegación inferior
  optimizada para móvil y un acceso visual renovado para iniciar jornada.
- Cancelación segura publicada: una jornada vacía puede
  cancelarse sin completar el cierre; si tiene viajes exige contraseña, motivo
  y `CANCELAR`. La jornada se conserva como cancelada y queda auditada.
  Railway sirvió exactamente `310d3f575e6a`, con la migración previa y la API
  saludables. La sesión de José, la actualización PWA, el inicio en `/` y la
  lectura protegida de Matías se verificaron sin modificar datos reales.
- Experiencia móvil estabilizada mediante `4395366`: TaxFin conserva su fondo
  oscuro al desplazar o reducir la vista, evita zoom accidental y cubre las
  áreas completas de iPhone. Railway sirvió exactamente `43953668fe97` con la
  API saludable.
- Áreas seguras de iPhone y Android publicadas mediante `afe5710`: la cabecera
  evita la barra de estado, cámaras y recortes, y la navegación inferior respeta
  los controles del sistema. Railway sirvió exactamente `afe571066031`.
- Inicio del propietario reunificado mediante `341d6c4`: resumen del
  día, equipo y actividad personal sustituyen las tarjetas repetidas. La fila
  del conductor conserva sus acumulados esenciales y abre el detalle completo
  en modo de solo lectura. Railway sirvió exactamente `341d6c465e16`; la sesión
  real de José, la actualización PWA y la protección de Matías se verificaron
  sin modificar datos.
- Centro de control del propietario publicado mediante `dc68c80`: una jornada
  activa abre seguimiento en vivo con refresco automático, todos los viajes y
  acumulados de efectivo, datáfono, comisiones y propinas. El kilometraje final
  y las opciones para compartir permanecen ocultos hasta el cierre. Railway
  sirvió exactamente `dc68c80baf93`; la jornada real activa de Matías se
  comprobó desde José en solo lectura y sin modificar datos.
- Protección móvil pendiente de publicación: la barra de estado pasa a ser
  opaca y la cabecera queda fija bajo las áreas seguras, evitando que tarjetas
  o textos se vean detrás de la hora, notificaciones y batería al desplazarse.
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
- Las 71 jornadas históricas y sus 1.221 viajes quedaron asignados a Matías
  mediante una operación transaccional y verificada.
- TaxFin conserva además la jornada nueva de José y sus 3 viajes.
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

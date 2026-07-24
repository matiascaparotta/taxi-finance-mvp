# 📍 Estado actual del proyecto

**Versión:** 2.0

**Última actualización:** 24/07/2026

**Estado:** Beta 1.0 finalizada — estabilización previa al deploy

---

# Objetivo

Este documento resume el estado actual de Taxi Finance.

Su finalidad es ofrecer una visión rápida del punto en el que se encuentra el proyecto, incluyendo el avance del desarrollo, la documentación disponible y la metodología de trabajo utilizada.

A diferencia del **Roadmap**, que describe las fases previstas del proyecto, este documento refleja únicamente la situación actual del desarrollo.

---

# Proyecto

**Nombre:** Taxi Finance

**Versión actual:** Beta 1.0

**Estado general:** Funcional y en estabilización

La Beta 1.0 se considera finalizada.

El proyecto dispone de una arquitectura consolidada, una documentación alineada y una primera versión funcional capaz de gestionar una jornada completa de trabajo.

A partir de este punto, el desarrollo continúa con la estabilización y la
preparación de un primer deploy privado.

---

# Sprint actual

## Sprint 17 — Estabilización

**Estado:** En desarrollo

### Objetivos

- Corregir errores detectados durante el uso diario.
- Mejorar el rendimiento general de la aplicación.
- Optimizar la experiencia de usuario.
- Realizar ajustes menores en la interfaz.

---

# Estado del Backend

La arquitectura del backend se considera funcionalmente completa para la Beta 1.0.

### Implementado

- API REST con Express.
- Arquitectura por capas (`Controller → Service → Repository`).
- CRUD completo de jornadas.
- CRUD completo de viajes.
- Gestión de jornada activa.
- Historial de jornadas.
- Resúmenes automáticos.
- Gestión de comisión por viaje.
- Gestión de propina por viaje.
- Recalculo automático de todos los totales.
- Protección de los viajes pertenecientes a jornadas cerradas.
- Validación de importes, comisión y propina.
- Compatibilidad con cierres históricos importados.
- Validación de las reglas de fecha y continuidad del kilometraje.

---

# Estado del Frontend

El frontend se considera funcionalmente completo para la Beta 1.0.

La interfaz permite realizar el flujo completo de una jornada de trabajo, desde su creación hasta el cierre y la consulta del historial.

### Implementado

- Creación de jornadas.
- Detección automática de jornada activa.
- Registro rápido de viajes mediante `QuickTripForm`.
- Edición de viajes mediante `TripForm`.
- Eliminación de viajes con confirmación.
- Historial de jornadas.
- Consulta del detalle de una jornada.
- Cierre completo de jornada.
- Resumen preparado para compartir.
- Copiar resumen al portapapeles.
- Tarjeta de jornada reutilizable (`WorkDayTicket`).
- Home optimizada para el trabajo diario del conductor.
- Filtros del historial por día y por mes.
- Carga bajo demanda de resúmenes históricos.
- Listas extensas compactadas mediante mostrar más y mostrar menos.
- Prevención de acciones duplicadas.
- Recuperación y reintento ante fallos de carga.
- Tarjetas compartidas paginadas.
- Compartir, guardar imágenes y copiar texto.

---

# Datos actuales

- 70 jornadas históricas importadas desde el registro de WhatsApp.
- 1.203 viajes históricos originales.
- Cierres de efectivo y datáfono validados contra la fuente original.
- La jornada activa se mantiene separada del historial cerrado.

Los datos se encuentran actualmente en la base MySQL local. Todavía no fueron
migrados a una base de producción.

---

# Estado del deploy

Taxi Finance todavía no está desplegada.

El frontend y el servidor ya admiten configuración por entorno. En desarrollo
utilizan los valores locales y en producción podrán recibir la URL pública de
la API y el puerto asignado sin modificar el código. No existe todavía
autenticación ni separación por usuario: cualquier persona que accediera a
una publicación abierta utilizaría el mismo conjunto de datos.

El primer deploy deberá ser privado para un único conductor. Antes de
realizarlo quedan pendientes:

1. ✅ Configuración de la URL de API y puerto mediante variables de entorno.
2. ✅ Esquema reproducible y sistema de migraciones de la base de datos.
3. ✅ Restricción del origen permitido por CORS.
4. ✅ Protección del acceso privado para un único conductor.
5. ✅ Copia de seguridad inicial verificada.
6. Configuración de respaldos automáticos en producción.
7. ✅ Uso de Node.js 22 en desarrollo y producción.
8. ✅ Frontend y API unificados bajo el mismo sitio.
9. Prueba integral desde el móvil.

El traslado de los datos todavía está pendiente porque requiere crear primero
la base privada de destino. Una vez disponible, se aplicarán las migraciones y
se importará una copia validada de los datos locales.

Existe un comando reproducible para generar respaldos privados con
`mysqldump` y validar su integridad mediante SHA-256. La automatización
periódica se configurará cuando se haya elegido el proveedor de producción.

La API y el frontend ya incluyen acceso privado mediante contraseña y sesión
firmada. En producción será obligatorio configurar la huella de la contraseña
y una clave de sesión. Esta solución protege la Beta individual, pero todavía
no crea cuentas ni separa datos entre distintos usuarios.

El proveedor de despliegue deberá permitir que frontend y API funcionen bajo
el mismo sitio para conservar la sesión de forma fiable en el móvil. El código
ya implementa esa topología: Express sirve el frontend y agrupa la API bajo
`/api`.

---

# Estado de la documentación

La documentación principal del proyecto se encuentra actualizada y alineada con la Beta 1.0.

## Documentación disponible

- ✅ 00-roadmap.md
- ✅ 01-project-journal.md
- ✅ 02-architecture.md
- ✅ 03-architecture-decisions.md
- ✅ 04-backlog.md
- ✅ 05-release-notes.md
- ✅ 06-business-rules.md
- ✅ 07-current-state.md

Cada documento cumple un propósito específico y, en conjunto, proporciona una visión completa del estado funcional, técnico y organizativo del proyecto.

---

# Próxima fase

Tras la finalización de la Beta 1.0, el desarrollo continuará siguiendo el Roadmap oficial.

Las prioridades actuales son:

1. Sprint 17 — Estabilización.
2. Sprint 18 — Liquidación mensual.
3. Sprint 19 — Dashboard.
4. Sprint 20 — Reportes y exportación.
5. Sprint 21 — Usuarios y roles.
6. Sprint 22 — Panel del jefe.

---

# Metodología de trabajo

El desarrollo de Taxi Finance seguirá un proceso iterativo basado en sprints.

Cada sprint deberá completar el siguiente flujo de trabajo:

1. Revisar la documentación vigente.
2. Confirmar las reglas de negocio aplicables.
3. Implementar una única funcionalidad o conjunto reducido de cambios relacionados.
4. Realizar pruebas funcionales.
5. Actualizar la documentación correspondiente.
6. Crear el commit.
7. Realizar el push al repositorio.
8. Cerrar el sprint.

Este proceso garantiza que el código, la documentación y las reglas de negocio evolucionen de forma sincronizada.

---

# Fuente de verdad

La documentación ubicada en el directorio `/docs` constituye la referencia oficial del proyecto.

Ante cualquier contradicción entre una conversación, una implementación o una propuesta de cambio, deberá consultarse la documentación antes de modificar el comportamiento de la aplicación.

Las reglas de negocio y las decisiones arquitectónicas deberán actualizarse antes de dar por finalizado cualquier sprint que implique cambios funcionales.

---

# Conclusión

Este documento ofrece una visión resumida del estado actual de Taxi Finance.

Su objetivo es facilitar la incorporación al proyecto, conocer rápidamente el punto de desarrollo alcanzado y servir como referencia para iniciar el siguiente sprint.

Siempre deberá mantenerse alineado con el Roadmap, el Backlog y el resto de la documentación principal para reflejar con precisión la situación real del proyecto.

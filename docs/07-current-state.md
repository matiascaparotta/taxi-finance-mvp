# 📍 Estado actual del proyecto

**Versión:** 2.1

**Última actualización:** 25/07/2026

**Estado:** Beta 1.0 publicada — transición multiusuario en desarrollo

---

# Objetivo

Este documento resume el estado actual de TaxFin.

Su finalidad es ofrecer una visión rápida del punto en el que se encuentra el proyecto, incluyendo el avance del desarrollo, la documentación disponible y la metodología de trabajo utilizada.

A diferencia del **Roadmap**, que describe las fases previstas del proyecto, este documento refleja únicamente la situación actual del desarrollo.

---

# Proyecto

**Aplicación:** TaxFin

**Organización inicial:** Lic249

**Versión actual:** Beta 1.0

**Estado general:** Funcional y en estabilización

La Beta 1.0 se considera finalizada.

El proyecto dispone de una arquitectura consolidada, una documentación alineada y una primera versión funcional capaz de gestionar una jornada completa de trabajo.

A partir de este punto, el desarrollo continúa con la estabilización y la
validación del uso diario sobre el primer deploy privado.

---

# Sprint actual

## Sprint 18 — Base multiusuario

**Estado:** En desarrollo

### Objetivos

- Incorporar organizaciones, usuarios, membresías y vehículos.
- Mantener disponible e intacto el flujo diario de producción.
- Preparar la migración de los datos históricos a la cuenta de Matías.
- Sustituir el acceso general solo después de validar el acceso individual.

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

Los datos se encuentran en MySQL de producción y fueron verificados después de
la restauración. La copia local y el respaldo SQL con checksum se conservan
como recuperación independiente.

---

# Estado del deploy

Lic249 está desplegada de forma privada en Railway:

- Aplicación: `https://taxi-finance-mvp-production.up.railway.app`
- Entorno: `production`
- Región: EU West
- Base de datos: MySQL con volumen persistente
- Acceso: contraseña única y sesión firmada para el conductor autorizado
- Topología: frontend y API bajo el mismo dominio HTTPS

Estado de la preparación:

1. ✅ Configuración de la URL de API y puerto mediante variables de entorno.
2. ✅ Esquema reproducible y sistema de migraciones de la base de datos.
3. ✅ Restricción del origen permitido por CORS.
4. ✅ Protección del acceso privado para un único conductor.
5. ✅ Copia de seguridad inicial verificada.
6. ⏳ Alternativa de respaldos automáticos compatible con el plan Hobby.
7. ✅ Uso de Node.js 22 en desarrollo y producción.
8. ✅ Frontend y API unificados bajo el mismo sitio.
9. ✅ Railway elegido y configurado como plataforma de la Beta.
10. ✅ Creación de los servicios reales de aplicación y MySQL.
11. ✅ Migración y validación de los datos en producción.
12. Prueba integral desde el móvil.

El traslado de los datos se completó el 24/07/2026. Después de retirar una
jornada de prueba, producción contiene 70 jornadas, 1.203 viajes y 70
resúmenes mensuales.

Existe un comando reproducible para generar respaldos privados con
`mysqldump` y validar su integridad mediante SHA-256. Railway limita los
respaldos automáticos y PITR al plan Pro; mientras se mantenga Hobby, el
respaldo manual verificado es obligatorio antes de cambios de datos
importantes.

La API y el frontend incluyen acceso privado mediante contraseña y sesión
firmada. Esta solución continuará protegiendo la Beta durante la transición.
La base de organizaciones, usuarios, membresías y vehículos se incorporará de
forma aditiva, sin cambiar inicialmente el acceso ni asignar las jornadas.

El aprovisionamiento inicial de Lic249 está preparado para crear a Matías como
conductor, a José Revilla como propietario y conductor, y el vehículo
compartido. Todavía no fue ejecutado en producción.

Las jornadas ya pueden incorporar referencias opcionales a organización,
conductor y vehículo. El procedimiento para asignar las jornadas existentes a
Matías está preparado y probado, pero todavía no fue ejecutado en producción.

El inicio de sesión individual está implementado en desarrollo. Convive con el
acceso privado actual, conserva las sesiones antiguas y permite identificar al
usuario, su organización y sus roles. Todavía no filtra jornadas ni fue
publicado en producción.

Las cuentas individuales también exigen cambiar la contraseña temporal antes
de acceder a jornadas o viajes. El flujo está protegido en frontend y backend,
pero todavía no fue publicado ni ejecutado con cuentas reales.

El aislamiento por conductor y organización está implementado en desarrollo.
Los conductores solo acceden a sus datos; los propietarios pueden consultar y
exportar las jornadas de su organización, pero únicamente modifican las
propias. Las nuevas jornadas reciben conductor y vehículo automáticamente, y
el kilometraje conserva la continuidad entre los turnos del coche compartido.
Esta funcionalidad todavía no fue publicada ni activada con datos reales.

La separación de marca está implementada en desarrollo. La aplicación utiliza
TaxFin en sus pantallas generales y conserva Lic249 como identidad de la
organización inicial en tarjetas y exportaciones. Las futuras organizaciones
recibirán su nombre desde los datos de la jornada. Todavía no fue publicada.

El primer panel del propietario también está implementado en desarrollo. Una
cuenta propietaria puede seguir las jornadas activas de sus conductores, ver
sus totales y los cinco viajes más recientes con actualización cada treinta
segundos. La vista es de solo lectura y permanece separada de la jornada
personal del propietario. Todavía no fue publicada.

El proveedor de despliegue deberá permitir que frontend y API funcionen bajo
el mismo sitio para conservar la sesión de forma fiable en el móvil. El código
ya implementa esa topología: Express sirve el frontend y agrupa la API bajo
`/api`.

Railway aloja el primer deploy mediante el plan Hobby. La configuración del
repositorio instala y compila el monorepo, ejecuta las migraciones antes de
publicar, comprueba `/api/health` y reinicia el servicio ante fallos.

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

1. Sprint 18 — Base multiusuario.
2. Sprint 19 — Panel del propietario.
3. Sprint 20 — Liquidaciones configurables.
4. Sprint 21 — Dashboard.
5. Sprint 22 — Reportes y exportación.

---

# Metodología de trabajo

El desarrollo de Lic249 seguirá un proceso iterativo basado en sprints.

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

Este documento ofrece una visión resumida del estado actual de Lic249.

Su objetivo es facilitar la incorporación al proyecto, conocer rápidamente el punto de desarrollo alcanzado y servir como referencia para iniciar el siguiente sprint.

Siempre deberá mantenerse alineado con el Roadmap, el Backlog y el resto de la documentación principal para reflejar con precisión la situación real del proyecto.

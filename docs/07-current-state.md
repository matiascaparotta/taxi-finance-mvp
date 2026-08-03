# 📍 Estado actual del proyecto

**Versión:** 2.1

**Última actualización:** 25/07/2026

**Estado:** Beta 1.0 publicada — base multiusuario compatible desplegada

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

**Estado:** Base técnica, aprovisionamiento y migración histórica desplegados

### Objetivos

- Incorporar organizaciones, usuarios, membresías y vehículos.
- Mantener disponible e intacto el flujo diario de producción.
- Mantener vinculados los datos históricos a la cuenta de Matías.
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
- 1 jornada posterior creada durante el uso real.
- 1.221 viajes almacenados actualmente.
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

El traslado inicial de los datos se completó el 24/07/2026. El 25/07/2026,
antes de publicar la base multiusuario, producción contenía 71 jornadas,
1.221 viajes y 70 cierres importados. Esos recuentos se conservaron después
del despliegue.

Existe un comando reproducible para generar respaldos privados con
`mysqldump` y validar su integridad mediante SHA-256. Railway limita los
respaldos automáticos y PITR al plan Pro; mientras se mantenga Hobby, el
respaldo manual verificado es obligatorio antes de cambios de datos
importantes.

La API y el frontend incluyen acceso privado mediante contraseña y sesión
firmada. Esta solución continuará protegiendo la Beta durante la transición.
La base de organizaciones, usuarios, membresías y vehículos se incorporó en
producción de forma aditiva el 25/07/2026. Las migraciones `008` a `013`
quedaron registradas y las jornadas históricas se asignaron después mediante
una operación independiente. El acceso privado anterior continúa activo.

El aprovisionamiento inicial de Lic249 se ejecutó en producción el 25/07/2026.
Creó a Matías como conductor, a José Revilla como propietario y conductor, y
el vehículo compartido `Taxi Lic249`. Ambas cuentas autentican correctamente
y exigen cambiar su contraseña temporal durante el primer acceso.

Las 71 jornadas históricas y sus 1.221 viajes pertenecen a Matías, dentro de
Lic249 y vinculadas al vehículo `Taxi Lic249`. La asignación fue transaccional,
solo afectó jornadas sin propietario y conservó la jornada nueva de José.

El inicio de sesión individual está publicado en producción. Convive con el
acceso privado actual, conserva las sesiones antiguas y permite identificar al
usuario, su organización y sus roles cuando existan cuentas aprovisionadas.

Las cuentas individuales también exigen cambiar la contraseña temporal antes
de acceder a jornadas o viajes. El flujo ya está publicado y protegido en
frontend y backend; Matías y José ya disponen de sus cuentas reales
aprovisionadas.

El aislamiento por conductor y organización está publicado y activo.
Los conductores solo acceden a sus datos; los propietarios pueden consultar y
exportar las jornadas de su organización, pero únicamente modifican las
propias. Las nuevas jornadas reciben conductor y vehículo automáticamente, y
el kilometraje conserva la continuidad entre los turnos del coche compartido.
Los datos reales de Matías y José ya están separados por propietario.

La separación de marca está publicada. La aplicación utiliza
TaxFin en sus pantallas generales y conserva Lic249 como identidad de la
organización inicial en tarjetas y exportaciones. Las futuras organizaciones
recibirán su nombre desde los datos de la jornada.

El primer panel del propietario también está publicado y permanece oculto
hasta que exista una cuenta propietaria aprovisionada. Una
cuenta propietaria puede seguir las jornadas activas de sus conductores, ver
sus totales y todos los viajes con actualización cada treinta segundos. El
seguimiento incluye acumulados privados de comisión y propina. La vista es de
solo lectura y permanece separada de la jornada personal del propietario.

Esta mejora está publicada en producción. Las imágenes compartidas omiten
comisiones y propinas de los viajes, sin eliminar esos datos del sistema.

La primera corrección segura está publicada: un usuario personal
puede editar un viaje de una jornada propia cerrada y creada en TaxFin. Debe
confirmar su contraseña y registrar un motivo. TaxFin guarda una auditoría
transaccional con el usuario y los valores anterior y resultante. Las jornadas
importadas y las jornadas ajenas continúan protegidas. La eliminación se
abordó en una entrega separada; la corrección de los datos generales de la
jornada sigue pendiente.

La segunda corrección segura está publicada: el conductor puede
eliminar un viaje de una jornada propia cerrada usando la misma contraseña y
el mismo motivo de corrección. La eliminación y su auditoría se ejecutan en una
sola transacción. Las jornadas importadas y ajenas permanecen bloqueadas.

El despliegue de `5b0d5d9` fue verificado con la API saludable y el nuevo
paquete visible en producción. Los recuentos permanecieron en 78 jornadas,
1.344 viajes y 70 importaciones; las 70 jornadas importadas siguen marcadas
como protegidas. La tabla de auditoría existe y no recibió registros de prueba,
ya que la comprobación no eliminó datos reales. La prueba automatizada confirma
que una eliminación válida y su auditoría se confirman o revierten juntas.
José conserva acceso de lectura a las jornadas de Matías, sin permiso de
escritura. La corrección de fecha continúa pendiente y no forma parte de esta
entrega.

La tercera corrección segura está implementada localmente. Un usuario personal
puede corregir el combustible y los kilómetros de una jornada propia cerrada.
La operación exige contraseña, motivo y confirmación; valida la continuidad
contra las jornadas anterior y siguiente del vehículo y registra valores
anteriores y resultantes dentro de la misma transacción. El propietario solo
puede registrar combustible propio y el conductor conserva el reparto 50/50.
Las jornadas importadas y ajenas siguen bloqueadas. La fecha continúa
pendiente.

La publicación del commit `64af02b` dejó activa la migración de auditoría. La
comprobación posterior registró 78 jornadas, 1.344 viajes y 70 importaciones,
sin cambios en los datos existentes.

La corrección del acceso histórico del propietario está publicada. Incorpora
`Mis conductores`, el acceso directo al historial de Matías y un selector por
conductor. El contrato de sesión normaliza los roles nuevos y anteriores para
conservar las sesiones ya abiertas sin exigir un nuevo inicio de sesión.

La siguiente mejora está implementada localmente y pendiente de publicación:
el historial del propietario diferenciará `Mis jornadas` de `Jornadas de
Matías`, sin una vista combinada, y las jornadas ajenas se identificarán como
solo lectura. La opción de combustible compartido del conductor conservará el
reparto 50/50 con una etiqueta genérica, sin vincular la interfaz a un nombre
personal.

En el cierre de una jornada propia, un propietario registra toda la gasolina
como gasto propio. La interfaz no ofrece reparto y el backend fuerza la misma
regla aunque se manipule la petición. Los conductores no propietarios conservan
las opciones actuales de carga propia o compartida.

La gestión inicial de conductores está publicada y permanece disponible solo
para cuentas propietarias. Un
propietario puede crear accesos con contraseña temporal, elegir la modalidad
de combustible y suspender o reactivar conductores no propietarios. La
suspensión conserva el historial, exige que no exista una jornada activa e
invalida las sesiones existentes en la siguiente petición.

El restablecimiento de contraseñas también está publicado. Un
propietario puede generar una clave temporal nueva para un conductor de su
organización; la anterior se invalida y cualquier sesión abierta vuelve al
cambio obligatorio en su siguiente petición.

Antes del despliegue del 25/07/2026 se creó el respaldo privado
`taxfin-production-before-multiuser-2026-07-25.sql`, acompañado por su huella
SHA-256. Después del despliegue se verificaron:

- las 13 migraciones registradas;
- las cuatro tablas multiusuario;
- 71 jornadas, 1.221 viajes y 70 cierres importados sin cambios;
- el endpoint de salud de TaxFin;
- la sesión anterior, la Home y el historial real.

Antes de la asignación histórica se creó y verificó el respaldo privado
`taxfin-production-before-workday-assignment-2026-07-25.sql`, con SHA-256
`1233ceac7bcc26343ce619604fea9a4d62f9912543e3dfbef53316a7d48253a5`.
Después de la operación se verificaron 72 jornadas y 1.224 viajes totales:
71 jornadas y 1.221 viajes de Matías, más una jornada y 3 viajes de José.
No quedó ninguna jornada sin propietario y el acceso legacy continúa activo.

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

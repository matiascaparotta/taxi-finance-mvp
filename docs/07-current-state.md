# 📍 Estado actual del proyecto

**Versión:** 2.1

**Última actualización:** 03/08/2026

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

# Liquidación mensual publicada

La nueva pestaña `Mensual` reconstruye los meses de Matías desde jornadas
cerradas. Incluye reparto 50/50, conciliación de efectivo y datáfono,
configuración compartida de Seguridad Social y nómina, historial y cierre
exclusivo por Matías con instantánea y auditoría. No modifica jornadas, no
habilita escrituras offline y no retira el acceso legacy.

El cotejo de junio contra la liquidación entregada confirmó 20 jornadas,
364,48 € de gasolina propia, 110,73 € de gasolina de José y 3.179,27 € de
datáfono. Las jornadas oficiales suman 2.373,50 € de efectivo y 5.122 km. Se
identificaron como errores manuales del documento anterior una diferencia de
0,21 € en efectivo y otra de 232 km. Junio queda por tanto conciliado con
5.188,29 € netos y una entrega final de 1.172,56 € a José, sin modificar
ninguna jornada.

La función está publicada desde el 03/08/2026. El historial de commits es
`f2769a5` (funcionalidad), `fc8ed9c` (migraciones separadas), `4c6106e`
(identificación de conductores) y `f1bfc05` (fechas normalizadas). Railway
desplegó exactamente `f1bfc054889c`; las migraciones `016` y `017` quedaron
aplicadas y `/api/health` respondió saludable.

La comprobación de solo lectura con la sesión real de José confirmó la pestaña
`Mensual`, los 20 días de junio con fechas válidas, todos los importes
conciliados y el mensaje que reserva el cierre definitivo a Matías. José no ve
el botón de cierre. No se guardó configuración, no se cerró ninguna
liquidación y no se creó, corrigió ni eliminó ninguna jornada o viaje. El
service worker activo usa la versión real `taxfin-app-shell-f1bfc054889c`, sin
el marcador de compilación. El acceso legacy continúa activo y no existe modo
offline financiero ni sincronización posterior.

# Sprint actual

## Perfil independiente de Alberto — publicado

El alta de `Lic1315` crea una organización aislada, el vehículo `Taxi Lic1315`
y la cuenta personal `alberto.caparotta`. Alberto es propietario y conductor
de su propia organización, por lo que no pertenece a Lic249 ni puede consultar
datos de Matías o José. Comienza con combustible por importe real completo; no
se aplica ningún porcentaje sobre la carga. El aprovisionamiento es idempotente
y exige un cambio de contraseña en el primer acceso.

El perfil se publicó el 03/08/2026 mediante `64632da`. Railway desplegó
exactamente `64632da9b276` y `/api/health` permaneció saludable. El alta segura
creó el usuario con identificador 3 dentro de la organización 2. Una
autenticación de comprobación confirmó su nombre, licencia, roles y cambio de
contraseña obligatorio. Hasta realizar ese cambio, la API rechaza el acceso a
jornadas. No se creó ninguna jornada, viaje ni dato financiero y Lic249 no se
modificó.

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

La tercera corrección segura está publicada. Un usuario personal
puede corregir el combustible y los kilómetros de una jornada propia cerrada.
La operación exige contraseña, motivo y confirmación; valida la continuidad
contra las jornadas anterior y siguiente del vehículo y registra valores
anteriores y resultantes dentro de la misma transacción. El propietario solo
puede registrar combustible propio y el conductor conserva el reparto 50/50.
Las jornadas importadas y ajenas siguen bloqueadas. El despliegue de `9e6fa03`
quedó activo en Railway y la API respondió saludable. La verificación mantuvo
la referencia de 78 jornadas, 1.344 viajes, 70 importaciones protegidas y cero
auditorías previas, sin efectuar correcciones reales. Las 122 pruebas
automatizadas finalizaron correctamente. La fecha continúa pendiente y no se
inició en esta entrega.

La publicación del commit `64af02b` dejó activa la migración de auditoría. La
comprobación posterior registró 78 jornadas, 1.344 viajes y 70 importaciones,
sin cambios en los datos existentes.

El bloque completo de corrección segura está publicado en producción.
Además de los viajes, combustible y kilómetros ya publicados, permite corregir
la fecha sin duplicar jornadas del mismo conductor y vuelve a validar la
continuidad del vehículo según la nueva posición temporal. La eliminación de
una jornada completa exige contraseña, motivo y la palabra `ELIMINAR`; la
auditoría conserva previamente la jornada y todos sus viajes en la misma
transacción. Solo el conductor propietario puede usar estas operaciones. José
mantiene lectura sobre jornadas ajenas y las importadas siguen bloqueadas.
El commit `1cdd5d6` quedó activo en Railway el 03/08/2026. El despliegue
confirmó que las migraciones estaban actualizadas y la API respondió saludable.
La comprobación posterior conservó 79 jornadas, 1.354 viajes, 70 importaciones
protegidas y una auditoría previa. No aparecieron fechas duplicadas ni rupturas
de continuidad kilométrica y no se modificó ni eliminó ningún dato real.

Antes de publicar se generó el respaldo privado
`lic249-2026-08-03T14-23-24-625Z.sql`, de 142.112 bytes, con SHA-256
`54edb2bd794443643a885fdf91542a3f93748d29bc2406b623ec127ab6b93068`.
El archivo y su checksum tienen permisos privados, fueron verificados y
permanecen en `backups/`, ignorados por Git.

La sesión personal de José permaneció activa durante el despliegue. Desde ella
se verificó el acceso al historial y detalle de Matías en modo explícito de solo
lectura, sin controles de corrección o eliminación. Matías y José permanecen
activos, con contraseña definitiva. No se cerró la sesión de José ni se pidió
la contraseña privada de Matías para repetir un inicio manual; el cambio no
modificó autenticación y el acceso legacy continúa configurado.

Durante la primera prueba real se detectó una pestaña anterior al despliegue
que enviaba la corrección sin el nuevo campo de fecha y no mostraba los campos
de seguridad del borrado. La compatibilidad se corrigió conservando la fecha
almacenada cuando el cliente anterior no la envía, normalizando fechas ISO sin
desplazarlas por zona horaria y mostrando un aviso explícito para volver a
abrir TaxFin si la pantalla de eliminación está desactualizada. La palabra
`ELIMINAR` se exige ahora tanto en el cliente como en el servidor.

TaxFin incorpora un manifiesto de aplicación con inicio en `/`, alcance global
y modo independiente. Los accesos instalados nuevos abren la Home en lugar de
conservar la URL de un detalle. El encabezado TaxFin también permite volver al
inicio desde cualquier pantalla. Un acceso directo creado antes de esta mejora
puede requerir eliminarse y añadirse nuevamente una sola vez.
La identidad instalada utiliza un icono propio de taxi con la marca TaxFin,
fondo oscuro y formatos específicos para iPhone y Android.

La primera etapa PWA está publicada en producción desde el 03/08/2026 mediante
el commit `1ae3285`.
El service worker almacena solamente la interfaz, el manifest y los iconos;
excluye completamente `/api`, sesiones y datos financieros. TaxFin avisa al
perder conexión, bloquea escrituras sin red y permite activar una nueva versión
mediante el botón `Actualizar TaxFin`. El modo offline con cola de viajes no
forma parte de esta entrega.

Railway sirvió exactamente el build `1ae3285a1f98`, después de completar el
paso obligatorio de migraciones y superar el healthcheck de `/api/health`. El
worker publicado usa `taxfin-app-shell-1ae3285a1f98` y ya no contiene
`__TAXFIN_BUILD_VERSION__`. `/sw.js`, `/manifest.webmanifest`, los iconos de
180, 192 y 512 píxeles y el favicon respondieron correctamente. El manifiesto
conserva `start_url` y `scope` en `/`; el registro, control e inicio desde la
Home quedaron verificados, igual que la activación segura de versiones nuevas
mediante `Actualizar TaxFin`.

La comprobación funcional se realizó con la sesión real y ya iniciada de José,
sin introducir ni enviar datos. La Home y el historial de Matías cargaron
correctamente; tanto el selector como el detalle identificaron la consulta como
solo lectura y no ofrecieron acciones de edición, corrección o eliminación. No
se creó, corrigió ni eliminó ninguna jornada o viaje real. El acceso legacy
continúa activo.

La cabecera personalizada por usuario está publicada desde el 03/08/2026
mediante el commit `1f49f4a`. TaxFin muestra el icono de la aplicación, el
nombre, el rol, las iniciales y una salida de sesión secundaria. El icono y la
marca regresan a Inicio. Matías dispone de `Inicio`, `Mi jornada` e
`Historial`; José añade `Mis conductores` por su rol propietario. La navegación
móvil distribuye todas las opciones sin desbordamiento y `Mi jornada` lleva a
la acción personal sin crear una ruta de escritura nueva.

Railway sirvió exactamente el build `1f49f4a521b3`, completó las migraciones
previas y mantuvo `/api/health` saludable. Las 98 pruebas del servidor, las 40
del cliente, el análisis estático y la compilación finalizaron correctamente.
La sesión real de José conservó el acceso después de activar la versión nueva
con `Actualizar TaxFin`; el historial de Matías continuó identificado como
solo lectura. No se escribió ni modificó ningún dato real y el acceso legacy
permanece activo.

El seguimiento de una jornada activa incorpora acumulados discretos por medio
de pago desde el commit `95e4dab`. Encima de la calculadora de viajes aparecen
la facturación total, el efectivo y el datáfono; cada bloque indica además la
cantidad de viajes correspondiente y se actualiza después de guardar. La Home
personal y el seguimiento de solo lectura del propietario muestran también los
recuentos de efectivo y datáfono como información secundaria bajo cada importe.

Railway publicó exactamente el build `95e4dab6ed2a`, con migraciones
actualizadas y `/api/health` saludable. Las 41 pruebas del cliente, el análisis
estático y la compilación finalizaron correctamente. La sesión real de José
activó la nueva PWA sin perder acceso. No había conductores en servicio durante
la comprobación, por lo que los acumulados poblados se validaron mediante las
pruebas y el paquete publicado, sin crear una jornada o un viaje de prueba. No
se modificaron datos reales y el acceso legacy continúa activo.

La reorganización de la jornada está publicada desde el 03/08/2026 mediante el
commit `310d3f5`. Inicio queda reducido a un resumen breve y la nueva ruta
`/my-work-day` concentra la operativa personal: iniciar jornada, consultar los
acumulados, registrar viajes, cerrar y cancelar. En móvil la barra inferior
separa Inicio, Mi jornada e Historial sin desbordamiento horizontal.

Una jornada abierta creada por error puede cancelarse sin completar los campos
de cierre. Si está vacía, la confirmación es simple. Si contiene viajes, exige
motivo, contraseña actual y escribir `CANCELAR`. El servidor conserva el
registro con estado `CANCELLED`, escribe la auditoría en la misma transacción y
permite iniciar una jornada de reemplazo en esa fecha. La función solo puede
usarla el conductor sobre su propia jornada con una cuenta personal; la lectura
del propietario y el acceso legacy no cambian. La verificación local finalizó
con 102 pruebas del servidor, 43 del cliente, análisis estático y compilación
correctos. Railway ejecutó la migración `015` como paso previo y dejó activo
exactamente el build `310d3f575e6a`, con `/api/health` saludable. El worker
publicado utiliza esa versión sin el marcador de compilación; manifiesto e
iconos respondieron correctamente y la actualización controlada regresó a `/`.
La sesión real de José permaneció activa y la consulta del historial y detalle
de Matías continuó sin controles de escritura. No se modificó ningún dato real,
el acceso legacy siguió activo y no se incorporó modo offline financiero.

La interfaz móvil mantiene ahora una escala estable y un fondo oscuro continuo
en `html`, `body` y la raíz de React. El viewport cubre las áreas completas del
iPhone, evita el zoom accidental y el rebote ya no descubre el fondo blanco del
navegador. La mejora se publicó mediante `4395366`; Railway dejó activo
`43953668fe97`, con `/api/health` saludable y el worker correctamente
versionado. No hubo cambios de datos.

Las áreas seguras móviles están publicadas mediante `afe5710`. Railway sirve
exactamente `afe571066031`; la cabecera queda debajo de la barra de estado, la
cámara y los recortes de iPhone y Android, mientras la navegación inferior
respeta los controles del sistema.

El Inicio reunificado del propietario está publicado desde el 03/08/2026
mediante `341d6c4`. El estado general, el equipo y la actividad personal forman una
jerarquía compacta. Cada conductor aparece una sola vez y, cuando trabaja,
muestra viajes, facturación, efectivo y datáfono sin desplegar toda la jornada.
Al tocarlo se conserva el detalle completo de solo lectura. La validación local
finalizó con 47 pruebas del cliente, análisis estático y compilación correctos.
Railway sirve exactamente `341d6c465e16` y `/api/health` permanece saludable.
La sesión real de José conservó su identidad; Matías apareció en una única fila
fuera de servicio y su historial continuó en modo de solo lectura, sin acciones
de escritura. La actualización PWA no perdió la pantalla consultada y ningún
dato real fue modificado.

El centro de control en vivo del propietario está publicado desde el 03/08/2026
mediante `dc68c80`. Al tocar un conductor en servicio, José ve todos los
viajes y los acumulados de facturación, efectivo, datáfono, comisiones y
propinas, con actualización automática cada diez segundos. La vista abierta no
muestra kilometraje final ni permite compartir. Cuando el conductor cierra la
jornada, el detalle pasa al modo cerrado y habilita el resumen compartible. El
acceso permanece en solo lectura. La validación finalizó con 50 pruebas del
cliente, análisis estático, compilación y revisión visual móvil correctos.
Railway sirve exactamente `dc68c80baf93` y `/api/health` permanece saludable.
La jornada real activa de Matías permitió confirmar desde José los viajes y
acumulados en solo lectura, sin kilometraje final, opciones para compartir ni
controles de escritura. La PWA se actualizó y ningún dato real fue modificado.

La protección de desplazamiento móvil está implementada localmente y pendiente
de publicación. La barra de estado de iPhone es opaca y la cabecera de TaxFin
permanece fija, con fondo sólido y debajo de las áreas seguras de iPhone y
Android. La revisión móvil confirmó el comportamiento después de desplazar más
de 600 píxeles, sin que el contenido invada la hora, notificaciones o batería.
Las 50 pruebas del cliente, análisis estático y compilación finalizaron bien.

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

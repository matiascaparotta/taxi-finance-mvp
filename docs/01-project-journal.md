# TaxFin — Project Journal

**Versión:** 2.1

**Última actualización:** 25/07/2026

**Sprint actual:** 18

**Último sprint completado:** 17

---

# Introducción

Este documento registra la evolución completa de TaxFin desde el inicio del proyecto. Las referencias históricas a Lic249 corresponden al nombre utilizado antes de separar la marca de la aplicación y la licencia de la organización.

Su objetivo no es únicamente listar las funcionalidades desarrolladas, sino documentar las decisiones técnicas, los cambios de enfoque y el aprendizaje obtenido durante el desarrollo.

A medida que el proyecto fue creciendo, también evolucionó la comprensión del problema que debía resolver. Algunas decisiones iniciales fueron modificadas tras validar el flujo de trabajo real de un conductor de taxi, priorizando siempre la utilidad práctica por encima de incorporar nuevas funcionalidades.

Por ese motivo, algunos objetivos planteados en los primeros sprints fueron redefinidos posteriormente. Estos cambios forman parte del proceso natural de diseño del producto y quedan reflejados tanto en este documento como en el Roadmap y en las Reglas de Negocio oficiales.

Cada sprint representa un incremento funcional del proyecto y deja constancia de las decisiones tomadas en ese momento.

---

# Sprint 1 — Inicio del proyecto

## Objetivo

Crear la base técnica sobre la que se desarrollará Lic249.

## Trabajo realizado

- Creación del repositorio Git.
- Configuración inicial del proyecto.
- Organización de la estructura de carpetas.
- Configuración del servidor Node.js.
- Instalación de Express.
- Configuración del entorno de desarrollo.
- Primer endpoint de prueba (`/health`).

## Resultado

Se obtuvo una base sólida y funcional para comenzar el desarrollo del backend.

Aunque la funcionalidad era mínima, el proyecto ya contaba con una estructura preparada para crecer de forma ordenada.

## Valor para el proyecto

Disponer de una arquitectura limpia desde el inicio permitió trabajar posteriormente con mayor rapidez y mantener el código organizado.

## Aprendizaje técnico

- Organización inicial de un proyecto Node.js.
- Configuración de Express.
- Separación básica entre servidor y aplicación.
- Primer contacto con la arquitectura del backend.

## Reflexión del sprint

Invertir tiempo en preparar correctamente la base del proyecto simplifica significativamente el desarrollo posterior.

## Estado

✅ Sprint finalizado.

---

# Sprint 2 — Primer flujo de datos

## Objetivo

Construir el primer flujo completo entre el cliente y la API.

## Trabajo realizado

- Creación del endpoint para registrar jornadas.
- Implementación del controlador.
- Creación de la capa de servicios.
- Primeras validaciones de datos.
- Pruebas mediante Thunder Client.

## Resultado

La aplicación ya era capaz de recibir información, validarla y procesarla correctamente.

Aunque todavía no existía persistencia de datos, quedó establecida la estructura que utilizaría toda la API.

## Valor para el proyecto

Se definió el patrón de trabajo que posteriormente seguirían todos los módulos del backend.

## Aprendizaje técnico

- Arquitectura Controller → Service.
- Validación de peticiones.
- Organización del código.
- Separación de responsabilidades.

## Reflexión del sprint

Comprender el flujo completo de una petición fue mucho más importante que desarrollar nuevas funcionalidades en esta etapa.

## Estado

✅ Sprint finalizado.

---

# Sprint 3 — Primeras reglas de negocio

## Objetivo

Comenzar a definir las reglas de negocio que posteriormente darían forma al funcionamiento financiero de Lic249.

## Trabajo realizado

- Primeras pruebas de cálculos financieros.
- Definición inicial de la relación entre efectivo, datáfono y combustible.
- Diseño preliminar de los resúmenes de jornada.
- Análisis del funcionamiento real del trabajo diario del conductor.

## Resultado

Se establecieron las primeras bases para los cálculos financieros de la aplicación.

Durante los siguientes sprints estas reglas evolucionarían considerablemente hasta consolidarse en el documento oficial de Reglas de Negocio.

## Valor para el proyecto

Antes de implementar funcionalidades complejas fue necesario comprender cómo debía comportarse realmente el negocio.

## Aprendizaje técnico

- Diseño de lógica de negocio.
- Separación entre datos y cálculos.
- Importancia de validar el comportamiento antes de programar todas las funcionalidades.

## Reflexión del sprint

Este sprint marcó el comienzo del cambio de enfoque del proyecto: dejar de pensar únicamente en programación para empezar a diseñar un producto adaptado al trabajo real del conductor.

## Estado

✅ Sprint finalizado.

---

# Sprint 4 — Persistencia de datos

## Objetivo

Incorporar una base de datos para conservar la información registrada entre sesiones.

## Trabajo realizado

- Integración de MySQL.
- Configuración de la conexión.
- Creación de las primeras tablas.
- Primeras operaciones de inserción y consulta.
- Organización de la capa de acceso a datos.

## Resultado

La información dejó de existir únicamente en memoria y comenzó a almacenarse de forma permanente.

Este paso convirtió a Lic249 en una aplicación capaz de conservar el historial de trabajo.

## Valor para el proyecto

La persistencia de datos permitió preparar el terreno para futuras funcionalidades como el historial, los informes y las estadísticas.

## Aprendizaje técnico

- Integración de MySQL.
- Consultas SQL básicas.
- Separación entre lógica de negocio y almacenamiento.
- Organización de la capa de datos.

## Reflexión del sprint

La persistencia fue uno de los primeros grandes hitos del proyecto, ya que permitió empezar a construir funcionalidades realmente útiles para el usuario.

## Estado

✅ Sprint finalizado.

# Sprint 5 — Registro de jornadas

## Objetivo

Permitir crear jornadas de trabajo desde la aplicación y validar por primera vez el flujo completo entre la interfaz, la API y la base de datos.

## Trabajo realizado

- Creación del endpoint para registrar jornadas.
- Implementación de las primeras validaciones.
- Persistencia de la información en la base de datos.
- Integración inicial entre frontend y backend.
- Pruebas del flujo completo de creación de una jornada.
- Corrección de errores detectados durante las primeras pruebas.

## Resultado

Lic249 fue capaz de registrar jornadas reales por primera vez.

La aplicación dejó de ser únicamente una estructura técnica y comenzó a almacenar información vinculada al trabajo diario del conductor.

## Valor para el proyecto

Este sprint permitió comprobar que la arquitectura elegida funcionaba de extremo a extremo y que el proyecto podía avanzar hacia funcionalidades más cercanas al uso real.

## Aprendizaje técnico

La integración entre frontend, backend y base de datos permitió entender cómo circula la información dentro de la aplicación y cómo debe validarse antes de guardarse.

## Reflexión del sprint

En esta etapa, la jornada todavía se entendía principalmente como un registro general del día. Más adelante, el proyecto evolucionaría hacia un modelo centrado en los viajes individuales, que reflejaba mejor el flujo real de trabajo del conductor.

## Estado

✅ Sprint finalizado.

# Sprint 6 — Primeras reglas automáticas de una jornada

## Objetivo

Transformar la información registrada en una jornada en datos útiles para el conductor mediante cálculos automáticos.

## Trabajo realizado

- Implementación de los primeros cálculos automáticos de la jornada.
- Integración de kilómetros iniciales y finales.
- Cálculo automático de kilómetros recorridos.
- Primeras reglas para efectivo, datáfono y combustible.
- Consolidación de la lógica de negocio dentro del backend.

## Resultado

La aplicación comenzó a generar automáticamente la información principal de una jornada utilizando los datos registrados.

Durante este sprint se definieron las primeras reglas de negocio, que posteriormente serían refinadas hasta convertirse en las reglas oficiales documentadas del proyecto.

## Valor para el proyecto

El sistema dejó de limitarse a almacenar información y comenzó a interpretarla, reduciendo cálculos manuales y preparando la futura automatización del flujo de trabajo.

## Aprendizaje técnico

Las reglas de negocio deben centralizarse en un único lugar para garantizar resultados consistentes en toda la aplicación.

## Reflexión del sprint

Este sprint marcó el paso desde una aplicación de registro hacia una herramienta capaz de aportar valor mediante cálculos automáticos. Muchas de estas reglas evolucionarían posteriormente tras validar el uso real de la aplicación.

## Estado

✅ Sprint finalizado.

---

# Sprint 7 — Registro de viajes

## Objetivo

Permitir registrar cada viaje realizado durante una jornada de trabajo.

## Trabajo realizado

- Creación del modelo Trip.
- Relación entre jornadas y viajes.
- Endpoint para registrar viajes.
- Asociación automática del viaje con la jornada abierta.
- Validaciones iniciales.
- Persistencia en base de datos.

## Resultado

Lic249 comenzó a almacenar cada viaje de forma individual, dejando atrás el modelo basado únicamente en totales diarios.

## Valor para el proyecto

Cada viaje pasó a convertirse en la unidad principal de información del sistema, permitiendo generar posteriormente estadísticas, historiales y resúmenes mucho más precisos.

## Aprendizaje técnico

Diseñar correctamente las relaciones entre entidades facilita enormemente la evolución futura del proyecto.

## Reflexión del sprint

Este fue uno de los cambios más importantes del desarrollo. La aplicación dejó de centrarse únicamente en jornadas para empezar a reflejar el trabajo real de un conductor de taxi.

## Estado

✅ Sprint finalizado.

---

# Sprint 8 — Home de la aplicación

## Objetivo

Construir la primera pantalla principal de Lic249 mostrando la información esencial de la jornada activa.

## Trabajo realizado

- Creación de la Home.
- Consulta de la jornada abierta.
- Visualización de los viajes registrados.
- Acceso al registro de nuevos viajes.
- Integración entre frontend y backend.

## Resultado

Por primera vez la aplicación permitió gestionar una jornada completa desde una interfaz visual.

## Valor para el proyecto

El conductor pudo dejar de interactuar únicamente con la API y comenzar a utilizar Lic249 como una herramienta real durante su jornada.

## Aprendizaje técnico

Una buena interfaz debe mostrar únicamente la información necesaria para realizar el trabajo sin distraer al usuario.

## Reflexión del sprint

La Home comenzó siendo sencilla, pero se convirtió en la base sobre la que posteriormente se optimizaría todo el flujo de trabajo diario.

## Estado

✅ Sprint finalizado.

---

# Sprint 9 — Mejora de la experiencia de uso

## Objetivo

Reducir el tiempo necesario para registrar viajes y simplificar el uso de la aplicación durante una jornada real.

## Trabajo realizado

- Revisión completa del flujo de registro.
- Simplificación de formularios.
- Mejora de la navegación.
- Optimización de la interacción entre pantallas.
- Identificación de futuras mejoras para acelerar aún más el registro de viajes.

## Resultado

El flujo comenzó a adaptarse mejor al ritmo de trabajo de un taxista, eliminando pasos innecesarios y detectando oportunidades de mejora que serían desarrolladas en sprints posteriores.

## Valor para el proyecto

La experiencia de uso pasó a convertirse en una prioridad al mismo nivel que la implementación técnica.

## Aprendizaje técnico

Una aplicación utilizada decenas de veces al día debe minimizar cualquier acción repetitiva que no aporte valor.

## Reflexión del sprint

Durante este sprint se comprendió que la velocidad de uso era uno de los aspectos más importantes del producto. Esta conclusión daría origen posteriormente al Sprint 15.

## Estado

✅ Sprint finalizado.

---

# Sprint 10 — Cierre de jornada

## Objetivo

Implementar el primer flujo de cierre de una jornada de trabajo.

## Trabajo realizado

- Cierre manual de jornadas.
- Registro del combustible.
- Actualización del estado de la jornada.
- Preparación del resumen final.
- Organización de la información necesaria para finalizar un turno.

## Resultado

Lic249 fue capaz de cerrar correctamente una jornada y dejar preparada toda la información para su revisión.

Aunque el flujo de cierre evolucionaría posteriormente, este sprint estableció la estructura sobre la que se desarrollaría el proceso definitivo.

## Valor para el proyecto

El sistema ya cubría el ciclo completo de una jornada: apertura, registro de viajes y cierre.

## Aprendizaje técnico

Completar el ciclo de vida de una entidad permite validar la arquitectura completa del sistema.

## Reflexión del sprint

Este sprint cerró la primera versión funcional del flujo de trabajo. La experiencia real de uso permitiría posteriormente simplificar y mejorar este proceso hasta llegar al cierre definitivo previsto para la Beta 1.0.

## Estado

✅ Sprint finalizado.

# Sprint 11 — Ticket de jornada

## Objetivo

Mostrar un resumen completo de la jornada una vez finalizado el turno, permitiendo revisar fácilmente toda la información antes de compartirla o consultarla posteriormente.

## Trabajo realizado

- Creación del componente reutilizable `WorkDayTicket`.
- Desarrollo de la pantalla `WorkDayClosedPage`.
- Implementación del endpoint `GET /work-days/:id`.
- Integración del ticket con los datos reales de la jornada.
- Navegación automática al finalizar el cierre de jornada.
- Visualización de:
  - fecha;
  - kilómetros;
  - cantidad de viajes;
  - facturación;
  - efectivo;
  - datáfono;
  - combustible.

## Resultado

Cada jornada cerrada pasó a disponer de un resumen visual claro y reutilizable.

Aunque en esta etapa se contempló su posible uso para futuras exportaciones en PDF, posteriormente el proyecto evolucionó hacia un sistema basado principalmente en tarjetas compartibles y resúmenes de texto.

## Valor para el proyecto

Toda la información importante quedó concentrada en un único componente reutilizable, facilitando su mantenimiento y evolución.

## Aprendizaje técnico

Diseñar componentes reutilizables evita duplicar código y garantiza una presentación consistente en toda la aplicación.

## Reflexión del sprint

El Ticket de Jornada se convirtió en una pieza central del proyecto, ya que posteriormente sería reutilizado tanto en el historial como en otras funcionalidades.

## Estado

✅ Sprint finalizado.

---

# Sprint 12 — Calidad del cierre de jornada

## Objetivo

Mejorar la calidad del cierre de jornada y ofrecer una experiencia de usuario más profesional antes de seguir incorporando nuevas funcionalidades.

## Trabajo realizado

- Creación de la utilidad `formatCurrency()`.
- Unificación del formato monetario en toda la aplicación.
- Implementación de `buildWorkDaySummaryText()`.
- Generación automática del resumen de la jornada.
- Copia automática al portapapeles.
- Sustitución de mensajes mediante `alert()` por notificaciones integradas en la interfaz.
- Revisión del flujo completo de cierre.

## Resultado

El cierre de jornada pasó a ofrecer una experiencia mucho más fluida, con un formato homogéneo y un resumen listo para compartir.

Este sprint sentó las bases del sistema de resumen diario, que seguiría evolucionando durante el resto del MVP.

## Valor para el proyecto

Se redujo el tiempo necesario para finalizar una jornada y compartir la información.

## Aprendizaje técnico

Las pequeñas mejoras de experiencia de usuario tienen un impacto muy importante cuando una funcionalidad se utiliza todos los días.

## Reflexión del sprint

Antes de añadir nuevas características era necesario consolidar el flujo existente y mejorar la calidad de uso.

## Estado

✅ Sprint finalizado.

---

# Sprint 13 — Gestión de viajes

## Objetivo

Permitir modificar y corregir los viajes registrados durante una jornada sin comprometer la consistencia de la información.

## Trabajo realizado

- Implementación del endpoint `GET /trips/:id`.
- Finalización del CRUD completo de viajes.
- Creación del componente reutilizable `TripForm`.
- Refactorización del formulario de creación.
- Desarrollo de `EditTripPage`.
- Edición de importe, método de pago y notas.
- Eliminación de viajes con confirmación.
- Acceso directo a la edición desde la Home.
- Actualización automática de los cálculos tras modificar un viaje.

## Resultado

Los viajes pasaron a ser completamente gestionables desde la aplicación.

El usuario ya no necesitaba eliminar jornadas completas para corregir errores de registro.

## Valor para el proyecto

La aplicación ganó flexibilidad y se adaptó mucho mejor al uso real durante una jornada de trabajo.

## Aprendizaje técnico

La reutilización de componentes permitió mantener un único formulario para crear y editar viajes, simplificando el mantenimiento del código.

## Reflexión del sprint

Este sprint consolidó definitivamente al viaje como la unidad principal de información dentro de Lic249.

## Estado

✅ Sprint finalizado.

---

# Sprint 14 — Historial de jornadas

## Objetivo

Permitir consultar jornadas anteriores, revisar todos los viajes registrados y construir la base para futuros informes y estadísticas.

## Trabajo realizado

- Desarrollo de `WorkDayHistoryPage`.
- Nueva ruta `/history`.
- Acceso al historial desde la pantalla principal.
- Desarrollo de `WorkDayDetailPage`.
- Nueva ruta `/work-days/:id`.
- Integración del detalle completo de cada jornada.
- Reutilización del componente `WorkDayTicket`.
- Visualización de:
  - información general;
  - resumen económico;
  - listado completo de viajes.
- Implementación del botón para copiar el resumen diario.
- Separación entre la información mostrada dentro de la aplicación y el texto compartido externamente.
- Mejora del formato del resumen para WhatsApp.
- Adaptación automática de la fecha para jornadas nocturnas.
- Ordenación de jornadas por fecha de creación.

## Resultado

Lic249 pasó a conservar el historial completo de jornadas, permitiendo revisar cualquier día trabajado sin depender de anotaciones externas.

El historial se convirtió además en la base sobre la que posteriormente se construirían los módulos de estadísticas e informes previstos en el Roadmap.

## Valor para el proyecto

El conductor obtuvo acceso permanente a toda su información histórica desde una única aplicación.

## Aprendizaje técnico

Separar claramente la representación interna de los datos y el formato compartido facilita adaptar la aplicación a distintos escenarios sin duplicar lógica.

## Reflexión del sprint

Con este sprint Lic249 dejó de ser únicamente una herramienta para registrar el presente y pasó a convertirse también en una herramienta de consulta y seguimiento del trabajo realizado.

## Estado

✅ Sprint finalizado.

# Sprint 15 — Optimización del flujo de registro

## Objetivo

Reducir al mínimo el tiempo necesario para registrar un viaje durante una jornada real, priorizando la velocidad y la simplicidad de uso por encima de la incorporación de nuevas funcionalidades.

## Trabajo realizado

- Revisión completa del flujo de registro de viajes.
- Simplificación de la interfaz para reducir el número de acciones necesarias.
- Reorganización de la pantalla principal priorizando la rapidez de uso.
- Eliminación de pasos que no aportaban valor al conductor.
- Adaptación del flujo al trabajo real realizado durante una jornada de taxi.
- Preparación de la aplicación para la Beta 1.0.

## Resultado

Registrar un viaje pasó a ser un proceso mucho más rápido, sencillo y natural.

Durante este sprint se confirmó que el verdadero problema no era únicamente introducir importes con mayor rapidez, sino optimizar todo el flujo de trabajo del conductor.

Esta conclusión provocó una revisión del MVP y permitió definir con mayor claridad los objetivos de la Beta 1.0.

## Valor para el proyecto

La aplicación comenzó a construirse alrededor del comportamiento real del usuario, priorizando la experiencia de uso frente a la incorporación de nuevas funcionalidades.

## Aprendizaje técnico

El mejor software no es el que incorpora más funciones, sino el que permite realizar el trabajo diario con el menor esfuerzo posible.

## Reflexión del sprint

Este sprint supuso un cambio importante en la filosofía del proyecto.

Hasta ese momento muchas decisiones se habían tomado desde un punto de vista técnico. A partir de aquí, cada nueva decisión comenzó a evaluarse principalmente desde la perspectiva del flujo de trabajo del conductor.

Ese cambio de enfoque terminó definiendo la identidad de Lic249.

## Estado

✅ Sprint finalizado.

---

# Sprint 16 — Beta 1.0 (Cierre del MVP)

## Objetivo

Completar el flujo principal de Lic249 y obtener una primera versión totalmente funcional capaz de sustituir el registro manual mediante WhatsApp durante una jornada real de trabajo.

## Trabajo realizado

- Nuevo flujo de cierre de jornada.
- Confirmación de la fecha de la jornada.
- Registro del combustible.
- Reparto automático del combustible entre el conductor y José cuando corresponda.
- Simplificación del resumen diario.
- Implementación de la tarjeta visual para compartir.
- Mejora del resumen en formato texto.
- Limpieza de la pantalla principal.
- Consolidación definitiva de las reglas de negocio.
- Actualización completa de la documentación del proyecto.
- Validación del funcionamiento en condiciones reales.
- Importación de 70 jornadas históricas procedentes del registro de WhatsApp.
- Validación exacta de los cierres históricos de efectivo y datáfono.
- Búsqueda del historial por día y por mes.
- Protección contra jornadas duplicadas y fechas anteriores.
- Continuidad del kilometraje con reinicio explícito por cambio de vehículo.
- Edición segura de comisión, propina, importe y medio de pago.
- Prevención de operaciones duplicadas por doble toque.
- Recuperación mediante reintento en las pantallas que cargan datos.
- Paginación de las imágenes compartidas y compactación de listas extensas.
- Opción de compartir, guardar imágenes y copiar el resumen como texto.

## Resultado

Se obtuvo una Beta 1.0 funcional que permite gestionar el ciclo completo de
una jornada y consultar el historial real importado. La aplicación entra en
estabilización antes de su primer deploy privado.

## Valor para el proyecto

El conductor podrá gestionar toda su jornada desde una única aplicación, eliminando la necesidad de utilizar WhatsApp, calculadora o anotaciones manuales.

## Aprendizaje

Las listas extensas, la posibilidad de repetir acciones con un doble toque y
los fallos momentáneos de carga requieren un tratamiento explícito en una
aplicación utilizada con rapidez desde el móvil.

## Reflexión del sprint

Este sprint representa el cierre del MVP.

A partir de este momento el objetivo deja de ser añadir nuevas funcionalidades y pasa a ser validar que Lic249 resuelve correctamente el problema para el que fue creado.

Solo una vez validado el producto en producción comenzará el desarrollo de las siguientes fases del Roadmap.

## Estado

✅ Sprint finalizado.

---

# Sprint 17 — Estabilización y preparación del deploy privado

## Objetivo

Consolidar la Beta 1.0, reducir riesgos durante el uso diario y preparar una
publicación privada que preserve los datos del conductor.

## Trabajo realizado hasta el momento

- Recuperación segura de la carga del inicio, historial, detalle, edición y
  pantallas de cierre.
- Bloqueo de inicios, cierres, guardados, ediciones y eliminaciones repetidas.
- Carga bajo demanda de los resúmenes visibles del historial.
- Listas compactas con opción de mostrar todos los viajes.
- Tarjetas compartidas divididas en un resumen principal y páginas de detalle.
- Hasta 15 viajes por imagen de detalle.
- Guardado explícito de las imágenes además del uso del menú para compartir.
- Validación del último kilometraje antes de iniciar una nueva jornada.
- Auditoría inicial de preparación para producción.

## Estado del deploy

El 24/07/2026 se realizó el primer deploy privado en Railway:

- Se activó el plan Hobby.
- Se creó el proyecto privado `Lic249`.
- Se desplegaron la aplicación unificada y MySQL en EU West.
- Se ejecutaron las migraciones antes de publicar.
- Se configuraron CORS, sesión firmada y acceso mediante contraseña.
- Se restauraron y verificaron 70 jornadas, 1.203 viajes y 70 resúmenes
  mensuales.
- Se eliminó una jornada de prueba incluida en el respaldo inicial.
- Se validó el acceso y la carga del inicio desde el dominio público.

Railway reserva los respaldos automáticos y la recuperación por momento exacto
para el plan Pro. Mientras se mantenga el plan Hobby se conservarán respaldos
manuales verificados y se evaluará una automatización alternativa.

## Estado

🚧 En desarrollo: deploy completado y pendiente de prueba integral móvil.

---

# Evolución del proyecto

Lic249 no fue desarrollado siguiendo un plan completamente cerrado desde el primer día.

A medida que avanzó el desarrollo y se comprendió mejor el trabajo diario del conductor, varias decisiones iniciales fueron revisadas para adaptarse a un flujo de trabajo más eficiente.

Los cambios más importantes fueron:

- La liquidación mensual dejó de formar parte del MVP y pasó a desarrollarse en una fase posterior del Roadmap.
- La generación de PDF dejó de ser una prioridad frente a una tarjeta visual y un resumen de texto preparados para compartir.
- Las reglas de negocio evolucionaron progresivamente hasta consolidarse en un documento específico antes de continuar desarrollando nuevas funcionalidades.
- El flujo de cierre de jornada fue simplificándose hasta convertirse en el proceso definitivo previsto para la Beta 1.0.
- El desarrollo pasó de centrarse en funcionalidades aisladas a diseñarse alrededor del flujo real de trabajo del conductor.

Estos cambios no representan errores de planificación, sino el aprendizaje obtenido durante el desarrollo y la validación continua del producto.

---

# Sprint 18 — Base multiusuario compatible

## Objetivo

Incorporar organizaciones, usuarios y vehículos sin interrumpir la aplicación
que Matías utiliza diariamente ni modificar los datos históricos.

## Primera funcionalidad

- Se definió el modelo de organización independiente por licencia.
- Se permitió que un propietario sea también conductor.
- Se separaron los permisos de consulta del propietario y de gestión del
  conductor.
- Se preparó el vehículo compartido como futura referencia del cuentakilómetros.
- Se prepararon dos modalidades de combustible por conductor: carga real y
  tarifa por kilómetro.
- Se crearon migraciones aditivas que no modifican todavía las jornadas.
- El acceso privado actual permanece vigente durante la transición.

## Segunda funcionalidad

Se preparó el aprovisionamiento inicial de Lic249:

- organización `Lic249`;
- Matías Caparotta como conductor (`mati.caparotta`);
- José Revilla como propietario y conductor (`jose.revilla`);
- vehículo compartido `Taxi Lic249`;
- modalidad de carga real para ambos conductores.

El proceso se ejecuta dentro de una transacción, genera contraseñas temporales
seguras y muestra cada una solo cuando crea la cuenta. Puede repetirse sin
duplicar datos ni cambiar las contraseñas existentes.

El aprovisionamiento todavía no se ejecutó en producción. La creación real de
las cuentas se realizará después de aplicar las migraciones sobre una copia de
prueba y verificar un respaldo reciente.

## Tercera funcionalidad

Se preparó la propiedad de las jornadas:

- cada jornada podrá vincularse a una organización, un conductor y un vehículo;
- las referencias son inicialmente opcionales para conservar compatibilidad;
- la restricción global de fecha permanece vigente durante la transición;
- un comando transaccional asignará las jornadas sin propietario a Matías y al
  vehículo compartido;
- la operación rechaza datos parciales, jornadas de otros conductores y estados
  mixtos inesperados;
- una segunda ejecución conserva la asignación existente.

La migración no contiene actualizaciones de datos y el comando todavía no fue
ejecutado en producción.

## Cuarta funcionalidad

Se implementó el inicio de sesión individual compatible:

- el formulario acepta nombre de usuario y contraseña personal;
- durante la transición el usuario puede dejar vacío el nombre y utilizar la
  contraseña general vigente;
- las sesiones antiguas continúan siendo válidas;
- una sesión personal conserva identidad, organización y roles mediante una
  firma del backend;
- la interfaz muestra el nombre y la organización de la cuenta personal;
- las cuentas suspendidas o sin membresía activa no pueden iniciar sesión.

Esta etapa identifica al usuario, pero todavía no filtra jornadas. El acceso
general se conservará hasta que la autorización por conductor haya sido
implementada y validada.

## Quinta funcionalidad

Se implementó el cambio obligatorio de la contraseña temporal:

- una cuenta nueva no puede consultar jornadas ni viajes antes de cambiarla;
- la restricción se aplica tanto en la interfaz como en el backend;
- el usuario debe confirmar su contraseña temporal;
- la nueva contraseña requiere al menos diez caracteres, una letra y un número;
- la huella se actualiza de forma atómica y nunca se devuelve al cliente;
- la sesión se renueva inmediatamente con el primer acceso completado;
- el modo de acceso anterior continúa funcionando sin esta obligación.

El restablecimiento de contraseñas por parte del propietario permanece como una
funcionalidad posterior.

## Sexta funcionalidad

Se implementó el aislamiento de jornadas por identidad:

- un conductor individual solo consulta y gestiona sus propias jornadas;
- un propietario consulta todas las jornadas de su organización;
- las jornadas ajenas se muestran al propietario en modo de solo lectura;
- el nombre del conductor identifica cada jornada en historial y detalle;
- las nuevas jornadas se vinculan automáticamente al usuario autenticado y al
  vehículo activo de su organización;
- viajes, resúmenes y consultas mensuales aplican el mismo alcance;
- la fecha continúa validándose por conductor, permitiendo dos turnos distintos
  el mismo día;
- una migración sustituye la unicidad global de fecha por la combinación
  conductor y fecha, sin actualizar ni eliminar jornadas;
- el kilometraje inicial toma como referencia el último cierre del vehículo
  compartido, independientemente de quién lo condujo;
- el acceso anterior conserva temporalmente el comportamiento existente.

La funcionalidad permanece aislada en desarrollo y no modifica producción.

## Séptima funcionalidad

Se separó la marca del producto y la identidad de cada organización:

- la aplicación pasa a llamarse `TaxFin`;
- `Lic249` continúa identificando la licencia de la organización inicial;
- la cabecera, el acceso, el cambio de contraseña, el título del navegador y
  la API utilizan la marca TaxFin;
- las tarjetas, imágenes, títulos compartidos y nombres de archivo utilizan el
  nombre de la organización asociado a la jornada;
- durante la transición, una jornada sin organización conserva `Lic249` como
  valor de compatibilidad;
- una organización futura podrá mostrar su propia licencia sin cambiar el
  código ni la marca TaxFin.

El cambio permanece en desarrollo y todavía no modifica producción.

## Octava funcionalidad

Se implementó el primer panel de seguimiento del propietario:

- solo aparece para cuentas con rol de propietario;
- muestra las jornadas activas de otros conductores de la organización;
- identifica al conductor y presenta kilometraje inicial, viajes, facturación,
  efectivo y datáfono;
- muestra los cinco viajes más recientes con hora, método de pago, importe,
  comisión y propina;
- se actualiza automáticamente cada treinta segundos y permite actualización
  manual;
- las jornadas propias del propietario permanecen separadas de las estadísticas
  de sus conductores;
- toda la información ajena continúa siendo de solo lectura;
- reutiliza el aislamiento ya validado en el backend y no crea accesos nuevos.

La funcionalidad permanece en desarrollo y todavía no modifica producción.

## Novena funcionalidad

Se implementó la gestión inicial de conductores:

- solo una cuenta propietaria puede abrir la pantalla y utilizar sus endpoints;
- el propietario crea nombre, usuario y modalidad de combustible;
- el sistema genera una contraseña temporal y la muestra una única vez;
- el conductor debe cambiar esa contraseña en su primer acceso;
- el propietario puede suspender y reactivar conductores no propietarios;
- una cuenta con jornada activa no puede suspenderse hasta cerrar el turno;
- suspender conserva todas las jornadas, viajes y estadísticas;
- una sesión ya iniciada pierde acceso en la siguiente petición si su membresía
  fue suspendida;
- ninguna organización puede consultar o gestionar conductores de otra.

La funcionalidad permanece en desarrollo y todavía no modifica producción.

## Décima funcionalidad

Se implementó el restablecimiento de contraseñas de conductores:

- el propietario puede generar una contraseña temporal nueva desde la ficha del
  conductor;
- la contraseña anterior deja de ser válida inmediatamente;
- solo se almacena la nueva huella;
- la contraseña temporal se muestra una única vez y puede copiarse junto al
  usuario;
- las sesiones abiertas detectan el restablecimiento en su siguiente petición;
- el conductor vuelve automáticamente al flujo obligatorio de cambio de
  contraseña;
- esta pantalla no permite restablecer contraseñas propietarias;
- toda operación permanece limitada a la organización del propietario.

La funcionalidad permanece en desarrollo y todavía no modifica producción.

## Decisión de seguridad

La cuenta de Matías y la asignación de sus 70 jornadas y 1.203 viajes se
realizarán en una funcionalidad posterior. Separar ambos pasos permite
verificar las cuentas antes de modificar la propiedad de los datos.

## Primer despliegue compatible

El 25/07/2026 se publicó la base técnica multiusuario sin retirar el acceso
anterior ni aprovisionar cuentas reales.

Antes del despliegue se generó un respaldo lógico privado con huella SHA-256.
La base contenía 71 jornadas, 1.221 viajes y 70 cierres importados.

Railway ejecutó correctamente las migraciones `008` a `013`, creando
organizaciones, usuarios, membresías y vehículos, además de las referencias
opcionales de propiedad en las jornadas. Ninguna jornada fue reasignada.

Después de publicar se verificaron:

- 109 pruebas automatizadas;
- compilación y análisis estático del frontend;
- despliegue activo y endpoint de salud correcto;
- 13 migraciones registradas;
- conservación exacta de los recuentos de jornadas y viajes;
- funcionamiento de la sesión legacy, la Home y el historial real.

El siguiente paso continúa siendo aprovisionar Lic249 y sus primeras cuentas
en una operación separada y reversible.

## Aprovisionamiento real de Lic249

El 25/07/2026 se ejecutó el aprovisionamiento idempotente sobre producción.

Se crearon:

- la organización `Lic249`;
- Matías Caparotta como conductor (`mati.caparotta`);
- José Revilla como propietario y conductor (`jose.revilla`);
- el vehículo activo y compartido `Taxi Lic249`.

Las dos cuentas nacieron con contraseña temporal y cambio obligatorio en el
primer acceso. Se verificó la autenticación real mediante la API, incluyendo
la organización y los roles correctos.

La operación no reasignó jornadas: las 71 existentes continúan con referencias
de organización, conductor y vehículo vacías. La asignación a Matías permanece
como siguiente funcionalidad independiente.

## Asignación histórica real a Matías

El 25/07/2026 se completó la migración de propiedad de los datos históricos.
Antes de modificar producción se generó el respaldo privado
`taxfin-production-before-workday-assignment-2026-07-25.sql` y se verificó su
huella SHA-256:
`1233ceac7bcc26343ce619604fea9a4d62f9912543e3dfbef53316a7d48253a5`.

Durante la comprobación previa se detectó que José ya había creado una jornada
real con 3 viajes. El procedimiento se ajustó para asignar únicamente jornadas
sin propietario, manteniendo intactas las jornadas completas de otros
conductores y rechazando cualquier asignación parcial.

La operación transaccional asignó a Matías las 71 jornadas históricas y sus
1.221 viajes. La verificación posterior confirmó:

- 72 jornadas y 1.224 viajes totales;
- 71 jornadas y 1.221 viajes pertenecientes a Matías;
- una jornada y 3 viajes pertenecientes a José;
- ninguna jornada sin organización, conductor o vehículo;
- Matías como conductor y José como propietario y conductor de Lic249;
- API saludable, aplicación disponible y acceso legacy conservado.

## Acceso de José al historial de Matías

La prueba real posterior a la asignación reveló que José figuraba correctamente
como propietario en la base, pero la interfaz leía el rol desde una estructura
distinta de la generada por la sesión. Como resultado, veía únicamente su flujo
personal.

Se publicó la unificación del contrato de roles manteniendo compatibilidad con
las sesiones ya abiertas. Además, quedaron disponibles `Mis conductores` y el
selector por conductor del historial. Se verificó en producción que José puede
entrar directamente a las jornadas de Matías, consultarlas y exportarlas,
mientras las operaciones de modificación, cierre y eliminación continúan
reservadas al conductor titular.

## Gasolina propia del propietario

La prueba diaria de José mostró que el cierre todavía ofrecía compartir la
gasolina con José, una opción que solo tiene sentido para Matías. Se separó el
comportamiento por rol: el propietario registra toda la carga como gasto propio
y no ve el selector de reparto. La misma regla se aplica en backend para evitar
que una petición manipulada genere `Gasolina José`. El flujo de Matías no fue
modificado y mantiene sus dos opciones actuales.

## Separación visual de jornadas del propietario

La prueba visual posterior pidió una separación más fuerte entre el trabajo
propio del propietario y el de sus conductores. El historial pasó a abrir las
jornadas de José por defecto y a mostrar las de Matías únicamente mediante una
selección explícita, identificada como solo lectura. También se retiró el
nombre de José de la etiqueta de reparto 50/50 para que la interfaz no quede
acoplada a una persona concreta.

## Seguimiento completo y futuras correcciones seguras

Después de una semana de uso real se decidió ampliar el seguimiento en vivo:
José necesita consultar todos los viajes de la jornada activa de Matías, junto
con los acumulados de comisión y propina. Estos datos permanecen visibles
dentro de TaxFin, pero se eliminan de las imágenes compartidas.

También se definió el siguiente bloque de trabajo. Cada usuario podrá corregir
sus propias jornadas creadas en TaxFin después del cierre, incluida la fecha,
los viajes, el combustible y el kilometraje. Podrá eliminar viajes y una
jornada completa de prueba. La operación exigirá contraseña, motivo, auditoría
y validaciones de continuidad; las jornadas históricas importadas continuarán
protegidas. Esta corrección segura todavía no está implementada.

La primera funcionalidad del bloque quedó implementada de forma aislada: el
conductor puede corregir un viaje de una jornada propia cerrada y creada en
TaxFin. Antes de guardar debe introducir su contraseña actual y explicar el
motivo. La modificación y su registro de auditoría se ejecutan en una misma
transacción, conservando valores anteriores y resultantes. Las jornadas
importadas y las jornadas ajenas permanecen en modo lectura. La eliminación
de viajes y las correcciones de fecha, combustible y kilómetros continúan
pendientes para funcionalidades separadas.

Antes de preparar su publicación se generó un respaldo nuevo de producción de
140.209 bytes, conservado fuera de Git, con SHA-256
`09eec13cb0402d6f691557148bb406626318daa8775a895c53c44bfc0ee87006`.

La funcionalidad se publicó mediante el commit `64af02b`. Railway aplicó la
migración `014_create_correction_audit_logs.sql` y activó el despliegue sin
interrumpir el servicio. La verificación posterior confirmó 78 jornadas, 1.344
viajes, 70 cierres importados y cero auditorías iniciales. La API respondió
correctamente y la sesión de José mantuvo las jornadas de Matías en modo de
solo lectura.

La segunda funcionalidad del bloque habilita la eliminación de un viaje
cerrado sin reabrir la jornada. Reutiliza la contraseña y el motivo de la
corrección, conserva en auditoría todos los datos previos del viaje y recalcula
el resumen desde los viajes restantes. La eliminación y la auditoría forman
una única transacción. Continúa pendiente la corrección de fecha, combustible
y kilómetros, así como la eliminación reforzada de la jornada completa.

La eliminación segura se publicó mediante el commit `5b0d5d9` en `main` y
`codex/multiuser-foundation`. Antes del despliegue se verificó el respaldo
`lic249-2026-08-03T13-34-05-546Z.sql`, de 140.209 bytes, con SHA-256
`09eec13cb0402d6f691557148bb406626318daa8775a895c53c44bfc0ee87006`.
Railway completó el despliegue con la API saludable y sin alterar los datos:
78 jornadas, 1.344 viajes y 70 cierres importados. Las 70 jornadas importadas
continúan bloqueadas. No se ejecutó una eliminación real durante la
verificación; la atomicidad de eliminación y auditoría quedó cubierta por las
pruebas automatizadas y la tabla de auditoría permaneció correctamente en cero.
La corrección de fecha no se inició.

La tercera funcionalidad del bloque permite corregir el combustible y los
kilómetros de una jornada propia cerrada y creada en TaxFin. Reutiliza la
contraseña, el motivo y la auditoría transaccional. El kilometraje corregido
debe quedar entre el cierre anterior y el inicio siguiente del mismo vehículo,
además de mantener el final igual o por encima del inicio. El combustible se
recalcula con las reglas vigentes: carga propia o 50/50 para el conductor y
siempre carga propia para el propietario. Las jornadas importadas y ajenas
continúan protegidas. La fecha permanece fuera de esta entrega.

La corrección de combustible y kilometraje se publicó mediante el commit
`9e6fa03` en `main` y `codex/multiuser-foundation`. Antes de publicar se
verificó el respaldo `lic249-2026-08-03T13-34-05-546Z.sql` con SHA-256
`09eec13cb0402d6f691557148bb406626318daa8775a895c53c44bfc0ee87006`.
Railway dejó activo el despliegue con el mensaje del commit y la API respondió
saludable. La comprobación conservadora confirmó la referencia de 78 jornadas,
1.344 viajes, 70 importaciones y cero auditorías previas; las 70 jornadas
importadas permanecen bloqueadas. Las 122 pruebas automatizadas confirmaron
los permisos de lectura y escritura, la protección de jornadas importadas y
ajenas, la continuidad del kilometraje y la auditoría transaccional. No se
modificaron datos reales durante la verificación.

El 03/08/2026 se completó localmente el bloque de corrección segura. La fecha
de una jornada propia cerrada puede modificarse si no duplica otra fecha del
mismo conductor y si los kilómetros siguen siendo coherentes con las jornadas
anterior y siguiente del vehículo en la nueva posición cronológica. También se
reforzó la eliminación completa: exige contraseña, motivo y la palabra
`ELIMINAR`; antes del borrado, la auditoría conserva los datos de la jornada y
todos sus viajes dentro de la misma transacción. Las jornadas importadas y las
ajenas continúan protegidas. La suite específica, las 30 pruebas del cliente,
el análisis estático y la compilación finalizaron correctamente. Producción no
se modificó durante esta implementación.

Ese mismo día se publicó `1cdd5d6` en `main`. Antes de que Railway activara la
nueva versión se creó el respaldo
`lic249-2026-08-03T14-23-24-625Z.sql` y se verificó su huella SHA-256
`54edb2bd794443643a885fdf91542a3f93748d29bc2406b623ec127ab6b93068`,
su tamaño de 142.112 bytes, sus permisos privados y la presencia de las ocho
tablas críticas. El despliegue `a34ecae3` finalizó correctamente: las 14
migraciones estaban actualizadas y la API respondió saludable.

Las comprobaciones de solo lectura conservaron 79 jornadas, 1.354 viajes, 70
importaciones protegidas y una auditoría preexistente. No había fechas
duplicadas ni rupturas del kilometraje del vehículo. La sesión real de José
siguió funcionando y permitió consultar el historial y detalle de Matías en
modo de solo lectura, sin acciones de modificación. Ambas cuentas continuaron
activas y con contraseña definitiva. No se utilizó la contraseña privada de
Matías para repetir un inicio manual, no se corrigió ni eliminó ningún dato
real y el acceso legacy no fue retirado.

La primera prueba posterior reveló que una pestaña que había quedado abierta
con el paquete anterior enviaba la corrección sin fecha y ejecutaba el flujo
antiguo de eliminación, que no tenía campos para contraseña y motivo. El
servidor rechazó correctamente ambas operaciones y no cambió datos. Se añadió
compatibilidad para conservar la fecha almacenada cuando el cliente anterior
la omite, una normalización de fechas independiente de la zona horaria y un
mensaje que indica cerrar y volver a abrir TaxFin ante una pantalla antigua.
También se reforzó el contrato: `ELIMINAR` debe llegar y validarse en el
servidor, no solamente en la interfaz.

También se corrigió el punto de entrada de la aplicación instalada. Hasta ese
momento no existía manifiesto web y un acceso creado desde el detalle podía
seguir abriendo esa URL. El manifiesto de TaxFin fija `/` como inicio y alcance,
activa el modo independiente y define su identidad visual. Además, la marca del
encabezado pasa a enlazar con la Home sin afectar la navegación interna.
Se añadió además un icono propio en SVG y variantes PNG de 180, 192 y 512
píxeles para que el acceso de pantalla de inicio tenga una presentación
consistente y profesional en iPhone y Android.

El 03/08/2026 comenzó la primera etapa PWA. Se incorporó un service worker
propio y versionado en cada build que conserva únicamente la interfaz, el
manifest y los iconos. Las navegaciones pueden recuperar la Home almacenada
cuando falla la red, pero las rutas `/api`, las sesiones y la información
financiera quedan fuera de la caché. El cliente bloquea cualquier escritura sin
conexión y aclara que no guardó cambios. Una versión nueva permanece en espera
hasta que el usuario pulse `Actualizar TaxFin`, evitando recargas durante la
carga de un viaje. La sincronización offline se pospuso hasta poder diseñarla
con idempotencia y auditoría.

Ese mismo día se publicó el commit `1ae3285` en `main`. Railway completó el
paso previo de migraciones y dejó activo exactamente el build
`1ae3285a1f98`; `/api/health` respondió saludable. El service worker publicado
utilizó `taxfin-app-shell-1ae3285a1f98`, sin el marcador de compilación, y el
manifiesto, los iconos y el inicio en `/` quedaron disponibles. También se
verificaron el registro y control del worker y el flujo de actualización
confirmada por el usuario. La sesión real de José continuó abierta y permitió
consultar el historial y un detalle de Matías en modo de solo lectura, sin
acciones de modificación. No se creó, corrigió ni eliminó ningún dato real y
el acceso legacy permaneció activo.

Después se publicó la nueva navegación identificada mediante el commit
`1f49f4a`. La cabecera reutiliza el icono real de TaxFin, presenta nombre, rol e
iniciales y convierte el cierre de sesión en una acción secundaria accesible.
El conductor recibe accesos a Inicio, su jornada y su historial; el propietario
añade la gestión de conductores sin duplicar la aplicación ni relajar permisos.
La variante de José se verificó en tamaño iPhone sin desbordamiento horizontal.

Railway dejó activo exactamente `1f49f4a521b3` después de completar las
migraciones, y la API respondió saludable. La suite completa terminó con 98
pruebas del servidor y 40 del cliente, además del análisis estático y la
compilación. La sesión real de José conservó su identidad y sus cuatro accesos
después de activar la versión nueva mediante `Actualizar TaxFin`. El historial
de Matías continuó en solo lectura y no se creó ni modificó ningún dato real.
El acceso legacy no se retiró.

## Estado

🚧 Sprint en desarrollo.

---

# Próximas fases

Una vez validada la Beta 1.0, Lic249 continuará evolucionando siguiendo el Roadmap oficial del proyecto:

- Sprint 18 — Base multiusuario.
- Sprint 19 — Panel del propietario.
- Sprint 20 — Liquidaciones configurables.
- Sprint 21 — Dashboard financiero.
- Sprint 22 — Informes y exportación.

Cada fase comenzará únicamente cuando la anterior haya sido validada y considerada estable.

---

# Filosofía del proyecto

Lic249 se desarrolla de forma incremental.

Cada sprint debe aportar valor real al conductor y dejar la aplicación en un estado funcional.

Las decisiones técnicas siempre están al servicio del flujo de trabajo del usuario.

Cuando una mejor comprensión del negocio requiere modificar una decisión anterior, el proyecto evoluciona manteniendo la coherencia entre el Roadmap, las Reglas de Negocio y la implementación.

La prioridad no es desarrollar más funcionalidades, sino construir una herramienta que simplifique realmente el trabajo diario.

---

# Fuente oficial

Este documento constituye el historial oficial del desarrollo de Lic249.

Cada sprint refleja el estado del proyecto en ese momento, las decisiones tomadas, los cambios introducidos y los aprendizajes obtenidos durante la evolución del producto.

Las reglas de negocio vigentes y el alcance actual del proyecto quedan definidos en la documentación oficial (`Roadmap`, `Business Rules` y `Architecture Decisions`), mientras que este Journal conserva la historia de cómo Lic249 llegó a convertirse en la aplicación que es hoy.

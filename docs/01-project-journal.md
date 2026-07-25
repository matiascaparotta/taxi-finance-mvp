# Lic249 — Project Journal

**Versión:** 2.1

**Última actualización:** 25/07/2026

**Sprint actual:** 18

**Último sprint completado:** 17

---

# Introducción

Este documento registra la evolución completa de Lic249 desde el inicio del proyecto.

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

## Decisión de seguridad

La cuenta de Matías y la asignación de sus 70 jornadas y 1.203 viajes se
realizarán en una funcionalidad posterior. Separar ambos pasos permite
verificar las cuentas antes de modificar la propiedad de los datos.

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

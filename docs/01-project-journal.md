# Taxi Finance — Project Journal

## Estado del proyecto

- Proyecto: Taxi Finance MVP
- Estado: 🚧 Desarrollo activo
- Sprint actual: Sprint 13
- Último sprint completado: Sprint 13
- Stack: React + Vite + Tailwind CSS + Node.js + Express + MySQL

---

## Objetivo del proyecto

Taxi Finance es una aplicación pensada para ayudar a conductores de taxi a registrar su jornada diaria, viajes, gastos, combustible y liquidaciones mensuales.

El objetivo principal es reemplazar el uso manual de WhatsApp, calculadora y cuaderno por una herramienta rápida, clara y confiable.

---

### Sprint 1 — Base inicial del proyecto

### Objetivo

Crear la base técnica de Taxi Finance.

### Trabajo realizado

- Creación del repositorio local.
- Conexión con GitHub.
- Configuración inicial de Node.js y Express.
- Creación del endpoint `/health`.
- Primeras pruebas con Thunder Client.

### Resultado

API inicial funcionando.

### Valor para el usuario

Se establece una base técnica sólida para construir una API confiable y estable.

### Aprendizaje técnico

Estructura básica de una API Express y flujo Git/GitHub.

### Reflexión del sprint

Sentar una base técnica clara facilita el desarrollo progresivo y controlado del proyecto.

### Estado

✅ Sprint finalizado.

---

### Sprint 2 — Jornadas de trabajo

### Objetivo

Registrar jornadas laborales.

### Trabajo realizado

- Creación de tabla `work_days`.
- Endpoint `POST /work-days`.
- Endpoint `GET /work-days`.
- Validaciones iniciales de fecha, kilómetros y gasolina.

### Resultado

El sistema puede guardar y listar jornadas.

### Valor para el usuario

Permite a los conductores registrar y consultar sus jornadas de trabajo de forma digital.

### Aprendizaje técnico

Conexión entre Express, MySQL y Thunder Client.

### Reflexión del sprint

Integrar la base de datos con la API es fundamental para persistir datos de manera segura.

### Estado

✅ Sprint finalizado.

---

### Sprint 3 — Resumen mensual inicial

### Objetivo

Empezar a calcular información mensual.

### Trabajo realizado

- Creación de módulo de resumen mensual.
- Endpoint con parámetro `month`.
- Primeras reglas de negocio: efectivo, datáfono, gasolina.

### Resultado

Primer cálculo financiero mensual.

### Valor para el usuario

Proporciona una visión financiera mensual para mejor control y análisis.

### Aprendizaje técnico

Diferencia entre guardar datos y generar información útil.

### Reflexión del sprint

Transformar datos en información relevante mejora el valor de la aplicación.

### Estado

✅ Sprint finalizado.

---

### Sprint 4 — Gestión de viajes

### Objetivo

Registrar viajes individuales dentro de una jornada.

### Trabajo realizado

- Creación de tabla `trips`.
- Relación `trips.work_day_id` con `work_days.id`.
- Endpoint `POST /trips`.
- Endpoint `GET /trips?workDayId=...`.
- Endpoint `PUT /trips/:id`.
- Endpoint `DELETE /trips/:id`.

### Resultado

CRUD completo de viajes funcionando.

### Valor para el usuario

Permite gestionar viajes de forma detallada y organizada.

### Aprendizaje técnico

Construcción completa de un módulo con crear, leer, actualizar y eliminar.

### Reflexión del sprint

Implementar un CRUD completo es esencial para la gestión dinámica de datos.

### Estado

✅ Sprint finalizado.

---

### Sprint 5 — Refactor de arquitectura

### Objetivo

Mejorar la estructura del backend.

### Trabajo realizado

- Creación de carpeta `repositories`.
- Movimiento de archivos de acceso a MySQL desde `services` hacia `repositories`.
- Separación clara de responsabilidades:
  - Routes: URLs.
  - Controllers: petición y respuesta HTTP.
  - Services: reglas de negocio.
  - Repositories: consultas SQL.

### Resultado

Arquitectura más limpia y mantenible.

### Valor para el usuario

Mejora la estabilidad y escalabilidad del backend para futuros desarrollos.

### Aprendizaje técnico

Importancia de la separación de responsabilidades.

### Reflexión del sprint

Una arquitectura bien definida reduce la complejidad y facilita el mantenimiento.

### Estado

✅ Sprint finalizado.

---

### Sprint 6 — Resumen inteligente de jornada

### Objetivo

Calcular automáticamente el resumen financiero de una jornada.

### Trabajo realizado

- Eliminación de `cash` y `card` de `work_days`.
- Los totales se calculan desde `trips`.
- Creación de:
  - `workDaySummaryRepository`
  - `workDaySummaryService`
  - `workDaySummaryController`
  - `workDaySummaryRoutes`
- Endpoint `GET /work-days/:id/summary`.

### Resultado

La API calcula automáticamente:
- kilómetros trabajados;
- cantidad de viajes;
- efectivo;
- datáfono;
- facturación total;
- gasolina propia;
- gasolina José;
- efectivo a rendir;
- promedio por viaje.

### Valor para el usuario

Obtiene un resumen financiero preciso sin necesidad de ingresar datos duplicados.

### Aprendizaje técnico

Evitar duplicación de datos y calcular información desde la fuente real.

### Reflexión del sprint

Calcular datos derivados en tiempo real mejora la integridad y precisión de la información.

### Estado

✅ Sprint finalizado.

---

### Sprint 7 — Frontend React (MVP)

### Objetivo

Construir la primera interfaz de Taxi Finance.

### Trabajo realizado

- Creación del cliente React con Vite.
- Integración con Tailwind CSS.
- Diseño inicial responsive orientado a móvil.
- Creación de componentes reutilizables:
  - Button
  - Card
  - SectionTitle
  - Stat
  - WorkDayCard
- Conexión del frontend con la API Express.
- Visualización de jornadas desde MySQL.
- Creación de la pantalla Home.
- Creación de la pantalla Nueva Jornada.

### Resultado

Taxi Finance deja de ser solamente una API y pasa a tener una interfaz moderna y funcional.

### Valor para el usuario

Proporciona una experiencia visual amigable y accesible para los conductores.

### Aprendizaje técnico

Separación entre frontend y backend, reutilización de componentes y consumo de APIs desde React.

### Reflexión del sprint

Un frontend bien diseñado mejora la adopción y usabilidad del producto.

### Estado

✅ Sprint finalizado.

---

### Sprint 8 — Jornadas activas

### Objetivo

Adaptar la aplicación al flujo real de trabajo de un taxista.

### Trabajo realizado

- Se incorporó el estado de jornada:
  - OPEN
  - CLOSED
- Se modificó la base de datos para permitir jornadas abiertas.
- Se implementó la regla de negocio:
  - Un conductor solo puede tener una jornada OPEN.
- Creación del endpoint:

GET /work-days/open

- El frontend consulta automáticamente la jornada activa.
- La Home cambia dinámicamente según el estado de la jornada.
- Se añadió la pantalla "Jornada activa".
- Se impide iniciar una segunda jornada mientras exista otra abierta.

### Resultado

Taxi Finance comienza a comportarse como una aplicación real de gestión diaria y no solamente como un sistema de registro.

### Valor para el usuario

Permite gestionar jornadas activas, evitando errores y duplicaciones.

### Aprendizaje técnico

Modelar correctamente el negocio antes que la interfaz.

### Reflexión del sprint

Entender y reflejar el flujo real del negocio es clave para una aplicación útil.

### Estado

✅ Sprint finalizado.

---

### Sprint 9 — Gestión de viajes en tiempo real

### Objetivo

Permitir registrar viajes durante una jornada activa y visualizar la información en tiempo real.

### Trabajo realizado

- Creación de la pantalla `NewTripPage`.
- Navegación desde la Home para registrar viajes.
- Integración con la API para crear viajes.
- Consulta automática de la jornada activa.
- Visualización del resumen de la jornada activa.
- Creación del componente de resumen reutilizable (inicio de la refactorización).
- Visualización de los últimos viajes registrados.
- Orden cronológico de los viajes (más reciente primero).

### Mejoras de UX

- Futuro teclado numérico optimizado para conductores.
- Flujo rápido de registro de viajes.
- Confirmación antes de eliminar un viaje.
- Posibilidad de editar viajes.
- Separación entre resumen operativo y resumen personal.

### Resultado

Taxi Finance ya permite trabajar durante una jornada activa registrando viajes y viendo la evolución de la facturación en tiempo real.

### Valor para el usuario

Facilita el registro y seguimiento de viajes en tiempo real durante la jornada.

### Aprendizaje técnico

La interfaz debe adaptarse al flujo real de trabajo del conductor y mostrar siempre el estado actual de la jornada.

### Reflexión del sprint

Adaptar la UI al usuario final mejora la eficiencia y satisfacción.

### Estado

✅ Sprint finalizado.

---

### Sprint 10 — Cierre completo de jornada

### Objetivo

Completar el flujo real de finalización de una jornada de trabajo.

### Trabajo realizado

- Creación del endpoint `PUT /work-days/:id/close`.
- Implementación de `closeWorkDayRepository`.
- Implementación de `closeWorkDayService`.
- Implementación de `closeWorkDayController`.
- Creación de la pantalla `CloseWorkDayPage`.
- Creación del componente reutilizable `WorkDaySummaryCard`.
- Integración del resumen de la jornada antes del cierre.
- Validación del kilometraje final.
- Validación del combustible (permitiendo 0 €).
- Cálculo en tiempo real de los kilómetros trabajados.
- Confirmación antes de cerrar la jornada.
- Cambio automático del estado de `OPEN` a `CLOSED`.
- Regreso automático al Dashboard tras finalizar la jornada.

### Mejoras de UX

- Visualización del kilometraje inicial.
- Cálculo inmediato de kilómetros trabajados mientras el usuario escribe.
- Mensajes de error claros.
- Confirmación antes de ejecutar una acción irreversible.

### Resultado

Taxi Finance ya permite completar el ciclo completo de una jornada:

- iniciar turno;
- registrar viajes;
- consultar el resumen en tiempo real;
- finalizar la jornada;
- guardar combustible;
- registrar kilometraje final;
- cerrar la jornada correctamente.

### Valor para el usuario

Proporciona un cierre de jornada seguro y completo, evitando errores y pérdidas de datos.

### Aprendizaje técnico

Separar la lógica de negocio en Repository, Service y Controller facilita añadir nuevas funcionalidades sin romper las existentes. Además, diseñar la interfaz siguiendo el flujo real de trabajo del conductor mejora significativamente la experiencia de uso.

### Reflexión del sprint

Una arquitectura modular y un diseño centrado en el usuario son clave para funcionalidades críticas.

### Estado

✅ Sprint finalizado.

---

### Sprint 11 — Ticket de jornada

### Objetivo

Mostrar un resumen final de la jornada una vez cerrado el turno.

### Trabajo realizado

- Creación del componente reutilizable `WorkDayTicket`.
- Creación de la pantalla `WorkDayClosedPage`.
- Creación del endpoint `GET /work-days/:id`.
- Integración del ticket con datos reales de la jornada cerrada.
- Integración del ticket con el resumen de jornada.
- Navegación automática desde el cierre de jornada hacia el ticket final.
- Visualización de:
  - fecha;
  - viajes;
  - kilómetros trabajados;
  - facturación;
  - efectivo;
  - datáfono;
  - combustible.

### Resultado

Al cerrar una jornada, Taxi Finance muestra un ticket final con la información operativa del turno.

### Valor para el usuario

Ofrece un resumen profesional y accesible para revisar y compartir la jornada cerrada.

### Aprendizaje técnico

Una misma vista de resumen puede reutilizarse en varias partes de la aplicación: cierre de jornada, historial, PDF y compartir.

### Reflexión del sprint

Reutilizar componentes mejora la consistencia y reduce tiempos de desarrollo.

### Estado

✅ Sprint finalizado.

---

### Sprint 12 - Calidad del cierre de jornada

### Objetivo

Mejorar la experiencia de usuario del cierre de jornada y del ticket final antes de continuar agregando nuevas funcionalidades.

### Trabajo realizado

- Se creó la utilidad `formatCurrency()` para unificar el formato de importes en toda la aplicación.
- El Ticket de Jornada ahora utiliza el nuevo formato monetario.
- El texto compartido utiliza el mismo formato de moneda.
- Se implementó la utilidad `buildWorkDaySummaryText()`.
- Se agregó la posibilidad de copiar automáticamente el resumen al portapapeles.
- Se reemplazó el `alert()` por un mensaje visual dentro de la interfaz.
- Se mejoró la experiencia de usuario al compartir el resumen.

### Resultado

Se unificó el formato monetario y se mejoró la interacción para compartir el resumen de la jornada, proporcionando una experiencia más profesional y fluida.

### Valor para el usuario

Ahora el conductor puede finalizar la jornada y compartir un resumen profesional en pocos segundos, sin copiar manualmente los datos ni rehacer cálculos.

### Aprendizaje técnico

- Creación de utilidades reutilizables.
- Uso de `Intl.NumberFormat`.
- Uso de `navigator.clipboard`.
- Mejora de UX mediante feedback visual sin interrumpir el flujo del usuario.

### Reflexión del sprint

Incorporar utilidades comunes y mejorar el feedback visual aumenta la calidad y profesionalismo del producto.

### Estado

✅ Sprint finalizado.

---

---

### Sprint 13 — Gestión y edición de viajes

### Objetivo

Permitir editar y eliminar viajes registrados durante una jornada activa, mejorando la flexibilidad de la aplicación sin comprometer la consistencia de la información.

### Trabajo realizado

- Se implementó el endpoint `GET /trips/:id`.
- Se completó el CRUD de viajes en la API.
- Se creó el componente reutilizable `TripForm`.
- Se refactorizó `NewTripPage` para reutilizar el formulario.
- Se creó la pantalla `EditTripPage`.
- Se implementó la edición de importe, método de pago y nota.
- Se añadió la eliminación de viajes con confirmación.
- Los viajes de la Home ahora son clicables y permiten acceder directamente a su edición.
- El resumen de la jornada permanece consistente tras editar o eliminar un viaje.

### Resultado

Taxi Finance permite ahora crear, consultar, editar y eliminar viajes desde una interfaz unificada, manteniendo la coherencia de los datos y reutilizando componentes para facilitar el mantenimiento del proyecto.

### Valor para el usuario

El conductor puede corregir errores de registro en cualquier momento de la jornada sin tener que eliminar información manualmente ni rehacer cálculos.

### Aprendizaje técnico

- Diseño de componentes reutilizables.
- Refactorización de formularios.
- Implementación de un CRUD completo de extremo a extremo.
- Navegación dinámica con React Router.
- Sincronización entre frontend y backend.

### Reflexión del sprint

Antes de añadir nuevas funcionalidades, se consolidó la arquitectura del frontend mediante la reutilización de componentes. Esta decisión reduce la duplicación de código y facilita la evolución futura de la aplicación.

### Estado

✅ Sprint finalizado.

---

# Próximo Sprint

## Sprint 14 — Historial de jornadas

### Objetivo

Construir una pantalla de historial que permita consultar jornadas anteriores, acceder a sus detalles, revisar los viajes registrados y preparar la futura generación de PDF y estadísticas.
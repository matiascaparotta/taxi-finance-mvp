# Taxi Finance — Architecture

**Versión:** 2.0

**Última actualización:** 24/07/2026

**Estado:** Beta 1.0 finalizada — estabilización en curso

---

# Objetivo

Este documento describe la arquitectura técnica de Taxi Finance y explica cómo se organiza internamente la aplicación.

Su propósito es facilitar la comprensión del proyecto, mantener una estructura consistente a medida que evoluciona y servir como referencia para cualquier desarrollador que participe en su mantenimiento o desarrollo.

La arquitectura se ha diseñado siguiendo principios de simplicidad, separación de responsabilidades y escalabilidad, pero siempre priorizando un objetivo principal: adaptarse al flujo de trabajo real de un conductor de taxi.

---

# Filosofía de la arquitectura

Taxi Finance no nace como un ejercicio académico, sino como una herramienta diseñada para resolver un problema real.

Por este motivo, todas las decisiones técnicas se toman teniendo en cuenta dos criterios:

- mantener una arquitectura limpia y mantenible;
- reducir el tiempo necesario para realizar las tareas repetitivas del conductor.

La prioridad del proyecto no es incorporar la mayor cantidad posible de funcionalidades, sino construir una aplicación rápida, sencilla y fiable para el uso diario.

A medida que el proyecto evolucionó, algunas decisiones iniciales fueron revisadas tras validar el flujo de trabajo real. Esta evolución forma parte del diseño del producto y queda documentada tanto en el **Project Journal** como en las **Architecture Decisions**.

---

# Stack tecnológico

## Frontend

- React
- Vite
- Tailwind CSS

## Backend

- Node.js
- Express

## Base de datos

- MySQL
- mysql2/promise

## Herramientas de desarrollo

- Git
- GitHub
- Thunder Client
- dotenv

---

# Arquitectura general

```text
React
   │
   ▼
Pages
   │
   ▼
Components
   │
   ▼
Services
   │
   ▼
Utils
   │
   ▼
REST API
   │
   ▼
Routes
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Repositories
   │
   ▼
MySQL
```

Cada capa posee una única responsabilidad y únicamente conoce la capa inmediatamente inferior.

Este diseño reduce el acoplamiento entre módulos y facilita la evolución del proyecto.

---

# Principios de la arquitectura

Taxi Finance se apoya en varios principios de ingeniería de software.

## Separación de responsabilidades

Cada capa del sistema tiene una única responsabilidad claramente definida.

Esto facilita el mantenimiento, las pruebas y la evolución futura del proyecto.

---

## Reutilización de componentes

Siempre que una funcionalidad pueda reutilizarse, se implementa como un componente independiente.

Ejemplos:

- WorkDayTicket
- TripForm
- Button
- Card
- WorkDayCard

Esta estrategia reduce la duplicación de código y garantiza una experiencia visual consistente.

---

## Single Source of Truth

Uno de los principios más importantes del proyecto consiste en evitar almacenar información duplicada.

Los viajes constituyen la fuente oficial de información de una jornada.

Los totales de efectivo, datáfono, facturación y demás datos agregados se calculan siempre a partir de los viajes registrados.

Gracias a este enfoque, cualquier modificación realizada sobre un viaje se refleja automáticamente en toda la aplicación sin necesidad de sincronizar datos duplicados.

---

## Reglas de negocio centralizadas

Toda la lógica del negocio reside en la capa **Services** del backend.

El frontend únicamente muestra información y envía solicitudes.

Las consultas SQL permanecen aisladas dentro de los **Repositories**.

Esta separación permite modificar las reglas de negocio sin afectar la interfaz ni el acceso a la base de datos.

---

# Arquitectura orientada al flujo de trabajo

La arquitectura de Taxi Finance no está diseñada únicamente alrededor de entidades técnicas.

Está diseñada alrededor del trabajo diario del conductor.

Cada decisión importante intenta responder a una pregunta sencilla:

> ¿Permite realizar una jornada de trabajo con menos tiempo, menos errores y menos esfuerzo?

Este enfoque explica decisiones como:

- registro rápido de viajes;
- separación entre edición y carga rápida;
- cierre simplificado de jornada;
- resumen preparado para compartir;
- reutilización del Ticket de Jornada.

La arquitectura técnica siempre está al servicio del flujo de trabajo del usuario.

# Flujo general de una petición

El siguiente diagrama representa el recorrido completo de una operación típica dentro de Taxi Finance.

Ejemplo: registro de un viaje.

```text
Usuario
   │
   ▼
QuickTripForm
   │
   ▼
tripService
   │
   ▼
POST /trips
   │
   ▼
Route
   │
   ▼
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
MySQL
   │
   ▼
Respuesta JSON
   │
   ▼
React actualiza automáticamente la interfaz
```

Cada capa tiene una responsabilidad concreta y nunca accede directamente a capas que no le corresponden.

---

# Arquitectura del Frontend

El frontend está organizado para separar claramente la interfaz de usuario, la comunicación con la API y la lógica reutilizable.

Su principal responsabilidad consiste en mostrar información al usuario y facilitar la interacción con la aplicación.

Toda la lógica de negocio permanece en el backend.

---

# Pages

Las **Pages** representan las pantallas principales de la aplicación.

Cada página organiza uno o varios componentes reutilizables y coordina las acciones que puede realizar el usuario.

Actualmente Taxi Finance dispone de las siguientes páginas:

- HomePage
- NewWorkDayPage
- NewTripPage
- EditTripPage
- CloseWorkDayPage
- WorkDayClosedPage
- WorkDayHistoryPage
- WorkDayDetailPage

Las páginas contienen muy poca lógica propia y delegan la mayor parte del trabajo en componentes y servicios.

---

# Components

Los componentes encapsulan partes reutilizables de la interfaz.

Su objetivo es evitar duplicación de código y mantener una experiencia visual consistente.

Ejemplos de componentes reutilizables:

- Button
- Card
- Stat
- WorkDayCard
- WorkDayTicket
- TripForm
- QuickTripForm

Cada componente tiene una responsabilidad concreta y puede reutilizarse en distintas pantallas.

---

## QuickTripForm

El registro rápido de viajes constituye uno de los elementos más importantes de Taxi Finance.

Durante una jornada real un conductor puede registrar entre veinte y treinta viajes.

Por este motivo se decidió crear un componente específico para esta tarea.

Su flujo de trabajo es el siguiente:

```text
Introducir importe
      │
      ▼
Guardar en efectivo
o
Guardar en datáfono
      │
      ▼
Confirmación visual
      │
      ▼
Formulario limpio
      │
      ▼
Preparado para el siguiente viaje
```

Este flujo evita volver continuamente a la pantalla principal y reduce el número de acciones necesarias para registrar cada viaje.

---

## TripForm

Aunque ambos formularios trabajan con viajes, cumplen objetivos diferentes.

**QuickTripForm**

- Optimizado para velocidad.
- Utilizado durante la jornada activa.
- Preparado para registrar muchos viajes consecutivos.

**TripForm**

- Optimizado para edición.
- Utilizado sobre viajes ya existentes.
- Permite modificar toda la información registrada.

Mantener ambos componentes separados evita sobrecargar un único formulario con comportamientos distintos y facilita su mantenimiento.

---

# Services del Frontend

Los servicios encapsulan toda la comunicación HTTP con la API.

Ningún componente realiza llamadas HTTP directamente.

Esto permite:

- reutilizar llamadas;
- centralizar el manejo de errores;
- facilitar futuras modificaciones de la API.

Ejemplos:

- workDayService
- tripService

---

# Utils

Las utilidades contienen funciones reutilizables que no pertenecen a ninguna pantalla concreta.

Entre ellas se encuentran:

- formatDate
- formatCurrency
- buildWorkDaySummaryText

Separar estas funciones evita duplicar lógica en diferentes componentes y mantiene el código más limpio.

---

# Arquitectura del Backend

El backend concentra toda la lógica de negocio de Taxi Finance.

Mientras el frontend se ocupa de mostrar información e interactuar con el usuario, el backend valida los datos, aplica las reglas de negocio y accede a la base de datos.

Su arquitectura sigue una organización por capas:

```text
Routes
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Repositories
   │
   ▼
MySQL
```

Cada capa posee una única responsabilidad y desconoce los detalles internos del resto de capas.

# Arquitectura del Backend

El backend constituye el núcleo de Taxi Finance.

Su responsabilidad es validar la información recibida desde el frontend, aplicar las reglas de negocio del proyecto y gestionar el acceso a la base de datos.

Toda la lógica funcional se concentra en esta capa, mientras que el frontend se limita a mostrar información y capturar las acciones del usuario.

La arquitectura sigue una organización por capas:

```text
Routes
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Repositories
   │
   ▼
MySQL
```

Cada capa posee una única responsabilidad y únicamente interactúa con la inmediatamente inferior.

Esta organización facilita el mantenimiento del proyecto y permite modificar una capa sin afectar al resto.

---

# Routes

Las **Routes** definen los endpoints públicos de la API.

Su única responsabilidad consiste en recibir la petición HTTP y dirigirla hacia el Controller correspondiente.

No contienen reglas de negocio ni consultas a la base de datos.

Ejemplos de endpoints:

```text
POST   /work-days
GET    /work-days
GET    /work-days/open
GET    /work-days/:id
PUT    /work-days/:id/close

POST   /trips
GET    /trips
GET    /trips/:id
PUT    /trips/:id
DELETE /trips/:id
```

Esta capa actúa como puerta de entrada al sistema.

---

# Controllers

Los Controllers coordinan cada petición recibida por la API.

Sus responsabilidades son:

- recibir la petición HTTP;
- leer `req.body`, `req.params` y `req.query`;
- validar la estructura básica de la petición;
- llamar al Service correspondiente;
- devolver la respuesta en formato JSON.

Los Controllers nunca contienen reglas de negocio ni consultas SQL.

Su objetivo es actuar únicamente como intermediarios entre la API y la lógica del sistema.

---

# Services

Los Services contienen toda la inteligencia de Taxi Finance.

Es la capa donde se aplican las reglas de negocio oficiales del proyecto.

Entre otras responsabilidades:

- validar datos;
- calcular kilómetros trabajados;
- calcular la facturación;
- calcular efectivo;
- calcular datáfono;
- aplicar las reglas del combustible;
- generar el resumen de jornada;
- coordinar el cierre de una jornada;
- mantener la consistencia de la información.

Toda modificación relacionada con el funcionamiento del negocio debe implementarse aquí.

Por este motivo, las reglas oficiales se documentan de forma independiente en **06-business-rules.md**, mientras que esta capa se encarga de ejecutarlas.

---

# Repositories

Los Repositories constituyen la única capa autorizada para acceder directamente a MySQL.

Toda consulta SQL se encuentra aislada aquí.

Responsabilidades:

- INSERT
- SELECT
- UPDATE
- DELETE

Esta separación ofrece varias ventajas:

- evita mezclar SQL con reglas de negocio;
- facilita las pruebas;
- simplifica el mantenimiento;
- permite sustituir el motor de base de datos en el futuro con un impacto mínimo sobre el resto de la aplicación.

---

# Base de datos

Actualmente Taxi Finance utiliza dos entidades principales.

```text
WorkDay
      │
      ├───────────────┐
      │               │
      ▼               ▼
 Trip 1          Trip 2 ... Trip N
```

La jornada representa el contexto de trabajo.

Los viajes representan la información real registrada durante esa jornada.

Toda la información agregada se obtiene a partir de los viajes.

---

# Entidad WorkDay

Una jornada representa un turno completo de trabajo.

Su responsabilidad consiste en agrupar todos los viajes realizados durante ese turno y almacenar únicamente la información propia de la jornada.

Contiene información como:

- fecha;
- kilómetros iniciales;
- kilómetros finales;
- combustible propio;
- combustible compartido con José;
- estado de la jornada;
- fecha de creación;
- fecha de actualización.

La jornada **no almacena** los importes de efectivo, datáfono ni la facturación total.

Estos valores siempre se calculan automáticamente a partir de los viajes registrados.

---

# Entidad Trip

El viaje constituye la unidad principal de información de Taxi Finance.

Cada viaje pertenece exactamente a una única jornada mediante la relación `work_day_id`.

Actualmente un viaje puede contener:

- importe;
- método de pago;
- comisión (opcional);
- propina (opcional);
- nota (opcional);
- fecha de creación;
- fecha de actualización.

La incorporación de comisión y propina responde a situaciones reales del trabajo diario del conductor y permite mantener un registro más preciso sin complicar el flujo de carga.

---

# Modelo del dominio

Aunque técnicamente existen varias tablas y componentes, el dominio del proyecto es muy sencillo.

```text
Jornada
      │
      ├──────────────► Viajes
                          │
                          ▼
                 Reglas de negocio
                          │
                          ▼
              Resumen de la jornada
```

La jornada actúa como contenedor.

Los viajes constituyen la fuente oficial de información.

Las reglas de negocio transforman esos datos en el resumen que utiliza el conductor.

Este modelo permite mantener una única fuente de verdad y evita inconsistencias entre los datos almacenados y los resultados mostrados por la aplicación.

---

# Reglas de negocio dentro de la arquitectura

Las reglas de negocio forman parte de la arquitectura, pero se documentan de manera independiente.

Esta separación evita duplicar información y mantiene cada documento centrado en una única responsabilidad.

La distribución de responsabilidades es la siguiente:

- **Architecture** → explica dónde vive la lógica y cómo interactúan las capas.
- **Business Rules** → define qué debe hacer la aplicación.
- **Services** → implementan esas reglas.
- **Repositories** → almacenan y recuperan la información necesaria.

Gracias a esta organización resulta posible modificar una regla del negocio sin alterar la arquitectura general del sistema.

# Decisiones de arquitectura

A lo largo del desarrollo se tomaron varias decisiones con el objetivo de mantener la aplicación simple, consistente y alineada con el trabajo diario del conductor.

Estas decisiones forman parte de la arquitectura del sistema y explican por qué el proyecto está construido de la forma actual.

---

## Single Source of Truth

Uno de los principios más importantes de Taxi Finance consiste en evitar almacenar información duplicada.

La entidad `work_days` únicamente almacena la información propia de la jornada.

Toda la información económica (facturación, efectivo y datáfono) se obtiene siempre a partir de los viajes registrados.

Esta decisión aporta varias ventajas:

- evita inconsistencias entre tablas;
- elimina la necesidad de sincronizar datos duplicados;
- simplifica el mantenimiento;
- garantiza que cualquier modificación de un viaje se refleje automáticamente en toda la aplicación.

---

## Separación entre carga rápida y edición

Durante el desarrollo se detectó que registrar un viaje nuevo y editar un viaje existente son tareas completamente diferentes.

Por este motivo se decidió utilizar dos componentes independientes.

### QuickTripForm

Optimizado para registrar muchos viajes consecutivos durante una jornada activa.

Características:

- mínimo número de pulsaciones;
- confirmación visual inmediata;
- limpieza automática del formulario;
- preparado para registrar el siguiente viaje sin abandonar la pantalla.

### TripForm

Orientado a la edición de información ya registrada.

Permite modificar todos los datos del viaje sin afectar la velocidad del flujo principal.

Esta separación simplifica ambos componentes y evita añadir complejidad innecesaria.

---

## Separación entre vista interna y resumen compartido

Taxi Finance distingue claramente entre la información que necesita el conductor y la información que debe compartir.

Dentro de la aplicación pueden mostrarse datos como:

- kilómetros iniciales;
- kilómetros finales;
- kilómetros recorridos;
- número de viajes;
- facturación;
- efectivo;
- datáfono;
- combustible.

Sin embargo, el resumen compartido mantiene únicamente la información necesaria para la operativa diaria.

Ejemplo:

```text
23/07/2026

KM: 186

EFECTIVO: 145,20 €
DATÁFONO: 312,40 €
FACTURACIÓN: 457,60 €

GASOLINA: 41,50 €
```

Esta separación evita mostrar información innecesaria y permite adaptar fácilmente el formato compartido a futuras necesidades.

---

## Adaptación al trabajo nocturno

El proyecto contempla el funcionamiento real de un taxi.

Una jornada puede comenzar un día y finalizar después de la medianoche.

Para evitar inconsistencias en el historial, la fecha de la jornada se ajusta automáticamente cuando corresponde, de forma que toda la actividad queda registrada bajo el día de trabajo correcto.

---

# Relación entre la documentación

Cada documento del proyecto tiene una responsabilidad específica.

| Documento | Responsabilidad |
|-----------|-----------------|
| `00-roadmap.md` | Planificación del proyecto y evolución futura. |
| `01-project-journal.md` | Historial cronológico del desarrollo. |
| `02-architecture.md` | Organización técnica del sistema. |
| `03-architecture-decisions.md` | Decisiones técnicas relevantes y sus motivos. |
| `04-backlog.md` | Funcionalidades pendientes y mejoras futuras. |
| `05-release-notes.md` | Cambios incorporados en cada versión. |
| `06-business-rules.md` | Reglas funcionales oficiales del negocio. |
| `07-current-state.md` | Estado actual del proyecto y próximos pasos. |

Esta organización evita duplicar información y facilita mantener la documentación actualizada.

---

# Estado actual de la arquitectura

Actualmente Taxi Finance dispone de:

## Frontend

- Gestión de jornadas.
- Jornada activa.
- Registro rápido de viajes.
- Registro consecutivo de múltiples viajes.
- Confirmación visual tras guardar un viaje.
- Comisión y propina opcionales por viaje.
- Nota opcional.
- Edición y eliminación de viajes.
- Cierre de jornada.
- Ticket reutilizable.
- Historial de jornadas.
- Detalle completo de cada jornada.
- Resumen preparado para compartir.
- Componentes reutilizables.

---

## Backend

- Arquitectura por capas.
- CRUD completo de jornadas.
- CRUD completo de viajes.
- Reglas de negocio centralizadas.
- Cálculos automáticos del resumen diario.
- Gestión del cierre de jornada.
- Repositories desacoplados de la lógica de negocio.

---

## Base de datos

Actualmente el dominio del proyecto se apoya en dos entidades principales:

- `work_days`
- `trips`

Toda la información financiera se deriva de la relación entre ambas.

---

# Evolución prevista

Una vez finalizada la Beta 1.0, la arquitectura continuará evolucionando siguiendo el Roadmap oficial del proyecto.

Las próximas fases previstas son:

1. Estabilización y mejoras derivadas del uso real.
2. Liquidación mensual.
3. Dashboard financiero.
4. Informes y exportación.
5. Usuarios y roles.
6. Panel del jefe.

La arquitectura actual ha sido diseñada para permitir incorporar estas funcionalidades sin necesidad de realizar cambios estructurales importantes.

---

# Estado de producción

La arquitectura actual funciona como una aplicación de un único conductor.
Todas las solicitudes acceden al mismo conjunto de jornadas y viajes en
MySQL. Todavía no existen autenticación, usuarios, roles ni un propietario
asociado a cada registro.

Por este motivo, el primer despliegue deberá ser privado. Antes de producción
se configurarán mediante variables de entorno la URL de la API y el puerto del
servidor. Esta configuración ya está implementada y documentada mediante
archivos `.env.example`. A continuación se limitará CORS al origen autorizado
y se definirá un procedimiento de creación, migración y copia de seguridad de
la base de datos.

Los datos históricos importados conservan los cierres de efectivo y datáfono
del registro original como referencia autorizada, mientras que las jornadas
nuevas continúan calculándose a partir de sus viajes.

La estructura de MySQL se reproduce mediante migraciones SQL numeradas dentro
de `server/database/migrations`. El comando `npm run db:migrate` aplica
únicamente las migraciones pendientes y registra cada una en
`schema_migrations`. Las restricciones únicas de fecha refuerzan en la base de
datos las reglas aplicadas por los Services.

---

# Conclusión

Taxi Finance sigue una arquitectura por capas orientada tanto a la calidad del software como a las necesidades reales del usuario.

La separación entre interfaz, reglas de negocio y acceso a datos facilita el mantenimiento del proyecto, mientras que el diseño basado en el flujo de trabajo del conductor permite que la aplicación evolucione sin perder simplicidad.

El objetivo de la arquitectura no es únicamente organizar el código, sino proporcionar una base sólida sobre la que el proyecto pueda seguir creciendo de forma ordenada, consistente y sostenible.

# Taxi Finance — Architecture

## Objetivo

Este documento describe la arquitectura Full Stack actual de Taxi Finance, explicando cómo se organiza el proyecto y cuál es la responsabilidad de cada capa.

El objetivo es mantener una arquitectura limpia, escalable y fácil de entender para cualquier desarrollador que participe en el proyecto.

## Stack tecnológico

### Frontend

- React
- Vite
- Tailwind CSS

### Backend

- Node.js
- Express

### Base de datos

- MySQL
- mysql2/promise

### Herramientas

- Git
- GitHub
- Thunder Client
- dotenv

---

## Arquitectura general

```text
React
   ↓
Pages
   ↓
Components
   ↓
Services
   ↓
Utils
   ↓
REST API
   ↓
Routes
   ↓
Controllers
   ↓
Services
   ↓
Repositories
   ↓
MySQL
```

## Filosofía de la arquitectura

Taxi Finance sigue una arquitectura por capas con los siguientes objetivos:

- Separación de responsabilidades.
- Reutilización de código.
- Facilidad de mantenimiento.
- Escalabilidad.
- Facilidad para realizar pruebas.

Cada capa tiene una única responsabilidad y únicamente conoce a la capa inmediatamente inferior.

---

## Flujo de una petición

Ejemplo: registro de un viaje.

```text
Usuario
   ↓
NewTripPage
   ↓
QuickTripForm
   ↓
tripService
   ↓
POST /trips
   ↓
Route
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
MySQL
   ↓
Respuesta JSON
   ↓
React actualiza la interfaz
```

---

## Frontend

### Pages

Las páginas representan las pantallas principales de la aplicación.

Ejemplos:

- HomePage
- NewWorkDayPage
- NewTripPage
- EditTripPage
- CloseWorkDayPage
- WorkDayClosedPage
- WorkDayHistoryPage
- WorkDayDetailPage

### Components

Los componentes reutilizables encapsulan la interfaz y evitan duplicación de código.

Ejemplos:

- Button
- Card
- Stat
- TripForm
- QuickTripForm
- WorkDayCard
- WorkDayTicket

#### Formularios de viajes

Taxi Finance utiliza dos formularios distintos según el contexto.

- **QuickTripForm** se utiliza para registrar viajes rápidamente durante una jornada activa.
- **TripForm** se utiliza para editar viajes ya registrados.

Esta separación evita sobrecargar un único componente con responsabilidades diferentes y permite optimizar cada flujo de trabajo de forma independiente.

### Services

Los servicios del frontend encapsulan todas las llamadas HTTP hacia la API.

### Utils

Las utilidades contienen lógica reutilizable, por ejemplo:

- formatDate
- formatCurrency
- buildWorkDaySummaryText

---

## Backend

### Routes

Las rutas definen los endpoints disponibles de la API.

Ejemplos:

```text
POST /work-days
GET /work-days
GET /work-days/open
GET /work-days/:id
PUT /work-days/:id/close
GET /work-days/:id/summary
POST /trips
GET /trips?workDayId=1
GET /trips/:id
PUT /trips/:id
DELETE /trips/:id
```

Las rutas únicamente redirigen las peticiones hacia el controlador correspondiente.

---

### Controllers

Los controllers son la puerta de entrada de la aplicación.

Su responsabilidad es:

- recibir la petición HTTP;
- leer `req.body`, `req.params` y `req.query`;
- llamar al Service correspondiente;
- devolver una respuesta JSON.

No contienen lógica de negocio ni consultas SQL.

---

### Services

Los Services contienen las reglas de negocio de Taxi Finance.

Ejemplos:

- validar datos;
- calcular kilómetros trabajados;
- calcular efectivo;
- calcular datáfono;
- calcular facturación total;
- calcular efectivo a rendir;
- calcular promedio por viaje.

Toda la inteligencia de la aplicación vive en esta capa.

---

### Repositories

Los Repositories son la única capa que accede directamente a MySQL.

Aquí viven todas las consultas SQL.

Responsabilidades:

- INSERT
- SELECT
- UPDATE
- DELETE

Gracias a esta separación, si algún día cambiamos MySQL por PostgreSQL, la mayor parte de la aplicación no tendría que modificarse.

---

## Base de datos

Actualmente Taxi Finance utiliza dos entidades principales.

### work_days

Representa una jornada laboral.

Contiene:

- fecha;
- kilómetros iniciales;
- kilómetros finales;
- gasolina propia;
- gasolina José;
- fecha de creación;
- fecha de actualización.

No almacena efectivo ni datáfono.

---

### trips

Representa un viaje realizado durante una jornada.

Cada viaje pertenece a una jornada mediante `work_day_id`.

Contiene:

- importe;
- método de pago;
- nota;
- ajuste de efectivo;
- motivo del ajuste;
- fechas de creación y actualización.

---

## Decisiones de arquitectura

### Evitar duplicación de datos

Inicialmente la tabla `work_days` almacenaba:

- cash
- card

Durante el Sprint 6 se decidió eliminar estas columnas.

Los motivos fueron:

- evitar inconsistencias;
- mantener una única fuente de verdad;
- calcular los totales siempre desde los viajes registrados.

De esta forma, cualquier modificación de un viaje se refleja automáticamente en el resumen de la jornada.

---

## Principios del proyecto

Taxi Finance intenta seguir varios principios de ingeniería de software.

- Separación de responsabilidades.
- Código reutilizable.
- Arquitectura por capas.
- Una única fuente de verdad para los datos.
- Reglas de negocio centralizadas en los Services.

---

## Estructura del proyecto

```text
client/
├── pages
├── components
├── services
└── utils

server/
├── config
├── routes
├── controllers
├── services
├── repositories
└── database
```

Esta organización facilita localizar rápidamente la responsabilidad de cada archivo y favorece la evolución del proyecto sin aumentar el acoplamiento entre módulos.

---

## Estado actual

Actualmente Taxi Finance dispone de:

### Frontend

- Gestión de jornadas.
- Jornada activa.
- Registro rápido de viajes con interfaz tipo calculadora.
- Carga consecutiva de varios viajes sin volver a la pantalla principal.
- Guardado directo en efectivo o datáfono.
- Nota opcional desplegable.
- Confirmación visual después de guardar un viaje.
- Edición y eliminación de viajes.
- Cierre de jornada.
- Ticket final reutilizable.
- Historial de jornadas.
- Detalle completo de jornada.
- Compartir resumen limpio para WhatsApp.
- Componentes reutilizables.

### Backend

- Arquitectura por capas.
- CRUD de jornadas.
- CRUD de viajes.
- Consulta individual de viajes.
- Resumen inteligente calculado desde los viajes.
- Reglas de negocio centralizadas.

### Base de datos

- work_days
- trips

---

## Decisión de interfaz para el registro rápido

Durante una jornada real un conductor puede registrar entre 20 y 30 viajes. Reducir la cantidad de pulsaciones necesarias para registrar cada uno de ellos era una prioridad del producto.

Por este motivo se decidió crear un componente específico (`QuickTripForm`) para la carga rápida de viajes, en lugar de reutilizar el formulario tradicional de edición.

El flujo quedó definido de la siguiente manera:

```text
Ingresar importe
   ↓
Guardar efectivo o Guardar datáfono
   ↓
Mostrar confirmación visual
   ↓
Limpiar formulario
   ↓
Listo para registrar el siguiente viaje
```

La pantalla permanece abierta después de cada registro para permitir cargar varios viajes consecutivos sin volver constantemente a la pantalla principal.

Además, el usuario mantiene accesos directos para:

- Ver la jornada.
- Cerrar la jornada.

Esta decisión prioriza la velocidad de uso durante una jornada real de trabajo sin perder acceso a las funciones principales.

---

## Consideraciones de producto implementadas

### Separación entre vista interna y resumen para WhatsApp

La aplicación puede mostrar información detallada dentro de la interfaz, como kilómetros iniciales, kilómetros finales, kilómetros trabajados, cantidad de viajes, efectivo, datáfono, gasolina y facturación total.

Sin embargo, el texto copiado para enviar al jefe se mantiene intencionalmente simple:

```text
DÍA DD/MM

KILÓMETROS: 000

EFECTIVO: 00,00 €
DATÁFONO: 00,00 €
TOTAL: 00,00 €

GASOLINA: 00,00 €
```

Esta separación evita mezclar necesidades internas del usuario con el formato operativo que necesita enviar por WhatsApp.

### Jornada nocturna

Taxi Finance contempla el flujo real del conductor: una jornada puede comenzar un día y terminar después de la medianoche.

Por ese motivo, al crear una jornada antes de las 06:00, la fecha por defecto se asigna al día anterior. Esta regla refleja el uso real del taxi y evita que una jornada nocturna quede registrada con la fecha incorrecta.

---

## Evolución prevista

Los siguientes pasos previstos para la arquitectura son:

- Exportación PDF diaria.
- Resumen mensual y PDF mensual.
- Dashboard financiero.
- Deploy privado para pruebas reales.
- Configuración de reglas de jornada y corte horario.
- Soporte para múltiples conductores.
- Autenticación y autorización.
- Panel de jefe con acceso a los datos de sus conductores.
- Conversión de la aplicación en una Progressive Web App (PWA).
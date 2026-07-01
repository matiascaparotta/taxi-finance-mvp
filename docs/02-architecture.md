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

## Frontend

### Pages

Las páginas representan las pantallas principales de la aplicación.

Ejemplos:

- Home
- NewWorkDayPage
- ActiveWorkDayPage
- NewTripPage
- CloseWorkDayPage
- WorkDayClosedPage

### Components

Los componentes reutilizables encapsulan la interfaz y evitan duplicación de código.

Ejemplos:

- Button
- Card
- Stat
- WorkDayCard
- WorkDaySummaryCard
- WorkDayTicket

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
POST /trips
GET /trips?workDayId=1
PUT /trips/:id
DELETE /trips/:id
GET /work-days/:id/summary
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

## Estado actual

Actualmente Taxi Finance dispone de:

### Frontend

- Gestión de jornadas.
- Jornada activa.
- Registro de viajes.
- Cierre de jornada.
- Ticket final.
- Compartir resumen.
- Componentes reutilizables.

### Backend

- Arquitectura por capas.
- CRUD de jornadas.
- CRUD de viajes.
- Resumen inteligente.
- Reglas de negocio.

### Base de datos

- work_days
- trips

---

## Evolución prevista

Los siguientes pasos de la arquitectura incluyen:

- Gestión completa de viajes (editar y eliminar).
- Dashboard financiero.
- Exportación PDF.
- Historial de jornadas.
- Soporte para múltiples conductores.
- Despliegue como aplicación web (PWA).
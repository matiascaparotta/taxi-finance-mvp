# Taxi Finance — Architecture

## Objetivo

Este documento explica la arquitectura actual del backend de Taxi Finance y el motivo de cada capa.

Taxi Finance está diseñado siguiendo una separación clara de responsabilidades para que el proyecto sea más fácil de mantener, escalar y explicar técnicamente.

---

## Stack actual

- Node.js
- Express
- MySQL
- mysql2/promise
- dotenv
- Thunder Client para pruebas manuales
- Git y GitHub para control de versiones

---

## Arquitectura general

```text
Client / Thunder Client / Future React App
        |
        v
Express Routes
        |
        v
Controllers
        |
        v
Services
        |
        v
Repositories
        |
        v
MySQL Database

## Capas de la aplicación

### Routes

Las rutas definen los endpoints disponibles de la API.

Ejemplos:

```text
POST /work-days
GET /work-days
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

Actualmente el backend permite:

- crear jornadas;
- listar jornadas;
- registrar viajes;
- listar viajes;
- editar viajes;
- eliminar viajes;
- obtener el resumen inteligente de una jornada.

---

## Próximos pasos

El siguiente gran objetivo será construir el frontend en React para consumir esta API y convertir Taxi Finance en una aplicación completa.
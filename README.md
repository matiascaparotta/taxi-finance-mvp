# Taxi Finance MVP

Aplicación para registrar jornadas de taxi, calcular ganancias diarias, generar resúmenes para WhatsApp y preparar liquidaciones mensuales.

## Objetivo

Construir una herramienta real para:

- Registrar kilómetros iniciales y finales.
- Registrar efectivo y datáfono.
- Registrar gasolina propia.
- Registrar gasolina cargada para José cuando corresponda.
- Calcular ganancia neta diaria.
- Generar resumen diario.
- Generar liquidación mensual.
- Exportar reportes.

## Fórmula principal

Ganancia neta diaria:

```txt
(efectivo + datáfono - gasolina propia - nómina diaria) / 2
```

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Base de datos: MySQL
- Git + GitHub
# Taxi Finance — Architecture Decision Records (ADR)

**Versión:** 2.0

**Última actualización:** 24/07/2026

**Estado:** Beta 1.0 finalizada — estabilización en curso

---

# Objetivo

Este documento registra las decisiones arquitectónicas más importantes tomadas durante el desarrollo de Taxi Finance.

Su finalidad es conservar el razonamiento técnico detrás de la arquitectura del proyecto para que cualquier desarrollador pueda comprender no solo cómo está construido el sistema, sino también por qué se tomaron determinadas decisiones.

Mientras que el documento **Architecture** describe la estructura técnica del proyecto, los **Architecture Decision Records (ADR)** explican las decisiones que dieron forma a esa arquitectura.

Cada ADR representa un momento en el que fue necesario elegir entre varias alternativas y documenta las consecuencias de dicha elección.

---

# ¿Qué es un ADR?

Un **Architecture Decision Record (ADR)** es un documento breve que registra una decisión técnica relevante.

Cada ADR responde, como mínimo, a las siguientes preguntas:

- ¿Cuál era el problema?
- ¿Qué alternativas existían?
- ¿Qué decisión se tomó?
- ¿Por qué se eligió esa solución?
- ¿Qué beneficios aporta?
- ¿Qué impacto tendrá en el futuro?

Documentar estas decisiones evita que, con el paso del tiempo, se pierda el contexto en el que fueron tomadas.

---

# Cómo utilizar este documento

Este documento debe actualizarse siempre que una decisión afecte significativamente a alguno de los siguientes aspectos:

- arquitectura del sistema;
- organización del código;
- reglas de negocio;
- modelo de datos;
- experiencia de uso;
- evolución futura del proyecto.

Cada decisión debe documentarse antes o al mismo tiempo que se implementa.

---

# Estructura de un ADR

Todos los ADR del proyecto siguen la misma estructura para mantener una documentación consistente.

```text
Contexto o problema

↓

Alternativas consideradas
(opcional)

↓

Decisión tomada

↓

Beneficios

↓

Impacto futuro
```

Cuando una decisión no tenga alternativas relevantes, dicha sección podrá omitirse.

---

# Estado de implementación

Los ADR también sirven para conocer el estado de cada decisión.

Se utilizarán los siguientes estados:

- ✅ Implementado
- 🚧 En desarrollo
- 📋 Planificado

Actualmente, todos los ADR incluidos en este documento corresponden a decisiones ya implementadas dentro de la Beta 1.0.

---

# Índice

- ADR-001 — Single Source of Truth para los datos financieros
- ADR-002 — Crear la capa Repositories
- ADR-003 — Arquitectura por capas
- ADR-004 — Resúmenes calculados dinámicamente
- ADR-005 — Modo Trabajo y Modo Gestión
- ADR-006 — Edición y eliminación de viajes
- ADR-007 — Reutilización del Ticket de Jornada
- ADR-008 — Separar resumen interno del resumen para WhatsApp
- ADR-009 — Regla de jornada nocturna
- ADR-010 — Ordenar jornadas por última carga
- ADR-011 — Registro rápido de viajes con QuickTripForm
- ADR-012 — Diseñar la aplicación alrededor del flujo de trabajo del conductor
- ADR-013 — Preservar cierres autorizados durante la importación histórica

---

# ADR-001

## Single Source of Truth para los datos financieros

**Fecha:** 30/06/2026

**Estado:** ✅ Implementado

### Contexto

En las primeras versiones del proyecto, la tabla `work_days` almacenaba los importes de efectivo y datáfono.

Sin embargo, esa misma información también podía obtenerse a partir de los viajes registrados en la tabla `trips`.

Esto generaba duplicación de datos y aumentaba el riesgo de inconsistencias cuando un viaje era editado o eliminado.

### Decisión

Eliminar los campos `cash` y `card` de `work_days` y calcular siempre los totales financieros a partir de los viajes registrados.

De esta manera, la tabla `trips` pasa a convertirse en la única fuente oficial de información económica de una jornada.

### Beneficios

- Una única fuente de verdad.
- Eliminación de datos duplicados.
- Menor riesgo de inconsistencias.
- Cualquier modificación de un viaje actualiza automáticamente todos los cálculos.

### Impacto futuro

Todos los nuevos cálculos financieros deberán obtener la información desde `trips`, evitando almacenar datos derivados dentro de `work_days`.

**Relacionado con:**

- Architecture
- Business Rules

---

# ADR-002

## Crear la capa Repositories

**Fecha:** 30/06/2026

**Estado:** ✅ Implementado

### Contexto

Durante las primeras etapas del desarrollo, las consultas SQL se encontraban mezcladas con la lógica de negocio.

Esta organización dificultaba el mantenimiento del código y aumentaba el acoplamiento entre la lógica del sistema y la base de datos.

### Decisión

Crear una capa específica denominada **Repositories**, responsable de centralizar todas las consultas a MySQL.

Ningún Service podrá ejecutar consultas SQL directamente.

### Beneficios

- Separación clara de responsabilidades.
- Código más limpio.
- Mayor facilidad para realizar pruebas.
- Menor acoplamiento entre negocio y persistencia.

### Impacto futuro

Si en el futuro cambia el motor de base de datos o la estrategia de persistencia, las modificaciones quedarán concentradas en los Repositories sin afectar al resto del sistema.

**Relacionado con:**

- Architecture
- Sprint 3

# ADR-003

## Arquitectura por capas

**Fecha:** 30/06/2026

**Estado:** ✅ Implementado

### Contexto

Desde el inicio del proyecto era necesario definir una estructura que permitiera hacer crecer la aplicación sin convertir el código en un conjunto de funciones difíciles de mantener.

Mezclar rutas, lógica de negocio y consultas a la base de datos habría provocado un alto acoplamiento y dificultado la incorporación de nuevas funcionalidades.

### Alternativas consideradas

- Centralizar toda la lógica en los Controllers.
- Utilizar una estructura basada únicamente en rutas.
- Separar claramente las responsabilidades mediante capas.

### Decisión

Adoptar una arquitectura por capas para todo el backend.

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

Cada capa tiene una única responsabilidad y únicamente interactúa con la capa inmediatamente inferior.

### Beneficios

- Código más organizado.
- Mayor facilidad para mantener el proyecto.
- Menor acoplamiento entre componentes.
- Facilita la incorporación de nuevas funcionalidades.
- Permite realizar pruebas de forma más sencilla.

### Impacto futuro

Toda nueva funcionalidad deberá respetar esta estructura para mantener una arquitectura consistente a medida que el proyecto crezca.

**Relacionado con:**

- Architecture
- Sprint 3

---

# ADR-004

## Resúmenes calculados dinámicamente

**Fecha:** 30/06/2026

**Estado:** ✅ Implementado

### Contexto

Durante las primeras versiones surgió la posibilidad de almacenar el resumen diario de una jornada directamente en la base de datos.

Sin embargo, dicho resumen puede obtenerse a partir de la información registrada durante la jornada.

Guardar ambos datos habría supuesto mantener información derivada que podría quedar desactualizada.

### Decisión

No almacenar los resúmenes diarios.

Cada vez que la aplicación necesita mostrar un resumen, este se genera dinámicamente utilizando la información existente en la base de datos.

### Beneficios

- Información siempre actualizada.
- No existen resúmenes obsoletos.
- Se elimina la duplicación de datos.
- Cualquier modificación de un viaje se refleja automáticamente en el resumen.

### Impacto futuro

Siempre que sea posible, los nuevos informes deberán calcularse dinámicamente en lugar de almacenarse como información adicional.

Únicamente se considerará almacenar datos derivados cuando existan motivos de rendimiento claramente justificados.

**Relacionado con:**

- Business Rules
- Architecture

---

# ADR-005

## Modo Trabajo y Modo Gestión

**Fecha:** 30/06/2026

**Estado:** ✅ Implementado

### Contexto

Durante una jornada activa el conductor necesita registrar viajes de la forma más rápida posible.

Fuera de la jornada, en cambio, las necesidades cambian completamente y la prioridad pasa a ser consultar información, revisar jornadas anteriores y gestionar los datos registrados.

Intentar cubrir ambos escenarios dentro de una única interfaz generaba una experiencia más compleja y con elementos innecesarios para cada momento.

### Decisión

Dividir el funcionamiento de la aplicación en dos modos claramente diferenciados.

### Modo Trabajo

Se activa automáticamente cuando existe una jornada con estado **OPEN**.

La interfaz prioriza:

- registro rápido de viajes;
- acceso inmediato al resumen de la jornada;
- cierre de jornada;
- mínima cantidad de acciones por operación.

### Modo Gestión

Se activa cuando no existe ninguna jornada abierta.

La interfaz se orienta a:

- consultar el historial;
- revisar jornadas anteriores;
- acceder a estadísticas;
- crear una nueva jornada.

### Beneficios

- Interfaz más sencilla.
- Menor carga visual.
- Flujo adaptado al momento de trabajo.
- Mejor experiencia de uso.
- Mayor productividad durante la jornada.

### Impacto futuro

Las futuras pantallas deberán integrarse respetando esta separación entre trabajo operativo y gestión administrativa.

**Relacionado con:**

- Architecture
- Roadmap
- Business Rules

---

# ADR-006

## Edición y eliminación de viajes

**Fecha:** 08/07/2026

**Estado:** ✅ Implementado

### Contexto

Durante una jornada es habitual cometer pequeños errores al registrar un viaje.

Puede introducirse un importe incorrecto, seleccionar un método de pago equivocado o añadir una nota incompleta.

Además, en ocasiones un viaje puede registrarse accidentalmente y necesitar ser eliminado.

### Alternativas consideradas

- Editar los viajes mediante un cuadro de diálogo.
- Permitir únicamente eliminar el viaje y volver a crearlo.
- Crear una pantalla específica para la edición.

### Decisión

Crear una pantalla independiente para la edición de viajes.

```text
/trips/:id/edit
```

Desde esta pantalla es posible:

- modificar el importe;
- cambiar el método de pago;
- editar la nota;
- actualizar comisión y propina;
- eliminar el viaje con confirmación previa.

### Beneficios

- Flujo más claro.
- Interfaz preparada para crecer.
- Mejor experiencia de uso en dispositivos móviles.
- Menor complejidad en el formulario de registro rápido.
- Los cálculos permanecen sincronizados gracias a que todos los totales se obtienen desde `trips`.

### Impacto futuro

Si la edición incorpora nuevas funcionalidades, deberán añadirse sobre esta pantalla sin afectar al flujo de registro rápido.

**Relacionado con:**

- QuickTripForm
- TripForm
- Architecture

# ADR-007

## Reutilización del componente WorkDayTicket

**Fecha:** 08/07/2026

**Estado:** ✅ Implementado

### Contexto

Durante el desarrollo apareció la necesidad de mostrar el resumen de una jornada en diferentes pantallas de la aplicación.

Inicialmente se planteó construir un diseño independiente para cada una de ellas.

Sin embargo, esto habría provocado duplicación de código y el riesgo de que ambas vistas evolucionaran de forma diferente con el paso del tiempo.

### Alternativas consideradas

- Duplicar el diseño en cada pantalla.
- Crear un componente reutilizable.

### Decisión

Crear un componente independiente denominado **WorkDayTicket**.

Este componente se utiliza como representación oficial de una jornada dentro de la aplicación y puede reutilizarse desde cualquier pantalla que necesite mostrar un resumen.

Actualmente muestra información como:

- fecha;
- kilómetros iniciales;
- kilómetros finales;
- kilómetros recorridos;
- cantidad de viajes;
- efectivo;
- datáfono;
- facturación;
- combustible.

### Beneficios

- Una única implementación.
- Consistencia visual en toda la aplicación.
- Menor cantidad de código.
- Mayor facilidad para realizar mejoras futuras.

### Impacto futuro

Toda modificación del diseño del resumen deberá realizarse únicamente sobre `WorkDayTicket`, propagándose automáticamente al resto de pantallas.

**Relacionado con:**

- Architecture
- Componentes reutilizables
- Sprint 14

---

# ADR-008

## Separación entre resumen interno y resumen para compartir

**Fecha:** 08/07/2026

**Estado:** ✅ Implementado

### Contexto

El conductor necesita consultar información muy detallada dentro de la aplicación.

Sin embargo, el resumen que comparte con su responsable debe ser breve, claro y contener únicamente la información necesaria para la operativa diaria.

Intentar utilizar un único formato para ambos casos habría obligado a hacer concesiones que perjudicarían una de las dos experiencias.

### Decisión

Separar completamente ambas responsabilidades.

El componente **WorkDayTicket** muestra toda la información necesaria dentro de la aplicación.

Por otro lado, la función:

```text
buildWorkDaySummaryText()
```

genera un resumen específico para compartir mediante WhatsApp.

### Beneficios

- Cada formato responde a una necesidad distinta.
- El resumen compartido permanece limpio y fácil de leer.
- La interfaz interna puede seguir creciendo sin afectar al mensaje enviado.

### Impacto futuro

Si en el futuro se incorporan nuevos formatos de salida, cada uno deberá implementarse de forma independiente.

Por ejemplo:

- resumen para WhatsApp;
- resumen para PDF;
- resumen mensual;
- resumen personal;
- resumen para el jefe.

Cada formato podrá evolucionar sin afectar al resto.

**Relacionado con:**

- Architecture
- Business Rules
- WorkDayTicket

---

# ADR-009

## Regla de jornada nocturna

**Fecha:** 08/07/2026

**Estado:** ✅ Implementado

### Contexto

El turno habitual del conductor comienza por la tarde y finaliza durante la madrugada.

Si la aplicación utilizara directamente la fecha del sistema al crear una jornada, una misma jornada podría quedar registrada con un día diferente al que realmente corresponde desde el punto de vista operativo.

### Decisión

Cuando se crea una nueva jornada, si la hora local es anterior a las 06:00, la fecha propuesta corresponde automáticamente al día anterior.

Ejemplo:

```text
Martes 07/07 - 17:00
↓

Jornada: 07/07


Miércoles 08/07 - 02:30
↓

Jornada: 07/07


Miércoles 08/07 - 08:00
↓

Jornada: 08/07
```

### Beneficios

- Refleja correctamente el trabajo real del conductor.
- Evita errores de registro.
- Reduce correcciones manuales.
- Mantiene un historial coherente.

### Impacto futuro

Cuando la aplicación soporte distintos conductores o varios turnos, este horario de corte podrá convertirse en una configuración específica para cada usuario.

**Relacionado con:**

- Business Rules
- WorkDay
- Architecture

---

# ADR-010

## Ordenar jornadas por orden de creación

**Fecha:** 08/07/2026

**Estado:** ✅ Implementado

### Contexto

La sección "Última jornada" debe representar la jornada registrada más recientemente en la aplicación.

Ordenar únicamente por la fecha operativa podía producir resultados poco intuitivos cuando el usuario registraba jornadas atrasadas o cuando una jornada nocturna pertenecía al día anterior.

### Decisión

Mientras no exista un criterio más adecuado, las jornadas se ordenan utilizando el identificador (`id`) en orden descendente.

```text
Mayor ID

↓

Última jornada creada
```

### Beneficios

- La Home refleja la actividad más reciente del usuario.
- El comportamiento resulta más predecible.
- Se evita confundir la fecha operativa con el momento en que la jornada fue registrada.

### Impacto futuro

Cuando el proyecto incorpore un campo `createdAt` completamente consolidado, el criterio de ordenación podrá evolucionar para utilizar la fecha real de creación.

**Relacionado con:**

- Home
- Historial
- Architecture

# ADR-011

## Registro rápido de viajes mediante QuickTripForm

**Fecha:** 22/07/2026

**Estado:** ✅ Implementado

### Contexto

Durante una jornada activa un conductor puede registrar entre veinte y treinta viajes.

El formulario tradicional obligaba a realizar varias acciones para registrar cada viaje, ralentizando el trabajo y aumentando el riesgo de errores.

Tras analizar el flujo real de uso se concluyó que el registro de un viaje nuevo y la edición de un viaje existente responden a necesidades completamente diferentes.

### Alternativas consideradas

- Mantener un único formulario para alta y edición.
- Utilizar un formulario dinámico con distintos modos.
- Crear un componente específico para el registro rápido.

### Decisión

Crear un componente independiente denominado **QuickTripForm**, diseñado exclusivamente para registrar viajes durante una jornada activa.

El componente incorpora:

- teclado numérico optimizado;
- importe con gran tamaño visual;
- coma decimal;
- botón de borrar;
- botones independientes para efectivo y datáfono;
- nota opcional desplegable;
- comisión opcional;
- propina opcional;
- confirmación visual al guardar;
- limpieza automática del formulario.

Tras registrar un viaje, la pantalla permanece abierta para facilitar el registro consecutivo de múltiples operaciones.

### Beneficios

- Menor cantidad de pulsaciones.
- Registro significativamente más rápido.
- Menor probabilidad de errores.
- Mejor experiencia en dispositivos móviles.
- Flujo adaptado al trabajo real del conductor.

### Impacto futuro

Las futuras mejoras relacionadas con la velocidad de registro deberán implementarse sobre `QuickTripForm`.

El componente `TripForm` permanecerá orientado exclusivamente a la edición de viajes existentes.

**Relacionado con:**

- TripForm
- Architecture
- Sprint 16

---

# ADR-012

## Diseñar la aplicación alrededor del flujo de trabajo del conductor

**Fecha:** 22/07/2026

**Estado:** ✅ Implementado

### Contexto

Muchas aplicaciones organizan su interfaz siguiendo la estructura técnica de la base de datos.

Sin embargo, un conductor de taxi no piensa en tablas, entidades o relaciones.

Su trabajo gira alrededor de una secuencia muy concreta:

```text
Comenzar jornada

↓

Registrar viajes

↓

Consultar el resumen

↓

Cerrar la jornada

↓

Compartir el resultado
```

Diseñar la aplicación siguiendo la estructura técnica habría obligado al usuario a adaptarse al software en lugar de que el software se adaptara a su forma de trabajar.

### Decisión

Diseñar toda la aplicación siguiendo el flujo real de una jornada de trabajo.

Las entidades técnicas permanecen ocultas al usuario.

La interfaz presenta únicamente las acciones necesarias en cada momento.

Este principio ha influido directamente en decisiones como:

- separación entre Modo Trabajo y Modo Gestión;
- creación de QuickTripForm;
- cierre simplificado de jornada;
- reutilización del WorkDayTicket;
- separación entre resumen interno y resumen compartido.

### Beneficios

- Curva de aprendizaje muy reducida.
- Menor cantidad de errores.
- Flujo intuitivo.
- Mayor productividad durante la jornada.
- Arquitectura alineada con las necesidades del negocio.

### Impacto futuro

Toda nueva funcionalidad deberá integrarse respetando el flujo natural de trabajo del conductor.

La prioridad será siempre simplificar la operativa diaria antes que añadir complejidad técnica visible para el usuario.

**Relacionado con:**

- Architecture
- Business Rules
- Roadmap

---

# ADR-013

## Preservar cierres autorizados durante la importación histórica

**Fecha:** 24/07/2026

**Estado:** ✅ Implementado

### Contexto

Las jornadas importadas desde el historial de WhatsApp contienen valores de
cierre de efectivo y datáfono que fueron revisados y utilizados en la
operativa real. La reconstrucción de los viajes no siempre permite representar
por sí sola todos los ajustes históricos.

### Decisión

Conservar para cada jornada importada sus valores autorizados de cierre y
utilizarlos al generar el resumen histórico. Las jornadas creadas directamente
en Taxi Finance continúan calculando sus importes desde los viajes, respetando
el principio de fuente única de verdad.

### Beneficios

- Los 70 cierres históricos coinciden con el registro original.
- No se crean viajes artificiales para forzar diferencias.
- Los datos importados quedan diferenciados de las jornadas nuevas.
- La experiencia diaria mantiene los cálculos automáticos actuales.

### Impacto futuro

La migración a producción deberá incluir tanto las jornadas y viajes como los
cierres autorizados de la importación. Cualquier futura herramienta de
importación deberá validar explícitamente esos totales.

---

# Conclusión

Los Architecture Decision Records recogen las decisiones técnicas más importantes tomadas durante el desarrollo de Taxi Finance.

Su objetivo no es únicamente documentar el estado actual del proyecto, sino conservar el razonamiento que dio origen a cada decisión.

Gracias a esta documentación es posible comprender cómo ha evolucionado la arquitectura, por qué se descartaron determinadas alternativas y cuáles son los principios que deberán respetarse en futuras versiones.

Este documento complementa al resto de la documentación del proyecto y constituye la referencia oficial para cualquier decisión arquitectónica relevante que se tome a partir de la Beta 1.0.

# 📘 Reglas de negocio

**Versión:** 2.0

**Última actualización:** 24/07/2026

**Estado:** Vigente

---

# Objetivo

Este documento define las reglas de negocio oficiales de Taxi Finance.

Su finalidad es garantizar que el comportamiento de la aplicación sea consistente independientemente de futuras modificaciones del código.

En caso de contradicción entre una conversación, una implementación o una propuesta de mejora, prevalecerá este documento hasta que se apruebe un cambio en las reglas de negocio.

---

# Cómo utilizar este documento

Las reglas descritas en este documento representan el comportamiento oficial de Taxi Finance.

Toda nueva funcionalidad deberá respetarlas o, en caso de requerir un cambio, actualizar previamente este documento.

En caso de conflicto entre la implementación y estas reglas, prevalecerán las reglas de negocio aquí definidas.

---

# Principios del producto

Taxi Finance está diseñado para ayudar al conductor durante su jornada de trabajo.

Toda funcionalidad deberá cumplir al menos uno de estos objetivos:

- Ahorrar tiempo.
- Reducir errores.
- Simplificar el trabajo diario.
- Facilitar la rendición de cuentas.

Si una funcionalidad no aporta alguno de estos beneficios, no tendrá prioridad dentro del MVP.

---

# Jornada

## Definición

Una jornada pertenece a un único conductor.

Cada jornada contiene:

- Fecha.
- Kilómetros iniciales.
- Kilómetros finales.
- Kilómetros trabajados (calculados automáticamente).
- Lista de viajes.
- Información del combustible.
- Resumen final.

---

## Estados

Una jornada podrá encontrarse únicamente en uno de los siguientes estados:

- Activa.
- Cerrada.

---

## Restricciones

Mientras una jornada permanezca activa podrán registrarse nuevos viajes.

Una vez cerrada, no podrán añadirse, modificarse ni eliminarse viajes.

Para un mismo conductor no podrán existir dos jornadas con la misma fecha.

La fecha de una nueva jornada deberá ser posterior a la última jornada
registrada.

El kilometraje inicial deberá ser igual o superior al kilometraje final de la
última jornada. Se permitirá utilizar una base inferior únicamente mediante
una confirmación explícita por cambio de vehículo o reinicio del
cuentakilómetros.

---

# Viajes

## Definición

Cada viaje representa un servicio realizado durante una jornada.

Cada viaje registra:

- Hora.
- Importe.
- Medio de pago.
- Comisión (opcional).
- Propina (opcional).
- Nota (opcional).

El importe nunca podrá ser negativo.

---

## Creación

Todo viaje deberá pertenecer a una jornada activa.

Al registrarse un viaje, el sistema recalculará automáticamente:

- efectivo;
- datáfono;
- facturación;
- resumen de la jornada.

Nunca será necesario recalcular estos valores manualmente.

---

## Edición

Un viaje podrá modificarse únicamente mientras la jornada permanezca activa.

Cada modificación deberá recalcular automáticamente:

- efectivo;
- datáfono;
- facturación;
- resumen de la jornada.

El usuario nunca deberá realizar recalculos manuales.

---

## Eliminación

Antes de eliminar un viaje, el sistema deberá solicitar una confirmación.

Una vez eliminado, deberán recalcularse automáticamente todos los totales de la jornada.

La eliminación de un viaje será irreversible.

---

# Medios de pago

Actualmente Taxi Finance admite dos medios de pago:

- Efectivo.
- Datáfono.

El sistema calculará automáticamente:

- Total en efectivo.
- Total en datáfono.
- Facturación total.

No podrán añadirse nuevos métodos de pago sin actualizar previamente estas reglas de negocio.

---

# Comisión

## Definición

La comisión pertenece exclusivamente al viaje en el que fue registrada.

No constituye un dato independiente de la jornada.

---

## Reglas

- Es un campo opcional.
- Solo se muestra debajo del viaje correspondiente.
- Nunca se acumula visualmente.
- Nunca aparece resumida al final de la jornada.
- Forma parte del cálculo interno del efectivo.

---

# Propina

## Definición

La propina pertenece exclusivamente al viaje en el que fue registrada.

No constituye un dato independiente de la jornada.

---

## Reglas

- Es un campo opcional.
- Solo se muestra debajo del viaje correspondiente.
- Nunca aparece como un total independiente.
- Nunca aparece en el resumen de la jornada.
- Forma parte del cálculo interno del efectivo.

---

# Efectivo

El efectivo mostrado al usuario representa siempre el efectivo final calculado por el sistema.

La aplicación ocultará todos los valores intermedios utilizados durante los cálculos.

Nunca deberán mostrarse:

- efectivo bruto;
- efectivo real;
- totales internos utilizados para los cálculos.

El usuario únicamente visualizará el resultado final necesario para gestionar su jornada.

---

# Facturación

La facturación corresponde al importe total generado durante la jornada.

Se calcula automáticamente mediante la suma de todos los viajes registrados.

El usuario no podrá modificar manualmente este valor.

---

# Combustible

## Registro

El combustible se registra únicamente durante el cierre de la jornada.

El usuario podrá indicar una de las siguientes opciones:

- Toda la carga corresponde al conductor.
- La carga se comparte al 50 % con José.

---

## Cálculo

Cuando el combustible sea compartido:

- Gasolina propia = 50 %.
- Gasolina José = 50 %.

Estos importes serán calculados automáticamente por el sistema.

El usuario no deberá realizar cálculos manuales.

---

## Visualización

Las reglas de visualización son las siguientes:

- Mostrar **Gasolina** únicamente cuando su importe sea mayor que cero.
- Mostrar **Gasolina José** únicamente cuando su importe sea mayor que cero.

---

# Resumen diario

## Objetivo

El resumen diario deberá ser claro, breve y fácil de leer.

Su finalidad es permitir al conductor revisar rápidamente toda la jornada y compartir la información cuando sea necesario.

---

## Información de la jornada

El resumen incluirá:

- Fecha.
- Kilómetros iniciales.
- Kilómetros finales.
- Kilómetros trabajados.

---

## Información de los viajes

Cada viaje mostrará:

- Hora.
- Medio de pago.
- Importe.

Solo cuando existan también se mostrarán:

- Comisión.
- Propina.

---

## Totales

El resumen mostrará únicamente:

- Cantidad de viajes.
- Cantidad de pagos en efectivo.
- Cantidad de pagos con datáfono.
- Efectivo.
- Datáfono.
- Facturación.
- Gasolina (si corresponde).
- Gasolina José (si corresponde).

Nunca deberán mostrarse:

- Total de comisiones.
- Total de propinas.
- Efectivo bruto.
- Efectivo real.
- Cálculos internos del sistema.

---

# Pantalla principal (Home)

## Objetivo

La pantalla principal prioriza únicamente la información necesaria durante la jornada de trabajo.

Su diseño busca reducir la carga visual y facilitar el registro rápido de nuevos viajes.

---

## Indicadores

La Home mostrará únicamente:

- Viajes.
- Facturación.
- Efectivo.
- Datáfono.

No deberán mostrarse indicadores secundarios que puedan distraer al conductor durante la jornada.

---

# Registro rápido

Durante una jornada activa, el sistema utilizará **QuickTripForm** como formulario principal para registrar viajes.

`TripForm` quedará reservado exclusivamente para la edición de viajes.

Esta separación permite simplificar la interfaz y optimizar el flujo de trabajo diario del conductor.

---

# Compartir resumen

Al finalizar la jornada el usuario dispondrá de dos opciones:

- Compartir la tarjeta visual de la jornada.
- Guardar la tarjeta visual como imagen.
- Copiar el resumen como texto.

La tarjeta compartida constituye el formato principal para compartir la información.

Cuando existan muchos viajes, la primera imagen conservará el resumen
principal y el detalle se dividirá en páginas de hasta 15 viajes para mantener
la legibilidad.

El PDF no forma parte del flujo principal de la Beta 1.0.

El resumen compartido nunca deberá mostrar:

- total de comisiones;
- total de propinas;
- efectivo bruto;
- efectivo real;
- cálculos internos del sistema.

---

# Cierre de jornada

## Flujo de cierre

El cierre de una jornada seguirá siempre el mismo proceso:

1. Confirmar la fecha de la jornada.
2. Registrar el combustible.
3. Indicar si el combustible corresponde íntegramente al conductor o si se comparte con José.
4. Calcular automáticamente los importes correspondientes.
5. Generar el resumen de la jornada.
6. Permitir compartir la tarjeta visual o copiar el resumen como texto.

El usuario no deberá realizar cálculos manuales durante este proceso.

---

# Reglas generales

Las siguientes reglas deberán cumplirse en toda la aplicación.

## Consistencia de los datos

Toda operación deberá mantener la consistencia de la información almacenada.

No podrán existir datos duplicados ni valores calculados manualmente.

---

## Recalculo automático

Siempre que una acción modifique la información de una jornada, el sistema deberá recalcular automáticamente todos los valores derivados.

Esto incluye, entre otros:

- efectivo;
- datáfono;
- facturación;
- cantidad de viajes;
- resumen de la jornada.

---

## Single Source of Truth

Cada dato deberá tener una única fuente oficial dentro del sistema.

Los resúmenes, indicadores y pantallas nunca almacenarán cálculos propios, sino que utilizarán siempre los datos generados por la lógica de negocio.

---

## Simplicidad

Toda nueva funcionalidad deberá mantener la filosofía de Taxi Finance:

- reducir el número de acciones necesarias para completar una tarea;
- minimizar los errores del usuario;
- mantener una interfaz sencilla y rápida de utilizar.

---

# Filosofía de desarrollo

Las reglas de negocio tienen prioridad sobre la implementación técnica.

El código deberá adaptarse a las reglas de negocio y no al contrario.

Antes de modificar cualquier funcionalidad deberá verificarse si el cambio afecta a este documento.

Si una regla cambia, este documento deberá actualizarse antes de cerrar el sprint correspondiente.

---

# Fuente oficial

Este documento constituye la fuente oficial de las reglas de negocio de Taxi Finance.

Toda decisión funcional deberá ser coherente con las reglas aquí definidas hasta que se apruebe una nueva versión del documento.

Su objetivo es garantizar un comportamiento consistente de la aplicación, facilitar el mantenimiento del proyecto y servir como referencia para futuras funcionalidades y decisiones de desarrollo.

# 📘 Reglas de negocio

**Versión:** 2.1

**Última actualización:** 25/07/2026

**Estado:** Vigente

---

# Objetivo

Este documento define las reglas de negocio oficiales de TaxFin.

Su finalidad es garantizar que el comportamiento de la aplicación sea consistente independientemente de futuras modificaciones del código.

En caso de contradicción entre una conversación, una implementación o una propuesta de mejora, prevalecerá este documento hasta que se apruebe un cambio en las reglas de negocio.

---

# Cómo utilizar este documento

Las reglas descritas en este documento representan el comportamiento oficial de TaxFin.

Toda nueva funcionalidad deberá respetarlas o, en caso de requerir un cambio, actualizar previamente este documento.

En caso de conflicto entre la implementación y estas reglas, prevalecerán las reglas de negocio aquí definidas.

---

# Principios del producto

TaxFin está diseñado para ayudar al conductor durante su jornada de trabajo.

## Marca e identidad de licencia

- La aplicación se llamará `TaxFin`.
- Cada organización tendrá su propio nombre visible de licencia.
- Las pantallas generales utilizarán TaxFin.
- Las tarjetas, resúmenes compartidos y archivos exportados utilizarán la
  licencia de la organización correspondiente.
- La organización inicial conservará `Lic249`.

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

Una vez cerrada, no podrán añadirse viajes. Los viajes de una jornada propia
creada en TaxFin podrán corregirse mediante una confirmación reforzada que
exija la contraseña actual y un motivo. El sistema conservará en auditoría el
usuario, la fecha, el motivo y los valores anteriores y resultantes.

La eliminación de un viaje cerrado utilizará la misma confirmación reforzada.
La auditoría conservará todos los datos que tenía el viaje antes de eliminarlo
y el resumen de la jornada se recalculará a partir de los viajes restantes.

La fecha, el combustible y el kilometraje de una jornada propia cerrada podrán
corregirse con la misma confirmación reforzada. El kilometraje inicial no podrá
ser inferior al final de la jornada anterior del mismo vehículo, el final no
podrá ser inferior al inicial ni superar el inicio de la jornada siguiente. El
combustible se recalculará aplicando nuevamente las reglas de reparto y rol.
La fecha deberá ser válida, no podrá duplicar otra jornada del mismo conductor
y el cambio conservará la continuidad kilométrica del vehículo en la nueva
posición cronológica.

Las jornadas históricas procedentes de la importación estarán protegidas y no
podrán modificarse ni eliminarse.

El propietario podrá consultar jornadas ajenas, pero no podrá usar la
corrección segura sobre ellas. Cada conductor solo podrá corregir sus propias
jornadas.

Las jornadas creadas directamente en TaxFin después de la importación podrán
eliminarse completas únicamente por su conductor. Se exigirán la contraseña
actual, un motivo de entre 5 y 500 caracteres y la confirmación escrita
`ELIMINAR`. La auditoría conservará la jornada y todos sus viajes antes de que
la eliminación en cascada los retire. El borrado y la auditoría serán una sola
transacción irreversible.

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

Actualmente Lic249 admite dos medios de pago:

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

Un conductor no propietario podrá indicar una de las siguientes opciones:

- Toda la carga corresponde al conductor.
- La carga se comparte al 50 % con José.

Cuando quien cierra la jornada sea propietario:

- toda la carga corresponderá al propietario;
- no se mostrará ninguna opción de reparto;
- el backend ignorará cualquier intento de enviar una carga compartida;
- **Gasolina José** será siempre cero en sus jornadas.

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

# Liquidación mensual de Matías

La liquidación mensual es un único registro compartido entre Matías y José.
Se reconstruye exclusivamente con jornadas cerradas de Matías; una jornada
activa o cancelada nunca afecta los totales.

## Regla de reparto

1. Sumar la facturación de las jornadas.
2. Restar la gasolina propia de Matías para obtener la **facturación neta para
   reparto**.
3. Restar la Seguridad Social completa del mes.
4. Dividir la base resultante al 50 % entre Matías y José.
5. Restar de la mitad de Matías la nómina que José ya transfirió.

La Seguridad Social se paga completa aunque Matías trabaje menos días. Durante
el mes en curso la aplicación puede mostrar una estimación diaria usando 670 €
y 22 días como valores iniciales, pero el cierre siempre utiliza el importe
mensual confirmado.

El promedio diario mostrado a Matías y José se calcula sobre la base posterior
a ambos descuentos: facturación menos gasolina propia de Matías menos la
Seguridad Social aplicada, dividida entre las jornadas cerradas del período.
La gasolina de José afecta al cierre de caja, no a este promedio.

## Cierre de caja

José recibe todo el datáfono y Matías conserva físicamente el efectivo. El
efectivo disponible se calcula restando al efectivo generado la gasolina de
Matías y la gasolina de José. La entrega final a José es el efectivo disponible
menos el importe todavía pendiente para Matías.

Seguridad Social, nómina transferida y días previstos son editables por ambos.
José puede revisar la liquidación pero no cerrarla. Solo Matías confirma el
cierre definitivo una vez finalizado el mes. Después del cierre los importes quedan congelados en una
instantánea y las modificaciones de configuración y el cierre quedan
auditados. Las jornadas diarias no se duplican ni se modifican.

Los meses anteriores se reconstruyen automáticamente a partir de las jornadas
cerradas y permanecen pendientes de revisión hasta confirmar sus datos. El
acceso legacy continúa disponible para el flujo existente, pero la liquidación
mensual requiere una cuenta personal para identificar permisos y autoría.

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

Esta restricción corresponde al resumen final del conductor. Como excepción,
el seguimiento privado del propietario mostrará los totales acumulados de
comisión y propina mientras una jornada ajena permanezca activa.

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

- comisiones o propinas de viajes individuales;
- total de comisiones;
- total de propinas;
- efectivo bruto;
- efectivo real;
- cálculos internos del sistema.

Las comisiones y propinas continuarán registradas en TaxFin y podrán
consultarse dentro de la aplicación, pero no se dibujarán en las imágenes
compartidas.

---

# Seguimiento en vivo del propietario

El propietario podrá consultar todos los viajes registrados en una jornada
ajena activa de su organización.

- La lista no estará limitada a los últimos viajes.
- Cada viaje podrá mostrar su comisión y propina cuando existan.
- El panel mostrará los totales acumulados de comisión y propina.
- La actualización continuará siendo automática y de solo lectura.
- El propietario no podrá modificar la jornada ni sus viajes.

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

## Continuidad durante la transición

La contraseña privada actual continuará protegiendo producción mientras se
desarrolla y prueba el acceso individual.

Las migraciones multiusuario deberán ser aditivas. No podrán borrar, modificar
ni reasignar jornadas históricas hasta que las cuentas correspondientes hayan
sido creadas y verificadas.

Durante la transición, las referencias de organización, conductor y vehículo
podrán permanecer vacías únicamente para conservar compatibilidad con la
versión publicada. Después de la asignación verificada serán obligatorias para
toda jornada nueva.

El acceso general solo podrá retirarse cuando el inicio de sesión individual y
el flujo completo de jornada hayan superado las pruebas de regresión.

## Organizaciones

Cada licencia o empresa constituye una organización independiente.

- Los datos de una organización nunca podrán consultarse desde otra.
- Una organización podrá tener uno o varios propietarios y conductores.
- Una persona propietaria podrá ser también conductora.
- Una persona propietaria podrá no conducir y dedicarse únicamente a gestionar.

## Usuarios y permisos

Cada usuario utilizará un nombre de usuario y una contraseña personal.

- El conductor solo podrá consultar y gestionar sus propias jornadas.
- El conductor no podrá consultar las jornadas de otros conductores.
- El propietario podrá crear y suspender conductores de su organización.
- El propietario podrá reactivar posteriormente un conductor suspendido.
- El propietario podrá consultar y exportar jornadas ajenas.
- El propietario podrá consultar el avance de jornadas ajenas activas.
- El historial personal del propietario deberá permanecer separado del
  historial de sus conductores.
- El acceso a jornadas ajenas deberá realizarse mediante una selección
  explícita del conductor, sin mezclar todas las jornadas en una única lista.
- El propietario no podrá modificar, cerrar ni eliminar jornadas ajenas.
- La autorización deberá validarse siempre en el backend.
- Las jornadas ajenas consultadas por un propietario deberán identificar al
  conductor y mostrarse en modo de solo lectura.
- El seguimiento activo mostrará importes calculados y viajes recientes sin
  permitir editar ninguno de sus datos.
- La fecha mínima se validará respecto de las jornadas del mismo conductor.
- El kilometraje inicial se validará respecto del último cierre del vehículo
  compartido, aunque corresponda a otro conductor.

Durante la transición se permitirá dejar vacío el nombre de usuario y acceder
con la contraseña privada anterior. Este modo no crea una identidad personal y
deberá retirarse únicamente después de validar el filtrado de todas las
operaciones por conductor.

Las cuentas suspendidas, organizaciones inactivas y membresías inactivas no
podrán iniciar una sesión individual.

- La suspensión no eliminará jornadas, viajes ni estadísticas.
- La suspensión tendrá efecto sobre las sesiones ya iniciadas.
- No se podrá suspender una cuenta propietaria.
- No se podrá suspender un conductor mientras tenga una jornada activa.
- La suspensión afectará únicamente la membresía de la organización que la
  solicita.

Toda cuenta creada por un propietario tendrá una contraseña temporal.

- Deberá cambiarse durante el primer acceso.
- Hasta completarlo no se podrán consultar ni gestionar jornadas o viajes.
- La nueva contraseña tendrá como mínimo diez caracteres, una letra y un
  número.
- Deberá ser diferente de la contraseña temporal.
- La contraseña y su confirmación nunca se almacenarán en texto.
- El cambio no se aplica al modo de acceso privado anterior.

El propietario podrá restablecer la contraseña de un conductor no propietario.

- Se generará una contraseña temporal nueva.
- La contraseña anterior dejará de funcionar inmediatamente.
- La contraseña temporal se mostrará una sola vez.
- Las sesiones abiertas deberán volver al cambio obligatorio de contraseña.
- No se podrá restablecer una contraseña propietaria desde la gestión de
  conductores.
- La operación solo podrá aplicarse a conductores de la misma organización.

Las 70 jornadas y los 1.203 viajes históricos actuales pertenecen a Matías y
deberán asignarse a su cuenta mediante una migración verificada.

## Vehículos compartidos

Cada jornada futura pertenecerá a un conductor y a un vehículo.

- Conductores diferentes podrán registrar una jornada en la misma fecha.
- Un mismo conductor no podrá registrar dos jornadas en la misma fecha.
- La continuidad del cuentakilómetros se validará por vehículo, no por
  conductor.
- Normalmente solo podrá existir una jornada activa por vehículo.
- El reinicio del cuentakilómetros o cambio de vehículo continuará requiriendo
  confirmación explícita.

## Modalidades de combustible por conductor

Cada conductor podrá tener una de estas modalidades:

- `ACTUAL_LOAD`: importe real introducido durante el cierre.
- `DISTANCE_RATE`: kilómetros trabajados multiplicados por una tarifa
  configurable.

La tarifa por distancia podrá cambiar sin alterar las jornadas cerradas
anteriormente. No representa un porcentaje del combustible cargado. Por
ejemplo, 300 km a 0,10 €/km generan un coste de 30 €, mientras que una carga
real de 60 € descuenta los 60 € completos. Alberto utiliza `DISTANCE_RATE` a
0,10 €/km. TaxFin calcula y guarda ese coste automáticamente al cerrar la
jornada; la tarifa podrá cambiar para jornadas futuras sin recalcular cierres.

## Configuración laboral de Alberto

Alberto puede gestionar desde su propia cuenta la tarifa de combustible por
kilómetro, el importe diario de Seguridad Social y su catálogo de empresas u
hoteles con comisión. Retirar una empresa la desactiva para viajes nuevos, pero
no borra su historial.

Al elegir una empresa en un viaje, TaxFin aplica el importe fijo configurado
para esa empresa y guarda como instantánea el nombre y el importe. Un
cambio posterior del importe no modifica viajes anteriores. Las propinas
pertenecen íntegramente a Alberto.

La jornada activa, el detalle cerrado y el resumen mensual muestran la comisión
total, la propina total y el desglose por empresa con cantidad de viajes e
importe acumulado.

## Consistencia de los datos

Toda operación deberá mantener la consistencia de la información almacenada.

No podrán existir datos duplicados ni valores calculados manualmente.

## Conectividad y PWA

TaxFin podrá instalarse y abrir su interfaz básica sin conexión. En esta
primera etapa no guardará localmente jornadas, viajes, cierres, correcciones ni
eliminaciones pendientes. Toda operación que modifique información financiera
requerirá conexión confirmada con el servidor.

Si el dispositivo está sin conexión, la aplicación deberá avisarlo y rechazar
la escritura indicando expresamente que no se guardó ningún cambio. Las
respuestas de `/api`, las sesiones y los datos financieros nunca formarán parte
de la caché del service worker.

Las nuevas versiones se activarán mediante una confirmación visible para no
recargar TaxFin mientras el conductor está introduciendo un viaje.

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

Toda nueva funcionalidad deberá mantener la filosofía de Lic249:

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

Este documento constituye la fuente oficial de las reglas de negocio de Lic249.

Toda decisión funcional deberá ser coherente con las reglas aquí definidas hasta que se apruebe una nueva versión del documento.

Su objetivo es garantizar un comportamiento consistente de la aplicación, facilitar el mantenimiento del proyecto y servir como referencia para futuras funcionalidades y decisiones de desarrollo.

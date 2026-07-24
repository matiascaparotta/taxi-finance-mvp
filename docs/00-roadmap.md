# 🚖 Taxi Finance — Roadmap

## Visión

Construir una aplicación Full Stack para la gestión financiera de conductores de taxi, sustituyendo los procesos manuales por una herramienta rápida, intuitiva, segura y profesional.

Taxi Finance nace para resolver un problema real: simplificar el trabajo diario del conductor de taxi, reduciendo el tiempo dedicado a registrar información y eliminando errores en los cálculos y en la rendición de cuentas.

El objetivo del proyecto es evolucionar desde un MVP funcional hasta una plataforma completa para la gestión financiera de conductores.

---

# Resumen

- Estado: 🚧 Desarrollo activo
- Versión del roadmap: **1.0**
- Sprints completados: **16**
- Sprint actual: **Sprint 17 — Estabilización**
- Próximo hito: **Deploy privado seguro**
- Última actualización: **24/07/2026**

---

# Estado del proyecto

| Sprint | Estado | Objetivo | Valor para el usuario |
|---------|--------|----------|------------------------|
| Sprint 1 | ✅ | Base del proyecto | Infraestructura inicial |
| Sprint 2 | ✅ | Jornadas | Registrar jornadas |
| Sprint 3 | ✅ | Resumen mensual | Obtener información financiera mensual |
| Sprint 4 | ✅ | CRUD de viajes | Gestionar viajes |
| Sprint 5 | ✅ | Refactor de arquitectura | Mejorar mantenibilidad |
| Sprint 6 | ✅ | Resumen inteligente | Calcular automáticamente los totales |
| Sprint 7 | ✅ | Frontend React | Primera interfaz funcional |
| Sprint 8 | ✅ | Jornadas activas | Adaptar el flujo real del conductor |
| Sprint 9 | ✅ | Registro de viajes | Registrar viajes durante la jornada |
| Sprint 10 | ✅ | Cierre de jornada | Completar el ciclo diario |
| Sprint 11 | ✅ | Ticket de jornada | Mostrar el resumen del turno |
| Sprint 12 | ✅ | Compartir resumen | Compartir rápidamente el cierre |
| Sprint 13 | ✅ | Gestión de viajes | Editar y eliminar viajes |
| Sprint 14 | ✅ | Historial de jornadas | Consultar jornadas anteriores |
| Sprint 15 | ✅ | Registro rápido | Registro tipo calculadora |
| **Sprint 16** | ✅ | **Beta 1.0 — Cierre del MVP** | **Gestionar una jornada completa con Taxi Finance** |
| **Sprint 17** | 🚧 | **Estabilización** | **Preparar un uso diario fiable y el deploy privado** |
| Sprint 18 | ⏳ | Liquidación mensual | Desarrollar el módulo financiero mensual |
| Sprint 19 | ⏳ | Dashboard financiero | Estadísticas y análisis |
| Sprint 20 | ⏳ | Informes y exportación | Exportaciones solo si siguen siendo necesarias |
| Sprint 21 | ⏳ | Usuarios y roles | Login y perfiles |
| Sprint 22 | ⏳ | Panel del jefe | Consulta de jornadas y conductores |

---

# Faro estratégico

La prioridad absoluta del proyecto es validar el flujo de trabajo diario antes de incorporar nuevas funcionalidades.

Cada decisión debe responder a una única pregunta:

> **¿Esto ayuda realmente al conductor durante su jornada de trabajo?**

Si la respuesta es no, la funcionalidad no tendrá prioridad dentro del MVP.

Taxi Finance debe crecer sobre una base estable y validada en producción.

---

# Fase 1 — Beta 1.0 (Cierre del MVP)

## Objetivo

Reemplazar completamente:

- WhatsApp.
- La calculadora.
- Las anotaciones manuales.

Al finalizar esta fase el conductor deberá poder registrar una jornada completa utilizando únicamente Taxi Finance.

---

# Funcionalidades incluidas en la Beta

- Iniciar jornada.
- Registrar viajes.
- Editar viajes.
- Eliminar viajes.
- Cerrar jornada.
- Historial de jornadas.
- Detalle de jornada.
- Resumen diario.
- Tarjeta profesional para compartir.
- Copiar resumen en formato texto.

---

# Objetivos del Sprint 16

## Flujo de cierre

El cierre de jornada deberá seguir este orden:

### 1. Confirmar la fecha

Opciones:

- Hoy.
- Ayer.

---

### 2. Registrar el combustible

Introducir el importe cargado.

---

### 3. Indicar cómo corresponde esa carga

```text
( ) Toda mía

( ) Compartida 50 % con José
```

El sistema calculará automáticamente:

- Gasolina propia.
- Gasolina José.

Sin necesidad de cálculos manuales por parte del usuario.
---

## Resumen diario

El resumen de la jornada deberá mostrar únicamente la información relevante para el conductor.

```text
JORNADA

Fecha

Km inicial

Km final

Km trabajados

-----------------------

VIAJES

Hora

Medio de pago

Importe

(si existe)

Comisión

Propina

-----------------------

RESUMEN

Viajes

(E | D)

Efectivo

Datáfono

Facturación

Gasolina (solo si > 0)

Gasolina José (solo si > 0)
```

El objetivo es que el resumen pueda entenderse en pocos segundos y sirva tanto para la consulta personal como para compartirlo con terceros.

---

## Compartir resumen

Al finalizar la jornada, la aplicación generará una **tarjeta visual profesional**, optimizada para dispositivos móviles.

El usuario dispondrá de dos acciones principales:

- 📤 Compartir resumen.
- 📋 Copiar texto.

El botón **Compartir resumen** utilizará el sistema nativo del dispositivo para compartir directamente mediante cualquier aplicación compatible:

- WhatsApp.
- Telegram.
- Mail.
- Mensajes.
- Otras aplicaciones compatibles.

La tarjeta deberá mantener el mismo diseño tanto en Android como en iPhone.

El PDF deja de ser una prioridad para el MVP y pasa a ser una funcionalidad opcional para fases futuras.

---

# Reglas de negocio congeladas

Durante la Beta 1.0 estas reglas no deberán modificarse salvo decisión expresa.

- Comisión y propina se registran por viaje.
- Comisión y propina solo aparecen debajo del viaje correspondiente.
- Nunca se muestran como un total al final de la jornada.
- El efectivo mostrado en el resumen ya incluye todos los descuentos correspondientes.
- Nunca mostrar "Efectivo real".
- Nunca mostrar el total de comisiones.
- Nunca mostrar el total de propinas.
- Mostrar Gasolina únicamente cuando su importe sea mayor que cero.
- Mostrar Gasolina José únicamente cuando su importe sea mayor que cero.

---

# Home

La pantalla principal debe mostrar únicamente los indicadores necesarios durante la jornada:

- Viajes.
- Facturación.
- Efectivo.
- Datáfono.

No deberán mostrarse indicadores que no aporten valor al trabajo diario del conductor.

---

# Criterios para considerar terminada la Beta 1.0

La Beta se considerará finalizada cuando se cumplan todos los siguientes puntos:

- Se pueda registrar una jornada completa utilizando únicamente Taxi Finance.
- El flujo de cierre funcione correctamente.
- El cálculo del combustible sea correcto.
- El resumen diario sea correcto.
- El resumen pueda compartirse desde el móvil.
- No existan errores críticos.
- La aplicación haya sido utilizada durante al menos una semana completa en trabajo real.
- Toda la documentación del proyecto esté actualizada.

---

# Antes del Deploy

La Beta 1.0 está funcionalmente terminada, pero su publicación requiere una
fase específica de preparación técnica y seguridad.

Antes del primer deploy privado deberán completarse los siguientes pasos:

- Consolidar y subir todo el código y la documentación.
- Configurar la URL de la API mediante variables de entorno.
- Configurar el puerto del servidor mediante variables de entorno.
- Crear un procedimiento reproducible para crear y migrar la base de datos.
- Migrar las jornadas históricas y validar sus totales.
- Restringir CORS al dominio de producción.
- Proteger el acceso para que únicamente el conductor autorizado pueda entrar.
- Crear una copia de seguridad previa y definir respaldos automáticos.
- Utilizar una versión de Node.js compatible con Vite.
- Validar desde el móvil el flujo completo de una jornada.
- Validar compartir y guardar imágenes en el dispositivo real.

Hasta que exista autenticación o separación por usuario, Taxi Finance se
desplegará únicamente como aplicación privada para un solo conductor.

---

# Fase 2 — Estabilización

## Objetivo

Una vez publicada la Beta 1.0, el objetivo será utilizar Taxi Finance en producción y corregir únicamente los problemas detectados durante el uso real.

Durante esta fase no se desarrollarán nuevas funcionalidades importantes.

Solo se trabajará sobre:

- Corrección de errores.
- Mejoras de estabilidad.
- Mejoras de rendimiento.
- Ajustes de usabilidad.
- Pequeñas mejoras detectadas trabajando.

El objetivo es conseguir una aplicación estable y fiable antes de continuar con el desarrollo.

---

# Fase 3 — Liquidación mensual

Una vez estabilizada la Beta se desarrollará el módulo financiero mensual.

Incluirá, entre otras funcionalidades:

- Liquidación mensual.
- Efectivo a rendir.
- Base a repartir.
- Gasolina propia.
- Gasolina José.
- Nómina.
- Adelantos.
- Ganancia estimada.
- Resumen mensual.

---

# Fase 4 — Dashboard financiero

Una vez completada la liquidación mensual se desarrollará el panel de estadísticas.

Permitirá consultar:

- Facturación.
- Promedios diarios.
- Evolución mensual.
- Comparativas.
- Tendencias.
- Indicadores financieros.

---

# Fase 5 — Informes y exportación

Solo se desarrollará si continúa siendo necesario después del uso real.

Incluirá:

- Tarjetas compartibles.
- PDF diario (opcional).
- PDF mensual (opcional).
- Impresión de informes.

La prioridad seguirá siendo compartir la información de la forma más rápida posible.

---

# Fase 6 — Usuarios y roles

Cuando la aplicación esté completamente validada se añadirá soporte para múltiples usuarios.

Incluye:

- Login.
- Gestión de usuarios.
- Roles.
- Perfiles.
- Separación de datos.
- Configuración individual.

---

# Fase 7 — Panel del jefe

Permitirá consultar la información de varios conductores desde una única interfaz.

Incluye:

- Consulta de jornadas.
- Consulta de viajes.
- Seguimiento de conductores.
- Estadísticas generales.
- Gestión de la información.

---

# Fuera del alcance del MVP

Las siguientes funcionalidades no forman parte de la Beta 1.0 y no deberán desarrollarse antes de validar el flujo diario:

- Multiempresa.
- Sincronización avanzada.
- Integraciones externas.
- Facturación electrónica.
- Estadísticas complejas.
- Automatizaciones avanzadas.
- Cualquier funcionalidad que no aporte valor directo al trabajo diario del conductor.

---

# Método de trabajo

Cada sprint seguirá siempre el mismo proceso:

1. Revisar la documentación.
2. Confirmar las reglas de negocio.
3. Implementar una única funcionalidad.
4. Probar completamente.
5. Actualizar la documentación.
6. Ejecutar `git add .`
7. Ejecutar `git commit`
8. Ejecutar `git push`
9. Cerrar el sprint.

La documentación será siempre la fuente oficial del proyecto.

---

# Filosofía del producto

Taxi Finance debe permitir cerrar una jornada completa en menos de un minuto.

Cada nueva funcionalidad deberá cumplir al menos uno de estos objetivos:

- Ahorrar tiempo.
- Reducir errores.
- Facilitar la rendición de cuentas.
- Mejorar la experiencia diaria del conductor.

Si una funcionalidad no aporta alguno de estos beneficios, no tendrá prioridad dentro del MVP.

---

# Regla principal del proyecto

> **Taxi Finance debe resolver primero el trabajo diario del conductor. Solo cuando ese flujo sea estable, rápido y esté validado en producción se incorporarán nuevas funcionalidades.**

---

# Fuente de verdad

La carpeta `docs/` constituye la documentación oficial del proyecto.

En caso de contradicción entre una conversación y la documentación, prevalecerá siempre la documentación hasta que se apruebe una modificación de las reglas de negocio.

Todo cambio funcional deberá reflejarse también en la documentación correspondiente antes de cerrar el sprint.

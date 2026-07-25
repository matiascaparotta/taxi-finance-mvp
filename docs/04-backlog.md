# TaxFin — Backlog

**Versión:** 2.1

**Última actualización:** 25/07/2026

**Estado:** Beta 1.0 finalizada

---

# Objetivo

Este documento centraliza todas las funcionalidades pendientes, mejoras previstas e ideas futuras de Lic249.

Su finalidad es servir como referencia para planificar el desarrollo del proyecto, priorizar el trabajo de cada sprint y mantener una visión clara de la evolución del producto.

A diferencia del **Roadmap**, que muestra las grandes fases del proyecto, el **Backlog** contiene el detalle de las funcionalidades que pertenecen a cada una de ellas.

---

# Filosofía del Backlog

El Backlog es un documento vivo.

Las prioridades pueden cambiar a medida que el proyecto evolucione, aparezcan nuevas necesidades o la experiencia de uso permita identificar oportunidades de mejora.

No todas las funcionalidades incluidas tienen la misma prioridad.

Algunas forman parte del desarrollo inmediato, mientras que otras representan ideas o mejoras que podrán evaluarse en versiones futuras.

---

# Estado actual del proyecto

Actualmente, Lic249 ha completado el desarrollo de la **Beta 1.0**.

La aplicación ya permite gestionar una jornada completa de trabajo, registrar viajes, cerrar la jornada y consultar el historial.

Las próximas fases del desarrollo estarán orientadas principalmente a:

- estabilizar la aplicación;
- incorporar nuevas herramientas de gestión;
- ampliar las opciones de análisis;
- preparar el proyecto para soportar múltiples usuarios.

---

# ✅ Beta 1.0 (Completada)

Las siguientes funcionalidades forman parte de la primera versión funcional del proyecto.

## Gestión de jornadas

- [x] Crear jornada.
- [x] Iniciar jornada.
- [x] Cerrar jornada.
- [x] Gestión de jornada activa.
- [x] Ajuste automático para jornadas nocturnas.
- [x] Historial de jornadas.
- [x] Consulta del detalle de una jornada.
- [x] Ordenación por última jornada registrada.

---

## Gestión de viajes

- [x] Crear viaje.
- [x] Editar viaje.
- [x] Eliminar viaje.
- [x] Confirmación antes de eliminar.
- [x] Registro rápido mediante `QuickTripForm`.
- [x] Guardado directo en efectivo o datáfono.
- [x] Nota opcional.
- [x] Comisión opcional por viaje.
- [x] Propina opcional por viaje.
- [x] Confirmación visual tras guardar.
- [x] Registro consecutivo de múltiples viajes.
- [x] Recalcular automáticamente todos los totales.

---

## Resúmenes

- [x] Ticket interno de jornada.
- [x] Resumen preparado para compartir.
- [x] Copiar resumen al portapapeles.
- [x] Separación entre resumen interno y resumen compartido.

---

## Arquitectura

- [x] Arquitectura por capas.
- [x] Controllers.
- [x] Services.
- [x] Repositories.
- [x] Single Source of Truth.
- [x] Arquitectura orientada al flujo de trabajo.
- [x] Componentes reutilizables.

---

# 🚀 Próximas fases

Las siguientes funcionalidades corresponden al desarrollo posterior a la Beta 1.0.

Su prioridad se encuentra definida por el Roadmap oficial del proyecto.

---

# Sprint 17 — Estabilización

## Calidad

- [x] Prevenir acciones duplicadas por doble toque.
- [x] Recuperar las pantallas ante errores de carga.
- [x] Cargar bajo demanda el historial visible.
- [x] Compactar listas extensas de viajes.
- [x] Paginar tarjetas compartidas con muchos viajes.
- [x] Permitir guardar las tarjetas como imágenes.
- [x] Validar el kilometraje anterior antes de iniciar.
- [x] Importar y validar 70 jornadas históricas.
- [x] Configurar la URL de la API y el puerto mediante variables de entorno.
- [x] Crear el esquema y procedimiento de migración de la base de datos.
- [x] Proteger el primer deploy para un único conductor.
- [x] Restringir CORS al origen configurado para cada entorno.
- [x] Unificar frontend y API bajo el mismo sitio.
- [x] Fijar Node.js 22 para desarrollo y producción.
- [x] Elegir Railway como plataforma para la Beta privada.
- [x] Crear la configuración reproducible de Railway.
- [x] Crear los servicios reales de aplicación y MySQL en Railway.
- [x] Crear y verificar una copia de seguridad inicial.
- [x] Migrar y validar 70 jornadas y 1.203 viajes en producción.
- [x] Proteger las jornadas importadas y permitir eliminar jornadas nuevas de prueba.
- [x] Agrupar las acciones de compartir y separar la navegación al historial.
- [x] Personalizar las jornadas compartidas con la marca Lic249.
- [x] Renovar la sesión privada durante 30 días en el mismo dispositivo.
- [ ] Definir una alternativa de respaldos automáticos compatible con Railway Hobby.
- [ ] Realizar la prueba integral desde el móvil.
- [ ] Validar compartir y guardar imágenes en Android y iPhone.

---

# Sprint 18 — Base multiusuario

## Fundamentos

- [x] Definir organizaciones, usuarios, membresías y vehículos.
- [x] Preparar modalidades de combustible por conductor.
- [x] Crear un aprovisionamiento seguro e idempotente para Lic249.
- [x] Preparar la propiedad y asignación segura de jornadas existentes.
- [x] Implementar inicio de sesión individual compatible con el acceso actual.
- [x] Exigir el cambio seguro de la contraseña temporal.
- [x] Crear la organización Lic249.
- [x] Crear las cuentas individuales de Matías y José.
- [x] Ejecutar y verificar la asignación de todas las jornadas existentes a
  Matías.
- [x] Preparar la sustitución progresiva de la contraseña general por sesiones
  individuales.
- [x] Permitir el cambio seguro de la contraseña temporal.
- [x] Permitir al propietario restablecer la contraseña de un conductor.
- [x] Vincular cada jornada nueva a un conductor y un vehículo.
- [x] Aplicar continuidad del cuentakilómetros por vehículo compartido.
- [x] Permitir la misma fecha para conductores distintos.
- [x] Mantener compatibilidad durante toda la transición.
- [x] Separar la marca TaxFin de la licencia de cada organización.
- [x] Publicar las migraciones multiusuario de forma aditiva.
- [x] Verificar que el acceso legacy, la Home y el historial continúan
  funcionando después del despliegue.

---

# Sprint 19 — Panel del propietario

## Gestión de conductores

- [x] Crear, suspender y reactivar conductores.
- [x] Consultar jornadas activas de los conductores.
- [x] Visualizar y exportar jornadas ajenas en modo lectura.
- [x] Acceder al historial mediante un selector explícito de conductor.
- [x] Mantener los permisos de propietario en sesiones personales ya abiertas.
- [x] Impedir que el propietario modifique, cierre o elimine jornadas ajenas.
- [x] Separar las consultas de jornadas entre organizaciones.

---

# Sprint 20 — Liquidaciones configurables

## Gestión financiera

- [ ] Resumen mensual.
- [ ] Liquidación mensual.
- [ ] Liquidación diaria.
- [ ] Histórico mensual.
- [ ] Comparación entre meses.
- [ ] Combustible por carga real.
- [ ] Combustible por kilómetros y tarifa configurable.

---

# Sprint 21 — Dashboard

## Dashboard financiero

- [ ] Dashboard diario.
- [ ] Dashboard mensual.
- [ ] Indicadores financieros.
- [ ] Comparativas.

---

# Sprint 22 — Reportes y exportación

## Reportes

- [ ] Exportación diaria en PDF.
- [ ] Resumen mensual en PDF.
- [ ] Reporte anual.
- [ ] Mejoras en el formato de impresión.
- [ ] Nuevos formatos de exportación.

---

# 🔮 Futuro

Estas funcionalidades forman parte de la visión a largo plazo del proyecto.

No están planificadas para las próximas versiones, pero representan posibles líneas de evolución de Lic249.

## Mejoras funcionales

- [ ] Estadísticas avanzadas.
- [ ] Comparativas anuales.
- [ ] Objetivos diarios de facturación.
- [ ] Objetivos mensuales.
- [ ] Recomendaciones inteligentes.
- [ ] Análisis financiero asistido por IA.

---

## Mejoras técnicas

- [ ] Progressive Web App (PWA).
- [ ] Funcionamiento offline.
- [ ] Sincronización en la nube.
- [ ] Exportación a Excel.
- [ ] Aplicación para Android.
- [ ] Aplicación para iOS.

---

## Gestión del vehículo

- [ ] Recordatorios de mantenimiento.
- [ ] Control de gastos extraordinarios.
- [ ] Soporte para múltiples vehículos.

---

# 💡 Ideas

Las siguientes propuestas todavía no forman parte del Roadmap oficial.

Se mantienen documentadas para futuras evaluaciones.

## Personalización

- [ ] Tema claro / oscuro.
- [ ] Preferencias de usuario.
- [ ] Configuración del horario de corte de jornada.
- [ ] Configuración de métodos de pago.

---

## Productividad

- [ ] Recordatorios automáticos.
- [ ] Copias de seguridad automáticas.
- [ ] Diferentes formatos de resumen.
- [ ] Automatización de tareas repetitivas.

---

# 📋 En evaluación

Las siguientes funcionalidades están siendo analizadas y todavía no tienen una prioridad definida.

- [ ] Exportación avanzada de informes.
- [ ] Integraciones con servicios externos.
- [ ] Sincronización entre varios dispositivos.
- [ ] Funciones basadas en inteligencia artificial.
- [ ] Notificaciones inteligentes.

---

# Prioridad actual

El trabajo pendiente seguirá el orden establecido en el Roadmap oficial.

| Prioridad | Estado |
|-----------|--------|
| Sprint 18 | Base multiusuario compatible con producción |
| Sprint 19 | Panel del propietario |
| Sprint 20 | Liquidaciones configurables |
| Sprint 21 | Dashboard financiero |
| Sprint 22 | Reportes y exportación |

---

# Criterios de priorización

Las nuevas funcionalidades se incorporarán siguiendo los siguientes criterios:

1. Corregir errores detectados durante el uso real.
2. Mejorar el flujo de trabajo del conductor.
3. Reducir el tiempo necesario para realizar tareas repetitivas.
4. Mantener una arquitectura sencilla y escalable.
5. Incorporar nuevas funcionalidades únicamente cuando aporten un valor claro al usuario.

Este enfoque garantiza que Lic249 evolucione de forma sostenible, manteniendo siempre el equilibrio entre nuevas características, estabilidad y facilidad de uso.

---

# Conclusión

El Backlog representa la planificación funcional de Lic249 y complementa al Roadmap detallando las funcionalidades previstas para cada etapa del proyecto.

A diferencia del Roadmap, que define las grandes fases del desarrollo, este documento reúne el conjunto de tareas concretas que permitirán alcanzar cada uno de esos objetivos.

A medida que el proyecto evolucione, el Backlog deberá mantenerse actualizado para reflejar las nuevas prioridades, conservar una planificación clara y facilitar la organización de futuros sprints.

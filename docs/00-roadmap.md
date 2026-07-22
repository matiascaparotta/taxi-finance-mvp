# 🚖 Taxi Finance — Roadmap

## Visión

Construir una aplicación Full Stack para la gestión financiera de conductores de taxi, sustituyendo procesos manuales por una herramienta rápida, segura y profesional.

## Resumen

- Estado: 🚧 Desarrollo activo
- Sprints completados: 15
- Sprint actual: Sprint 16
- Próximo hito: Exportación PDF diaria
- Última actualización: 22/07/2026

---

# Estado del proyecto

| Sprint | Estado | Objetivo | Valor para el usuario |
|---------|--------|----------|------------------------|
| Sprint 1 | ✅ | Base del proyecto | Infraestructura inicial para comenzar el desarrollo |
| Sprint 2 | ✅ | Jornadas | Registrar jornadas de trabajo |
| Sprint 3 | ✅ | Resumen mensual | Obtener información financiera mensual |
| Sprint 4 | ✅ | CRUD de viajes | Gestionar viajes individuales |
| Sprint 5 | ✅ | Refactor de arquitectura | Mejorar mantenibilidad del sistema |
| Sprint 6 | ✅ | Resumen inteligente | Calcular automáticamente los totales |
| Sprint 7 | ✅ | Frontend React | Primera interfaz funcional |
| Sprint 8 | ✅ | Jornadas activas | Adaptar la aplicación al flujo real del conductor |
| Sprint 9 | ✅ | Registro de viajes | Registrar viajes durante la jornada |
| Sprint 10 | ✅ | Cierre de jornada | Completar el ciclo diario de trabajo |
| Sprint 11 | ✅ | Ticket de jornada | Mostrar un resumen profesional del turno |
| Sprint 12 | ✅ | Compartir resumen y mejoras UX | Compartir el cierre de jornada de forma rápida |
| Sprint 13 | ✅ | Gestión de viajes | Editar y eliminar viajes con seguridad |
| Sprint 14 | ✅ | Historial y detalle de jornadas | Consultar jornadas anteriores, ver detalle completo y copiar resumen para WhatsApp |
| Sprint 15 | ✅ | Registro rápido de viajes | Cargar viajes en menos pasos con una interfaz tipo calculadora |
| Sprint 16 | 🚧 | Exportación PDF diaria | Generar un informe profesional de una jornada cerrada |
| Sprint 17 | ⏳ | Resumen mensual y PDF mensual | Calcular liquidación mensual, efectivo a rendir y generar informe mensual |
| Sprint 18 | ⏳ | Dashboard financiero | Analizar estadísticas, promedios, rentabilidad y evolución mensual |
| Sprint 19 | ⏳ | Deploy privado estable | Publicar una versión privada para prueba real desde móvil |
| Sprint 20 | ⏳ | Usuarios y roles | Preparar login, perfiles y separación de datos por usuario |
| Sprint 21 | ⏳ | Panel de jefe | Permitir que el jefe consulte jornadas y datos de sus conductores |

---

## Faro estratégico del producto

Taxi Finance se desarrollará siguiendo una evolución progresiva, evitando agregar complejidad antes de validar el uso real.

### Principio principal

Primero se construye una herramienta útil para un conductor individual. Luego se valida en una semana real de trabajo. Después se agregan reportes, PDF, dashboard y finalmente usuarios con roles.

### Fase 1 — Herramienta individual para Matías

Objetivo: reemplazar WhatsApp, calculadora y registros manuales durante la jornada.

Incluye:

- iniciar jornada;
- cargar viajes;
- cerrar jornada;
- generar resumen diario;
- copiar resumen limpio para WhatsApp;
- consultar historial;
- ver detalle de jornadas pasadas;
- cargar viajes de forma rápida durante el turno.

Esta fase debe permitir que Matías use Taxi Finance durante una semana real de trabajo y confirme si la aplicación es cómoda, rápida y confiable.

### Fase 2 — Reportes y liquidación

Objetivo: convertir los datos diarios en información financiera útil.

Incluye:

- exportación PDF diaria;
- resumen mensual;
- PDF mensual;
- cálculo de efectivo a rendir;
- cálculo de total facturado;
- cálculo de gasolina propia;
- cálculo de gasolina José;
- cálculo de base a repartir;
- cálculo de ganancia estimada;
- dashboard financiero.

Esta fase debe servir para revisar el mes completo y reducir errores en la liquidación con el jefe.

### Fase 3 — Prueba con el jefe

Objetivo: que el jefe pueda conocer la herramienta y evaluar si también le resulta útil.

Antes del multiusuario, el jefe podría probar Taxi Finance como conductor individual, con sus propias jornadas y sus propios números.

Esto permite validar si el producto también sirve para otra persona con un flujo de trabajo similar.

### Fase 4 — Usuarios, roles y panel de jefe

Objetivo: convertir Taxi Finance en una aplicación compartida entre jefe y conductores.

Incluye:

- usuarios;
- login;
- roles;
- permisos;
- perfil de conductor;
- panel de jefe;
- datos separados por usuario;
- visualización en directo de jornadas y viajes cargados por cada conductor.

Roles previstos:

```text
DRIVER
→ carga y ve sus propios datos.

BOSS
→ ve sus propios datos y también los datos de sus conductores.

ADMIN
→ gestiona la aplicación completa.
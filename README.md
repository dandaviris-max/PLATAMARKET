# PlataMarket



## Gestión de Configuración de Software



PlataMarket es una propuesta de marketplace orientada a facilitar la comercialización directa de productos de la Red de Plataneros de Urabá.



El proyecto integra funciones de acceso diferenciado para compradores y productores, consulta y publicación de ofertas, negociación, pago en custodia, seguimiento de pedidos y notificaciones.



## Objetivo del repositorio



Este repositorio contiene los elementos necesarios para gestionar la configuración, versionado y trazabilidad del proyecto PlataMarket.



La línea base inicial del proyecto corresponde a la versión:



\*\*v1.0.0\*\*



## Catálogo de Elementos de Configuración



### 1. Programas



| Código | Elemento | Descripción |

|---|---|---|

| ECS-P01 | Acceso y roles | Gestión del acceso diferenciado entre compradores y productores. |

| ECS-P02 | Catálogo | Consulta de ofertas por variedad, ubicación, cantidad, calidad y precio. |

| ECS-P03 | Negociación | Selección de ofertas, cantidad, propuestas de precio y comunicación. |

| ECS-P04 | Pago y custodia | Confirmación del pedido, pago y retención del dinero hasta verificar la entrega. |

| ECS-P05 | Seguimiento | Estados del pedido, checkpoints, recorrido y confirmación de entrega. |

| ECS-P06 | Notificaciones | Avisos relacionados con ofertas, negociaciones, pagos y pedidos. |

| ECS-P07 | Gestión del productor | Publicación de ofertas, administración de negociaciones y consulta de ingresos/pagos. |

| ECS-P08 | Interfaces UI/UX | Pantallas correspondientes a los principales procesos de la plataforma. |



### 2. Datos



| Código | Elemento | Descripción |

|---|---|---|

| ECS-D01 | Usuarios y perfiles | Información de usuarios y diferenciación de roles. |

| ECS-D02 | Productos y ofertas | Variedad, ubicación, cantidad, calidad y precio. |

| ECS-D03 | Negociaciones | Ofertas seleccionadas, cantidades, propuestas y comunicación. |

| ECS-D04 | Pedidos | Información asociada a las compras realizadas. |

| ECS-D05 | Pagos y custodia | Información relacionada con el proceso de pago y custodia. |

| ECS-D06 | Seguimiento y estados | Estados, fechas, checkpoints, recorrido y confirmación de entrega. |

| ECS-D07 | Notificaciones | Información asociada a los avisos generados por el sistema. |

| ECS-D08 | Gestión del productor | Información sobre ofertas, pedidos, ingresos y compradores contactados. |



### 3. Documentación



| Código | Elemento | Descripción |

|---|---|---|

| ECS-DC01 | Documento de requisitos | Requerimientos funcionales, no funcionales y restricciones. |

| ECS-DC02 | Arquitectura y componentes | Organización de los módulos y componentes de PlataMarket. |

| ECS-DC03 | Prototipo UI/UX | Diseño de las interfaces de compradores y productores. |

| ECS-DC04 | Product Backlog | Historias de usuario, criterios de aceptación y prioridades. |

| ECS-DC05 | Sprint Backlog | Organización de las historias de usuario en Sprints. |

| ECS-DC06 | Manual técnico | Información para comprender y mantener el sistema. |

| ECS-DC07 | Manual de usuario | Orientación para el uso de las funcionalidades de PlataMarket. |

| ECS-DC08 | Registro de cambios | Registro de las modificaciones realizadas sobre los elementos de configuración. |



## Gestión del cambio



El cambio utilizado para demostrar el proceso de Gestión de Configuración de Software corresponde a:



\*\*OCI-001 — Ampliación del sistema de notificaciones.\*\*



El cambio consiste en ampliar las notificaciones relacionadas con las diferentes etapas del pedido, incluyendo confirmación, pago en custodia, envío, entrega y confirmación final.



### Elementos afectados



\- ECS-P05 — Seguimiento.

\- ECS-P06 — Notificaciones.

\- ECS-D06 — Seguimiento y estados.

\- ECS-D07 — Notificaciones.

\- ECS-DC01 — Documento de requisitos.

\- ECS-DC03 — Prototipo UI/UX.

\- ECS-DC04 — Product Backlog.

\- ECS-DC07 — Manual de usuario.



## Estrategia de ramas



El proyecto utiliza una estrategia basada en GitFlow:



\- `main`: versión estable del proyecto.

\- `develop`: integración de cambios.

\- `feature/notificaciones-pedido`: desarrollo del OCI-001.

\- `hotfix`: correcciones críticas de versiones estables.



## Versionamiento



Se utiliza el esquema:



\*\*MAJOR.MINOR.PATCH\*\*



Versión inicial:



\*\*v1.0.0\*\*



Versión resultante después de implementar OCI-001:



\*\*v1.1.0\*\*



## Flujo del cambio



OCI-001
   ↓
Análisis de impacto
   ↓
feature/notificaciones-pedido
   ↓
Implementación
   ↓
Pruebas
   ↓
Pull Request
   ↓
develop
   ↓
v1.1.0

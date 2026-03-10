Reportes Municipales - Coinco
Plataforma ciudadana desarrollada para la Municipalidad de Coinco, diseñada para optimizar la gestión de incidencias en la vía pública. Permite a los vecinos reportar problemas estructurales o de servicios (luminarias defectuosas, baches, microbasurales, etc.) mediante un sistema geolocalizado.

Características Principales
Interfaz Ciudadana: Formulario web optimizado para dispositivos móviles y de escritorio, que permite la carga de evidencia fotográfica, descripción detallada y marcación exacta de coordenadas mediante mapas interactivos.

Panel de Administración (/admin): Dashboard centralizado que integra un mapa satelital híbrido de alta resolución, facilitando el monitoreo territorial de las incidencias en tiempo real.

Gestión de Estados Dinámicos: Sistema de seguimiento visual en el mapa para el control de flujo de trabajo:

Pendiente: Incidencia registrada a la espera de revisión.

En Proceso: Equipo municipal notificado y trabajando en la resolución.

Resuelto: Problema solucionado y archivado.

Tecnologías Utilizadas
Framework: Next.js (React)

Estilos: Tailwind CSS

Mapas y Geolocalización: Leaflet, React-Leaflet y capas satelitales híbridas de Google Maps.

Backend as a Service (BaaS): Supabase (PostgreSQL y Storage)

Despliegue e Integración Continua: Vercel

Instrucciones de Ejecución Local
Para ejecutar este proyecto en un entorno de desarrollo local, siga los siguientes pasos:

Instalación de dependencias:

Bash

npm install
Configuración de Variables de Entorno:
Cree un archivo llamado .env.local en la raíz del proyecto con sus credenciales de Supabase.

Nota: Este archivo contiene llaves privadas y no se sincroniza con el repositorio por motivos de seguridad.

Ejecución:

Bash

npm run dev
Despliegue
Este proyecto cuenta con integración continua mediante Vercel vinculado a la rama main. Cualquier cambio subido (push) se refleja automáticamente en la versión de producción.

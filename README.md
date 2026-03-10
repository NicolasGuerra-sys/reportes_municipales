# Reportes Municipales - Coinco

Plataforma ciudadana desarrollada para la Municipalidad de Coinco, diseñada para optimizar la gestión de incidencias en la vía pública. Permite a los vecinos reportar problemas estructurales o de servicios (luminarias defectuosas, baches, microbasurales, etc.) mediante un sistema geolocalizado.

## Características Principales

* **Interfaz Ciudadana:** Formulario web optimizado para dispositivos móviles y de escritorio, que permite la carga de evidencia fotográfica, descripción detallada y marcación exacta de coordenadas mediante mapas interactivos.
* **Panel de Administración (/admin):** Dashboard centralizado que integra un mapa satelital híbrido de alta resolución, facilitando el monitoreo territorial de las incidencias en tiempo real.
* **Gestión de Estados Dinámicos:** Sistema de seguimiento visual en el mapa para el control de flujo de trabajo:
  * Pendiente: Incidencia registrada a la espera de revisión.
  * En Proceso: Equipo municipal notificado y trabajando en la resolución.
  * Resuelto: Problema solucionado y archivado.

## Tecnologías Utilizadas

* **Framework:** Next.js (React)
* **Estilos:** Tailwind CSS
* **Mapas y Geolocalización:** Leaflet, React-Leaflet y capas satelitales híbridas de Google Maps.
* **Backend as a Service (BaaS):** Supabase (PostgreSQL y Storage)
* **Despliegue e Integración Continua:** Vercel

## Instrucciones de Ejecución Local

1. **Instalación de dependencias:** `npm install`
2. **Configuración:** Crear `.env.local` con las llaves de Supabase.
3. **Ejecución:** `npm run dev`

> **Nota:** Por seguridad, las credenciales de la base de datos no se sincronizan con este repositorio.

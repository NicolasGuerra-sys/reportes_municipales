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

Para ejecutar este proyecto en un entorno de desarrollo local, siga los siguientes pasos:

1. **Instalación de dependencias:**
   Ejecute el siguiente comando en la terminal dentro del directorio raíz del proyecto:
   ```bash
   npm install
   ```

2. **Configuración de Variables de Entorno:**
   Cree un archivo llamado `.env.local` en la raíz del proyecto y defina las credenciales de conexión a la base de datos:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=su_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=su_llave_anon_de_supabase
   ```

3. **Inicialización del servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Acceso a la plataforma:**
   * Portal de ingreso de reportes: `http://localhost:3000`
   * Panel de administración: `http://localhost:3000/admin`

## Despliegue

Este repositorio cuenta con integración continua (CI/CD) mediante Vercel. Cada confirmación (`commit`) realizada sobre la rama principal (`main`) activa automáticamente una nueva construcción y despliegue en el entorno de producción.

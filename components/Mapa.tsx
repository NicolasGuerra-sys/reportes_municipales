"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// Importa la conexión a la base de datos para poder actualizar los datos
import { supabase } from "../lib/supabase";

const iconRojo = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconAzul = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconVerde = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function Mapa({ reportes }: { reportes: any[] }) {
  const centro = [-34.26, -70.95];

  // Función que actualiza el estado en Supabase
  const actualizarEstado = async (id: string, nuevoEstado: string) => {
    const { error } = await supabase
      .from("reportes")
      .update({ estado: nuevoEstado })
      .eq("id", id);

    if (error) {
      alert("Error al actualizar: " + error.message);
    } else {
      // Si funciona, recarga la página rápido para ver el color nuevo
      window.location.reload();
    }
  };

  // Función para darle color a las etiquetas (texto)
  const colorEstado = (estado: string) => {
    if (estado === 'Pendiente') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (estado === 'En proceso') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (estado === 'Resuelto') return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <MapContainer 
      center={centro as any} 
      zoom={14} 
      style={{ height: "100%", width: "100%", borderRadius: "0.5rem", zIndex: 0 }}
    >
      <TileLayer
          url="https://mt1.google.com/vt/lyrs=y&hl=es&x={x}&y={y}&z={z}"
          attribution="&copy; Google Maps"
          maxZoom={20}
      />
      
      {reportes.map((rep) => {     //colores de los iconos
        
        let pinSeleccionado = iconRojo;
        if (rep.estado === 'En proceso') pinSeleccionado = iconAzul;
        if (rep.estado === 'Resuelto') pinSeleccionado = iconVerde;

        return (
          <Marker key={rep.id} position={[rep.latitud, rep.longitud]} icon={pinSeleccionado}>
            <Popup>
              <div className="text-sm min-w-[220px]">
                <strong className="block text-base mb-1">{rep.titulo}</strong>
                <p className="text-gray-600 mb-2">{rep.descripcion}</p>
                
                <span className={`inline-block border text-xs px-2 py-1 rounded-full mb-3 ${colorEstado(rep.estado)}`}>
                  Estado actual: {rep.estado}
                </span>

                {/* botones de administrador */}
                <div className="flex flex-col gap-1 mb-3 border-t pt-2">
                  <p className="text-xs text-gray-500 font-semibold">Cambiar estado a:</p>
                  <div className="flex gap-1">
                    <button onClick={() => actualizarEstado(rep.id, 'Pendiente')} className="text-[10px] bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 text-yellow-700 px-2 py-1 rounded transition-colors">Pendiente</button>
                    <button onClick={() => actualizarEstado(rep.id, 'En proceso')} className="text-[10px] bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-2 py-1 rounded transition-colors">En proceso</button>
                    <button onClick={() => actualizarEstado(rep.id, 'Resuelto')} className="text-[10px] bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 px-2 py-1 rounded transition-colors">Resuelto</button>
                  </div>
                </div>

                {rep.foto_url && (
                  <img 
                    src={rep.foto_url} 
                    alt="Foto del problema" 
                    className="w-full h-auto rounded border border-gray-200" 
                  />
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

export default function MapaUsuario({ reportes }: { reportes: any[] }) {
  const centro = [-34.26, -70.95];

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
      
      {reportes.map((rep) => {
        let pinSeleccionado = iconRojo;
        if (rep.estado === 'En proceso') pinSeleccionado = iconAzul;
        if (rep.estado === 'Resuelto') pinSeleccionado = iconVerde;

        return (
          <Marker key={rep.id} position={[rep.latitud, rep.longitud]} icon={pinSeleccionado}>
            <Popup>
              <div className="text-sm min-w-[200px]">
                <strong className="block text-base mb-1">{rep.titulo}</strong>
                <p className="text-gray-600 mb-2">{rep.descripcion}</p>
                
                <span className={`inline-block border text-xs px-2 py-1 rounded-full ${colorEstado(rep.estado)}`}>
                  Estado: {rep.estado}
                </span>

                {rep.foto_url && (
                  <img 
                    src={rep.foto_url} 
                    alt="Evidencia" 
                    className="w-full h-auto mt-3 rounded border border-gray-200" 
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
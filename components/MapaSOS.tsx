"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { ExternalLink } from "lucide-react";

const iconSOS = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [38, 55], 
  iconAnchor: [19, 55],
});

function RecenterMap({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 18, { animate: true });
    }
  }, [coords, map]);
  return null;
}

export default function MapaSOS({ alertas, ultimaCoords }: { alertas: any[], ultimaCoords: [number, number] | null }) {
  const centroCoinco: [number, number] = [-34.26, -70.95];

  const abrirNavegacion = (lat: number, lng: number) => {
   
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  return (
    <MapContainer 
      center={centroCoinco} 
      zoom={14} 
      style={{ height: "100%", width: "100%" }}
      className="z-0" 
    >
      <TileLayer 
        url="https://mt1.google.com/vt/lyrs=y&hl=es&x={x}&y={y}&z={z}" 
        attribution="© Google Maps" 
      />
      
      <RecenterMap coords={ultimaCoords} />
      
      {alertas.filter(a => a.estado === 'Activa').map((alerta) => (
        <Marker 
          key={alerta.id} 
          position={[alerta.latitud, alerta.longitud]} 
          icon={iconSOS}
        >
          <Popup maxWidth={350} minWidth={280}>
            <div className="text-center font-sans p-3 flex flex-col items-center gap-3">
              
              <div className="flex items-center gap-2 border-b border-red-200 pb-2 w-full justify-center">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></span>
                <p className="text-red-700 font-black uppercase text-[12px] tracking-widest">
                  ¡Emergencia Activa!
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl shadow-inner w-full">
                <p className="font-bold text-slate-500 text-[10px] uppercase tracking-wider mb-1">Vecino Afectado</p>
                <p className="font-black text-slate-950 text-xl tracking-tight leading-none mb-4">
                  {alerta.vecino_nombre}
                </p>
                
                <p className="font-bold text-slate-500 text-[10px] uppercase tracking-wider mb-1">Ubicación GPS Exacta</p>
                <div className="bg-white border border-slate-200 p-3 rounded-lg flex flex-col gap-1.5 font-mono shadow-sm">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-600 uppercase text-[11px]">Latitud:</span>
                    <span className="font-bold text-blue-700">{alerta.latitud.toFixed(7)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-1.5">
                    <span className="font-bold text-slate-600 uppercase text-[11px]">Longitud:</span>
                    <span className="font-bold text-blue-700">{alerta.longitud.toFixed(7)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => abrirNavegacion(alerta.latitud, alerta.longitud)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-black py-4 px-5 rounded-xl uppercase transition-all flex items-center justify-center gap-2.5 shadow-md active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                Iniciar Navegación (Cómo llegar)
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
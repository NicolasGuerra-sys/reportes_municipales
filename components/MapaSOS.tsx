"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import { ExternalLink, AlertTriangle } from "lucide-react";

const iconSOS = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [38, 55],
  iconAnchor: [19, 55],
  popupAnchor: [0, -50] 
});

function RecenterMap({ coords, zoom = 18 }: { coords: [number, number] | null, zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, zoom, { animate: true, duration: 1 });
    }
  }, [coords, map, zoom]);
  return null;
}

export default function MapaSOS({ alertas, ultimaCoords, alertaEnFoco }: { alertas: any[], ultimaCoords: [number, number] | null, alertaEnFoco: any }) {
  const centroCoinco: [number, number] = [-34.26, -70.95];
  
  const markerRefs = useRef<{ [key: string]: L.Marker | null }>({});

  const abrirNavegacion = (lat: number, lng: number) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    if (alertaEnFoco && markerRefs.current[alertaEnFoco.id]) {
      markerRefs.current[alertaEnFoco.id]?.openPopup();
    }
  }, [alertaEnFoco]);

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
   
      <RecenterMap 
        coords={alertaEnFoco ? [alertaEnFoco.latitud, alertaEnFoco.longitud] : ultimaCoords} 
      />
      
      {alertas.filter(a => a.estado === 'Activa').map((alerta) => (
        <Marker 
          key={alerta.id} 
          position={[alerta.latitud, alerta.longitud]} 
          icon={iconSOS}
          ref={(el) => { markerRefs.current[alerta.id] = el; }} // Guardamos la referencia
        >
          <Popup maxWidth={350} minWidth={300}>
            <div className="text-center font-sans p-3 flex flex-col items-center gap-3">
              
              <div className="flex items-center gap-2 border-b border-red-200 pb-2 w-full justify-center">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></span>
                <p className="text-red-700 font-black uppercase text-[12px] tracking-widest">
                  ¡Emergencia Activa!
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl shadow-inner w-full text-center">
                <p className="font-bold text-slate-500 text-[10px] uppercase tracking-wider mb-1">Vecino Afectado</p>
                <p className="font-black text-slate-950 text-xl tracking-tight leading-none mb-3">
                  {alerta.vecino_nombre}
                </p>

                <div className="flex items-center justify-center gap-2 mb-4 bg-red-100 p-2 rounded-lg border border-red-200">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <p className="font-black text-[11px] uppercase tracking-tighter text-red-700">
                    {alerta.motivo || "Sin motivo especificado"}
                  </p>
                </div>
                
                <p className="font-bold text-slate-500 text-[10px] uppercase tracking-wider mb-1">Ubicación GPS Exacta</p>
                <div className="bg-white border border-slate-200 p-3 rounded-lg flex flex-col gap-1.5 font-mono shadow-sm text-center">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-600 uppercase text-[11px]">Lat:</span>
                    <span className="font-bold text-blue-700">{alerta.latitud.toFixed(7)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-1.5">
                    <span className="font-bold text-slate-600 uppercase text-[11px]">Long:</span>
                    <span className="font-bold text-blue-700">{alerta.longitud.toFixed(7)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => abrirNavegacion(alerta.latitud, alerta.longitud)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-[12px] font-black py-4 px-5 rounded-xl uppercase transition-all flex items-center justify-center gap-2.5 shadow-md active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                Iniciar Navegación
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
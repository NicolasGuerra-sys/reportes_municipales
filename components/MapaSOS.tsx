"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

const iconSOS = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  iconSize: [30, 46],
  iconAnchor: [15, 46],
});

function RecenterMap({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (coords) map.setView(coords, 16);
  }, [coords, map]);
  return null;
}

export default function MapaSOS({ alertas, ultimaCoords }: { alertas: any[], ultimaCoords: [number, number] | null }) {
  return (
    <MapContainer center={[-34.26, -70.95]} zoom={14} style={{ height: "100%", width: "100%" }}>
      <TileLayer url="https://mt1.google.com/vt/lyrs=y&hl=es&x={x}&y={y}&z={z}" attribution="&copy; Google Maps" />
      <RecenterMap coords={ultimaCoords} />
      {alertas.filter(a => a.estado === 'Activa').map((alerta) => (
        <Marker key={alerta.id} position={[alerta.latitud, alerta.longitud]} icon={iconSOS}>
          <Popup>
            <div className="text-center font-sans">
              <p className="text-red-600 font-black uppercase text-xs">¡Emergencia!</p>
              <p className="font-bold text-slate-900">{alerta.vecino_nombre}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
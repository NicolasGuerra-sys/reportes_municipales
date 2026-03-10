"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const IconoLupa = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-white">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607ZM10.5 7.5v6m3-3h-6" />
  </svg>
);

const nombresCategorias: { [key: string]: string } = {
  "1": "Luminarias",
  "2": "Calles y Baches",
  "3": "Basura y Microbasurales",
  "4": "Áreas Verdes"
};

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
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");

  const extraerId = (titulo: string) => {
    const match = titulo.match(/\d+$/);
    return match ? match[0] : "0";
  };

  const colorEstado = (estado: string) => {
    if (estado === 'Pendiente') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (estado === 'En proceso') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (estado === 'Resuelto') return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <>
      <MapContainer 
        center={centro as any} 
        zoom={14} 
        style={{ height: "100%", width: "100%", borderRadius: "0.5rem", zIndex: 0 }}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=y&hl=es&x={x}&y={y}&z={z}"
          attribution="&copy; Google Maps"
        />
        
        {reportes.map((rep) => {
          let pin = iconRojo;
          if (rep.estado === 'En proceso') pin = iconAzul;
          if (rep.estado === 'Resuelto') pin = iconVerde;

          const catId = rep.categoria_id ? String(rep.categoria_id) : extraerId(rep.titulo);
          const nombreCategoria = nombresCategorias[catId] || "Desconocida";

          return (
            <Marker key={rep.id} position={[rep.latitud, rep.longitud]} icon={pin}>
              <Popup>
                <div className="text-sm min-w-[260px] p-1">
                  <div className="mb-2">
                    <span className="text-slate-900 font-bold text-lg">Categoría: </span>
                    <span className="text-slate-800 text-lg">{nombreCategoria}</span>
                  </div>

                  <div className="mb-1">
                    <span className="text-slate-900 font-bold">Motivo: </span>
                    <span className="text-slate-800">{rep.descripcion}</span>
                  </div>

                  <div className="mb-3">
                    <span className="text-slate-900 font-bold">Fecha: </span>
                     <span className="text-slate-700 font-medium">
                         {rep.creado_en ? (
                         new Date(rep.creado_en).toLocaleString('es-CL', {
                             day: '2-digit',
                             month: '2-digit',
                                year: 'numeric',
                               })
                          ) : (
                        "Sin fecha"
                    )}
                    </span>
                    </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${colorEstado(rep.estado)}`}>
                      {rep.estado}
                    </span>
                  </div>
                  
                  {rep.foto_url && (
                    <div 
                      className="relative group mt-3 rounded-xl overflow-hidden cursor-zoom-in border border-slate-200 shadow-sm"
                      onClick={() => {
                        setCurrentImage(rep.foto_url);
                        setOpen(true);
                      }}
                    >
                      <img 
                        src={rep.foto_url} 
                        alt="Evidencia" 
                        className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
        
                      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <IconoLupa />
                        <span className="text-white text-xs font-bold mt-2 uppercase tracking-widest">AMPLIAR</span>
                      </div>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src: currentImage }]}
      />
    </>
  );
}
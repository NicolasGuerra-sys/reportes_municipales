"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const IconoLupa = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
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
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const iconAzul = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const iconNaranja = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const iconVioleta = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

const iconVerde = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
});

export default function MapaUsuario({ reportes }: { reportes: any[] }) {
  const centro = [-34.26, -70.95];
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const estiloSelect = {
    backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
    backgroundPosition: 'right 0.5rem center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1.2em 1.2em'
  };

  const extraerId = (titulo: string) => {
    const match = titulo.match(/\d+$/);
    return match ? match[0] : "0";
  };

  const colorEstado = (estado: string) => {
    if (estado === 'Pendiente') return 'bg-yellow-200 text-yellow-950 border-yellow-300';
    if (estado === 'En proceso') return 'bg-blue-200 text-blue-950 border-blue-300';
    if (estado === 'En proceso CGE') return 'bg-orange-200 text-orange-950 border-orange-300';
    if (estado === 'En proceso Essbio') return 'bg-purple-200 text-purple-950 border-purple-300';
    if (estado === 'Resuelto') return 'bg-green-200 text-green-950 border-green-300';
    return 'bg-gray-200 text-gray-950 border-gray-300';
  };

  const reportesFiltrados = reportes.filter((rep) => {
    const catId = extraerId(rep.titulo);
    const cumpleCat = filtroCategoria === "Todas" || catId === filtroCategoria;
    const cumpleEst = filtroEstado === "Todos" || rep.estado === filtroEstado;
    return cumpleCat && cumpleEst;
  });

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col bg-white overflow-hidden">
      <div className="bg-white px-6 py-4 border-b border-slate-100 z-[1002]">
        <h1 className="text-xl font-bold text-slate-900">Mapa de Reportes Comunitarios</h1>
        <p className="text-xs text-slate-500 font-medium">Visualiza el progreso de las solicitudes en la comuna.</p>
      </div>

      <div className="bg-slate-50 px-4 py-3 border-b flex flex-wrap gap-2 z-[1001]">
        <select 
          className="text-xs font-bold border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 appearance-none pr-8 flex-1 shadow-sm"
          style={estiloSelect}
          value={filtroCategoria}
          onChange={(e) => setFiltroCategoria(e.target.value)}
        >
          <option value="Todas" className="text-slate-900">Categorías</option>
          {Object.entries(nombresCategorias).map(([id, nombre]) => (
            <option key={id} value={id} className="text-slate-900 font-medium">{nombre}</option>
          ))}
        </select>
        <select 
          className="text-xs font-bold border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-900 appearance-none pr-8 flex-1 shadow-sm"
          style={estiloSelect}
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="Todos" className="text-slate-900">Estados</option>
          <option value="Pendiente" className="text-slate-900 font-medium">Pendiente</option>
          <option value="En proceso" className="text-slate-900 font-medium">Municipal</option>
          <option value="En proceso CGE" className="text-slate-900 font-medium">CGE</option>
          <option value="En proceso Essbio" className="text-slate-900 font-medium">Essbio</option>
          <option value="Resuelto" className="text-slate-900 font-medium">Resuelto</option>
        </select>
      </div>

      <div className="flex-grow relative h-full w-full font-sans">
        <MapContainer center={centro as any} zoom={14} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://mt1.google.com/vt/lyrs=y&hl=es&x={x}&y={y}&z={z}" attribution="&copy; Google" />
          {reportesFiltrados.map((rep) => { 
            let pin = iconRojo;
            if (rep.estado === 'En proceso') pin = iconAzul;
            if (rep.estado === 'En proceso CGE') pin = iconNaranja;
            if (rep.estado === 'En proceso Essbio') pin = iconVioleta;
            if (rep.estado === 'Resuelto') pin = iconVerde;

            return (
              <Marker key={rep.id} position={[rep.latitud, rep.longitud]} icon={pin}>
                <Popup maxWidth={280}>
                  <div className="text-sm p-1 font-sans">
                    <div className="mb-2">
                      <span className="text-slate-900 font-bold text-lg">Categoría: </span>
                      <span className="text-slate-800 text-lg">{nombresCategorias[extraerId(rep.titulo)] || "Reporte"}</span>
                    </div>
                    <div className="mb-1 text-slate-800">
                      <span className="text-slate-900 font-bold">Motivo: </span>{rep.descripcion}
                    </div>
                    <div className="mb-3 text-[13px] text-slate-700">
                      <span className="text-slate-900 font-bold">Fecha: </span>
                      {rep.creado_en ? new Date(rep.creado_en).toLocaleDateString('es-CL') : "Sin fecha"}
                    </div>
                    
                    <div className="mb-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${colorEstado(rep.estado)}`}>
                        {rep.estado}
                      </span>
                    </div>

                    {rep.foto_url && (
                      <div 
                        className="relative group mt-3 rounded-lg overflow-hidden cursor-zoom-in border border-slate-200 shadow-sm" 
                        onClick={() => { setCurrentImage(rep.foto_url); setOpen(true); }}
                      >
                        <img 
                          src={rep.foto_url} 
                          alt="Evidencia" 
                          className="w-full h-28 object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <IconoLupa />
                        </div>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
      <Lightbox open={open} close={() => setOpen(false)} slides={[{ src: currentImage }]} />
    </div>
  );
}
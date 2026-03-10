"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { supabase } from "../lib/supabase";
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
  const [open, setOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  const extraerId = (titulo: string) => {
    const match = titulo.match(/\d+$/);
    return match ? match[0] : "0";
  };

  const actualizarEstado = async (id: string, nuevoEstado: string) => {
    const { error } = await supabase
      .from("reportes")
      .update({ estado: nuevoEstado })
      .eq("id", id);

    if (error) {
      alert("Error: " + error.message);
    } else {
      window.location.reload();
    }
  };

  const colorEstado = (estado: string) => {
    if (estado === 'Pendiente') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (estado === 'En proceso') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (estado === 'Resuelto') return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const reportesFiltrados = reportes.filter((rep) => {
    const catId = extraerId(rep.titulo);
    const cumpleCat = filtroCategoria === "Todas" || catId === filtroCategoria;
    const cumpleEst = filtroEstado === "Todos" || rep.estado === filtroEstado;
    return cumpleCat && cumpleEst;
  });

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col bg-white overflow-hidden">
      <div className="bg-white px-6 py-4 flex items-center gap-6 shrink-0 border-b border-slate-100 z-[1002]">
        <img 
          src="/logom.png" 
          alt="Logo Coinco" 
          className="h-16 w-auto object-contain" 
        />
        <div className="flex flex-col">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">
            Panel de Control Municipal
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Visualización en tiempo real de problemas reportados por la comunidad.
          </p>
        </div>
      </div>

      <div className="bg-slate-50 px-6 py-3 border-b shadow-sm flex items-center gap-6 z-[1001] shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-0.5 tracking-wider">Categoría</label>
            <select 
              className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-900 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none pr-10 shadow-sm transition-all"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <option value="Todas">Todas las categorías</option>
              {Object.entries(nombresCategorias).map(([id, nombre]) => (
                <option key={id} value={id}>{nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-0.5 tracking-wider">Estado</label>
            <select 
              className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-900 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 outline-none pr-10 shadow-sm transition-all"
              style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.2em 1.2em' }}
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="Todos">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En proceso">En proceso</option>
              <option value="Resuelto">Resuelto</option>
            </select>
          </div>
        </div>

        <div className="ml-auto">
          <div className="text-xs font-bold text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            Mostrando: <span className="text-blue-600 font-black">{reportesFiltrados.length}</span> de {reportes.length}
          </div>
        </div>
      </div>

      <div className="flex-grow relative h-full w-full">
 
        <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-md border border-slate-200 hidden md:flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold text-xs">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png" className="h-4" alt="P" />
            Pendiente
          </div>
          <div className="flex items-center gap-1.5 border-l pl-4 border-slate-200 text-slate-700 font-semibold text-xs">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png" className="h-4" alt="E" />
            En proceso
          </div>
          <div className="flex items-center gap-1.5 border-l pl-4 border-slate-200 text-slate-700 font-semibold text-xs">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png" className="h-4" alt="R" />
            Resuelto
          </div>
        </div>

        <MapContainer 
          center={centro as any} 
          zoom={14} 
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
              url="https://mt1.google.com/vt/lyrs=y&hl=es&x={x}&y={y}&z={z}"
              attribution="&copy; Google Maps"
              maxZoom={20}
          />
          
          {reportesFiltrados.map((rep) => { 
            let pin = iconRojo;
            if (rep.estado === 'En proceso') pin = iconAzul;
            if (rep.estado === 'Resuelto') pin = iconVerde;

            const catId = extraerId(rep.titulo);
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
                    <div className="mb-3 text-[13px]">
                      <span className="text-slate-900 font-bold">Fecha: </span>
                      <span className="text-slate-700">
                        {rep.creado_en ? new Date(rep.creado_en).toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', }) : "Sin fecha"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${colorEstado(rep.estado)}`}>
                        {rep.estado}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Cambiar estado:</p>
                      <div className="grid grid-cols-3 gap-1">
                        <button onClick={() => actualizarEstado(rep.id, 'Pendiente')} className="text-[12px] bg-white hover:bg-yellow-50 border border-yellow-200 text-yellow-700 py-1.5 rounded shadow-sm transition-all active:scale-95">Pendiente</button>
                        <button onClick={() => actualizarEstado(rep.id, 'En proceso')} className="text-[12px] bg-white hover:bg-blue-50 border border-blue-200 text-blue-700 py-1.5 rounded shadow-sm transition-all active:scale-95">En proceso</button>
                        <button onClick={() => actualizarEstado(rep.id, 'Resuelto')} className="text-[12px] bg-white hover:bg-green-50 border border-green-200 text-green-700 py-1.5 rounded shadow-sm transition-all active:scale-95">Resuelto</button>
                      </div>
                    </div>
                    {rep.foto_url && (
                      <div 
                        className="relative group mt-2 rounded-xl overflow-hidden cursor-zoom-in border border-slate-200"
                        onClick={() => { setCurrentImage(rep.foto_url); setOpen(true); }}
                      >
                        <img 
                          src={rep.foto_url} 
                          alt="Evidencia" 
                          className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <IconoLupa />
                          <span className="text-white text-[10px] font-bold mt-1 uppercase tracking-widest">Ver Original</span>
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

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[{ src: currentImage }]}
      />
    </div>
  );
}
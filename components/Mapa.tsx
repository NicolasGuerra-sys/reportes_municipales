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

export default function Mapa({ reportes }: { reportes: any[] }) {
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

  const actualizarEstado = async (id: string, nuevoEstado: string) => {
    const { error } = await supabase.from("reportes").update({ estado: nuevoEstado }).eq("id", id);
    if (error) alert("Error: " + error.message);
    else window.location.reload();
  };

  const eliminarReporte = async (id: string) => {
    if (confirm("¿Estás seguro?")) {
      const { error } = await supabase.from("reportes").delete().eq("id", id);
      if (error) alert("Error: " + error.message);
      else window.location.reload();
    }
  };

  const limpiarFiltros = () => {
    setFiltroCategoria("Todas");
    setFiltroEstado("Todos");
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

  const hayFiltrosActivos = filtroCategoria !== "Todas" || filtroEstado !== "Todos";

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col bg-white overflow-hidden">
      <header className="shrink-0 z-[1003] bg-white px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
        <div className="flex items-center gap-6">
          <img src="/logom.png" alt="Logo" className="h-16 w-auto object-contain" />
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">Panel de Control Municipal</h1>
            <p className="text-sm text-slate-600 font-medium font-sans">Gestión interna de reportes comunitarios.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 bg-slate-100 p-2 md:px-4 rounded-lg border border-slate-200 shadow-inner font-sans">
          <div className="flex items-center gap-1.5">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png" alt="P" className="h-4 w-auto" />
            <span className="text-[10px] text-red-700 font-bold uppercase">Pendiente</span>
          </div>
          <div className="flex items-center gap-1.5 border-l pl-4 border-slate-300">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png" alt="M" className="h-4 w-auto" />
            <span className="text-[10px] text-blue-700 font-bold uppercase">Muni</span>
          </div>
          <div className="flex items-center gap-1.5 border-l pl-4 border-slate-300">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png" alt="C" className="h-4 w-auto" />
            <span className="text-[10px] text-orange-700 font-bold uppercase">CGE</span>
          </div>
          <div className="flex items-center gap-1.5 border-l pl-4 border-slate-300">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png" alt="E" className="h-4 w-auto" />
            <span className="text-[10px] text-purple-700 font-bold uppercase">Essbio</span>
          </div>
          <div className="flex items-center gap-1.5 border-l pl-4 border-slate-300">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png" alt="R" className="h-4 w-auto" />
            <span className="text-[10px] text-green-700 font-black uppercase">Resuelto</span>
          </div>
        </div>
      </header>

      <div className="shrink-0 bg-slate-50 px-6 py-3 border-b shadow-sm flex flex-wrap items-center gap-6 z-[1001] font-sans">
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Categoría</label>
          <select className="text-sm font-bold border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-slate-900 appearance-none pr-10 focus:ring-2 focus:ring-blue-500 shadow-sm" style={estiloSelect} value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
            <option value="Todas" className="text-slate-900">Todas</option>
            {Object.entries(nombresCategorias).map(([id, nombre]) => <option key={id} value={id} className="text-slate-900">{nombre}</option>)}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Estado</label>
          <select className={`text-sm font-bold border rounded-lg px-3 py-1.5 appearance-none pr-10 focus:ring-2 focus:ring-blue-500 shadow-sm ${filtroEstado !== 'Todos' ? colorEstado(filtroEstado) : 'bg-white text-slate-900 border-slate-300'}`} style={estiloSelect} value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="Todos" className="bg-white text-slate-900">Todos</option>
            <option value="Pendiente" className="bg-white text-red-700 font-bold">Pendiente</option>
            <option value="En proceso" className="bg-white text-blue-700 font-bold">Municipal</option>
            <option value="En proceso CGE" className="bg-white text-orange-700 font-bold">CGE</option>
            <option value="En proceso Essbio" className="bg-white text-purple-700 font-bold">Essbio</option>
            <option value="Resuelto" className="bg-white text-green-700 font-bold">Resuelto</option>
          </select>
        </div>

        {hayFiltrosActivos && (
          <button onClick={limpiarFiltros} className="text-[10px] font-black text-slate-500 hover:text-red-700 uppercase tracking-widest border-b-2 border-slate-300 hover:border-red-500 transition-all self-end mb-1">Limpiar Filtros</button>
        )}

        <div className="ml-auto text-xs font-bold text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm font-sans">
          Mostrando: <span className="text-blue-600 font-black">{reportesFiltrados.length}</span> de <span className="text-slate-400">{reportes.length}</span>
        </div>
      </div>

      <div className="flex-grow relative h-full w-full">
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
                <Popup maxWidth={300}>
                  <div className="text-sm p-1 max-h-[500px] overflow-y-auto custom-scrollbar font-sans">
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
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${colorEstado(rep.estado)}`}>{rep.estado}</span>
                    </div>
                    
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 mb-3">
                      <p className="text-[10px] text-slate-500 font-bold uppercase mb-1 text-center tracking-wider">Actualizar Estado:</p>
                      <div className="grid grid-cols-2 gap-1">
                        <button onClick={() => actualizarEstado(rep.id, 'Pendiente')} className="text-[10px] bg-white border border-yellow-200 text-yellow-700 py-1.5 rounded shadow-sm font-bold active:scale-95 transition-transform">Pendiente</button>
                        <button onClick={() => actualizarEstado(rep.id, 'En proceso')} className="text-[10px] bg-white border border-blue-200 text-blue-700 py-1.5 rounded shadow-sm font-bold active:scale-95 transition-transform">Muni</button>
                        <button onClick={() => actualizarEstado(rep.id, 'En proceso CGE')} className="text-[10px] bg-white border border-orange-200 text-orange-700 py-1.5 rounded shadow-sm font-bold active:scale-95 transition-transform">CGE</button>
                        <button onClick={() => actualizarEstado(rep.id, 'En proceso Essbio')} className="text-[10px] bg-white border border-purple-200 text-purple-700 py-1.5 rounded shadow-sm font-bold active:scale-95 transition-transform">Essbio</button>
                        <button onClick={() => actualizarEstado(rep.id, 'Resuelto')} className="col-span-2 text-[10px] bg-white border border-green-200 text-green-700 py-1.5 rounded font-black uppercase mt-1 shadow-sm active:scale-95 transition-transform tracking-wider">Resuelto</button>
                      </div>
                    </div>

                    {rep.foto_url && (
                      <div className="relative group mb-3 cursor-zoom-in overflow-hidden rounded-xl border border-slate-200 shadow-sm" onClick={() => { setCurrentImage(rep.foto_url); setOpen(true); }}>
                        <img src={rep.foto_url} alt="Evidencia" className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><IconoLupa /></div>
                      </div>
                    )}
                    <button onClick={() => eliminarReporte(rep.id)} className="w-full bg-slate-50 text-slate-500 border border-slate-200 text-[11px] font-bold py-2 rounded-lg uppercase hover:bg-red-600 hover:text-white hover:border-red-700 transition-all tracking-wider">Eliminar Reporte</button>
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
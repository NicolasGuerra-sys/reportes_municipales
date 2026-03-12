"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "../../lib/supabase";

const MapaUsuario = dynamic(() => import("../../components/MapaUsuario"), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full bg-slate-100 text-slate-400 font-bold">Cargando mapa...</div>
});

export default function VerReportesPage() {
  const [reportes, setReportes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarReportes = async () => {
      const { data, error } = await supabase
        .from("reportes")
        .select("*");

      if (!error) setReportes(data || []);
      setCargando(false);
    };
    cargarReportes();
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 overflow-hidden">
      <header className="shrink-0 z-[1003] p-4 bg-white border-b shadow-sm flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 leading-tight">Mapa de Reportes - Coinco</h1>
          <p className="text-xs text-slate-500 font-medium">Estado de incidencias en tiempo real.</p>
        </div>
        
        <div className="flex flex-wrap gap-x-3 gap-y-2 bg-slate-50 p-2 md:px-4 rounded-lg border border-slate-200 shadow-inner">
          <div className="flex items-center gap-1.5">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png" alt="P" className="h-4 w-auto" />
            <span className="text-[10px] md:text-xs text-slate-600 font-bold uppercase tracking-tight">Pendiente</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png" alt="M" className="h-4 w-auto" />
            <span className="text-[10px] md:text-xs text-slate-600 font-bold uppercase tracking-tight">Municipal</span>
          </div>

          <div className="flex items-center gap-1.5">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png" alt="C" className="h-4 w-auto" />
            <span className="text-[10px] md:text-xs text-slate-600 font-bold uppercase tracking-tight">CGE</span>
          </div>

          <div className="flex items-center gap-1.5">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png" alt="E" className="h-4 w-auto" />
            <span className="text-[10px] md:text-xs text-slate-600 font-bold uppercase tracking-tight">Essbio</span>
          </div>

          <div className="flex items-center gap-1.5 border-l pl-3 border-slate-300">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png" alt="R" className="h-4 w-auto" />
            <span className="text-[10px] md:text-xs text-green-700 font-black uppercase tracking-tight">Resuelto</span>
          </div>
        </div>
      </header>

      <main className="flex-1 relative w-full h-full p-4 overflow-hidden">
        {cargando ? (
          <div className="flex items-center justify-center h-full w-full bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-slate-500 text-sm font-black uppercase tracking-widest">Sincronizando reportes...</span>
            </div>
          </div>
        ) : (
          <div className="h-full w-full bg-white shadow-2xl rounded-2xl border border-slate-200 overflow-hidden relative">
            <MapaUsuario reportes={reportes} />
          </div>
        )}
      </main>
    </div>
  );
}
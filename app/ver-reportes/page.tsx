"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "../../lib/supabase";


const MapaUsuario = dynamic(() => import("../../components/MapaUsuario"), { ssr: false });

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
    <div className="flex flex-col h-screen bg-slate-50">
      <header className="p-4 bg-white border-b shadow-sm flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Mapa de Reportes - Coinco</h1>
          <p className="text-sm text-slate-500">Visualización pública de incidencias y su estado actual.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 text-sm bg-slate-50 p-2 md:px-4 rounded-lg border border-slate-200">
          <div className="flex items-center gap-1.5">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png" alt="Pendiente" className="h-5 w-auto" />
            <span className="text-slate-700 font-medium">Pendiente</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png" alt="En proceso" className="h-5 w-auto" />
            <span className="text-slate-700 font-medium">En proceso</span>
          </div>

          <div className="flex items-center gap-1.5">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png" alt="Resuelto" className="h-5 w-auto" />
            <span className="text-slate-700 font-medium">Resuelto</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4">
        {cargando ? (
          <div className="flex items-center justify-center h-full">Cargando mapa...</div>
        ) : (
          <div className="h-full border-2 border-white shadow-lg rounded-xl overflow-hidden">
            <MapaUsuario reportes={reportes} />
          </div>
        )}
      </main>
    </div>
  );
}
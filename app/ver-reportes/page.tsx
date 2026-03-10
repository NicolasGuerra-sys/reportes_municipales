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
      <header className="p-4 bg-white border-b shadow-sm">
        <h1 className="text-xl font-bold text-slate-800">Mapa de Reportes - Coinco</h1>
        <p className="text-sm text-slate-500">Visualización pública de incidencias y su estado actual.</p>
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
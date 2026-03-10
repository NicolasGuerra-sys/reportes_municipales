"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "../../lib/supabase";

const Mapa = dynamic(() => import("../../components/Mapa"), { ssr: false });

export default function AdminDashboard() {
  const [reportes, setReportes] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarReportes = async () => {
      const { data, error } = await supabase
        .from("reportes")
        .select("*");

      if (error) {
        console.error("Error cargando reportes:", error);
      } else {
        setReportes(data || []);
      }
      setCargando(false);
    };
    
    cargarReportes();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 p-8 flex flex-col font-sans">
    
      {/* contenedor principal para anclar el mapa */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative min-h-[600px]">
        {cargando ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-slate-500 text-lg animate-pulse">Cargando mapa y datos territoriales...</p>
          </div>
        ) : (
          <div className="absolute inset-0">
            <Mapa reportes={reportes} />
          </div>
        )}
      </div>
    </div>
  );
}
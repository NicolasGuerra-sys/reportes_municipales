"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";

const MapaSOS = dynamic(() => import("@/components/MapaSOS"), { ssr: false });

export default function MonitorSOS() {
  const [alertas, setAlertas] = useState<any[]>([]);
  const [ultimaCoords, setUltimaCoords] = useState<[number, number] | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchAlertas();

    const channel = supabase
      .channel('alertas-reales')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'alertas' }, 
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            if (payload.new.estado === 'Activa') {
              setUltimaCoords([payload.new.latitud, payload.new.longitud]);
              
              if (payload.eventType === 'INSERT' && audioRef.current) {
                audioRef.current.play().catch(() => {});
              }
            }
          }
          fetchAlertas();
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchAlertas = async () => {
    const { data, error } = await supabase
      .from("alertas")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setAlertas(data || []);
      const activa = data?.find(a => a.estado === 'Activa');
      if (activa && !ultimaCoords) {
        setUltimaCoords([activa.latitud, activa.longitud]);
      }
    }
  };

  const atenderAlerta = async (id: string) => {
    await supabase.from("alertas").update({ estado: 'Atendida' }).eq("id", id);
    fetchAlertas();
  };

  return (
    <div className="flex h-screen bg-slate-950 font-sans overflow-hidden text-white">
      <audio ref={audioRef} src="/warning.mpeg" preload="auto" />

      <aside className="w-96 border-r border-slate-800 flex flex-col bg-slate-900 shadow-2xl z-10">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <h2 className="text-2xl font-black tracking-tighter uppercase text-white">Central SOS</h2>
          <div className="flex items-center gap-2 mt-1 text-red-500">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Monitoreo en Vivo</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {alertas.filter(a => a.estado === 'Activa').map((alerta) => (
            <div key={alerta.id} className="p-5 rounded-2xl border-2 border-red-500 bg-red-950/20 shadow-lg animate-pulse">
              <div className="flex justify-between items-start mb-2">
                <p className="font-black text-sm uppercase">{alerta.vecino_nombre || "Anónimo"}</p>
                <span className="text-[9px] bg-red-600 text-white px-2 py-0.5 rounded-full font-black">NUEVA</span>
              </div>
              <p className="text-slate-400 text-[10px] font-bold mb-4 italic">
                {new Date(alerta.created_at).toLocaleTimeString()}
              </p>
              <button 
                onClick={() => atenderAlerta(alerta.id)}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-black py-3 rounded-xl uppercase transition-all shadow-md active:scale-95"
              >
                Marcar como Atendida
              </button>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 relative">
        <MapaSOS alertas={alertas} ultimaCoords={ultimaCoords} />
      </main>
    </div>
  );
}
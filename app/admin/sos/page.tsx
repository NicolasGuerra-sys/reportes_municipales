"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle } from "lucide-react";

const MapaSOS = dynamic(() => import("@/components/MapaSOS"), { ssr: false });

export default function MonitorSOS() {
  const [alertas, setAlertas] = useState<any[]>([]);
  const [ultimaCoords, setUltimaCoords] = useState<[number, number] | null>(null);
  const [alertaEnFoco, setAlertaEnFoco] = useState<any>(null); 
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

useEffect(() => {
  if ('wakeLock' in navigator) {
    const requestWakeLock = async () => {
      try {
        await (navigator as any).wakeLock.request('screen');
      } catch (err) {
        console.log("No se pudo bloquear el apagado de pantalla");
      }
    };
    requestWakeLock();
  }
}, []);

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
    if (alertaEnFoco?.id === id) setAlertaEnFoco(null); // Limpiar foco si se atiende
    fetchAlertas();
  };

  return (
    <div className="flex h-screen bg-slate-950 font-sans overflow-hidden text-white relative">
      <audio ref={audioRef} src="/warning.mpeg" preload="auto" />

      <aside className="w-96 border-r border-slate-800 flex flex-col bg-slate-900 shadow-2xl z-20 relative">
        <div className="p-0 border-b border-slate-800 bg-white">
          <div className="w-full flex justify-center p-6">
            <Image 
              src="/logom.png" 
              alt="Logo Ilustre Municipalidad de Coinco"
              width={240}
              height={140}
              quality={100}
              priority
              className="object-contain"
            />
          </div>
          
          <div className="p-6 pt-0 text-center bg-slate-900/100">
            <br />
            <h2 className="text-2xl font-black tracking-tighter text-white leading-none">Central SOS</h2>
            <div className="flex items-center justify-center gap-2 mt-2 text-red-500">
              <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
              <p className="text-[15px] font-black tracking-[0.2em]">Monitoreo en Vivo</p>
            </div>
          </div>
        </div>
     
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {alertas.filter(a => a.estado === 'Activa').map((alerta) => (
            <div 
              key={alerta.id} 
              onClick={() => setAlertaEnFoco(alerta)} 
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer hover:scale-[1.02] active:scale-95 shadow-lg ${
                alertaEnFoco?.id === alerta.id 
                ? "border-blue-500 bg-blue-900/40 animate-none scale-[1.02]" 
                : "border-red-500 bg-red-950/20 animate-pulse"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <p className="font-black text-sm uppercase text-white">{alerta.vecino_nombre || "Anónimo"}</p>
                <span className="text-[9px] bg-red-600 text-white px-2 py-0.5 rounded-full font-black">NUEVA</span>
              </div>
              
              <div className="flex items-center gap-2 my-3 bg-red-600/30 p-2 rounded-lg border border-red-500/50">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="font-black text-[11px] uppercase tracking-tighter text-red-200">
                  Motivo: {alerta.motivo || "No especificado"}
                </p>
              </div>

              <p className="text-slate-400 text-[10px] font-bold mb-4 italic">
                {new Date(alerta.created_at).toLocaleTimeString()}
              </p>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation(); 
                  atenderAlerta(alerta.id);
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-black py-3 rounded-xl uppercase transition-all shadow-md active:scale-95"
              >
                Marcar como Atendida
              </button>
            </div>
          ))}
        </div>
      </aside>

      <main className="flex-1 relative z-10">
     
        <MapaSOS alertas={alertas} ultimaCoords={ultimaCoords} alertaEnFoco={alertaEnFoco} />
      </main>

      <button 
        onClick={() => router.push("/admin")} 
        className="absolute bottom-6 right-6 z-30 flex items-center gap-2.5 text-slate-900 font-extrabold text-[12px] uppercase hover:text-red-600 transition-colors tracking-widest p-4 px-6 bg-white rounded-full border border-slate-200 shadow-xl hover:shadow-2xl active:scale-95"
      >
        <ArrowLeft className="w-5 h-5 text-red-600" /> Volver al Panel Principal
      </button>

    </div>
  );
}
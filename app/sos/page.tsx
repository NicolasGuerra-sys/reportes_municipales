"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function PaginaSOS() {
  const [estado, setEstado] = useState<"reposo" | "enviando" | "exito">("reposo");
  const [error, setError] = useState<string | null>(null);

  const enviarSOS = () => {
    setEstado("enviando");
    setError(null);

    if (!navigator.geolocation) {
      setError("Tu dispositivo no permite compartir ubicación.");
      setEstado("reposo");
      return;
    }

    const opciones = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { error: dbError } = await supabase.from("alertas").insert({
          vecino_nombre: "Vecino de Coinco",
          vecino_telefono: "Sin especificar",
          latitud: pos.coords.latitude,
          longitud: pos.coords.longitude,
          tipo_emergencia: "Botón SOS Web",
          estado: "Activa",
        });

        if (dbError) {
          setError("Error de conexión: " + dbError.message);
          setEstado("reposo");
        } else {
          setEstado("exito");
          if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 500]);
        }
      },
      (err) => {
        setError("No pudimos obtener tu ubicación. Revisa los permisos.");
        setEstado("reposo");
      },
      opciones
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-between p-8 font-sans">
      
      <div className="flex flex-col items-center mt-4">
        <div className="mb-4">
          <Image 
            src="/protegido.png" 
            alt="Logo Municipalidad" 
            width={300} 
            height={200} 
            priority
            className="object-contain"
          />
        </div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <h1 className="text-white text-2xl font-black uppercase tracking-tighter text-center">
            Coinco Protegido
          </h1>
        </div>
        <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] text-center">
          Central de Emergencias
        </p>
      </div>

      <div className="relative flex items-center justify-center">
        {estado === "reposo" && (
          <>
            <div className="absolute w-80 h-80 bg-red-600/20 rounded-full animate-ping"></div>
            <button
              onClick={enviarSOS}
              className="relative w-64 h-64 bg-red-600 border-[12px] border-red-500 rounded-full shadow-[0_0_80px_rgba(220,38,38,0.4)] active:scale-90 transition-all flex flex-col items-center justify-center group"
            >
              <span className="text-white text-7xl font-black tracking-tighter mb-1">SOS</span>
              <span className="text-red-200 text-[10px] font-black uppercase tracking-widest opacity-80 group-active:opacity-100">Presionar</span>
            </button>
          </>
        )}

        {estado === "enviando" && (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 border-8 border-slate-800 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <p className="text-white font-black uppercase tracking-widest text-sm italic">Localizando...</p>
          </div>
        )}

        {estado === "exito" && (
          <div className="text-center animate-in zoom-in duration-300">
            <div className="w-64 h-64 bg-green-600 rounded-full flex flex-col items-center justify-center shadow-[0_0_60px_rgba(22,163,74,0.4)]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-24 h-24 text-white mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <p className="text-white font-black uppercase text-xl tracking-tighter leading-none">Ayuda en<br/>camino</p>
            </div>
            <button 
              onClick={() => setEstado("reposo")} 
              className="mt-12 text-slate-500 font-black text-xs uppercase underline tracking-widest"
            >
              Cancelar / Volver
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-xs">
        {error && (
          <div className="bg-red-950/50 border border-red-800 p-4 rounded-2xl mb-6">
            <p className="text-red-400 text-[11px] font-bold text-center leading-tight">{error}</p>
          </div>
        )}
        
        <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 shadow-inner">
          <p className="text-slate-500 text-[9px] font-black uppercase text-center leading-relaxed">
            Esta alerta envía tu posición GPS exacta a la central de seguridad pública de Coinco.
          </p>
        </div>
      </div>
    </div>
  );
}
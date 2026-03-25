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
    <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-between p-6 font-sans overflow-hidden">
      
      <div className="flex flex-col items-center mt-2 w-full">
        <div className="relative w-32 h-32 md:w-40 md:h-40 mb-2">
          <Image 
            src="/protegido.png" 
            alt="Logo Municipalidad" 
            fill
            priority
            className="object-contain"
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <h1 className="text-white text-xl md:text-2xl font-black uppercase tracking-tighter">
            Coinco Protegido
          </h1>
        </div>
        <p className="text-slate-500 font-bold text-[9px] uppercase tracking-[0.3em]">
          Central de Emergencias
        </p>
      </div>

      <div className="relative flex items-center justify-center w-full">
        {estado === "reposo" && (
          <>
            <div className="absolute w-64 h-64 md:w-80 md:h-80 bg-red-600/20 rounded-full animate-ping"></div>
            <button
              onClick={enviarSOS}
              className="relative w-56 h-56 md:w-64 md:h-64 bg-red-600 border-[10px] border-red-500 rounded-full shadow-[0_0_50px_rgba(220,38,38,0.4)] active:scale-95 transition-all flex flex-col items-center justify-center group"
            >
              <span className="text-white text-6xl md:text-7xl font-black tracking-tighter">SOS</span>
              <span className="text-red-200 text-[10px] font-black uppercase tracking-widest opacity-80">Presionar</span>
            </button>
          </>
        )}

        {estado === "enviando" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-slate-800 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <p className="text-white font-black uppercase tracking-widest text-xs italic">Localizando...</p>
          </div>
        )}

        {estado === "exito" && (
          <div className="text-center animate-in zoom-in duration-300">
            <div className="w-56 h-56 md:w-64 md:h-64 bg-green-600 rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(22,163,74,0.4)]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={4} stroke="currentColor" className="w-16 h-16 text-white mb-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
              <p className="text-white font-black uppercase text-lg tracking-tighter leading-none text-center">Ayuda en<br/>camino</p>
            </div>
            <button 
              onClick={() => setEstado("reposo")} 
              className="mt-8 text-slate-500 font-black text-[10px] uppercase underline tracking-widest"
            >
              Volver
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-xs mb-4">
        {error && (
          <div className="bg-red-950/50 border border-red-800 p-3 rounded-xl mb-4">
            <p className="text-red-400 text-[10px] font-bold text-center leading-tight">{error}</p>
          </div>
        )}
        
        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/50 backdrop-blur-sm">
          <p className="text-slate-500 text-[8px] font-black uppercase text-center leading-tight">
            ESTA ALERTA ENVÍA TU POSICIÓN GPS EXACTA A LA CENTRAL DE SEGURIDAD PÚBLICA DE COINCO.
          </p>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function PaginaSOS() {
  const [estado, setEstado] = useState<"reposo" | "enviando" | "exito">("reposo");
  const [error, setError] = useState<string | null>(null);
  const watchId = useRef<number | null>(null);

  const detenerRastreo = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  };

  const enviarSOS = () => {
    setEstado("enviando");
    setError(null);

    if (!navigator.geolocation) {
      setError("GPS no soportado.");
      setEstado("reposo");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        const { error: dbError } = await supabase.from("alertas").insert({
          vecino_nombre: "Vecino de Coinco",
          latitud: latitude,
          longitud: longitude,
          tipo_emergencia: "SOS Inicial",
          estado: "Activa"
        });

        if (dbError) {
          setError("Error de conexión.");
          setEstado("reposo");
          return;
        }

        setEstado("exito");
        if (navigator.vibrate) navigator.vibrate([200, 100, 200]);

        watchId.current = navigator.geolocation.watchPosition(
          async (newPos) => {
            await supabase.from("alertas").upsert({
              vecino_nombre: "Vecino de Coinco",
              latitud: newPos.coords.latitude,
              longitud: newPos.coords.longitude,
              tipo_emergencia: "SOS Realtime",
              estado: "Activa"
            }, { onConflict: 'vecino_nombre' });
          },
          null,
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
        );
      },
      (err) => {
        setError("Por favor, activa el GPS.");
        setEstado("reposo");
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  useEffect(() => {
    return () => detenerRastreo();
  }, []);

  return (
    <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-between p-6 font-sans overflow-hidden">
      
      <div className="flex flex-col items-center mt-2 w-full">
        <div className="relative w-32 h-32 mb-2">
          <Image src="/protegido.png" alt="Logo" fill priority className="object-contain" />
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <h1 className="text-white text-xl font-black uppercase tracking-tighter">Coinco Protegido</h1>
        </div>
         <p className="text-slate-500 font-bold text-[12px] uppercase tracking-[0.3em]">
          Central de Emergencias
        </p>
      </div>

      <div className="relative flex items-center justify-center w-full">
        {estado === "reposo" && (
          <button
            onClick={enviarSOS}
            className="relative w-56 h-56 bg-red-600 border-[10px] border-red-500 rounded-full shadow-[0_0_50px_rgba(220,38,38,0.4)] active:scale-95 transition-all flex flex-col items-center justify-center group"
          >
            <span className="text-white text-6xl font-black">SOS</span>
          </button>
        )}

        {estado === "enviando" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-slate-800 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <p className="text-white font-black uppercase text-xs italic">Ubicando...</p>
          </div>
        )}

        {estado === "exito" && (
          <div className="text-center animate-in zoom-in duration-300">
            <div className="w-56 h-56 bg-green-600 rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(22,163,74,0.4)]">
              <p className="text-white font-black uppercase text-center leading-none text-xl">Ubicación<br/>compartida</p>
            </div>
            <button 
              onClick={() => { setEstado("reposo"); detenerRastreo(); }} 
              className="mt-8 text-slate-500 font-black text-[10px] uppercase underline"
            >
              Terminar Emergencia
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-xs mb-4 text-center">
        {error && (
          <div className="bg-red-900/50 border border-red-500/50 p-2 rounded-lg mb-2">
            <p className="text-red-200 text-[10px] font-bold uppercase">{error}</p>
          </div>
        )}
        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/50">
          <p className="text-slate-500 text-[8px] font-black uppercase tracking-tighter leading-tight">
            {estado === "exito" ? "TU POSICIÓN SE ESTÁ ACTUALIZANDO EN VIVO" : "ESTA ALERTA ENVÍA TU POSICIÓN GPS A SEGURIDAD PÚBLICA"}
          </p>
        </div>
      </div>
    </div>
  );
}
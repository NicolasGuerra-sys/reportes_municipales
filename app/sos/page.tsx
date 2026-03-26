"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

const MOTIVOS = [
  { id: "asalto", label: "Asalto / Robo" },
  { id: "pelea", label: "Pelea / Riña" },
  { id: "sospechoso", label: "Persona Sospechosa" },
  { id: "ruidos", label: "Ruidos Molestos / Fiesta" },
  { id: "accidente", label: "Accidente Vehicular" },
  { id: "otro", label: "Otro / Emergencia General" },
];

export default function PaginaSOS() {
  const [estado, setEstado] = useState<"reposo" | "enviando" | "exito">("reposo");
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const watchId = useRef<number | null>(null);

  const detenerRastreo = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  };

  const obtenerUbicacionConReintentos = (intentos = 0) => {
    const opciones = {
      enableHighAccuracy: intentos > 0, 
      timeout: 6000, 
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      async (pos) => {

        const { error: dbError } = await supabase.from("alertas").upsert({
          vecino_nombre: "Vecino de Coinco",
          latitud: pos.coords.latitude,
          longitud: pos.coords.longitude,
          motivo: motivo,
          tipo_emergencia: "Boton SOS Web",
          estado: "Activa"
        }, { onConflict: 'vecino_nombre' });

        if (!dbError) {
          setEstado("exito");
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
          
          activarRastreoFino();
        }
      },
      (err) => {
      
        if (intentos < 3) {
          console.log(`Reintentando obtener GPS... intento ${intentos + 1}`);
          obtenerUbicacionConReintentos(intentos + 1);
        } else {
          setError("El GPS no responde. Por favor, asegúrate de estar al aire libre o cerca de una ventana.");
          setEstado("reposo");
        }
      },
      opciones
    );
  };

  const activarRastreoFino = () => {
    watchId.current = navigator.geolocation.watchPosition(
      async (newPos) => {
        await supabase.from("alertas").upsert({
          vecino_nombre: "Vecino de Coinco",
          latitud: newPos.coords.latitude,
          longitud: newPos.coords.longitude,
          motivo: motivo,
          tipo_emergencia: "SOS Realtime",
          estado: "Activa"
        }, { onConflict: 'vecino_nombre' });
      },
      null,
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  const enviarSOS = () => {
    if (!motivo) {
      setError("Selecciona un motivo");
      return;
    }
    setEstado("enviando");
    setError(null);
    obtenerUbicacionConReintentos(0);
  };

  useEffect(() => {
    return () => detenerRastreo();
  }, []);

  return (
    <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-between p-6 font-sans overflow-hidden text-white">
      
      <div className="flex flex-col items-center mt-2 w-full">
        <div className="relative w-28 h-28 mb-2">
          <Image src="/protegido.png" alt="Logo" fill priority className="object-contain" />
        </div>
        <h1 className="text-xl font-black uppercase tracking-tighter">Coinco Protegido</h1>
      </div>

      <div className="relative flex flex-col items-center justify-center w-full gap-8">
        {estado === "reposo" && (
          <div className="w-full max-w-xs text-center">
            <label className="block text-[18px] font-black uppercase tracking-widest text-slate-500 mb-2">
              Motivo de la emergencia:
            </label>
            <select 
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full bg-slate-900 border-2 border-slate-800 p-4 rounded-2xl text-sm font-bold text-white outline-none focus:border-red-500 transition-all appearance-none text-center mb-8 shadow-2xl"
            >
              <option value="" disabled>Seleccione motivo de su emergencia</option>
              {MOTIVOS.map((m) => (
                <option key={m.id} value={m.label}>{m.label}</option>
              ))}
            </select>

            <div className="relative flex items-center justify-center">
              {motivo && <div className="absolute w-64 h-64 bg-red-600/20 rounded-full animate-ping"></div>}
              <button
                onClick={enviarSOS}
                disabled={!motivo}
                className={`relative w-56 h-56 rounded-full border-[10px] transition-all flex flex-col items-center justify-center ${
                  motivo ? "bg-red-600 border-red-500 active:scale-95" : "bg-slate-800 border-slate-700 opacity-50"
                }`}
              >
                <span className="text-6xl font-black tracking-tighter">SOS</span>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Presionar</span>
              </button>
            </div>
          </div>
        )}

        {estado === "enviando" && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-slate-800 border-t-red-600 rounded-full animate-spin mb-4"></div>
            <p className="font-black uppercase text-xs italic tracking-widest animate-pulse">Buscando Señal GPS...</p>
          </div>
        )}

        {estado === "exito" && (
          <div className="text-center">
            <div className="w-56 h-56 bg-green-600 rounded-full flex flex-col items-center justify-center shadow-2xl">
              <p className="font-black uppercase text-center leading-none text-xl tracking-tighter">Ayuda en<br/>camino</p>
            </div>
            <button 
              onClick={() => { setEstado("reposo"); setMotivo(""); detenerRastreo(); }} 
              className="mt-8 text-slate-500 font-black text-[10px] uppercase underline tracking-widest"
            >
              Cancelar Alerta
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-xs mb-4">
        {error && (
          <p className="text-red-500 text-[10px] font-black uppercase text-center mb-2 animate-bounce">{error}</p>
        )}
        <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/50 backdrop-blur-sm">
          <p className="text-slate-500 text-[12px] font-black uppercase text-center leading-tight">
            ESTA ALERTA ENVIA TU POSICION GPS EXACTA A SEGURIDAD PÚBLICA DEL MUNICIPIO.
          </p>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
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
  const [error, setError] = useState("");

  const enviarSOS = () => {
    if (!motivo) {
      setError("Selecciona un motivo primero.");
      return;
    }

    setEstado("enviando");
    setError("");

    if (!navigator.geolocation) {
      setError("GPS no soportado en este equipo.");
      setEstado("reposo");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
       
          const { error: dbError } = await supabase.from("alertas").insert({
            vecino_nombre: "Vecino de Coinco",
            latitud: position.coords.latitude,
            longitud: position.coords.longitude,
            motivo: motivo,
            tipo_emergencia: "Botón SOS Web",
            estado: "Activa"
          });

          if (dbError) {
            setError(`Error de BD: ${dbError.message}`);
            setEstado("reposo");
            return;
          }

          setEstado("exito");
          if (navigator.vibrate) navigator.vibrate([300, 100, 300]);
        } catch (err) {
          setError("Error crítico de red.");
          setEstado("reposo");
        }
      },
      (err) => {
        setError("Error de GPS: Activa tu ubicación.");
        setEstado("reposo");
      },
      { 
        enableHighAccuracy: false, 
        timeout: 10000, 
        maximumAge: 0 
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-[#020617] flex flex-col items-center justify-between p-6 font-sans overflow-hidden text-white">
      <div className="flex flex-col items-center mt-2 w-full text-center">
        <div className="relative w-28 h-28 mb-2">
          <Image src="/protegido.png" alt="Logo" fill priority className="object-contain" />
        </div>
        <h1 className="text-xl font-black uppercase tracking-tighter">Coinco Protegido</h1>
      </div>

      <div className="relative flex flex-col items-center justify-center w-full gap-8">
        {estado === "reposo" && (
          <div className="w-full max-w-xs text-center">
            <label className="block text-[14px] font-black uppercase tracking-widest text-slate-500 mb-2">
              Motivo de la emergencia:
            </label>
            <select 
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="w-full bg-slate-900 border-2 border-slate-800 p-4 rounded-2xl text-sm font-bold text-white outline-none focus:border-red-500 transition-all text-center mb-10 appearance-none shadow-2xl"
            >
              <option value="" disabled>Seleccione una categoría</option>
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
                  motivo ? "bg-red-600 border-red-500 active:scale-95 shadow-[0_0_50px_rgba(220,38,38,0.3)]" : "bg-slate-800 border-slate-700 opacity-50"
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
            <p className="font-black uppercase text-xs italic tracking-widest animate-pulse">Conectando con la central...</p>
          </div>
        )}

        {estado === "exito" && (
          <div className="text-center animate-in zoom-in duration-300">
            <div className="w-64 h-64 bg-green-600 rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(22,163,74,0.3)]">
              <p className="font-black uppercase text-center leading-none text-xl tracking-tighter">¡Alerta enviada!<br/>Ayuda en camino</p>
            </div>
            <button 
              onClick={() => { setEstado("reposo"); setMotivo(""); }} 
              className="mt-8 text-slate-500 font-black text-[10px] uppercase underline tracking-widest"
            >
              Cerrar y Volver
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-xs mb-4">
        {error && (
          <div className="bg-red-900/50 border border-red-500 p-3 rounded-xl mb-4 text-center">
            <p className="text-red-200 text-[10px] font-black uppercase tracking-tight">{error}</p>
          </div>
        )}
        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/50 backdrop-blur-sm shadow-inner">
          <p className="text-slate-500 text-[11px] font-black uppercase text-center leading-tight">
            ESTA ALERTA ENVIA TU POSICION GPS A SEGURIDAD MUNICIPAL.
          </p>
        </div>
      </div>
    </div>
  );
}
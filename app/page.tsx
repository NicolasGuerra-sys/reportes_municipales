"use client";

import { useState } from "react";
import { MapPin, Camera, Send, CheckCircle2, ChevronDown } from "lucide-react";
import { supabase } from "../lib/supabase"; 

export default function Home() {
  const [ubicacion, setUbicacion] = useState<{ lat: number; lng: number } | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  const obtenerUbicacion = () => {
    setCargando(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Tu navegador no soporta la geolocalización.");
      setCargando(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUbicacion({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setCargando(false);
      },
      (err) => {
        setError("No pudimos obtener tu ubicación. Por favor, permite el acceso al GPS.");
        setCargando(false);
      }
    );
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ubicacion || !categoria || !descripcion || !foto) {
      setError("Por favor completa todos los campos y adjunta una foto.");
      return;
    }

    setEnviando(true);
    setError("");

    try {
      const extension = foto.name.split('.').pop();
      const nombreArchivo = `${Math.random()}.${extension}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('fotos_reportes')
        .upload(nombreArchivo, foto);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('fotos_reportes')
        .getPublicUrl(nombreArchivo);

      const fotoUrl = publicUrlData.publicUrl;

      const { error: dbError } = await supabase
        .from('reportes')
        .insert([
          {
            titulo: `Reporte de problema - Categoría ${categoria}`,
            descripcion: descripcion,
            latitud: ubicacion.lat,
            longitud: ubicacion.lng,
            foto_url: fotoUrl,
            categoria_id: parseInt(categoria),
            estado: 'Pendiente'
          }
        ]);

      if (dbError) throw dbError;

      setExito(true);
    } catch (err) {
      console.error(err);
      setError("Hubo un error al enviar el reporte. Intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  if (exito) {
    return (
      <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center font-sans relative overflow-hidden">
     
        <div className="absolute inset-0 z-0 opacity-20 bg-[url('/logomuni.png')] bg-center bg-no-repeat bg-contain m-8"></div>
        
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center space-y-4 relative z-10">
          <CheckCircle2 size={60} className="text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800">¡Reporte Enviado!</h2>
          <p className="text-gray-500">Gracias por ayudarnos a mejorar la comuna. Nuestro equipo revisará el problema pronto.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl w-full"
          >
            Hacer otro reporte
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center justify-center font-sans relative overflow-hidden">
      
    
      <div className="absolute inset-0 z-0 opacity-50 bg-[url('/logomuni.png')] bg-center bg-no-repeat bg-contain m-4 md:m-16 pointer-events-none"></div>

     
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center relative z-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Reportes Municipales</h1>
        <p className="text-gray-500 mb-6">Ayúdanos a mejorar nuestra comuna reportando problemas en la vía pública.</p>

        {!ubicacion ? (
          <div className="space-y-4">
            <button
              onClick={obtenerUbicacion}
              disabled={cargando}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <MapPin size={20} /> 
              {cargando ? "Buscando ubicación..." : "Mostrar mi ubicación"}
            </button>
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}
          </div>
        ) : (
          <form onSubmit={manejarEnvio} className="text-left space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800 text-sm font-medium">
              <MapPin size={18} className="text-green-600" /> ¡Ubicación capturada con éxito!
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Categoría del problema</label>
              <div className="relative">
                <select required value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900 appearance-none cursor-pointer">
                  <option value="">Selecciona una opción...</option>
                  <option value="1">Luminarias</option>
                  <option value="2">Calles y Baches</option>
                  <option value="3">Basura y Microbasurales</option>
                  <option value="4">Áreas Verdes</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción breve</label>
              <textarea required value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Ej: Hay un foco apagado frente al paradero..." className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24 text-gray-900 placeholder-gray-400" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Foto del problema</label>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                  <Camera className="mb-2 text-gray-400" size={32} />
                  <p className="text-sm font-semibold text-center px-2 text-gray-700">
                    {foto ? foto.name : "Toca aquí para tomar foto o subir imagen"}
                  </p>
                </div>
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => setFoto(e.target.files?.[0] || null)} required />
              </label>
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

            <button type="submit" disabled={enviando} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4">
              <Send size={20} />
              {enviando ? "Enviando datos..." : "Enviar Reporte"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
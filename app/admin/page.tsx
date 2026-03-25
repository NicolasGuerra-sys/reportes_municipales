"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShieldAlert, Map, LogOut, LayoutDashboard } from "lucide-react";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      }
      setLoading(false);
    };
    checkSession();
  }, [router]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Cargando Panel...</div>
    </div>
  );

  return (
    <div className="min-h-screen relative font-sans overflow-hidden bg-white">
      
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-[0.05]">
        <Image 
          src="/logomuni.png" 
          alt="Muni Coinco Background"
          width={1000}
          height={1000}
          priority
          className="object-contain" 
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 text-slate-900">
        
        <div className="text-center mb-16 flex flex-col items-center">
          
          <div className="mb-8">
            <Image 
              src="/logom.png" 
              alt="Logo Ilustre Municipalidad de Coinco"
              width={400}
              height={400}
              quality={100}
              priority
              className="object-contain"
            />
          </div>

          <div className="flex items-center justify-center gap-3 mb-3">
            <LayoutDashboard className="w-9 h-9 text-emerald-600" />
            <h1 className="text-4xl font-extrabold uppercase tracking-tighter text-slate-950">
              Panel de Gestión Municipal
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-5xl px-6">
          
          <Link href="/admin/reportes" className="group p-10 bg-white border border-slate-100 rounded-[2.5rem] hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all flex flex-col items-center text-center shadow-lg hover:-translate-y-1">
            <div className="p-5 bg-blue-50 rounded-2xl mb-7 group-hover:bg-blue-100 transition-colors">
              <Map className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-extrabold uppercase tracking-tight mb-2 text-slate-950">Reportes Comunitarios</h2>
            <p className="text-slate-600 text-sm leading-relaxed max-w-[280px]">Gestión de baches, luminarias y áreas verdes en el mapa local.</p>
          </Link>

          <Link href="/admin/sos" className="group p-10 bg-white border border-slate-100 rounded-[2.5rem] hover:border-red-500 hover:shadow-2xl hover:shadow-red-500/10 transition-all flex flex-col items-center text-center shadow-lg hover:-translate-y-1">
            <div className="p-5 bg-red-50 rounded-2xl mb-7 group-hover:bg-red-100 transition-colors relative">
              <ShieldAlert className="w-12 h-12 text-red-600 group-hover:animate-pulse" />
              <span className="absolute top-4 right-4 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
              </span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-2 text-slate-950">Central SOS</h2>
            <p className="text-slate-600 text-sm leading-relaxed max-w-[280px]">Monitoreo de alertas de emergencia con geolocalización en tiempo real.</p>
          </Link>
        </div>

        <button 
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }}
          className="mt-20 flex items-center gap-2 text-slate-500 font-extrabold text-[11px] uppercase hover:text-red-600 transition-colors tracking-widest p-4 bg-slate-50 rounded-full border border-slate-100 shadow-md hover:shadow-lg transition-shadow"
        >
          <LogOut className="w-4 h-4" /> Cerrar Sesión
        </button>

      </div>
    </div>
  );
}
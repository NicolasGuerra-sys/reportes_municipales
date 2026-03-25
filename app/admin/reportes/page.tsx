"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const MapaAdmin = dynamic(() => import("../../../components/Mapa"), { ssr: false });

export default function AdminPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportes, setReportes] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        router.push("/login");
      } else {
        setSession(currentSession);
        const { data } = await supabase.from("reportes").select("*");
        setReportes(data || []);
      }
      setLoading(false);
    };
    checkSession();
  }, [router]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <div className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Verificando sesión...</div>
    </div>
  );

  return session ? <MapaAdmin reportes={reportes} /> : null;
}
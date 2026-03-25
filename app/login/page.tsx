"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const emailFinal = username.includes('@') ? username : `${username}@admin.com`;

    const { error } = await supabase.auth.signInWithPassword({
      email: emailFinal,
      password,
    });

    if (error) {
      setError("Usuario o contraseña incorrectos");
    } else {
      router.push("/admin");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src="/logom.png" alt="Logo" className="h-20 mb-4 object-contain" />
          <h1 className="text-slate-500 text-md font-medium font-black tracking-tight">Ingreso Administrativo</h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Nombre de Usuario</label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 transition-all font-medium"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Ej: mcoinco"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 tracking-widest">Contraseña</label>
            <input
              type="password"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 mt-1 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-bold p-3 rounded-lg text-center animate-shake">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl transition-all shadow-lg active:scale-95 uppercase tracking-widest text-sm"
          >
            Entrar al Panel
          </button>
        </form>
      </div>
    </div>
  );
}
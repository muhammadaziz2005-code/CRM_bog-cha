import React, { useState } from "react";
import { Lock, User, Eye, EyeOff, AlertCircle, Building2 } from "lucide-react";

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Iltimos, login va parolni kiriting.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: username, parol: password }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        onLoginSuccess(data.user);
      } else {
        setError(data.message || "Xatolik yuz berdi. Iltimos, qaytadan urining.");
      }
    } catch (err) {
      setError("Server bilan aloqa uzildi. Iltimos, keyinroq urining.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F1F5F9] px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-xl border border-slate-100">
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/10">
            <Building2 className="h-8 w-8" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
            Bog'chalar Food CRM
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Tizimga kirish uchun login va parolingizni kiriting
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-100 animate-fade-in">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md">
            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Foydalanuvchi logini</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-3 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm outline-none transition"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Parol</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-10 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm outline-none transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 transition cursor-pointer"
            >
              {loading ? "Kirilmoqda..." : "Tizimga kirish"}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-400">
            Dastlabki kirish ma'lumotlari: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">admin / admin</code>
          </p>
        </div>
      </div>
    </div>
  );
}

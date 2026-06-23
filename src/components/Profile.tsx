import React, { useState, useEffect } from "react";
import { UserCircle, Key, Phone, Mail, AlertCircle, CheckCircle2, Save, X, Edit2, Lock } from "lucide-react";
import { AdminUser } from "../types";

interface ProfileProps {
  onProfileUpdate: (updatedUser: any) => void;
}

export default function Profile({ onProfileUpdate }: ProfileProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Edit fields
  const [f_i_sh, setF_i_sh] = useState("");
  const [login, setLogin] = useState("");
  const [telefon_raqami, setTelefon_raqami] = useState("");
  const [email, setEmail] = useState("");
  const [profil_rasmi, setProfil_rasmi] = useState("");

  // Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // Alerts
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [passErr, setPassErr] = useState("");

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/profile");
      const data = await res.json();
      setProfile(data);
      
      // Seed fields
      setF_i_sh(data.f_i_sh || "");
      setLogin(data.login || "");
      setTelefon_raqami(data.telefon_raqami || "");
      setEmail(data.email || "");
      setProfil_rasmi(data.profil_rasmi || "");
    } catch (err) {
      console.error("Profil yuklanishda darslik xatoligi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErr("");
    setProfileMsg("");

    if (!f_i_sh || !telefon_raqami) {
      setProfileErr("F.I.Sh va telefon raqami kiritilishi majburiy!");
      return;
    }

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          f_i_sh,
          telefon_raqami,
          email,
          profil_rasmi
        })
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setProfileMsg("Shaxsiy profildagi ma'lumotlar muvaffaqiyatli saqlandi.");
        setProfile(result.user);
        onProfileUpdate(result.user);
      } else {
        setProfileErr(result.message || "Saqlashda xatolik.");
      }
    } catch (err) {
      setProfileErr("Server bilan bo'g'lanishda xatolik.");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassErr("");
    setPassMsg("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPassErr("Barcha maydonlarni, amaldagi va yangi parolni to'ldiring!");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPassErr("Yangi kiritilgan parollar bir-biriga mos kelmadi!");
      return;
    }

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          joriy_parol: currentPassword,
          yangi_parol: newPassword
        })
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setPassMsg("Parolingiz muvaffaqiyatli o'zgartirildi!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setPassErr(result.message || "Xatolik ro'y berdi.");
      }
    } catch (err) {
      setPassErr("Serverdan javob o'rniga xato keldi.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-semibold text-gray-500">Profil ma'lumotlari yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight font-sans">Shaxsiy Kabinet & Sozlamalar</h1>
        <p className="text-sm text-gray-500">Tizim administratorining profil ma'lumotlari va xavfsizlik paroli boshqaruvi</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Profile Details form */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-150 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 flex items-center gap-2">
            <UserCircle className="h-5 w-5 text-blue-600" />
            <span>Shaxsiy Ma'lumotlarni Tahrirlash</span>
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            {profileMsg && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3.5 text-xs font-semibold text-green-700 border border-green-100">
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                <span>{profileMsg}</span>
              </div>
            )}
            {profileErr && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3.5 text-xs font-semibold text-red-700 border border-red-100">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{profileErr}</span>
              </div>
            )}

            <div className="flex flex-col items-center gap-4 sm:flex-row pb-2">
              <img 
                src={profil_rasmi || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"} 
                alt="Profile Avatar" 
                className="h-20 w-20 rounded-full object-cover border-2 border-slate-100 shadow-md"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 w-full space-y-1">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Profil rasmi URL manzili:</label>
                <input
                  type="text"
                  value={profil_rasmi}
                  onChange={(e) => setProfil_rasmi(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-xs text-slate-900 outline-none focus:border-blue-500"
                  placeholder="https://images.unsplash.com/... yoki bo'sh qoldiring"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Administrator F.I.Sh *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={f_i_sh}
                    onChange={(e) => setF_i_sh(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-2 text-sm text-slate-900 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Kirish Logini (Tizimdagi login) *</label>
                <input
                  type="text"
                  disabled
                  value={login}
                  className="block w-full rounded-lg border border-gray-200 bg-gray-50 py-2 px-3 text-sm text-gray-500 outline-none font-bold select-none cursor-not-allowed"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">Xavfsizlik nuqtai nazaridan asosiy loginni o'zgartirib bo'lmaydi.</span>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Aloqa telefoni *</label>
                <input
                  type="text"
                  required
                  value={telefon_raqami}
                  onChange={(e) => setTelefon_raqami(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 block mb-1">Elektron pochta (Email)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500"
                  placeholder="alisher@example-crm.uz"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-50">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5  py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition cursor-pointer"
              >
                <Save className="h-4 w-4" />
                <span>O'zgarishlarni Saqlash</span>
              </button>
            </div>
          </form>
        </div>

        {/* Password Changing Form */}
        <div className="rounded-2xl border border-gray-150 bg-white p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 mb-6 flex items-center gap-2">
            <Lock className="h-5 w-5 text-blue-600" />
            <span>Kodni Almashtirish (Parol)</span>
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-4">
            {passMsg && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-xs font-semibold text-green-700 border border-green-100 animate-fade-in">
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0" />
                <span>{passMsg}</span>
              </div>
            )}
            {passErr && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-100 animate-fade-in">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{passErr}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">Hozirgi amaldagi parol *</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="block w-full rounded-lg border border-slate-300 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">Yangi parol *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500"
                placeholder="Yangi parol..."
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 block mb-1">Yangi parolni takrorlang *</label>
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="block w-full rounded-lg border border-slate-200 bg-white py-2 px-3 text-sm text-slate-900 outline-none focus:border-blue-500"
                placeholder="Takrorlang..."
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition cursor-pointer"
              >
                <Key className="h-4 w-4" />
                <span>Parolni O'zgartirish</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

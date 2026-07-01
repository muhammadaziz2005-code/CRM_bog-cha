<<<<<<< HEAD
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
        setError(data.message || "Login yoki parol noto'g'ri!");
      }
    } catch (err) {
      setError("Server bilan aloqa uzildi. Iltimos, keyinroq urining.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-md">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Bog'chalar Food CRM
            </h1>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Tizimga kirish uchun login va parolingizni kiriting
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 p-3.5 mb-5 text-sm font-medium text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Foydalanuvchi logini
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <User className="h-4.5 w-4.5" />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  autoComplete="username"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
              </div>
            </div>


            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Parol
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin"
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Tekshirilmoqda...</span>
                </>
              ) : (
                "Tizimga kirish"
              )}
            </button>
          </form>

          {/* Hint */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Dastlabki kirish ma'lumotlari:{" "}
            <span className="font-mono font-semibold text-gray-600">admin</span>
            {" / "}
            <span className="font-mono font-semibold text-gray-600">*****`</span>
          </p>
        </div>
      </div>
    </div>
  );
}
=======
import { 
  LayoutDashboard, 
  Building2, 
  Package, 
  Warehouse, 
  ArrowDownCircle, 
  Truck, 
  Users, 
  BarChart3, 
  UserCircle,
  LogOut,
  FolderInput,
  Menu,
  X
} from "lucide-react";

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  adminUser: any;
  onLogout: () => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ 
  currentTab, 
  setTab, 
  adminUser, 
  onLogout,
  isOpen,
  toggleSidebar
}: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "kindergartens", label: "Bog'chalar (38)", icon: Building2 },
    { id: "products", label: "Mahsulotlar", icon: Package },
    { id: "warehouse", label: "Ombor / Zahira", icon: Warehouse },
    { id: "stock_in", label: "Mahsulot Kirimi", icon: ArrowDownCircle },
    { id: "deliveries", label: "Yetkazib Berish", icon: Truck },
    { id: "vehicles", label: "Moshinalar", icon: FolderInput },
    { id: "workers", label: "Xodimlar", icon: Users },
    { id: "reports", label: "Hisobotlar", icon: BarChart3 },
    { id: "profile", label: "Profil", icon: UserCircle },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">B</div>
          <span className="font-bold text-slate-800">Bog'cha CRM</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/60 md:hidden animate-fade-in"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Sidebar Wrapper */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-slate-800 bg-[#1E293B] transition-transform duration-300 ease-in-out md:translate-x-0 shrink-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Header - Desktop */}
        <div className="hidden h-16 items-center gap-3 border-b border-slate-700 px-6 md:flex shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">B</div>
          <span className="text-white font-bold text-lg leading-tight tracking-tight">Bog'cha CRM</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setTab(item.id);
                  if (window.innerWidth < 768) {
                    toggleSidebar();
                  }
                }}
                className={`
                  flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors duration-150 cursor-pointer
                  ${isActive 
                    ? "bg-blue-600/20 text-blue-400" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }
                `}
              >
                <IconComponent className={`h-5 w-5 shrink-0 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Card at Bottom */}
        <div className="p-4 border-t border-slate-700 bg-slate-900/50 block shrink-0 mt-auto">
          <div className="flex items-center gap-3">
            <img 
              src={adminUser?.profil_rasmi || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"} 
              alt={adminUser?.f_i_sh} 
              className="h-10 w-10 rounded-full object-cover border-2 border-white text-slate-950"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <h4 className="truncate text-xs font-bold text-white">{adminUser?.f_i_sh || "Aziz Abdullaev"}</h4>
              <span className="text-slate-500 text-[10px] block mt-0.5">Bosh Administrator</span>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors duration-150 cursor-pointer mt-3 border border-red-950/20"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>
    </>
  );
}
>>>>>>> 03fdfd009a1d82af5ad42a838a65614ff4aa0ff6

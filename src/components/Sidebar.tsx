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
        fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-[#1E293B] transition-transform duration-300 ease-in-out md:static md:translate-x-0 h-full shrink-0
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

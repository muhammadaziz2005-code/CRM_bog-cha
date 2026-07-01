import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Kindergartens from "./components/Kindergartens";
import Products from "./components/Products";
import Warehouse from "./components/Warehouse";
import StockInModule from "./components/StockIn";
import Deliveries from "./components/Deliveries";
import Vehicles from "./components/Vehicles";
import Workers from "./components/Workers";
import Reports from "./components/Reports";
import Profile from "./components/Profile";

export default function App() {
  const [adminUser, setAdminUser] = useState<any>(null);
  const [currentTab, setTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check on startup if user is logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("food_crm_admin");
    if (savedUser) {
      setAdminUser(JSON.parse(savedUser));
    }
    setCheckingAuth(false);
  }, []);

  const handleLoginSuccess = (user: any) => {
    localStorage.setItem("food_crm_admin", JSON.stringify(user));
    setAdminUser(user);
    setTab("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("food_crm_admin");
    setAdminUser(null);
  };

  const handleProfileUpdate = (updatedUser: any) => {
    localStorage.setItem("food_crm_admin", JSON.stringify(updatedUser));
    setAdminUser(updatedUser);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F1F5F9]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-semibold text-slate-600">Tizim yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  // If not logged in, force Login screen
  if (!adminUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Render components dynamically based on active tab
  const renderTabContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <Dashboard onNavigate={(tab) => setTab(tab)} />;
      case "kindergartens":
        return <Kindergartens />;
      case "products":
        return <Products />;
      case "warehouse":
        return <Warehouse />;
      case "stock_in":
        return <StockInModule />;
      case "deliveries":
        return <Deliveries />;
      case "vehicles":
        return <Vehicles />;
      case "workers":
        return <Workers />;
      case "reports":
        return <Reports />;
      case "profile":
        return <Profile onProfileUpdate={handleProfileUpdate} />;
      default:
        return <Dashboard onNavigate={(tab) => setTab(tab)} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F1F5F9] text-slate-900 font-sans">
      {/* Sidebar navigation */}
      <Sidebar
        currentTab={currentTab}
        setTab={setTab}
        adminUser={adminUser}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main body content area */}
      <div className="flex flex-1 flex-col overflow-hidden md:ml-64">
        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {renderTabContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

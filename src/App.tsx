import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
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

  // Login endi yo'q — admin ma'lumotini faqat ko'rsatish (Sidebar/Profil) uchun yuklaymiz
  useEffect(() => {
    fetch("/api/auth/profile")
      .then((res) => res.json())
      .then((data) => setAdminUser(data))
      .catch((err) => console.error("Admin profilini yuklashda xatolik:", err));
  }, []);

  const handleProfileUpdate = (updatedUser: any) => {
    setAdminUser(updatedUser);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
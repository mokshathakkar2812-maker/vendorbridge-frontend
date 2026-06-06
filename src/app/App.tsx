/* MARKER-MAKE-KIT-INVOKED */
import { useState } from "react";
import { Login } from "./components/Login";
import { Sidebar, type Screen } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { VendorManagement } from "./components/VendorManagement";
import { RFQManagement } from "./components/RFQManagement";
import { QuotationSubmission } from "./components/QuotationSubmission";
import { QuotationComparison } from "./components/QuotationComparison";
import { ApprovalWorkflow } from "./components/ApprovalWorkflow";
import { PurchaseOrder } from "./components/PurchaseOrder";
import { ActivityLogs } from "./components/ActivityLogs";
import { Reports } from "./components/Reports";
import { Bell, Search, Menu, X } from "lucide-react";

const SCREEN_TITLES: Record<Screen, string> = {
  dashboard: "Dashboard",
  vendors: "Vendor Management",
  rfq: "RFQ Management",
  quotations: "Vendor Quotations",
  comparison: "Quotation Comparison",
  approvals: "Approval Workflow",
  "purchase-orders": "Purchase Orders & Invoices",
  activity: "Activity & Notifications",
  reports: "Reports & Analytics",
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogin(email: string, role: string, name: string) {
    setUserName(name);
    setUserRole(role);
    setIsLoggedIn(true);
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setUserName("");
    setUserRole("");
    setCurrentScreen("dashboard");
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  function renderScreen() {
    switch (currentScreen) {
      case "dashboard": return <Dashboard onNavigate={setCurrentScreen} />;
      case "vendors": return <VendorManagement />;
      case "rfq": return <RFQManagement />;
      case "quotations": return <QuotationSubmission />;
      case "comparison": return <QuotationComparison />;
      case "approvals": return <ApprovalWorkflow />;
      case "purchase-orders": return <PurchaseOrder />;
      case "activity": return <ActivityLogs />;
      case "reports": return <Reports />;
      default: return <Dashboard onNavigate={setCurrentScreen} />;
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <Sidebar
          current={currentScreen}
          onNavigate={(s) => { setCurrentScreen(s); setSidebarOpen(false); }}
          onLogout={handleLogout}
          role={userRole}
          userName={userName}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center gap-4 px-4 lg:px-6 shrink-0">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex-1">
            <h1 className="font-semibold text-slate-800">{SCREEN_TITLES[currentScreen]}</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search..."
                className="w-52 pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
            </div>

            <button
              onClick={() => setCurrentScreen("activity")}
              className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-medium text-slate-700 leading-none">{userName}</p>
                <p className="text-xs text-slate-400 mt-0.5">{userRole}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}

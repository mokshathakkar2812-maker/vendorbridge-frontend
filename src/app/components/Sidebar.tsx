import {
  LayoutDashboard,
  Users,
  FileText,
  GitCompare,
  CheckSquare,
  ShoppingCart,
  Bell,
  BarChart2,
  LogOut,
  ChevronRight,
  Package,
  ClipboardList,
} from "lucide-react";

export type Screen =
  | "dashboard"
  | "vendors"
  | "rfq"
  | "quotations"
  | "comparison"
  | "approvals"
  | "purchase-orders"
  | "activity"
  | "reports";

interface NavItem {
  id: Screen;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface SidebarProps {
  current: Screen;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  role: string;
  userName: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "vendors", label: "Vendor Management", icon: <Users size={18} /> },
  { id: "rfq", label: "RFQ Management", icon: <ClipboardList size={18} /> },
  { id: "quotations", label: "Quotations", icon: <FileText size={18} /> },
  { id: "comparison", label: "Quotation Comparison", icon: <GitCompare size={18} /> },
  { id: "approvals", label: "Approval Workflow", icon: <CheckSquare size={18} />, badge: 3 },
  { id: "purchase-orders", label: "Purchase Orders", icon: <ShoppingCart size={18} /> },
  { id: "activity", label: "Activity & Logs", icon: <Bell size={18} />, badge: 5 },
  { id: "reports", label: "Reports & Analytics", icon: <BarChart2 size={18} /> },
];

const ROLE_COLORS: Record<string, string> = {
  "Admin": "bg-purple-500",
  "Procurement Officer": "bg-blue-500",
  "Manager": "bg-green-500",
  "Vendor": "bg-amber-500",
};

export function Sidebar({ current, onNavigate, onLogout, role, userName }: SidebarProps) {
  return (
    <aside className="flex flex-col h-full w-64 bg-sidebar text-sidebar-foreground shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
          <Package size={16} className="text-white" />
        </div>
        <div>
          <p className="text-white font-semibold tracking-tight leading-none">VendorBridge</p>
          <p className="text-xs text-slate-400 mt-0.5">Procurement ERP</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 mb-2">Main Menu</p>
        <ul className="space-y-0.5 px-3">
          {NAV_ITEMS.map((item) => {
            const active = current === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    active
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-sidebar-accent hover:text-white"
                  }`}
                >
                  <span className={active ? "text-white" : "text-slate-400"}>{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                      active ? "bg-blue-500 text-white" : "bg-red-500 text-white"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {active && <ChevronRight size={14} className="text-blue-300" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-8 h-8 rounded-full ${ROLE_COLORS[role] ?? "bg-slate-600"} flex items-center justify-center text-white text-xs font-bold`}>
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-xs text-slate-400">{role}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

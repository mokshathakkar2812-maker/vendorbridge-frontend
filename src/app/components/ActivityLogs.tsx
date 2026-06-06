import { useState } from "react";
import { Bell, CheckCircle, FileText, ShoppingCart, AlertCircle, User, Clock, Filter, Search } from "lucide-react";

interface Log {
  id: string; type: "approval" | "rfq" | "po" | "invoice" | "vendor" | "system";
  title: string; description: string; actor: string; timestamp: string; read: boolean;
}

interface Notification {
  id: string; type: "approval" | "rfq" | "invoice" | "alert";
  title: string; message: string; time: string; read: boolean;
}

const NOTIFICATIONS: Notification[] = [
  { id: "N001", type: "approval", title: "Approval Required", message: "Server Infrastructure Upgrade (₹25.1L) awaiting your approval", time: "5 min ago", read: false },
  { id: "N002", type: "rfq", title: "New Quotation Received", message: "CloudTech Systems submitted a quote for Office Laptops Q2", time: "1 hour ago", read: false },
  { id: "N003", type: "invoice", title: "Invoice Generated", message: "INV-2024-001 has been generated for PO-2024-001", time: "2 hours ago", read: false },
  { id: "N004", type: "alert", title: "RFQ Deadline Approaching", message: "Office Furniture Refurbishment deadline in 3 days", time: "3 hours ago", read: true },
  { id: "N005", type: "approval", title: "Approval Completed", message: "Server Infrastructure Upgrade approved by Rajesh Kumar", time: "Yesterday", read: true },
  { id: "N006", type: "rfq", title: "New RFQ Published", message: "Marketing Campaign Materials RFQ published by Sneha Patel", time: "Yesterday", read: true },
];

const LOGS: Log[] = [
  { id: "L001", type: "approval", title: "Approval Granted", description: "Rajesh Kumar approved APP-001 (Server Infrastructure Upgrade) for ₹25.1L", actor: "Rajesh Kumar", timestamp: "05 Jun 2024, 3:45 PM", read: true },
  { id: "L002", type: "po", title: "Purchase Order Issued", description: "PO-2024-001 issued to TechPro Solutions for server infrastructure upgrade", actor: "Priya Sharma", timestamp: "05 Jun 2024, 4:00 PM", read: true },
  { id: "L003", type: "invoice", title: "Invoice Generated", description: "INV-2024-001 generated and sent to TechPro Solutions via email", actor: "System", timestamp: "05 Jun 2024, 4:05 PM", read: true },
  { id: "L004", type: "rfq", title: "Quotation Submitted", description: "CloudTech Systems submitted quotation QT-2024-002 for RFQ-2024-001", actor: "CloudTech Systems", timestamp: "04 Jun 2024, 2:30 PM", read: true },
  { id: "L005", type: "rfq", title: "RFQ Published", description: "RFQ-2024-003 (Office Furniture Refurbishment) published and vendors notified", actor: "Priya Sharma", timestamp: "05 Jun 2024, 10:00 AM", read: true },
  { id: "L006", type: "approval", title: "Approval Initiated", description: "APP-002 (Office Laptops Q2) approval workflow started for ₹20.9L", actor: "Priya Sharma", timestamp: "04 Jun 2024, 5:00 PM", read: true },
  { id: "L007", type: "vendor", title: "Vendor Registered", description: "Prime Logistics registered and pending admin verification", actor: "Prime Logistics", timestamp: "04 Jun 2024, 9:00 AM", read: true },
  { id: "L008", type: "rfq", title: "RFQ Created", description: "RFQ-2024-002 (Server Infrastructure Upgrade) created with 2 vendors invited", actor: "Arjun Mehta", timestamp: "03 Jun 2024, 11:00 AM", read: true },
  { id: "L009", type: "approval", title: "Finance Review Approved", description: "Rajan Iyer approved finance review for APP-001 (Server Infrastructure)", actor: "Rajan Iyer", timestamp: "05 Jun 2024, 2:00 PM", read: true },
  { id: "L010", type: "system", title: "System Backup", description: "Daily database backup completed successfully — 2.4 GB archived", actor: "System", timestamp: "06 Jun 2024, 12:00 AM", read: true },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  approval: <CheckCircle size={14} className="text-green-500" />,
  rfq: <FileText size={14} className="text-blue-500" />,
  po: <ShoppingCart size={14} className="text-purple-500" />,
  invoice: <FileText size={14} className="text-amber-500" />,
  vendor: <User size={14} className="text-teal-500" />,
  system: <Bell size={14} className="text-slate-400" />,
  alert: <AlertCircle size={14} className="text-red-500" />,
};

const TYPE_BG: Record<string, string> = {
  approval: "bg-green-100",
  rfq: "bg-blue-100",
  po: "bg-purple-100",
  invoice: "bg-amber-100",
  vendor: "bg-teal-100",
  system: "bg-slate-100",
  alert: "bg-red-100",
};

export function ActivityLogs() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [logs] = useState(LOGS);
  const [tab, setTab] = useState<"notifications" | "audit">("notifications");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const unreadCount = notifications.filter(n => !n.read).length;

  function markAllRead() { setNotifications(notifications.map(n => ({ ...n, read: true }))); }
  function markRead(id: string) { setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n)); }

  const filteredLogs = logs.filter((l) => {
    const matchSearch = l.title.toLowerCase().includes(search.toLowerCase()) || l.description.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "All" || l.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-800">Activity & Notifications</h2>
          <p className="text-sm text-slate-500">{unreadCount} unread notifications</p>
        </div>
        {tab === "notifications" && unreadCount > 0 && (
          <button onClick={markAllRead} className="text-sm text-blue-600 hover:underline">Mark all as read</button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
        {(["notifications", "audit"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${tab === t ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
            {t === "notifications" ? (
              <span className="flex items-center gap-2">
                <Bell size={14} /> Notifications {unreadCount > 0 && <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{unreadCount}</span>}
              </span>
            ) : (
              <span className="flex items-center gap-2"><Clock size={14} /> Audit Logs</span>
            )}
          </button>
        ))}
      </div>

      {tab === "notifications" && (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                !n.read ? "bg-blue-50 border-blue-200 hover:bg-blue-100" : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <div className={`w-9 h-9 rounded-lg ${TYPE_BG[n.type]} flex items-center justify-center shrink-0`}>
                {TYPE_ICONS[n.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold ${!n.read ? "text-blue-800" : "text-slate-700"}`}>{n.title}</p>
                  {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{n.message}</p>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Clock size={10} />{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "audit" && (
        <>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search activity logs..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
                {["All", "approval", "rfq", "po", "invoice", "vendor", "system"].map((t) => <option key={t} value={t}>{t === "All" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="divide-y divide-slate-50">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50 transition-colors">
                  <div className={`w-9 h-9 rounded-lg ${TYPE_BG[log.type]} flex items-center justify-center shrink-0 mt-0.5`}>
                    {TYPE_ICONS[log.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{log.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{log.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate-400 flex items-center gap-1"><User size={10} />{log.actor}</p>
                    <p className="text-xs text-slate-400 mt-1">{log.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
            {filteredLogs.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Clock size={40} className="mx-auto mb-3 opacity-30" />
                <p>No log entries found</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

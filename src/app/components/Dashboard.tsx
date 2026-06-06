import {
  FileText, Users, ShoppingCart, CheckSquare, TrendingUp, Clock, AlertCircle, DollarSign,
  ArrowRight, ArrowUp, ArrowDown
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import type { Screen } from "./Sidebar";

interface DashboardProps {
  onNavigate: (s: Screen) => void;
}

const spendData = [
  { month: "Jan", amount: 420000 }, { month: "Feb", amount: 380000 },
  { month: "Mar", amount: 510000 }, { month: "Apr", amount: 460000 },
  { month: "May", amount: 590000 }, { month: "Jun", amount: 530000 },
];

const categoryData = [
  { name: "IT Equipment", value: 35 }, { name: "Office Supplies", value: 20 },
  { name: "Services", value: 25 }, { name: "Raw Materials", value: 20 },
];
const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

const rfqData = [
  { month: "Jan", open: 12, closed: 8 }, { month: "Feb", open: 18, closed: 14 },
  { month: "Mar", open: 15, closed: 20 }, { month: "Apr", open: 22, closed: 18 },
  { month: "May", open: 19, closed: 23 }, { month: "Jun", open: 25, closed: 21 },
];

const RECENT_POS = [
  { id: "PO-2024-001", vendor: "TechPro Solutions", amount: 145000, status: "Delivered", date: "2 Jun 2024" },
  { id: "PO-2024-002", vendor: "Global Supplies Ltd", amount: 89500, status: "In Transit", date: "4 Jun 2024" },
  { id: "PO-2024-003", vendor: "Office Needs Co.", amount: 32000, status: "Pending", date: "5 Jun 2024" },
  { id: "PO-2024-004", vendor: "Meridian Services", amount: 210000, status: "Approved", date: "6 Jun 2024" },
];

const PENDING_APPROVALS = [
  { id: "APP-001", rfq: "Office Furniture Q2", requester: "Priya Sharma", amount: 85000, priority: "High" },
  { id: "APP-002", rfq: "Server Infrastructure", requester: "Arjun Mehta", amount: 320000, priority: "Critical" },
  { id: "APP-003", rfq: "Marketing Materials", requester: "Sneha Patel", amount: 28000, priority: "Medium" },
];

const STATUS_COLORS: Record<string, string> = {
  "Delivered": "bg-green-100 text-green-700",
  "In Transit": "bg-blue-100 text-blue-700",
  "Pending": "bg-amber-100 text-amber-700",
  "Approved": "bg-purple-100 text-purple-700",
};

const PRIORITY_COLORS: Record<string, string> = {
  "Critical": "bg-red-100 text-red-700",
  "High": "bg-orange-100 text-orange-700",
  "Medium": "bg-yellow-100 text-yellow-700",
};

function StatCard({ icon, label, value, change, positive, color }: {
  icon: React.ReactNode; label: string; value: string; change: string; positive: boolean; color: string;
}) {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
          {icon}
        </div>
        <span className={`flex items-center gap-1 text-xs font-medium ${positive ? "text-green-600" : "text-red-500"}`}>
          {positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="p-6 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<FileText size={18} className="text-blue-600" />} label="Active RFQs" value="24" change="12% vs last month" positive={true} color="bg-blue-50" />
        <StatCard icon={<Users size={18} className="text-green-600" />} label="Registered Vendors" value="142" change="5 new this month" positive={true} color="bg-green-50" />
        <StatCard icon={<CheckSquare size={18} className="text-amber-600" />} label="Pending Approvals" value="7" change="3 overdue" positive={false} color="bg-amber-50" />
        <StatCard icon={<DollarSign size={18} className="text-purple-600" />} label="Monthly Spend" value="₹53.0L" change="10.2% vs last month" positive={false} color="bg-purple-50" />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800">Procurement Spend</h3>
              <p className="text-xs text-slate-400">Monthly spend trend (₹)</p>
            </div>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">FY 2024</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={spendData}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip formatter={(v: number) => [`₹${(v / 100000).toFixed(1)}L`, "Spend"]} />
              <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} fill="url(#spendGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-1">Spend by Category</h3>
          <p className="text-xs text-slate-400 mb-4">Current quarter</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                {categoryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {categoryData.map((d, i) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-xs text-slate-600">{d.name}</span>
                </div>
                <span className="text-xs font-medium text-slate-700">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RFQ chart */}
      <div className="bg-white rounded-xl p-5 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-800">RFQ Activity</h3>
            <p className="text-xs text-slate-400">Open vs closed RFQs per month</p>
          </div>
          <button onClick={() => onNavigate("rfq")} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
            View all <ArrowRight size={12} />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={rfqData} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Bar dataKey="open" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Open" />
            <Bar dataKey="closed" fill="#10b981" radius={[4, 4, 0, 0]} name="Closed" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tables row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent POs */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShoppingCart size={16} className="text-slate-500" />
              <h3 className="font-semibold text-slate-800">Recent Purchase Orders</h3>
            </div>
            <button onClick={() => onNavigate("purchase-orders")} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {RECENT_POS.map((po) => (
              <div key={po.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-700">{po.id}</p>
                  <p className="text-xs text-slate-400">{po.vendor}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">₹{po.amount.toLocaleString("en-IN")}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[po.status]}`}>{po.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-500" />
              <h3 className="font-semibold text-slate-800">Pending Approvals</h3>
              <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">3</span>
            </div>
            <button onClick={() => onNavigate("approvals")} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              Review all <ArrowRight size={12} />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {PENDING_APPROVALS.map((a) => (
              <div key={a.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-700">{a.rfq}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Clock size={11} className="text-slate-400" />
                    <p className="text-xs text-slate-400">{a.requester}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">₹{a.amount.toLocaleString("en-IN")}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_COLORS[a.priority]}`}>{a.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 text-white">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <TrendingUp size={16} /> Quick Actions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Create RFQ", screen: "rfq" as Screen, color: "bg-white/10 hover:bg-white/20" },
            { label: "Add Vendor", screen: "vendors" as Screen, color: "bg-white/10 hover:bg-white/20" },
            { label: "Review Approvals", screen: "approvals" as Screen, color: "bg-white/10 hover:bg-white/20" },
            { label: "View Reports", screen: "reports" as Screen, color: "bg-white/10 hover:bg-white/20" },
          ].map((a) => (
            <button
              key={a.label}
              onClick={() => onNavigate(a.screen)}
              className={`${a.color} rounded-lg px-4 py-3 text-sm font-medium transition-all flex items-center justify-between`}
            >
              {a.label}
              <ArrowRight size={14} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

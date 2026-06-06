import { useState } from "react";
import { Download, TrendingUp, TrendingDown, Star, DollarSign, FileText } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";

const monthlySpend = [
  { month: "Jan", spend: 4200000, orders: 8 }, { month: "Feb", spend: 3800000, orders: 6 },
  { month: "Mar", spend: 5100000, orders: 11 }, { month: "Apr", spend: 4600000, orders: 9 },
  { month: "May", spend: 5900000, orders: 13 }, { month: "Jun", spend: 5300000, orders: 10 },
];

const vendorPerf = [
  { vendor: "TechPro", onTime: 95, quality: 4.8, spend: 8700000 },
  { vendor: "CloudTech", onTime: 98, quality: 4.6, spend: 5400000 },
  { vendor: "Global Sup.", onTime: 88, quality: 4.5, spend: 3200000 },
  { vendor: "Meridian", onTime: 92, quality: 4.2, spend: 2100000 },
  { vendor: "Prime Log.", onTime: 85, quality: 3.9, spend: 1800000 },
];

const categorySpend = [
  { category: "IT Equipment", spend: 12400000, orders: 18, color: "#3b82f6" },
  { category: "Office Supplies", spend: 4200000, orders: 12, color: "#10b981" },
  { category: "Services", spend: 3800000, orders: 8, color: "#f59e0b" },
  { category: "Raw Materials", spend: 2100000, orders: 5, color: "#8b5cf6" },
  { category: "Logistics", spend: 800000, orders: 4, color: "#ef4444" },
];

const rfqStats = [
  { month: "Jan", created: 12, awarded: 8 }, { month: "Feb", created: 15, awarded: 11 },
  { month: "Mar", created: 18, awarded: 13 }, { month: "Apr", created: 22, awarded: 17 },
  { month: "May", created: 20, awarded: 16 }, { month: "Jun", created: 25, awarded: 19 },
];

const COLORS = categorySpend.map(c => c.color);

function MetricCard({ label, value, sub, icon, trend, positive }: {
  label: string; value: string; sub: string; icon: React.ReactNode; trend: string; positive: boolean;
}) {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">{icon}</div>
        <span className={`flex items-center gap-1 text-xs font-medium ${positive ? "text-green-600" : "text-red-500"}`}>
          {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {trend}
        </span>
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  );
}

export function Reports() {
  const [period, setPeriod] = useState("6M");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-bold text-slate-800">Reports & Analytics</h2>
          <p className="text-sm text-slate-500">Procurement insights and performance metrics</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
            {["1M", "3M", "6M", "1Y"].map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${period === p ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
                {p}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Spend" value="₹2.93Cr" sub="Across 47 POs" icon={<DollarSign size={18} className="text-blue-600" />} trend="8.5% vs prev period" positive={false} />
        <MetricCard label="Active Vendors" value="142" sub="12 new this period" icon={<Star size={18} className="text-amber-600" />} trend="9.2% increase" positive={true} />
        <MetricCard label="RFQs Processed" value="112" sub="19 this month" icon={<FileText size={18} className="text-green-600" />} trend="25% more vs last" positive={true} />
        <MetricCard label="Avg. Cycle Time" value="8.4 days" sub="RFQ to PO" icon={<TrendingUp size={18} className="text-purple-600" />} trend="12% faster" positive={true} />
      </div>

      {/* Monthly Spend & Orders */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800">Monthly Procurement Spend</h3>
              <p className="text-xs text-slate-400">Total spend in ₹ lakhs</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlySpend}>
              <defs>
                <linearGradient id="spendGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip formatter={(v: number) => [`₹${(v / 100000).toFixed(1)}L`, "Spend"]} />
              <Area type="monotone" dataKey="spend" stroke="#3b82f6" strokeWidth={2.5} fill="url(#spendGrad2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <div className="mb-4">
            <h3 className="font-semibold text-slate-800">RFQ Pipeline</h3>
            <p className="text-xs text-slate-400">Created vs awarded per month</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={rfqStats} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="created" fill="#dbeafe" stroke="#3b82f6" strokeWidth={1} radius={[4, 4, 0, 0]} name="Created" />
              <Bar dataKey="awarded" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Awarded" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Vendor Performance */}
      <div className="bg-white rounded-xl p-5 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-800">Vendor Performance</h3>
            <p className="text-xs text-slate-400">On-time delivery rate & quality rating</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={vendorPerf} layout="vertical" barSize={12}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <YAxis dataKey="vendor" type="category" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip formatter={(v: number) => [`${v}%`, "On-Time"]} />
            <Bar dataKey="onTime" fill="#10b981" radius={[0, 4, 4, 0]} name="On-Time Delivery" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category breakdown */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-1">Spend by Category</h3>
          <p className="text-xs text-slate-400 mb-4">Distribution across procurement categories</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categorySpend} dataKey="spend" cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3}>
                {categorySpend.map((entry, index) => <Cell key={index} fill={COLORS[index]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`₹${(v / 100000).toFixed(1)}L`, ""]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-4">Category Summary</h3>
          <div className="space-y-3">
            {categorySpend.map((cat, i) => {
              const totalSpend = categorySpend.reduce((s, c) => s + c.spend, 0);
              const pct = (cat.spend / totalSpend) * 100;
              return (
                <div key={cat.category}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-slate-600">{cat.category}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-slate-800">₹{(cat.spend / 100000).toFixed(1)}L</span>
                      <span className="text-slate-400 text-xs ml-2">{pct.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top vendors table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Vendor Performance Report</h3>
          <p className="text-xs text-slate-400">Detailed metrics by vendor</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Vendor", "Total Spend", "Orders", "On-Time %", "Quality Rating", "Status"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {vendorPerf.map((v) => (
                <tr key={v.vendor} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-medium text-slate-800">{v.vendor}</td>
                  <td className="px-5 py-3 text-slate-600">₹{(v.spend / 100000).toFixed(1)}L</td>
                  <td className="px-5 py-3 text-slate-600">{Math.round(v.spend / 320000)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden max-w-20">
                        <div className={`h-full rounded-full ${v.onTime >= 90 ? "bg-green-500" : "bg-amber-400"}`} style={{ width: `${v.onTime}%` }} />
                      </div>
                      <span className={`text-xs font-medium ${v.onTime >= 90 ? "text-green-600" : "text-amber-600"}`}>{v.onTime}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span className="text-slate-700 font-medium">{v.quality}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${v.onTime >= 90 && v.quality >= 4.5 ? "bg-green-100 text-green-700" : v.onTime >= 85 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>
                      {v.onTime >= 90 && v.quality >= 4.5 ? "Preferred" : v.onTime >= 85 ? "Acceptable" : "Under Review"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Search, Plus, Filter, Star, CheckCircle, XCircle, Clock, Eye, Edit, Trash2, X, Building2, Mail, Phone, MapPin } from "lucide-react";

interface Vendor {
  id: string; name: string; category: string; contact: string; email: string; phone: string;
  city: string; gst: string; status: "Active" | "Inactive" | "Pending"; rating: number;
  totalOrders: number; totalSpend: number; joinDate: string;
}

const VENDORS: Vendor[] = [
  { id: "V001", name: "TechPro Solutions Pvt Ltd", category: "IT Equipment", contact: "Vikram Nair", email: "vikram@techpro.in", phone: "+91 98765 43210", city: "Bengaluru", gst: "29ABCDE1234F1Z5", status: "Active", rating: 4.8, totalOrders: 34, totalSpend: 1240000, joinDate: "Jan 2022" },
  { id: "V002", name: "Global Supplies Ltd", category: "Office Supplies", contact: "Meera Iyer", email: "meera@globalsup.com", phone: "+91 87654 32109", city: "Mumbai", gst: "27FGHIJ5678K2A6", status: "Active", rating: 4.5, totalOrders: 58, totalSpend: 890000, joinDate: "Mar 2021" },
  { id: "V003", name: "Meridian Services", category: "Services", contact: "Arun Verma", email: "arun@meridian.co", phone: "+91 76543 21098", city: "Delhi", gst: "07KLMNO9012L3B7", status: "Active", rating: 4.2, totalOrders: 22, totalSpend: 640000, joinDate: "Jun 2022" },
  { id: "V004", name: "Sunrise Manufacturing", category: "Raw Materials", contact: "Divya Singh", email: "divya@sunrise.in", phone: "+91 65432 10987", city: "Pune", gst: "27PQRST3456M4C8", status: "Inactive", rating: 3.9, totalOrders: 15, totalSpend: 320000, joinDate: "Sep 2020" },
  { id: "V005", name: "CloudTech Systems", category: "IT Equipment", contact: "Nikhil Reddy", email: "nikhil@cloudtech.io", phone: "+91 54321 09876", city: "Hyderabad", gst: "36UVWXY7890N5D9", status: "Active", rating: 4.6, totalOrders: 27, totalSpend: 980000, joinDate: "Feb 2023" },
  { id: "V006", name: "Prime Logistics", category: "Logistics", contact: "Kavya Pillai", email: "kavya@primelogix.com", phone: "+91 43210 98765", city: "Chennai", gst: "33ZABCD1234O6E1", status: "Pending", rating: 0, totalOrders: 0, totalSpend: 0, joinDate: "Jun 2024" },
];

const STATUS_STYLES: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-red-100 text-red-700",
  Pending: "bg-amber-100 text-amber-700",
};

const CATEGORIES = ["All", "IT Equipment", "Office Supplies", "Services", "Raw Materials", "Logistics"];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={12} className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
      ))}
      <span className="text-xs text-slate-500 ml-1">{rating > 0 ? rating.toFixed(1) : "N/A"}</span>
    </div>
  );
}

const API_URL = "https://vendorbridge-production.up.railway.app";

export function VendorManagement() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [vendors, setVendors] = useState(VENDORS);
  const [form, setForm] = useState({ name: "", category: "IT Equipment", contact: "", email: "", phone: "", city: "", gst: "" });

  useEffect(() => {
    fetch(`${API_URL}/vendors/`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((v: any) => ({
            id: `V${String(v.id).padStart(3, "0")}`,
            name: v.name, category: v.category, contact: v.name,
            email: v.email, phone: v.phone, city: "India",
            gst: v.gst_number, status: v.status === "active" ? "Active" : "Inactive" as "Active" | "Inactive" | "Pending",
            rating: 0, totalOrders: 0, totalSpend: 0, joinDate: "2024"
          }));
          setVendors(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const filtered = vendors.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.contact.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || v.category === category;
    const matchStatus = statusFilter === "All" || v.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  function addVendor() {
    const newVendor: Vendor = {
      id: `V${String(vendors.length + 1).padStart(3, "0")}`,
      ...form, status: "Pending", rating: 0, totalOrders: 0, totalSpend: 0, joinDate: "Jun 2024"
    };
    setVendors([...vendors, newVendor]);
    setShowModal(false);
    setForm({ name: "", category: "IT Equipment", contact: "", email: "", phone: "", city: "", gst: "" });
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-800">Vendor Management</h2>
          <p className="text-sm text-slate-500">{vendors.length} registered vendors</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Add Vendor
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active Vendors", value: vendors.filter(v => v.status === "Active").length, icon: <CheckCircle size={16} className="text-green-600" />, bg: "bg-green-50" },
          { label: "Inactive Vendors", value: vendors.filter(v => v.status === "Inactive").length, icon: <XCircle size={16} className="text-red-500" />, bg: "bg-red-50" },
          { label: "Pending Approval", value: vendors.filter(v => v.status === "Pending").length, icon: <Clock size={16} className="text-amber-600" />, bg: "bg-amber-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-200 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}>{s.icon}</div>
            <div>
              <p className="text-xl font-bold text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendors..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
            {["All", "Active", "Inactive", "Pending"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Vendor", "Category", "Contact", "Location", "GST No.", "Status", "Rating", "Orders", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Building2 size={14} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{v.name}</p>
                        <p className="text-xs text-slate-400">{v.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{v.category}</span></td>
                  <td className="px-4 py-3">
                    <p className="text-slate-700">{v.contact}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1"><Mail size={10} />{v.email}</p>
                  </td>
                  <td className="px-4 py-3"><div className="flex items-center gap-1 text-slate-500"><MapPin size={12} />{v.city}</div></td>
                  <td className="px-4 py-3 text-xs text-slate-500 font-mono">{v.gst}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[v.status]}`}>{v.status}</span>
                  </td>
                  <td className="px-4 py-3"><StarRating rating={v.rating} /></td>
                  <td className="px-4 py-3 text-slate-600">{v.totalOrders}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelectedVendor(v)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={14} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"><Edit size={14} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Building2 size={40} className="mx-auto mb-3 opacity-30" />
            <p>No vendors found</p>
          </div>
        )}
      </div>

      {/* Add Vendor Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Register New Vendor</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-slate-700 block mb-1">Company Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Company Pvt Ltd"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {["IT Equipment", "Office Supplies", "Services", "Raw Materials", "Logistics"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Contact Person *</label>
                  <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="John Doe"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Email *</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="contact@company.com"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">City</label>
                  <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Mumbai"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">GST Number</label>
                  <input value={form.gst} onChange={(e) => setForm({ ...form, gst: e.target.value })} placeholder="27XXXXX1234X1Z5"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-100">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-slate-200 rounded-lg py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={addVendor} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-medium transition-colors">Register Vendor</button>
            </div>
          </div>
        </div>
      )}

      {/* Vendor Detail Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Vendor Details</h3>
              <button onClick={() => setSelectedVendor(null)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Building2 size={24} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">{selectedVendor.name}</h4>
                  <p className="text-sm text-slate-500">{selectedVendor.id} · {selectedVendor.category}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${STATUS_STYLES[selectedVendor.status]}`}>{selectedVendor.status}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { icon: <Mail size={14} />, label: "Email", value: selectedVendor.email },
                  { icon: <Phone size={14} />, label: "Phone", value: selectedVendor.phone },
                  { icon: <MapPin size={14} />, label: "City", value: selectedVendor.city },
                  { icon: <Building2 size={14} />, label: "GST", value: selectedVendor.gst },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-50 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">{item.icon}<span className="text-xs">{item.label}</span></div>
                    <p className="text-slate-700 text-xs font-medium truncate">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="font-bold text-blue-700">{selectedVendor.totalOrders}</p>
                  <p className="text-xs text-blue-500">Orders</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="font-bold text-green-700">₹{(selectedVendor.totalSpend / 100000).toFixed(1)}L</p>
                  <p className="text-xs text-green-500">Total Spend</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3 text-center">
                  <p className="font-bold text-amber-700">{selectedVendor.rating > 0 ? selectedVendor.rating : "—"}</p>
                  <p className="text-xs text-amber-500">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Plus, Search, Calendar, Paperclip, Trash2, X, FileText, Clock, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";

interface RFQItem { description: string; quantity: number; unit: string; }
interface RFQ {
  id: string; title: string; category: string; deadline: string; status: "Draft" | "Open" | "Closed" | "Awarded";
  vendors: string[]; items: RFQItem[]; createdDate: string; requester: string; description: string;
}

const RFQS: RFQ[] = [
  { id: "RFQ-2024-001", title: "Office Laptops & Accessories Q2", category: "IT Equipment", deadline: "15 Jun 2024", status: "Open", vendors: ["TechPro Solutions", "CloudTech Systems"], items: [{ description: "Laptop 16GB RAM", quantity: 25, unit: "Units" }, { description: "Wireless Mouse", quantity: 25, unit: "Units" }], createdDate: "01 Jun 2024", requester: "Priya Sharma", description: "Procurement of laptops and accessories for Q2 team expansion." },
  { id: "RFQ-2024-002", title: "Server Infrastructure Upgrade", category: "IT Equipment", deadline: "20 Jun 2024", status: "Open", vendors: ["TechPro Solutions", "CloudTech Systems"], items: [{ description: "Rack Server 2U", quantity: 4, unit: "Units" }, { description: "SAN Storage 50TB", quantity: 1, unit: "Unit" }], createdDate: "03 Jun 2024", requester: "Arjun Mehta", description: "Upgrade of server infrastructure for improved performance." },
  { id: "RFQ-2024-003", title: "Office Furniture Refurbishment", category: "Office Supplies", deadline: "30 Jun 2024", status: "Open", vendors: ["Global Supplies Ltd"], items: [{ description: "Ergonomic Chair", quantity: 50, unit: "Units" }, { description: "Standing Desk", quantity: 20, unit: "Units" }], createdDate: "05 Jun 2024", requester: "Priya Sharma", description: "Office furniture replacement for new floor expansion." },
  { id: "RFQ-2024-004", title: "Annual Software Licenses", category: "Services", deadline: "10 Jun 2024", status: "Closed", vendors: ["Meridian Services"], items: [{ description: "ERP License Annual", quantity: 100, unit: "Seats" }], createdDate: "25 May 2024", requester: "Arjun Mehta", description: "Annual renewal of enterprise software licenses." },
  { id: "RFQ-2024-005", title: "Marketing Campaign Materials", category: "Services", deadline: "25 Jun 2024", status: "Draft", vendors: [], items: [{ description: "Brochure Design & Print", quantity: 5000, unit: "Pieces" }], createdDate: "06 Jun 2024", requester: "Sneha Patel", description: "Design and printing for Q3 marketing campaign." },
];

const STATUS_STYLES: Record<string, string> = {
  Draft: "bg-slate-100 text-slate-600",
  Open: "bg-blue-100 text-blue-700",
  Closed: "bg-red-100 text-red-600",
  Awarded: "bg-green-100 text-green-700",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  Draft: <FileText size={12} />,
  Open: <Clock size={12} />,
  Closed: <AlertCircle size={12} />,
  Awarded: <CheckCircle size={12} />,
};

const ALL_VENDORS = ["TechPro Solutions", "Global Supplies Ltd", "Meridian Services", "CloudTech Systems", "Prime Logistics", "Sunrise Manufacturing"];

export function RFQManagement() {
  const [rfqs, setRfqs] = useState(RFQS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showCreate, setShowCreate] = useState(false);
  const [expandedRFQ, setExpandedRFQ] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "", category: "IT Equipment", description: "", deadline: "", vendors: [] as string[],
    items: [{ description: "", quantity: 1, unit: "Units" }] as RFQItem[],
  });

  const filtered = rfqs.filter((r) => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function addItem() { setForm({ ...form, items: [...form.items, { description: "", quantity: 1, unit: "Units" }] }); }
  function removeItem(i: number) { setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) }); }

  function toggleVendor(v: string) {
    setForm({ ...form, vendors: form.vendors.includes(v) ? form.vendors.filter((x) => x !== v) : [...form.vendors, v] });
  }

  function createRFQ() {
    const newRFQ: RFQ = {
      id: `RFQ-2024-00${rfqs.length + 1}`,
      ...form, status: "Open", createdDate: "06 Jun 2024", requester: "Priya Sharma",
    };
    setRfqs([newRFQ, ...rfqs]);
    setShowCreate(false);
    setForm({ title: "", category: "IT Equipment", description: "", deadline: "", vendors: [], items: [{ description: "", quantity: 1, unit: "Units" }] });
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-800">RFQ Management</h2>
          <p className="text-sm text-slate-500">{rfqs.filter(r => r.status === "Open").length} active requests</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus size={16} /> Create RFQ
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Draft", count: rfqs.filter(r => r.status === "Draft").length, color: "bg-slate-50 text-slate-600" },
          { label: "Open", count: rfqs.filter(r => r.status === "Open").length, color: "bg-blue-50 text-blue-700" },
          { label: "Closed", count: rfqs.filter(r => r.status === "Closed").length, color: "bg-red-50 text-red-600" },
          { label: "Awarded", count: rfqs.filter(r => r.status === "Awarded").length, color: "bg-green-50 text-green-700" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4 text-center">
            <p className={`text-2xl font-bold ${s.color.split(" ")[1]}`}>{s.count}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label} RFQs</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search RFQs..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
          {["All", "Draft", "Open", "Closed", "Awarded"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* RFQ List */}
      <div className="space-y-3">
        {filtered.map((rfq) => (
          <div key={rfq.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div
              className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => setExpandedRFQ(expandedRFQ === rfq.id ? null : rfq.id)}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <FileText size={18} className="text-blue-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-800">{rfq.title}</h3>
                    <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[rfq.status]}`}>
                      {STATUS_ICONS[rfq.status]} {rfq.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="text-xs text-slate-400">{rfq.id}</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{rfq.category}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar size={10} /> Due {rfq.deadline}</span>
                    <span className="text-xs text-slate-400">{rfq.vendors.length} vendors invited</span>
                  </div>
                </div>
              </div>
              <ChevronDown size={16} className={`text-slate-400 transition-transform ${expandedRFQ === rfq.id ? "rotate-180" : ""}`} />
            </div>
            {expandedRFQ === rfq.id && (
              <div className="border-t border-slate-100 p-5 bg-slate-50/50 space-y-4">
                <p className="text-sm text-slate-600">{rfq.description}</p>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Line Items</p>
                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead><tr className="bg-slate-50 border-b border-slate-100">
                        <th className="text-left text-xs font-semibold text-slate-500 px-4 py-2">Description</th>
                        <th className="text-left text-xs font-semibold text-slate-500 px-4 py-2">Qty</th>
                        <th className="text-left text-xs font-semibold text-slate-500 px-4 py-2">Unit</th>
                      </tr></thead>
                      <tbody>{rfq.items.map((item, i) => (
                        <tr key={i} className="border-t border-slate-50">
                          <td className="px-4 py-2 text-slate-700">{item.description}</td>
                          <td className="px-4 py-2 text-slate-600">{item.quantity}</td>
                          <td className="px-4 py-2 text-slate-500">{item.unit}</td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>Created: {rfq.createdDate}</span>
                  <span>•</span>
                  <span>By: {rfq.requester}</span>
                  <span>•</span>
                  <span>Vendors: {rfq.vendors.join(", ") || "None assigned"}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Create RFQ Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Create New RFQ</h3>
              <button onClick={() => setShowCreate(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">RFQ Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g., Office Laptop Procurement Q3"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {["IT Equipment", "Office Supplies", "Services", "Raw Materials", "Logistics"].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Response Deadline *</label>
                  <div className="relative">
                    <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                      className="w-full pl-9 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Describe the procurement requirements..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>

              {/* Line Items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">Line Items *</label>
                  <button onClick={addItem} className="text-xs text-blue-600 flex items-center gap-1 hover:underline"><Plus size={12} />Add Item</button>
                </div>
                <div className="space-y-2">
                  {form.items.map((item, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <input value={item.description} onChange={(e) => { const items = [...form.items]; items[i].description = e.target.value; setForm({ ...form, items }); }}
                        placeholder="Item description" className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <input type="number" value={item.quantity} onChange={(e) => { const items = [...form.items]; items[i].quantity = +e.target.value; setForm({ ...form, items }); }}
                        className="w-20 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <select value={item.unit} onChange={(e) => { const items = [...form.items]; items[i].unit = e.target.value; setForm({ ...form, items }); }}
                        className="w-24 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {["Units", "Pieces", "Kg", "Boxes", "Seats"].map((u) => <option key={u}>{u}</option>)}
                      </select>
                      {form.items.length > 1 && (
                        <button onClick={() => removeItem(i)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Vendor Assignment */}
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-2">Invite Vendors</label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_VENDORS.map((v) => (
                    <label key={v} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all text-sm ${
                      form.vendors.includes(v) ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 hover:border-slate-300"
                    }`}>
                      <input type="checkbox" checked={form.vendors.includes(v)} onChange={() => toggleVendor(v)} className="accent-blue-600" />
                      {v}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Attachments</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-4 text-center text-sm text-slate-400 hover:border-blue-300 cursor-pointer transition-colors">
                  <Paperclip size={18} className="mx-auto mb-1" />
                  <p>Drop files here or click to upload</p>
                  <p className="text-xs mt-1">PDF, DOC, XLS up to 10MB</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-100">
              <button onClick={() => setShowCreate(false)} className="flex-1 border border-slate-200 rounded-lg py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={createRFQ} disabled={!form.title} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-medium transition-colors">
                Publish RFQ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

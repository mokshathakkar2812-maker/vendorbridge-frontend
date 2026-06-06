import { useState } from "react";
import { FileText, Clock, CheckCircle, Edit, X, Plus, Trash2, Save } from "lucide-react";

interface QuotationItem { description: string; quantity: number; unitPrice: number; total: number; }
interface Quotation {
  id: string; rfqId: string; rfqTitle: string; vendor: string; submittedDate: string;
  deliveryDays: number; validityDays: number; notes: string; status: "Draft" | "Submitted" | "Accepted" | "Rejected";
  items: QuotationItem[]; tax: number;
}

const QUOTATIONS: Quotation[] = [
  {
    id: "QT-2024-001", rfqId: "RFQ-2024-001", rfqTitle: "Office Laptops & Accessories Q2",
    vendor: "TechPro Solutions", submittedDate: "03 Jun 2024", deliveryDays: 14, validityDays: 30,
    notes: "Includes 1-year on-site warranty. Bulk discount applied for orders above 20 units.",
    status: "Submitted",
    items: [
      { description: "Laptop 16GB RAM Core i7", quantity: 25, unitPrice: 78000, total: 1950000 },
      { description: "Wireless Mouse Logitech MX3", quantity: 25, unitPrice: 3500, total: 87500 },
    ],
    tax: 18,
  },
  {
    id: "QT-2024-002", rfqId: "RFQ-2024-001", rfqTitle: "Office Laptops & Accessories Q2",
    vendor: "CloudTech Systems", submittedDate: "04 Jun 2024", deliveryDays: 10, validityDays: 45,
    notes: "Free installation and data migration included. Same day support available.",
    status: "Submitted",
    items: [
      { description: "Laptop 16GB RAM Core i5", quantity: 25, unitPrice: 68000, total: 1700000 },
      { description: "Wireless Mouse HP Z3700", quantity: 25, unitPrice: 2800, total: 70000 },
    ],
    tax: 18,
  },
  {
    id: "QT-2024-003", rfqId: "RFQ-2024-002", rfqTitle: "Server Infrastructure Upgrade",
    vendor: "TechPro Solutions", submittedDate: "05 Jun 2024", deliveryDays: 21, validityDays: 60,
    notes: "Installation and commissioning charges extra. 3-year hardware warranty included.",
    status: "Accepted",
    items: [
      { description: "Dell PowerEdge R740 2U Rack Server", quantity: 4, unitPrice: 320000, total: 1280000 },
      { description: "EMC Unity 50TB SAN Storage", quantity: 1, unitPrice: 850000, total: 850000 },
    ],
    tax: 18,
  },
  {
    id: "QT-2024-004", rfqId: "RFQ-2024-003", rfqTitle: "Office Furniture Refurbishment",
    vendor: "Global Supplies Ltd", submittedDate: "Draft", deliveryDays: 30, validityDays: 30,
    notes: "",
    status: "Draft",
    items: [
      { description: "Herman Miller Ergonomic Chair", quantity: 50, unitPrice: 28000, total: 1400000 },
      { description: "Electric Standing Desk 160cm", quantity: 20, unitPrice: 45000, total: 900000 },
    ],
    tax: 18,
  },
];

const STATUS_STYLES: Record<string, string> = {
  Draft: "bg-slate-100 text-slate-600",
  Submitted: "bg-blue-100 text-blue-700",
  Accepted: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-600",
};

export function QuotationSubmission() {
  const [quotations, setQuotations] = useState(QUOTATIONS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Quotation | null>(null);
  const [filter, setFilter] = useState("All");

  const filtered = quotations.filter((q) => filter === "All" || q.status === filter);

  function startEdit(q: Quotation) {
    setEditForm({ ...q, items: q.items.map((i) => ({ ...i })) });
    setEditingId(q.id);
  }

  function saveEdit() {
    if (!editForm) return;
    setQuotations(quotations.map((q) => q.id === editForm.id ? { ...editForm, status: "Submitted", submittedDate: "06 Jun 2024" } : q));
    setEditingId(null);
    setEditForm(null);
  }

  function calcSubtotal(items: QuotationItem[]) { return items.reduce((s, i) => s + i.total, 0); }
  function calcTax(items: QuotationItem[], tax: number) { return calcSubtotal(items) * tax / 100; }
  function calcTotal(items: QuotationItem[], tax: number) { return calcSubtotal(items) + calcTax(items, tax); }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-800">Vendor Quotations</h2>
          <p className="text-sm text-slate-500">{quotations.length} quotations across {new Set(quotations.map(q => q.rfqId)).size} RFQs</p>
        </div>
        <div className="flex gap-2">
          {["All", "Draft", "Submitted", "Accepted", "Rejected"].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${filter === s ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((q) => {
          const subtotal = calcSubtotal(q.items);
          const taxAmt = calcTax(q.items, q.tax);
          const total = calcTotal(q.items, q.tax);

          return (
            <div key={q.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex items-start justify-between p-5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-slate-800">{q.rfqTitle}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[q.status]}`}>{q.status}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 flex-wrap">
                    <span>{q.id}</span>
                    <span>·</span>
                    <span>{q.rfqId}</span>
                    <span>·</span>
                    <span className="font-medium text-blue-600">{q.vendor}</span>
                    {q.status !== "Draft" && <span className="flex items-center gap-1"><Clock size={10} /> Submitted {q.submittedDate}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(q.status === "Draft" || q.status === "Submitted") && (
                    <button onClick={() => startEdit(q)} className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                      <Edit size={12} /> Edit
                    </button>
                  )}
                  {q.status === "Accepted" && (
                    <span className="flex items-center gap-1.5 text-xs bg-green-50 text-green-600 px-3 py-1.5 rounded-lg">
                      <CheckCircle size={12} /> Accepted
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5">
                {/* Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 rounded-lg">
                        <th className="text-left text-xs font-semibold text-slate-500 px-3 py-2">Description</th>
                        <th className="text-center text-xs font-semibold text-slate-500 px-3 py-2">Qty</th>
                        <th className="text-right text-xs font-semibold text-slate-500 px-3 py-2">Unit Price</th>
                        <th className="text-right text-xs font-semibold text-slate-500 px-3 py-2">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {q.items.map((item, i) => (
                        <tr key={i}>
                          <td className="px-3 py-2.5 text-slate-700">{item.description}</td>
                          <td className="px-3 py-2.5 text-center text-slate-600">{item.quantity}</td>
                          <td className="px-3 py-2.5 text-right text-slate-600">₹{item.unitPrice.toLocaleString("en-IN")}</td>
                          <td className="px-3 py-2.5 text-right font-medium text-slate-800">₹{item.total.toLocaleString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
                  <div className="text-sm text-slate-600 max-w-sm">
                    <div className="flex items-center gap-2 mb-1"><Clock size={13} className="text-blue-500" /><span className="font-medium">Delivery:</span> {q.deliveryDays} days</div>
                    <div className="flex items-center gap-2 mb-1"><FileText size={13} className="text-slate-400" /><span className="font-medium">Validity:</span> {q.validityDays} days</div>
                    {q.notes && <p className="text-xs text-slate-400 mt-2 bg-slate-50 p-2 rounded-lg">📝 {q.notes}</p>}
                  </div>
                  <div className="text-sm space-y-1 min-w-48">
                    <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
                    <div className="flex justify-between text-slate-600"><span>GST ({q.tax}%)</span><span>₹{taxAmt.toLocaleString("en-IN")}</span></div>
                    <div className="flex justify-between font-bold text-slate-800 border-t border-slate-200 pt-2 mt-1">
                      <span>Grand Total</span><span className="text-blue-600">₹{total.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingId && editForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-bold text-slate-800">Edit Quotation — {editForm.rfqTitle}</h3>
              <button onClick={() => { setEditingId(null); setEditForm(null); }} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Delivery (Days)</label>
                  <input type="number" value={editForm.deliveryDays} onChange={(e) => setEditForm({ ...editForm, deliveryDays: +e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Validity (Days)</label>
                  <input type="number" value={editForm.validityDays} onChange={(e) => setEditForm({ ...editForm, validityDays: +e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">Line Items</label>
                  <button onClick={() => setEditForm({ ...editForm, items: [...editForm.items, { description: "", quantity: 1, unitPrice: 0, total: 0 }] })}
                    className="text-xs text-blue-600 flex items-center gap-1 hover:underline"><Plus size={12} />Add Item</button>
                </div>
                <div className="space-y-2">
                  {editForm.items.map((item, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-center">
                      <input value={item.description} onChange={(e) => {
                        const items = [...editForm.items]; items[i] = { ...items[i], description: e.target.value }; setEditForm({ ...editForm, items });
                      }} placeholder="Description" className="col-span-5 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <input type="number" value={item.quantity} onChange={(e) => {
                        const items = [...editForm.items]; items[i] = { ...items[i], quantity: +e.target.value, total: +e.target.value * items[i].unitPrice }; setEditForm({ ...editForm, items });
                      }} className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <input type="number" value={item.unitPrice} onChange={(e) => {
                        const items = [...editForm.items]; items[i] = { ...items[i], unitPrice: +e.target.value, total: items[i].quantity * +e.target.value }; setEditForm({ ...editForm, items });
                      }} placeholder="Unit Price" className="col-span-3 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <div className="col-span-1 text-xs text-slate-500 text-right">₹{item.total.toLocaleString("en-IN")}</div>
                      {editForm.items.length > 1 && (
                        <button onClick={() => setEditForm({ ...editForm, items: editForm.items.filter((_, idx) => idx !== i) })}
                          className="col-span-1 p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 size={14} /></button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Notes</label>
                <textarea value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} rows={3}
                  placeholder="Add any notes or terms..."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-100">
              <button onClick={() => { setEditingId(null); setEditForm(null); }} className="flex-1 border border-slate-200 rounded-lg py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={saveEdit} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Save size={14} /> Submit Quotation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

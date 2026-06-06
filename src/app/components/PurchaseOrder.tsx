import { useState } from "react";
import { FileText, Download, Printer, Mail, CheckCircle, Clock, Truck, X, Send } from "lucide-react";

interface POItem { description: string; qty: number; unit: string; unitPrice: number; total: number; }
interface PO {
  id: string; date: string; dueDate: string; vendor: string; vendorAddress: string;
  vendorGST: string; vendorEmail: string; rfqId: string; approvalId: string;
  buyerName: string; buyerAddress: string; buyerGST: string;
  items: POItem[]; notes: string; tax: number;
  status: "Issued" | "Acknowledged" | "In Progress" | "Delivered" | "Invoiced";
  invoiceId?: string;
}

const POS: PO[] = [
  {
    id: "PO-2024-001", date: "05 Jun 2024", dueDate: "26 Jun 2024",
    vendor: "TechPro Solutions Pvt Ltd", vendorAddress: "42 Tech Park, Whitefield, Bengaluru 560066",
    vendorGST: "29ABCDE1234F1Z5", vendorEmail: "vikram@techpro.in",
    rfqId: "RFQ-2024-002", approvalId: "APP-001",
    buyerName: "Acme Corp Pvt Ltd", buyerAddress: "12 Industrial Area, Andheri East, Mumbai 400069",
    buyerGST: "27AAAAA0000A1Z5",
    items: [
      { description: "Dell PowerEdge R740 2U Rack Server", qty: 4, unit: "Units", unitPrice: 320000, total: 1280000 },
      { description: "EMC Unity 50TB SAN Storage", qty: 1, unit: "Unit", unitPrice: 850000, total: 850000 },
    ],
    notes: "Delivery to IT department, 3rd Floor. Contact: Arjun Mehta (+91 98765 43210). Installation included.",
    tax: 18, status: "Delivered", invoiceId: "INV-2024-001",
  },
  {
    id: "PO-2024-002", date: "06 Jun 2024", dueDate: "16 Jun 2024",
    vendor: "CloudTech Systems", vendorAddress: "8-2-123, Road No. 2, Banjara Hills, Hyderabad 500034",
    vendorGST: "36UVWXY7890N5D9", vendorEmail: "nikhil@cloudtech.io",
    rfqId: "RFQ-2024-001", approvalId: "APP-002",
    buyerName: "Acme Corp Pvt Ltd", buyerAddress: "12 Industrial Area, Andheri East, Mumbai 400069",
    buyerGST: "27AAAAA0000A1Z5",
    items: [
      { description: "Laptop 16GB Core i5 (HP EliteBook 845 G10)", qty: 25, unit: "Units", unitPrice: 68000, total: 1700000 },
      { description: "Wireless Mouse HP Z3700", qty: 25, unit: "Units", unitPrice: 2800, total: 70000 },
    ],
    notes: "Deliver to HR department for new joiner kit assembly.",
    tax: 18, status: "In Progress",
  },
];

const STATUS_STYLES: Record<string, string> = {
  Issued: "bg-blue-100 text-blue-700",
  Acknowledged: "bg-purple-100 text-purple-700",
  "In Progress": "bg-amber-100 text-amber-700",
  Delivered: "bg-green-100 text-green-700",
  Invoiced: "bg-slate-100 text-slate-600",
};

const STATUS_FLOW = ["Issued", "Acknowledged", "In Progress", "Delivered", "Invoiced"];

function InvoiceView({ po, onClose }: { po: PO; onClose: () => void }) {
  const [sendModal, setSendModal] = useState(false);
  const [emailTo, setEmailTo] = useState(po.vendorEmail);
  const [emailSent, setEmailSent] = useState(false);

  const subtotal = po.items.reduce((s, i) => s + i.total, 0);
  const taxAmt = subtotal * po.tax / 100;
  const grandTotal = subtotal + taxAmt;
  const invoiceId = po.invoiceId || `INV-${po.id.replace("PO-", "")}`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 rounded-t-2xl">
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="flex items-center gap-1.5 text-sm bg-slate-700 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg transition-colors">
              <Printer size={14} /> Print
            </button>
            <button className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors">
              <Download size={14} /> Download PDF
            </button>
            <button onClick={() => setSendModal(true)} className="flex items-center gap-1.5 text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg transition-colors">
              <Mail size={14} /> Send Email
            </button>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-white"><X size={18} /></button>
        </div>

        {/* Invoice body */}
        <div className="p-8 space-y-6" id="invoice-print">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <FileText size={14} className="text-white" />
                </div>
                <span className="font-bold text-blue-600 text-lg">INVOICE</span>
              </div>
              <p className="text-xl font-bold text-slate-800">{invoiceId}</p>
              <p className="text-sm text-slate-500">PO Ref: {po.id}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-800">{po.buyerName}</p>
              <p className="text-sm text-slate-500 whitespace-pre-line">{po.buyerAddress}</p>
              <p className="text-sm text-slate-500">GSTIN: {po.buyerGST}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Bill To</p>
              <p className="font-semibold text-slate-800">{po.vendor}</p>
              <p className="text-slate-500">{po.vendorAddress}</p>
              <p className="text-slate-500">GSTIN: {po.vendorGST}</p>
              <p className="text-blue-600">{po.vendorEmail}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Invoice Details</p>
              <div className="space-y-1">
                <div className="flex justify-between"><span className="text-slate-500">Invoice Date</span><span className="font-medium">{po.date}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Due Date</span><span className="font-medium">{po.dueDate}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">RFQ Ref</span><span className="font-medium">{po.rfqId}</span></div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="rounded-xl overflow-hidden border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="text-left px-4 py-3">#</th>
                  <th className="text-left px-4 py-3">Description</th>
                  <th className="text-center px-4 py-3">Qty</th>
                  <th className="text-center px-4 py-3">Unit</th>
                  <th className="text-right px-4 py-3">Unit Price</th>
                  <th className="text-right px-4 py-3">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {po.items.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}>
                    <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                    <td className="px-4 py-3 text-slate-700 font-medium">{item.description}</td>
                    <td className="px-4 py-3 text-center text-slate-600">{item.qty}</td>
                    <td className="px-4 py-3 text-center text-slate-500">{item.unit}</td>
                    <td className="px-4 py-3 text-right text-slate-600">₹{item.unitPrice.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-800">₹{item.total.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals + notes */}
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            {po.notes && (
              <div className="flex-1 bg-amber-50 rounded-xl p-4 border border-amber-200">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Notes</p>
                <p className="text-sm text-slate-600">{po.notes}</p>
              </div>
            )}
            <div className="min-w-60 space-y-2 text-sm">
              <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-100">
                <span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-100">
                <span>IGST @ {po.tax}%</span><span>₹{taxAmt.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-800 text-base bg-blue-50 rounded-lg px-3 py-2">
                <span>Total</span><span className="text-blue-600">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-slate-400 border-t border-slate-100 pt-4">
            This is a computer-generated invoice. No signature required. | VendorBridge ERP
          </div>
        </div>
      </div>

      {sendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-bold text-slate-800">Send Invoice via Email</h3>
            {emailSent ? (
              <div className="text-center py-6">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                <p className="font-semibold text-slate-800">Invoice sent!</p>
                <p className="text-sm text-slate-500 mt-1">Sent to {emailTo}</p>
                <button onClick={() => { setSendModal(false); setEmailSent(false); }} className="mt-4 text-blue-600 text-sm hover:underline">Close</button>
              </div>
            ) : (
              <>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">To</label>
                  <input value={emailTo} onChange={(e) => setEmailTo(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Subject</label>
                  <input defaultValue={`Invoice ${invoiceId} from Acme Corp`}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Message</label>
                  <textarea rows={3} defaultValue={`Dear ${po.vendor},\n\nPlease find attached invoice ${invoiceId} against PO ${po.id}.\n\nRegards,\nAccounts Team`}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setSendModal(false)} className="flex-1 border border-slate-200 rounded-lg py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                  <button onClick={() => setEmailSent(true)} className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Send size={14} /> Send Invoice
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function PurchaseOrder() {
  const [pos] = useState(POS);
  const [viewInvoice, setViewInvoice] = useState<PO | null>(null);
  const [filter, setFilter] = useState("All");

  const filtered = pos.filter(p => filter === "All" || p.status === filter);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-bold text-slate-800">Purchase Orders & Invoices</h2>
          <p className="text-sm text-slate-500">{pos.length} purchase orders</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", ...STATUS_FLOW].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${filter === s ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((po) => {
          const subtotal = po.items.reduce((s, i) => s + i.total, 0);
          const grandTotal = subtotal * (1 + po.tax / 100);
          const currentStep = STATUS_FLOW.indexOf(po.status);

          return (
            <div key={po.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-800">{po.id}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[po.status]}`}>{po.status}</span>
                    </div>
                    <p className="text-sm font-medium text-blue-600 mt-0.5">{po.vendor}</p>
                    <div className="flex gap-3 mt-1 text-xs text-slate-400 flex-wrap">
                      <span>Issued: {po.date}</span>
                      <span>Due: {po.dueDate}</span>
                      <span>Ref: {po.rfqId}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-slate-800">₹{(grandTotal / 100000).toFixed(1)}L</p>
                    <p className="text-xs text-slate-400">{po.items.length} line items · incl. GST</p>
                    <div className="flex gap-2 mt-2 justify-end">
                      <button onClick={() => setViewInvoice(po)}
                        className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                        <FileText size={12} /> {po.invoiceId ? "View Invoice" : "Generate Invoice"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-0">
                    {STATUS_FLOW.map((step, i) => {
                      const done = i <= currentStep;
                      const active = i === currentStep;
                      return (
                        <div key={step} className="flex items-center flex-1">
                          <div className={`flex flex-col items-center ${i === 0 ? "" : "flex-1"}`}>
                            {i > 0 && <div className={`h-0.5 w-full mb-2 ${done ? "bg-blue-500" : "bg-slate-200"}`} />}
                          </div>
                          <div className="flex flex-col items-center shrink-0">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              done ? active ? "bg-blue-600 text-white ring-4 ring-blue-100" : "bg-green-500 text-white" : "bg-slate-200 text-slate-400"
                            }`}>
                              {done && !active ? <CheckCircle size={12} /> : i + 1}
                            </div>
                            <span className={`text-xs mt-1 whitespace-nowrap ${active ? "text-blue-600 font-semibold" : done ? "text-green-600" : "text-slate-400"}`}>{step}</span>
                          </div>
                          {i < STATUS_FLOW.length - 1 && (
                            <div className={`h-0.5 flex-1 ${i < currentStep ? "bg-green-400" : "bg-slate-200"}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items summary */}
                <div className="mt-4 bg-slate-50 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead><tr className="border-b border-slate-200">
                      <th className="text-left text-slate-400 font-semibold px-3 py-2">Item</th>
                      <th className="text-center text-slate-400 font-semibold px-3 py-2">Qty</th>
                      <th className="text-right text-slate-400 font-semibold px-3 py-2">Amount</th>
                    </tr></thead>
                    <tbody>{po.items.map((item, i) => (
                      <tr key={i} className="border-t border-slate-100">
                        <td className="px-3 py-2 text-slate-600">{item.description}</td>
                        <td className="px-3 py-2 text-center text-slate-500">{item.qty}</td>
                        <td className="px-3 py-2 text-right font-medium text-slate-700">₹{item.total.toLocaleString("en-IN")}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {viewInvoice && <InvoiceView po={viewInvoice} onClose={() => setViewInvoice(null)} />}
    </div>
  );
}

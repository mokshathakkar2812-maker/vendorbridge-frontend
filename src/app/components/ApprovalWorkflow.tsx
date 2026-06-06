import { useState } from "react";
import { CheckCircle, XCircle, Clock, AlertTriangle, MessageSquare, User, ChevronDown, ChevronRight } from "lucide-react";

interface ApprovalStep { step: string; approver: string; status: "Approved" | "Rejected" | "Pending" | "Skipped"; date?: string; remarks?: string; }
interface Approval {
  id: string; rfqTitle: string; rfqId: string; requester: string; requestDate: string;
  amount: number; priority: "Critical" | "High" | "Medium" | "Low";
  status: "Pending" | "Approved" | "Rejected" | "In Review";
  steps: ApprovalStep[]; description: string; vendor: string;
}

const APPROVALS: Approval[] = [
  {
    id: "APP-001", rfqTitle: "Server Infrastructure Upgrade", rfqId: "RFQ-2024-002",
    requester: "Arjun Mehta", requestDate: "03 Jun 2024", amount: 2513400,
    priority: "Critical", status: "Approved",
    vendor: "TechPro Solutions",
    description: "Upgrade of critical server infrastructure to meet growing data processing demands.",
    steps: [
      { step: "Procurement Review", approver: "Priya Sharma", status: "Approved", date: "04 Jun 2024", remarks: "Quotations reviewed and TechPro selected as lowest bidder with best specs." },
      { step: "Finance Review", approver: "Rajan Iyer", status: "Approved", date: "05 Jun 2024", remarks: "Budget available under IT capex allocation Q2." },
      { step: "Manager Approval", approver: "Rajesh Kumar", status: "Approved", date: "05 Jun 2024", remarks: "Approved. Critical infrastructure upgrade needed." },
    ],
  },
  {
    id: "APP-002", rfqTitle: "Office Laptops & Accessories Q2", rfqId: "RFQ-2024-001",
    requester: "Priya Sharma", requestDate: "04 Jun 2024", amount: 2088600,
    priority: "High", status: "In Review",
    vendor: "CloudTech Systems",
    description: "25 laptops and accessories for Q2 new hires across engineering and design teams.",
    steps: [
      { step: "Procurement Review", approver: "Arjun Mehta", status: "Approved", date: "05 Jun 2024", remarks: "CloudTech selected — lowest price and faster delivery." },
      { step: "Finance Review", approver: "Rajan Iyer", status: "Pending" },
      { step: "Manager Approval", approver: "Rajesh Kumar", status: "Pending" },
    ],
  },
  {
    id: "APP-003", rfqTitle: "Office Furniture Refurbishment", rfqId: "RFQ-2024-003",
    requester: "Priya Sharma", requestDate: "06 Jun 2024", amount: 2714000,
    priority: "Medium", status: "Pending",
    vendor: "Global Supplies Ltd",
    description: "Ergonomic chairs and standing desks for new floor expansion (50 workstations).",
    steps: [
      { step: "Procurement Review", approver: "Arjun Mehta", status: "Pending" },
      { step: "Finance Review", approver: "Rajan Iyer", status: "Pending" },
      { step: "Manager Approval", approver: "Rajesh Kumar", status: "Pending" },
    ],
  },
  {
    id: "APP-004", rfqTitle: "Marketing Campaign Materials", rfqId: "RFQ-2024-005",
    requester: "Sneha Patel", requestDate: "06 Jun 2024", amount: 85000,
    priority: "Low", status: "Pending",
    vendor: "Meridian Services",
    description: "Brochure design and printing for Q3 marketing campaign.",
    steps: [
      { step: "Procurement Review", approver: "Arjun Mehta", status: "Pending" },
      { step: "Manager Approval", approver: "Rajesh Kumar", status: "Pending" },
    ],
  },
];

const STATUS_STYLES: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700",
  "In Review": "bg-blue-100 text-blue-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-600",
};

const PRIORITY_STYLES: Record<string, string> = {
  Critical: "bg-red-100 text-red-700 border-red-200",
  High: "bg-orange-100 text-orange-700 border-orange-200",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Low: "bg-slate-100 text-slate-600 border-slate-200",
};

const STEP_ICONS: Record<string, React.ReactNode> = {
  Approved: <CheckCircle size={16} className="text-green-500" />,
  Rejected: <XCircle size={16} className="text-red-500" />,
  Pending: <Clock size={16} className="text-slate-300" />,
  Skipped: <ChevronRight size={16} className="text-slate-300" />,
};

export function ApprovalWorkflow() {
  const [approvals, setApprovals] = useState(APPROVALS);
  const [expanded, setExpanded] = useState<string | null>("APP-002");
  const [remarkText, setRemarkText] = useState("");
  const [showRemarkFor, setShowRemarkFor] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  const filtered = approvals.filter(a => filter === "All" || a.status === filter);

  function handleAction(appId: string, action: "Approved" | "Rejected") {
    setApprovals(prev => prev.map(a => {
      if (a.id !== appId) return a;
      const steps = a.steps.map((s) => {
        if (s.status === "Pending") return { ...s, status: action, date: "06 Jun 2024", remarks: remarkText || (action === "Approved" ? "Approved." : "Rejected.") };
        return s;
      });
      const allApproved = steps.every(s => s.status === "Approved");
      const anyRejected = steps.some(s => s.status === "Rejected");
      return { ...a, steps, status: anyRejected ? "Rejected" : allApproved ? "Approved" : "In Review" };
    }));
    setRemarkText("");
    setShowRemarkFor(null);
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-bold text-slate-800">Approval Workflow</h2>
          <p className="text-sm text-slate-500">{approvals.filter(a => a.status === "Pending" || a.status === "In Review").length} items awaiting action</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Pending", "In Review", "Approved", "Rejected"].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${filter === s ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {s} {s === "All" ? "" : `(${approvals.filter(a => a.status === s).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Pending", count: approvals.filter(a => a.status === "Pending").length, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "In Review", count: approvals.filter(a => a.status === "In Review").length, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Approved", count: approvals.filter(a => a.status === "Approved").length, color: "text-green-600", bg: "bg-green-50" },
          { label: "Rejected", count: approvals.filter(a => a.status === "Rejected").length, color: "text-red-500", bg: "bg-red-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Approvals list */}
      <div className="space-y-3">
        {filtered.map((a) => {
          const isExpanded = expanded === a.id;
          const currentStep = a.steps.find(s => s.status === "Pending");
          const canAct = a.status === "Pending" || a.status === "In Review";

          return (
            <div key={a.id} className={`bg-white rounded-xl border-2 overflow-hidden transition-all ${
              a.status === "Approved" ? "border-green-200" :
              a.status === "Rejected" ? "border-red-200" :
              a.priority === "Critical" ? "border-red-300" : "border-slate-200"
            }`}>
              {/* Header */}
              <div
                className="flex items-start justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpanded(isExpanded ? null : a.id)}
              >
                <div className="flex items-start gap-4 flex-1">
                  {a.priority === "Critical" && <AlertTriangle size={18} className="text-red-500 mt-0.5 shrink-0" />}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-800">{a.rfqTitle}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[a.status]}`}>{a.status}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${PRIORITY_STYLES[a.priority]}`}>{a.priority}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 flex-wrap">
                      <span>{a.id} · {a.rfqId}</span>
                      <span className="flex items-center gap-1"><User size={10} />{a.requester}</span>
                      <span>Requested: {a.requestDate}</span>
                      <span className="font-medium text-slate-600">Vendor: {a.vendor}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="font-bold text-slate-800">₹{(a.amount / 100000).toFixed(1)}L</p>
                    <p className="text-xs text-slate-400">{a.steps.filter(s => s.status === "Approved").length}/{a.steps.length} steps done</p>
                  </div>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-100 p-5 space-y-5">
                  <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">{a.description}</p>

                  {/* Steps timeline */}
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Approval Chain</p>
                    <div className="space-y-3">
                      {a.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              step.status === "Approved" ? "bg-green-100" :
                              step.status === "Rejected" ? "bg-red-100" : "bg-slate-100"
                            }`}>
                              {STEP_ICONS[step.status]}
                            </div>
                            {i < a.steps.length - 1 && (
                              <div className={`w-0.5 h-8 mt-1 ${step.status === "Approved" ? "bg-green-200" : "bg-slate-200"}`} />
                            )}
                          </div>
                          <div className="flex-1 pb-2">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-slate-700">{step.step}</p>
                              {step.date && <span className="text-xs text-slate-400">{step.date}</span>}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{step.approver}</p>
                            {step.remarks && (
                              <p className="text-xs text-slate-500 bg-slate-50 rounded-lg p-2 mt-1.5 flex items-start gap-1.5">
                                <MessageSquare size={11} className="shrink-0 mt-0.5" />{step.remarks}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action area */}
                  {canAct && currentStep && (
                    <div className="bg-blue-50 rounded-xl p-4 space-y-3 border border-blue-200">
                      <p className="text-sm font-medium text-blue-800">Pending: <span className="font-semibold">{currentStep.step}</span> → {currentStep.approver}</p>
                      {showRemarkFor === a.id ? (
                        <div className="space-y-3">
                          <textarea value={remarkText} onChange={(e) => setRemarkText(e.target.value)} rows={2}
                            placeholder="Add approval remarks..."
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                          <div className="flex gap-2">
                            <button onClick={() => handleAction(a.id, "Approved")}
                              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                              <CheckCircle size={14} /> Approve
                            </button>
                            <button onClick={() => handleAction(a.id, "Rejected")}
                              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                              <XCircle size={14} /> Reject
                            </button>
                            <button onClick={() => setShowRemarkFor(null)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setShowRemarkFor(a.id)}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                          <MessageSquare size={14} /> Take Action
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

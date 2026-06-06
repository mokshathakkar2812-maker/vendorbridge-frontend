import { useState } from "react";
import { Star, Clock, Award, TrendingDown, CheckCircle, ArrowUpDown } from "lucide-react";

interface QuoteRow {
  vendor: string; rating: number; deliveryDays: number; validityDays: number;
  items: { description: string; qty: number; unitPrice: number; total: number }[];
  subtotal: number; tax: number; grandTotal: number; notes: string; status: "Pending" | "Selected" | "Rejected";
}

const RFQS_FOR_COMPARISON = ["RFQ-2024-001: Office Laptops Q2", "RFQ-2024-002: Server Infrastructure Upgrade"];

const COMPARISON_DATA: Record<string, QuoteRow[]> = {
  "RFQ-2024-001: Office Laptops Q2": [
    {
      vendor: "TechPro Solutions", rating: 4.8, deliveryDays: 14, validityDays: 30,
      items: [
        { description: "Laptop 16GB Core i7", qty: 25, unitPrice: 78000, total: 1950000 },
        { description: "Wireless Mouse", qty: 25, unitPrice: 3500, total: 87500 },
      ],
      subtotal: 2037500, tax: 18, grandTotal: 2404250,
      notes: "1-year on-site warranty. Bulk discount applied.", status: "Pending",
    },
    {
      vendor: "CloudTech Systems", rating: 4.6, deliveryDays: 10, validityDays: 45,
      items: [
        { description: "Laptop 16GB Core i5", qty: 25, unitPrice: 68000, total: 1700000 },
        { description: "Wireless Mouse HP", qty: 25, unitPrice: 2800, total: 70000 },
      ],
      subtotal: 1770000, tax: 18, grandTotal: 2088600,
      notes: "Free installation included. Same day support.", status: "Pending",
    },
  ],
  "RFQ-2024-002: Server Infrastructure Upgrade": [
    {
      vendor: "TechPro Solutions", rating: 4.8, deliveryDays: 21, validityDays: 60,
      items: [
        { description: "Dell PowerEdge R740", qty: 4, unitPrice: 320000, total: 1280000 },
        { description: "EMC Unity 50TB SAN", qty: 1, unitPrice: 850000, total: 850000 },
      ],
      subtotal: 2130000, tax: 18, grandTotal: 2513400,
      notes: "3-year hardware warranty included.", status: "Selected",
    },
    {
      vendor: "CloudTech Systems", rating: 4.6, deliveryDays: 28, validityDays: 45,
      items: [
        { description: "HP ProLiant DL380 G10", qty: 4, unitPrice: 295000, total: 1180000 },
        { description: "NetApp AFF A200 50TB", qty: 1, unitPrice: 920000, total: 920000 },
      ],
      subtotal: 2100000, tax: 18, grandTotal: 2478000,
      notes: "Includes 2-year support contract.", status: "Rejected",
    },
  ],
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={11} className={s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
      ))}
      <span className="text-xs text-slate-500 ml-1">{rating}</span>
    </div>
  );
}

export function QuotationComparison() {
  const [selectedRFQ, setSelectedRFQ] = useState(RFQS_FOR_COMPARISON[0]);
  const [data, setData] = useState(COMPARISON_DATA);
  const [sortBy, setSortBy] = useState<"price" | "delivery" | "rating">("price");

  const quotes = [...(data[selectedRFQ] || [])].sort((a, b) => {
    if (sortBy === "price") return a.grandTotal - b.grandTotal;
    if (sortBy === "delivery") return a.deliveryDays - b.deliveryDays;
    return b.rating - a.rating;
  });

  const lowestPrice = Math.min(...quotes.map(q => q.grandTotal));
  const fastestDelivery = Math.min(...quotes.map(q => q.deliveryDays));
  const highestRating = Math.max(...quotes.map(q => q.rating));

  function selectVendor(vendor: string) {
    setData((prev) => ({
      ...prev,
      [selectedRFQ]: prev[selectedRFQ].map((q) => ({
        ...q,
        status: q.vendor === vendor ? "Selected" : "Rejected",
      })),
    }));
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-bold text-slate-800">Quotation Comparison</h2>
          <p className="text-sm text-slate-500">Side-by-side vendor comparison</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <select value={selectedRFQ} onChange={(e) => setSelectedRFQ(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
            {RFQS_FOR_COMPARISON.map((r) => <option key={r}>{r}</option>)}
          </select>
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
            {(["price", "delivery", "rating"] as const).map((s) => (
              <button key={s} onClick={() => setSortBy(s)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize ${sortBy === s ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}>
                <ArrowUpDown size={11} /> {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Summary badges */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Lowest Price", value: `₹${lowestPrice.toLocaleString("en-IN")}`, vendor: quotes.find(q => q.grandTotal === lowestPrice)?.vendor, icon: <TrendingDown size={16} className="text-green-600" />, bg: "bg-green-50 border-green-200" },
          { label: "Fastest Delivery", value: `${fastestDelivery} days`, vendor: quotes.find(q => q.deliveryDays === fastestDelivery)?.vendor, icon: <Clock size={16} className="text-blue-600" />, bg: "bg-blue-50 border-blue-200" },
          { label: "Top Rated Vendor", value: `${highestRating} ★`, vendor: quotes.find(q => q.rating === highestRating)?.vendor, icon: <Star size={16} className="text-amber-600" />, bg: "bg-amber-50 border-amber-200" },
        ].map((badge) => (
          <div key={badge.label} className={`${badge.bg} rounded-xl border p-4 flex items-center gap-3`}>
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">{badge.icon}</div>
            <div>
              <p className="text-xs text-slate-500">{badge.label}</p>
              <p className="font-bold text-slate-800">{badge.value}</p>
              <p className="text-xs text-slate-500">{badge.vendor}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Cards */}
      <div className={`grid gap-4 ${quotes.length >= 2 ? "lg:grid-cols-2" : "grid-cols-1 max-w-lg"}`}>
        {quotes.map((q, idx) => {
          const isLowest = q.grandTotal === lowestPrice;
          const isFastest = q.deliveryDays === fastestDelivery;
          const isTopRated = q.rating === highestRating;

          return (
            <div key={q.vendor} className={`bg-white rounded-xl border-2 overflow-hidden transition-all ${
              q.status === "Selected" ? "border-green-400 shadow-lg shadow-green-100" :
              q.status === "Rejected" ? "border-red-200 opacity-60" :
              idx === 0 && sortBy === "price" ? "border-blue-300 shadow-md" : "border-slate-200"
            }`}>
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-800">{q.vendor}</h3>
                      {q.status === "Selected" && (
                        <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          <Award size={11} /> Selected
                        </span>
                      )}
                      {q.status === "Rejected" && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">Rejected</span>
                      )}
                    </div>
                    <StarRating rating={q.rating} />
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">₹{(q.grandTotal / 100000).toFixed(1)}L</p>
                    <p className="text-xs text-slate-400">incl. GST</p>
                  </div>
                </div>

                {/* Highlight badges */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {isLowest && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><TrendingDown size={10} />Lowest Price</span>}
                  {isFastest && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><Clock size={10} />Fastest Delivery</span>}
                  {isTopRated && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><Star size={10} />Top Rated</span>}
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Key metrics */}
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="bg-slate-50 rounded-lg p-2.5">
                    <p className="font-bold text-slate-800">{q.deliveryDays}d</p>
                    <p className="text-xs text-slate-400">Delivery</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5">
                    <p className="font-bold text-slate-800">{q.validityDays}d</p>
                    <p className="text-xs text-slate-400">Validity</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5">
                    <p className="font-bold text-slate-800">{q.tax}%</p>
                    <p className="text-xs text-slate-400">GST</p>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Line Items</p>
                  <div className="space-y-1.5">
                    {q.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-slate-600 flex-1 pr-2">{item.description} ×{item.qty}</span>
                        <span className="font-medium text-slate-800">₹{item.total.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-slate-50 rounded-lg p-3 space-y-1 text-sm">
                  <div className="flex justify-between text-slate-600"><span>Subtotal</span><span>₹{q.subtotal.toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between text-slate-600"><span>GST ({q.tax}%)</span><span>₹{(q.subtotal * q.tax / 100).toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between font-bold text-slate-800 border-t border-slate-200 pt-1 mt-1"><span>Grand Total</span><span className="text-blue-600">₹{q.grandTotal.toLocaleString("en-IN")}</span></div>
                </div>

                {q.notes && <p className="text-xs text-slate-500 bg-blue-50 p-2.5 rounded-lg">📝 {q.notes}</p>}

                {q.status === "Pending" && (
                  <button onClick={() => selectVendor(q.vendor)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <CheckCircle size={15} /> Select This Vendor
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

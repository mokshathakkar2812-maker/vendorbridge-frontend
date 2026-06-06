import { useState } from "react";
import { Package, Eye, EyeOff, ArrowRight } from "lucide-react";

type Mode = "login" | "signup" | "forgot";

interface LoginProps {
  onLogin: (email: string, role: string, name: string) => void;
}

const DEMO_ACCOUNTS = [
  { label: "Admin", email: "admin@vendorbridge.com", password: "admin123", role: "Admin", name: "Arjun Mehta" },
  { label: "Procurement Officer", email: "officer@vendorbridge.com", password: "officer123", role: "Procurement Officer", name: "Priya Sharma" },
  { label: "Manager", email: "manager@vendorbridge.com", password: "manager123", role: "Manager", name: "Rajesh Kumar" },
  { label: "Vendor", email: "vendor@acme.com", password: "vendor123", role: "Vendor", name: "ACME Supplies" },
];

export function Login({ onLogin }: LoginProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("Procurement Officer");
  const [error, setError] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const match = DEMO_ACCOUNTS.find((a) => a.email === email && a.password === password);
    if (match) {
      onLogin(match.email, match.role, match.name);
    } else {
      setError("Invalid email or password.");
    }
  }

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email || !password) { setError("All fields are required."); return; }
    onLogin(email, role, name);
  }

  function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setForgotSent(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl">
        {/* Left panel */}
        <div className="hidden lg:flex flex-col justify-between bg-blue-600 p-10 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Package size={20} />
            </div>
            <div>
              <p className="font-bold text-lg leading-none">VendorBridge</p>
              <p className="text-blue-200 text-xs">Procurement & Vendor ERP</p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold leading-tight mb-4">
              Streamline your<br />procurement workflow
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed mb-8">
              Manage vendors, RFQs, quotations, approvals, and invoices all from one centralized platform.
            </p>
            <div className="space-y-3">
              {["Vendor Management & RFQ Creation", "Quotation Comparison & Approvals", "Auto PO & Invoice Generation"].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <ArrowRight size={10} />
                  </div>
                  <span className="text-sm text-blue-100">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <p className="text-xs text-blue-200 mb-3">Demo Accounts</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.label}
                  onClick={() => { setEmail(a.email); setPassword(a.password); setMode("login"); }}
                  className="text-left p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                >
                  <p className="text-xs font-medium">{a.label}</p>
                  <p className="text-xs text-blue-200 truncate">{a.email}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="bg-white p-8 lg:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <Package size={20} className="text-blue-600" />
            <span className="font-bold text-slate-800">VendorBridge</span>
          </div>

          {mode === "login" && (
            <>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">Welcome back</h3>
              <p className="text-slate-500 text-sm mb-6">Sign in to your account to continue</p>
              <form onSubmit={handleLogin} className="space-y-4">
                {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Email address</label>
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <button type="button" onClick={() => { setMode("forgot"); setError(""); }} className="text-xs text-blue-600 mt-1 hover:underline">
                    Forgot password?
                  </button>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-sm font-medium transition-colors">
                  Sign In
                </button>
              </form>
              <p className="text-sm text-slate-500 mt-4 text-center">
                Don't have an account?{" "}
                <button onClick={() => { setMode("signup"); setError(""); }} className="text-blue-600 hover:underline font-medium">Create one</button>
              </p>
            </>
          )}

          {mode === "signup" && (
            <>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">Create account</h3>
              <p className="text-slate-500 text-sm mb-6">Join VendorBridge today</p>
              <form onSubmit={handleSignup} className="space-y-4">
                {error && <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Full Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Email address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Role</label>
                  <select value={role} onChange={(e) => setRole(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
                    <option>Admin</option>
                    <option>Procurement Officer</option>
                    <option>Manager</option>
                    <option>Vendor</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 block mb-1">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-sm font-medium transition-colors">
                  Create Account
                </button>
              </form>
              <p className="text-sm text-slate-500 mt-4 text-center">
                Already have an account?{" "}
                <button onClick={() => { setMode("login"); setError(""); }} className="text-blue-600 hover:underline font-medium">Sign in</button>
              </p>
            </>
          )}

          {mode === "forgot" && (
            <>
              <h3 className="text-2xl font-bold text-slate-800 mb-1">Reset password</h3>
              <p className="text-slate-500 text-sm mb-6">We'll send a reset link to your email</p>
              {forgotSent ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-green-700 text-sm font-medium">Reset link sent!</p>
                  <p className="text-green-600 text-xs mt-1">Check your inbox at {email}</p>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700 block mb-1">Email address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50" />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2.5 text-sm font-medium transition-colors">
                    Send Reset Link
                  </button>
                </form>
              )}
              <button onClick={() => { setMode("login"); setForgotSent(false); setError(""); }} className="text-sm text-blue-600 hover:underline mt-4 block text-center">
                ← Back to sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

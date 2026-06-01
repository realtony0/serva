import Link from "next/link";
import {
  QrCode,
  Zap,
  ChefHat,
  CreditCard,
  Palette,
  BarChart3,
  Bell,
  Star,
  Shield,
  Check,
  ArrowRight,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Timer,
} from "lucide-react";
import Pricing from "@/components/Pricing";

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <QrCode className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900">Serva</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">How it works</a>
          <a href="#pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
          <a href="#testimonials" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Testimonials</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Try for free
          </Link>
        </div>
      </div>
    </header>
  );
}

// ── Dashboard Mockup ──────────────────────────────────────────────────────────

function DashboardMockup() {
  const orders = [
    { id: "#041", table: "Table 4", items: "Thieboudienne, Bissap", amount: "5 800", status: "preparing", time: "2 min" },
    { id: "#040", table: "Table 7", items: "Burger Classic, Frites", amount: "3 200", time: "8 min", status: "ready" },
    { id: "#039", table: "Table 2", items: "Pizza Margherita", amount: "4 500", time: "14 min", status: "served" },
  ];

  const statusStyle: Record<string, string> = {
    preparing: "bg-amber-100 text-amber-700",
    ready: "bg-green-100 text-green-700",
    served: "bg-slate-100 text-slate-500",
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Glow behind */}
      <div className="absolute -inset-4 bg-blue-600/10 blur-3xl rounded-3xl" />

      {/* Window chrome */}
      <div className="relative bg-slate-900 rounded-2xl shadow-2xl border border-slate-700/60 overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-3 text-slate-400 text-xs font-mono">serva.app/dashboard</span>
        </div>

        <div className="flex h-[380px]">
          {/* Sidebar */}
          <div className="w-14 bg-slate-800/60 border-r border-slate-700/40 flex flex-col items-center pt-4 gap-4">
            {[
              { icon: BarChart3, active: true },
              { icon: UtensilsCrossed, active: false },
              { icon: QrCode, active: false },
              { icon: Users, active: false },
            ].map(({ icon: Icon, active }, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  active ? "bg-blue-600" : "bg-slate-700/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-white" : "text-slate-400"}`} />
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 overflow-hidden">
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white text-sm font-semibold">Good morning, Chef 👋</p>
                <p className="text-slate-400 text-xs">Sunday, Jun 1 · Le Baobab Restaurant</p>
              </div>
              <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-medium">8 tables live</span>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Revenue today", value: "148 600", unit: "FCFA", icon: TrendingUp, up: true, delta: "+12%" },
                { label: "Orders", value: "41", unit: "orders", icon: Bell, up: true, delta: "+5" },
                { label: "Avg. order", value: "3 625", unit: "FCFA", icon: Timer, up: false, delta: "-2%" },
              ].map(({ label, value, unit, icon: Icon, up, delta }) => (
                <div key={label} className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/40">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-xs">{label}</span>
                    <Icon className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <p className="text-white text-lg font-bold leading-none">{value}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-slate-500 text-xs">{unit}</span>
                    <span className={`text-xs font-medium ${up ? "text-green-400" : "text-red-400"}`}>{delta}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Orders list */}
            <div className="bg-slate-800/40 rounded-xl border border-slate-700/40 overflow-hidden">
              <div className="px-3 py-2 border-b border-slate-700/30 flex items-center justify-between">
                <span className="text-slate-300 text-xs font-semibold">Live orders</span>
                <span className="text-blue-400 text-xs">View all</span>
              </div>
              {orders.map((order) => (
                <div key={order.id} className="px-3 py-2.5 flex items-center gap-3 border-b border-slate-700/20 last:border-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs font-semibold">{order.id}</span>
                      <span className="text-slate-400 text-xs">·</span>
                      <span className="text-slate-300 text-xs">{order.table}</span>
                    </div>
                    <p className="text-slate-500 text-xs truncate mt-0.5">{order.items}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statusStyle[order.status]}`}>
                    {order.status}
                  </span>
                  <span className="text-slate-400 text-xs shrink-0">{order.amount} FCFA</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating phone mockup */}
      <div className="absolute -right-6 -bottom-6 w-28 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden hidden md:block">
        <div className="bg-slate-800 px-2 py-1.5">
          <div className="flex justify-center gap-1 mb-1">
            <span className="w-4 h-0.5 rounded bg-slate-600" />
          </div>
        </div>
        <div className="p-2">
          <div className="bg-blue-50 rounded-lg p-1.5 mb-1.5">
            <p className="text-blue-700 text-[9px] font-semibold">Table 4</p>
            <p className="text-slate-600 text-[8px]">Le Baobab</p>
          </div>
          <div className="space-y-1">
            {["Thieboudienne", "Jus de Bissap"].map((item) => (
              <div key={item} className="flex items-center justify-between">
                <p className="text-slate-700 text-[8px] truncate">{item}</p>
                <div className="w-3 h-3 rounded-full bg-blue-600 flex items-center justify-center ml-1 shrink-0">
                  <span className="text-white text-[6px]">+</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 bg-blue-600 rounded-md py-1 text-center">
            <p className="text-white text-[8px] font-semibold">Order · 5 800 F</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="pt-28 pb-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              QR ordering · No app · Real-time kitchen
            </div>

            <h1 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Orders flow,<br />
              <span className="text-blue-600">you focus<br />on cooking.</span>
            </h1>

            <p className="mt-6 text-lg text-slate-500 leading-relaxed max-w-md">
              Serva digitizes your restaurant in under 10 minutes. Tables scan a QR, orders land in your kitchen instantly — no waiter needed for taking orders.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm shadow-lg shadow-blue-200"
              >
                Start for free — 7 days
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 text-slate-700 px-6 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-medium text-sm"
              >
                See how it works
              </a>
            </div>

            <p className="mt-4 text-xs text-slate-400">No credit card · Cancel anytime · Setup in 10 min</p>

            {/* Mini stats */}
            <div className="mt-10 flex items-center gap-6">
              {[
                { value: "< 2s", label: "Menu load" },
                { value: "0", label: "Apps to install" },
                { value: "100%", label: "Real-time" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-black text-slate-900">{value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — real dashboard mockup */}
          <div className="lg:pl-6">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── How it works ──────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: QrCode,
      title: "Scan & browse",
      desc: "The customer scans the QR on the table. No app. The menu appears in under 2 seconds on their phone.",
    },
    {
      num: "02",
      icon: UtensilsCrossed,
      title: "Order & customize",
      desc: "They pick dishes, choose options, add notes. Everything is validated in a tap — no waiter needed.",
    },
    {
      num: "03",
      icon: ChefHat,
      title: "Kitchen gets it instantly",
      desc: "The order hits your kitchen display the millisecond it's placed. No relay, no errors, no delay.",
    },
    {
      num: "04",
      icon: CreditCard,
      title: "Pay & review",
      desc: "Card, mobile money, Apple/Google Pay — all at the table. Customers leave a review when they're done.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">How it works</span>
          <h2 className="mt-3 text-4xl font-black text-slate-900 leading-tight">
            Four steps.<br />Fully digital restaurant.
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-5">
          {steps.map(({ num, icon: Icon, title, desc }, i) => (
            <div key={num} className="relative group">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-full w-5 z-10">
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </div>
              )}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-full hover:border-blue-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-200">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-3xl font-black text-slate-100">{num}</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Two interfaces ────────────────────────────────────────────────────────────

function TwoInterfaces() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">Platform</span>
          <h2 className="mt-3 text-4xl font-black text-slate-900 leading-tight">
            Built for two worlds.
          </h2>
          <p className="mt-4 text-slate-500">
            One platform, two perfectly designed interfaces — for your team and your guests.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-slate-900 rounded-3xl p-8 text-white">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mb-6">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-2">Restaurant back-office</div>
            <h3 className="text-2xl font-black mb-5 leading-snug">Your entire operation, one screen.</h3>
            <ul className="space-y-3 text-slate-300 text-sm">
              {[
                "Real-time revenue, orders & table status",
                "Visual menu editor with images & options",
                "QR code generator per table or zone",
                "Kitchen display (KDS) with course management",
                "Analytics, export & team roles",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/signup" className="inline-flex items-center gap-2 mt-8 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl transition-colors">
              Create my restaurant <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-blue-600 rounded-3xl p-8 text-white">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-6">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div className="text-xs font-bold tracking-widest text-blue-200 uppercase mb-2">Customer experience</div>
            <h3 className="text-2xl font-black mb-5 leading-snug">Order in seconds. No app, ever.</h3>
            <ul className="space-y-3 text-blue-100 text-sm">
              {[
                "Instant menu on scan — no download, no login",
                "Beautiful menu with photos, allergens & options",
                "Live order tracking right on their phone",
                "Call waiter button, payment at the table",
                "One-tap review when done",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-blue-200 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
            <a href="#how-it-works" className="inline-flex items-center gap-2 mt-8 text-sm font-bold text-blue-600 bg-white hover:bg-blue-50 px-5 py-2.5 rounded-xl transition-colors">
              See a live demo <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────

function Features() {
  const features = [
    {
      icon: QrCode,
      title: "QR per table",
      desc: "One unique QR per table or zone. Customers get the menu in under 2 seconds — no install, no friction.",
    },
    {
      icon: Zap,
      title: "Instant kitchen",
      desc: "Orders reach your kitchen display in milliseconds. Zero transmission errors, zero relay.",
    },
    {
      icon: ChefHat,
      title: "Kitchen Display (KDS)",
      desc: "Course-aware kitchen screen. Your team always knows what's next, what's urgent, what's done.",
    },
    {
      icon: CreditCard,
      title: "Table-side payment",
      desc: "Card, Apple Pay, Google Pay, Mobile Money. Payment processed at the table, no runner needed.",
    },
    {
      icon: Palette,
      title: "Your brand, everywhere",
      desc: "Custom logo, colors, and fonts. Your guests see your identity — not a generic app.",
    },
    {
      icon: BarChart3,
      title: "Analytics that matter",
      desc: "Revenue by hour, bestsellers, table turnover. Actionable data, exportable anytime.",
    },
    {
      icon: Bell,
      title: "Waiter call",
      desc: "Guests call for help with one tap. Your staff sees it instantly on the dashboard.",
    },
    {
      icon: Star,
      title: "Auto reviews",
      desc: "Ratings collected automatically after each meal. Improve service with real data.",
    },
    {
      icon: Shield,
      title: "Roles & security",
      desc: "Admin, manager, kitchen, server — custom access per role. Your data stays yours.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">Features</span>
          <h2 className="mt-3 text-4xl font-black text-slate-900 leading-tight">
            Everything in one place.<br />
            <span className="text-slate-400 font-medium text-2xl">No integrations required.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center mb-4 transition-colors">
                <Icon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1.5">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────

function Testimonials() {
  const testimonials = [
    {
      quote: "We had zero order errors from day one. Our kitchen works faster and our customers keep coming back.",
      name: "Mamadou Diallo",
      role: "Owner · Le Baobab, Dakar",
      initials: "MD",
    },
    {
      quote: "Setup was 9 minutes. Serva just works. Our reviewers started mentioning the smooth ordering experience.",
      name: "Sophie Tremblay",
      role: "Manager · Brasserie St-Laurent, Montréal",
      initials: "ST",
    },
    {
      quote: "Running 4 spots across New York. The multi-location dashboard gives me full visibility without hopping between tools.",
      name: "James Okafor",
      role: "CEO · Fork & Flame Group, New York",
      initials: "JO",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">Testimonials</span>
          <h2 className="mt-3 text-4xl font-black text-slate-900 leading-tight">
            Real restaurants.<br />Real results.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="border border-slate-100 rounded-2xl p-7 hover:border-blue-100 hover:shadow-sm transition-all">
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Final CTA ─────────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="py-24 bg-blue-600">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-5xl font-black text-white leading-tight">
          Your restaurant,<br />digital by tonight.
        </h2>
        <p className="mt-5 text-blue-100 text-lg">
          7-day free trial. No credit card. Full setup in under 10 minutes.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors font-bold text-base shadow-lg">
            Create my account — it&apos;s free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/login" className="text-blue-200 hover:text-white transition-colors text-sm font-medium">
            Already have an account →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <QrCode className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white font-bold">Serva</span>
            </div>
            <p className="text-sm leading-relaxed">
              The restaurant platform that turns a QR scan into a kitchen order in under 2 seconds.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Features", href: "#features" },
                { label: "How it works", href: "#how-it-works" },
                { label: "Pricing", href: "#pricing" },
                { label: "Testimonials", href: "#testimonials" },
              ].map((l) => (
                <li key={l.label}><a href={l.href} className="hover:text-white transition-colors">{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Access</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: "Create an account", href: "/signup" },
                { label: "Restaurant dashboard", href: "/login" },
                { label: "Kitchen screen", href: "/login" },
                { label: "Admin panel", href: "/login" },
              ].map((l) => (
                <li key={l.label}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              {["Terms of use", "Privacy policy", "Legal notice", "Contact"].map((l) => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">© 2025 Serva. All rights reserved.</p>
          <p className="text-sm">Built for restaurateurs worldwide 🌍</p>
        </div>
      </div>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <TwoInterfaces />
        <Features />
        <Pricing />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

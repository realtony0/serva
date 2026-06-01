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
  Clock,
} from "lucide-react";

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
            Sign in →
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Free trial
          </Link>
        </div>
      </div>
    </header>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            IN-TABLE ORDERING · NO APP REQUIRED
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 text-center leading-tight max-w-4xl mx-auto">
          Your restaurant,{" "}
          <span className="text-blue-600">fully digital.</span>
        </h1>

        <p className="mt-6 text-xl text-slate-500 text-center max-w-2xl mx-auto leading-relaxed">
          Customers scan, order and pay from their phone. Your kitchen gets orders instantly.
          You manage everything from one dashboard.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-xl hover:bg-blue-700 transition-colors font-semibold text-base shadow-sm shadow-blue-200"
          >
            Start free — 30 days
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 text-slate-700 px-6 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-medium text-base"
          >
            See how it works
          </a>
        </div>

        {/* Trust line */}
        <p className="mt-4 text-center text-sm text-slate-400">
          No credit card required · Setup in under 10 min · Cancel anytime
        </p>

        {/* Stats bar */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-px bg-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {[
            { icon: Clock, value: "< 2s", label: "Menu load after scan" },
            { icon: QrCode, value: "0", label: "Apps to download" },
            { icon: Zap, value: "100%", label: "Real-time orders" },
            { icon: Star, value: "30 days", label: "Free trial" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-white px-6 py-6 flex flex-col items-center text-center">
              <Icon className="w-5 h-5 text-blue-600 mb-2" />
              <span className="text-2xl font-bold text-slate-900">{value}</span>
              <span className="text-xs text-slate-500 mt-1">{label}</span>
            </div>
          ))}
        </div>

        {/* Mockup placeholder */}
        <div className="mt-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 h-[420px] flex items-center justify-center shadow-2xl border border-slate-700/50">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-slate-400 text-sm">Dashboard preview</p>
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
      title: "Scan QR Code",
      desc: "The customer scans the QR code on the table. No app to install. The menu opens instantly on their phone.",
    },
    {
      num: "02",
      title: "Order online",
      desc: "The customer picks dishes, customizes options, and confirms. Done in under 2 minutes, directly from their phone.",
    },
    {
      num: "03",
      title: "Kitchen receives it",
      desc: "The order appears instantly on the kitchen display (KDS). Your team prepares without any transmission errors.",
    },
    {
      num: "04",
      title: "Payment & Review",
      desc: "Integrated payment (card, Apple Pay, Google Pay). The customer leaves a review once the meal is done.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-widest text-blue-600 uppercase">How it works</span>
          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            Simple for the customer.{" "}
            <span className="text-blue-600">Powerful for you.</span>
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto">
            4 steps and your restaurant is fully digitized.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div key={step.num} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(100%_-_12px)] w-6 text-slate-200">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 h-full">
                <span className="text-4xl font-black text-blue-100 leading-none">{step.num}</span>
                <h3 className="mt-3 text-base font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">{step.desc}</p>
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
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-widest text-blue-600 uppercase">Two distinct interfaces</span>
          <h2 className="mt-3 text-4xl font-bold text-slate-900">One platform, two experiences.</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Restaurant */}
          <div className="bg-slate-900 rounded-2xl p-8 text-white">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mb-5">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-2">For the restaurant</div>
            <h3 className="text-2xl font-bold mb-4">Manage your restaurant from your back-office</h3>
            <ul className="space-y-2.5 text-slate-300 text-sm">
              {[
                "Secure back-office access",
                "Dashboard: revenue, orders & tables in real time",
                "Menu, floor plan & QR codes",
                "Kitchen KDS, analytics & team management",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-lg transition-colors"
            >
              Create my restaurant <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Client */}
          <div className="bg-white rounded-2xl p-8 border border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
              <QrCode className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-2">For the end customer</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Order without an app, from the table</h3>
            <ul className="space-y-2.5 text-slate-500 text-sm">
              {[
                "QR menu, no app to install",
                "Order and pay from the table",
                "Live tracking, call waiter & customer reviews",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              See a client demo <ArrowRight className="w-4 h-4" />
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
      title: "QR Code per table",
      desc: "Generate a unique QR for each table. Customers scan and get the menu instantly, no download needed.",
    },
    {
      icon: Zap,
      title: "Real-time orders",
      desc: "Orders appear on the kitchen screen the moment the customer confirms. Zero delay, zero transmission errors.",
    },
    {
      icon: ChefHat,
      title: "Kitchen Display (KDS)",
      desc: "A dedicated kitchen screen organized by course, priority, and status. Your team always knows what to prepare next.",
    },
    {
      icon: CreditCard,
      title: "Integrated payments",
      desc: "Accept cards, Apple Pay, Google Pay, and more. Payments are processed directly at the table.",
    },
    {
      icon: Palette,
      title: "Custom branding",
      desc: "Your logo, your colors, your fonts. The customer experience reflects your restaurant identity.",
    },
    {
      icon: BarChart3,
      title: "Analytics & reporting",
      desc: "Track revenue, bestsellers, peak hours, and table occupancy. Export your data at any time.",
    },
    {
      icon: Bell,
      title: "Waiter call",
      desc: "Customers can call a waiter directly from the menu. Notifications appear instantly on your dashboard.",
    },
    {
      icon: Star,
      title: "Customer reviews",
      desc: "Collect feedback automatically after each order. Improve your service with real-time insights.",
    },
    {
      icon: Shield,
      title: "Multi-role & security",
      desc: "Admin, manager, kitchen, waiter — each role has its own access. Your data stays protected.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-widest text-blue-600 uppercase">Features</span>
          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            Everything your restaurant needs.
          </h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto">
            A complete platform, no mandatory third-party integrations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:border-blue-100 hover:bg-blue-50/30 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:border-blue-200 flex items-center justify-center mb-4 shadow-sm">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────

function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Get started with digital ordering",
      popular: false,
      features: [
        "Up to 10 tables",
        "QR code menu",
        "Order management",
        "Basic analytics",
        "3 staff accounts",
        "Email support",
      ],
    },
    {
      name: "Pro",
      price: "$79",
      period: "/month",
      description: "For active and growing restaurants",
      popular: true,
      features: [
        "Up to 30 tables",
        "QR code menu",
        "Order management",
        "Kitchen display (KDS)",
        "Customer reviews",
        "Advanced analytics",
        "Custom branding",
        "10 staff accounts",
        "Priority support",
      ],
    },
    {
      name: "Premium",
      price: "$149",
      period: "/month",
      description: "For high-volume restaurants",
      popular: false,
      features: [
        "Up to 100 tables",
        "All Pro features",
        "Multi-room & zones",
        "Advanced multi-role",
        "Data export",
        "30 staff accounts",
        "24/7 priority support",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For groups & franchises",
      popular: false,
      features: [
        "Unlimited tables",
        "All Premium features",
        "Multi-location",
        "Group dashboard",
        "Dedicated API",
        "Unlimited staff accounts",
        "Guaranteed SLA",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-widest text-blue-600 uppercase">Pricing</span>
          <h2 className="mt-3 text-4xl font-bold text-slate-900">Simple and transparent.</h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto">
            30-day free trial on all plans. No credit card required.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-6 flex flex-col ${
                plan.popular
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-200 ring-2 ring-blue-600"
                  : "bg-white border border-slate-200"
              }`}
            >
              {plan.popular && (
                <span className="text-xs font-semibold bg-white/20 text-white px-2.5 py-1 rounded-full self-start mb-3">
                  MOST POPULAR
                </span>
              )}
              <h3 className={`font-bold text-lg ${plan.popular ? "text-white" : "text-slate-900"}`}>
                {plan.name}
              </h3>
              <p className={`text-xs mt-1 ${plan.popular ? "text-blue-100" : "text-slate-500"}`}>
                {plan.description}
              </p>
              <div className="mt-5 flex items-end gap-1">
                <span className={`text-4xl font-black ${plan.popular ? "text-white" : "text-slate-900"}`}>
                  {plan.price}
                </span>
                {plan.period && (
                  <span className={`text-sm mb-1 ${plan.popular ? "text-blue-100" : "text-slate-400"}`}>
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="mt-6 space-y-2.5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check
                      className={`w-4 h-4 flex-shrink-0 ${plan.popular ? "text-blue-200" : "text-blue-600"}`}
                    />
                    <span className={plan.popular ? "text-blue-50" : "text-slate-600"}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.name === "Enterprise" ? "/contact" : "/signup"}
                className={`mt-8 w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  plan.popular
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {plan.name === "Enterprise" ? "Contact us" : "Start for free"}
              </Link>
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
      quote:
        "We cut our order errors to zero the first week. Customers love ordering from their phones, and our waiters focus on service instead of running back and forth.",
      name: "Marcus Chen",
      role: "Owner, Golden Wok — Toronto",
      initials: "MC",
    },
    {
      quote:
        "Setup took 8 minutes. Serva is the simplest tool we've ever added to our restaurant. Our kitchen is faster and our reviews have gone up.",
      name: "Sophie Tremblay",
      role: "Manager, Brasserie St-Laurent — Montréal",
      initials: "ST",
    },
    {
      quote:
        "We run 4 locations and the group dashboard is a game changer. I can see revenue, orders, and table status across all restaurants from my phone.",
      name: "James Okafor",
      role: "CEO, Fork & Flame Group — New York",
      initials: "JO",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-widest text-blue-600 uppercase">Testimonials</span>
          <h2 className="mt-3 text-4xl font-bold text-slate-900">They switched to Serva.</h2>
          <p className="mt-4 text-slate-500 max-w-xl mx-auto">
            Feedback from restaurant owners across North America.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-slate-50 rounded-2xl p-7 border border-slate-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3 mt-5">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
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
    <section className="py-20 bg-blue-600">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-white leading-tight">
          Launch your digital restaurant today.
        </h2>
        <p className="mt-4 text-blue-100 text-lg">
          30 days free, no credit card. Setup in under 10 minutes. Support included.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3.5 rounded-xl hover:bg-blue-50 transition-colors font-semibold text-base"
          >
            Create my account for free
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="text-blue-100 hover:text-white transition-colors text-sm font-medium"
          >
            I already have an account →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <QrCode className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white font-bold">Serva</span>
            </div>
            <p className="text-sm leading-relaxed">
              The SaaS platform for QR-code restaurant ordering. Digitize your restaurant in 10 minutes.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "How it works", href: "#how-it-works" },
                { label: "Testimonials", href: "#testimonials" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="hover:text-white transition-colors">{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Access */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Access</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Create an account", href: "/signup" },
                { label: "Restaurant back-office", href: "/login" },
                { label: "Kitchen screen", href: "/login" },
                { label: "Super admin", href: "/login" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              {["Terms of use", "Privacy policy", "Legal notice", "Contact"].map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">© 2025 Serva. All rights reserved.</p>
          <p className="text-sm">Made for restaurateurs worldwide.</p>
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

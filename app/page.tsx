import Link from "next/link";
import {
  QrCode,
  LayoutDashboard,
  MapPin,
  CheckCircle,
  ChevronRight,
  Star,
  Zap,
  Shield,
} from "lucide-react";

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Serva
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-3 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Star className="w-3 h-3 fill-blue-500 text-blue-500" />
            Trusted by 500+ restaurants worldwide
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 text-balance">
            The smartest way to manage your{" "}
            <span className="text-blue-600">restaurant</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 mb-10 text-balance leading-relaxed">
            QR code ordering, real-time dashboards, and seamless kitchen
            coordination — all in one platform built for modern restaurants.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Get Started Free
              <ChevronRight className="w-4 h-4" />
            </Link>
            <button className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3 rounded-lg border border-slate-200 transition-colors text-sm">
              Watch Demo
              <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center">
                <span className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[7px] border-l-slate-600 ml-0.5" />
              </span>
            </button>
          </div>

          {/* Dashboard mockup placeholder */}
          <div className="relative mx-auto max-w-4xl">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_20px_60px_-10px_rgb(0,0,0,0.12)] overflow-hidden">
              {/* Browser chrome */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-slate-300 rounded-full" />
                  <div className="w-3 h-3 bg-slate-300 rounded-full" />
                  <div className="w-3 h-3 bg-slate-300 rounded-full" />
                </div>
                <div className="flex-1 mx-4 bg-white border border-slate-200 rounded-md px-3 py-1 text-xs text-slate-400 text-left">
                  app.serva.io/dashboard
                </div>
              </div>
              {/* Dashboard preview */}
              <div className="p-6 bg-slate-50 min-h-[320px]">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Today's Orders", value: "142", color: "blue" },
                    { label: "Revenue", value: "$3,840", color: "green" },
                    { label: "Active Tables", value: "18", color: "orange" },
                    { label: "Avg Order", value: "$27", color: "purple" },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white rounded-xl border border-slate-200 p-4"
                    >
                      <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-slate-700">
                      Recent Orders
                    </p>
                    <span className="text-xs text-blue-600 font-medium">
                      View all
                    </span>
                  </div>
                  <div className="space-y-2">
                    {[
                      {
                        table: "Table 4",
                        items: "3 items",
                        status: "Preparing",
                        amount: "$54",
                      },
                      {
                        table: "Table 9",
                        items: "2 items",
                        status: "Ready",
                        amount: "$32",
                      },
                      {
                        table: "Table 12",
                        items: "5 items",
                        status: "Pending",
                        amount: "$87",
                      },
                    ].map((order) => (
                      <div
                        key={order.table}
                        className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                      >
                        <span className="text-sm font-medium text-slate-700">
                          {order.table}
                        </span>
                        <span className="text-xs text-slate-400">
                          {order.items}
                        </span>
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            order.status === "Ready"
                              ? "bg-green-50 text-green-700"
                              : order.status === "Preparing"
                              ? "bg-orange-50 text-orange-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {order.status}
                        </span>
                        <span className="text-sm font-semibold text-slate-900">
                          {order.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────

const features = [
  {
    icon: QrCode,
    title: "QR Code Ordering",
    description:
      "Generate unique QR codes for every table. Guests scan, browse your menu, and order — no app download required.",
  },
  {
    icon: LayoutDashboard,
    title: "Real-time Dashboard",
    description:
      "Watch orders come in live. Track revenue, monitor table status, and coordinate your kitchen from a single screen.",
  },
  {
    icon: MapPin,
    title: "Multi-location Support",
    description:
      "Manage multiple restaurant locations from one account. Each location gets its own menu, tables, and analytics.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    description:
      "Enterprise-grade security with Supabase. Your data is encrypted, backed up, and always available.",
  },
  {
    icon: Zap,
    title: "Instant Notifications",
    description:
      "Kitchen staff get real-time alerts the moment an order is placed. No missed orders, faster service.",
  },
  {
    icon: Star,
    title: "Customer Insights",
    description:
      "Understand your guests better. Track popular items, peak hours, and revenue trends over time.",
  },
];

function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
            Features
          </p>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Everything your restaurant needs
          </h2>
          <p className="text-slate-600 text-lg">
            A complete suite of tools to streamline operations and delight your
            guests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-slate-50 rounded-xl p-6 border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── How it works ──────────────────────────────────────────────────────────────

const steps = [
  {
    number: "01",
    title: "Create your menu",
    description:
      "Add your categories, dishes, prices, and photos. Publish changes instantly — no technical knowledge needed.",
  },
  {
    number: "02",
    title: "Generate QR codes",
    description:
      "Each table gets a unique QR code. Print and place them — guests can start ordering immediately.",
  },
  {
    number: "03",
    title: "Receive orders instantly",
    description:
      "Orders appear on your dashboard in real time. Confirm, prepare, and mark as ready with one click.",
  },
];

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
            How it works
          </p>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Up and running in minutes
          </h2>
          <p className="text-slate-600 text-lg">
            Three simple steps to transform how your restaurant handles orders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(100%-1rem)] w-[calc(100%-2rem)] h-px bg-slate-200 z-0" />
              )}
              <div className="relative z-10 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
                <div className="text-5xl font-bold text-blue-100 mb-4 leading-none">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Pricing ───────────────────────────────────────────────────────────────────

const plans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for single-location restaurants just getting started.",
    features: [
      "1 restaurant location",
      "Up to 20 tables",
      "Unlimited menu items",
      "Real-time order dashboard",
      "QR code generation",
      "Email support",
    ],
    cta: "Start free trial",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/month",
    description:
      "For growing restaurants that need more power and customization.",
    features: [
      "Up to 3 locations",
      "Unlimited tables",
      "Custom branding",
      "Advanced analytics",
      "Priority support",
      "API access",
    ],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description:
      "For restaurant groups and franchises with complex needs.",
    features: [
      "Unlimited locations",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "On-site onboarding",
      "White-label option",
    ],
    cta: "Contact us",
    highlighted: false,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">
            Pricing
          </p>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-600 text-lg">
            No hidden fees. Start with a 14-day free trial on any plan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-8 flex flex-col ${
                plan.highlighted
                  ? "bg-blue-600 border-blue-600 shadow-xl shadow-blue-600/20"
                  : "bg-white border-slate-200 shadow-sm"
              }`}
            >
              <div className="mb-6">
                <p
                  className={`text-sm font-semibold mb-1 ${
                    plan.highlighted ? "text-blue-100" : "text-slate-500"
                  }`}
                >
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-3">
                  <span
                    className={`text-4xl font-bold ${
                      plan.highlighted ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span
                      className={`text-sm mb-1.5 ${
                        plan.highlighted ? "text-blue-100" : "text-slate-500"
                      }`}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
                <p
                  className={`text-sm ${
                    plan.highlighted ? "text-blue-100" : "text-slate-600"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <CheckCircle
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        plan.highlighted ? "text-blue-200" : "text-blue-600"
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        plan.highlighted ? "text-blue-50" : "text-slate-600"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.name === "Enterprise" ? "/contact" : "/signup"}
                className={`w-full text-center py-3 px-6 rounded-lg font-semibold text-sm transition-colors ${
                  plan.highlighted
                    ? "bg-white text-blue-600 hover:bg-blue-50"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Serva
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              The modern SaaS platform for restaurants that want to grow.
            </p>
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-4">Product</p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How it works
                </a>
              </li>
              <li>
                <Link href="/changelog" className="hover:text-white transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-4">Company</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-white font-semibold text-sm mb-4">Legal</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-white transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Serva Technologies Inc. All rights
            reserved.
          </p>
          <p className="text-sm">
            Made for restaurants worldwide.
          </p>
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
        <Features />
        <HowItWorks />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}

"use client";

import Link from "next/link";
import {
  QrCode,
  Zap,
  ChefHat,
  Users,
  Palette,
  BarChart3,
  Bell,
  Star,
  Shield,
  Check,
  ArrowRight,
  TrendingUp,
  UtensilsCrossed,
  Timer,
} from "lucide-react";
import Pricing from "@/components/Pricing";
import { useLanguage, LanguageToggle } from "@/components/LanguageProvider";

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar() {
  const { t } = useLanguage();
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm shadow-blue-600/30">
            <QrCode className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">Serva</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">{t("nav.features")}</a>
          <a href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">{t("nav.how")}</a>
          <a href="#pricing" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">{t("nav.pricing")}</a>
          <a href="#testimonials" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">{t("nav.testimonials")}</a>
        </nav>

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Link href="/login" className="hidden sm:inline text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium">
            {t("nav.signin")}
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all font-medium shadow-sm shadow-blue-600/20 hover:shadow-blue-600/40"
          >
            {t("nav.tryFree")}
          </Link>
        </div>
      </div>
    </header>
  );
}

// ── Dashboard Mockup ──────────────────────────────────────────────────────────

function DashboardMockup() {
  const { t } = useLanguage();
  const orders = [
    { id: "#041", table: "Table 4", items: "Thieboudienne, Bissap", amount: "5 800", status: "preparing" },
    { id: "#040", table: "Table 7", items: "Burger Classic, Frites", amount: "3 200", status: "ready" },
    { id: "#039", table: "Table 2", items: "Pizza Margherita", amount: "4 500", status: "served" },
  ];

  const statusStyle: Record<string, string> = {
    preparing: "bg-amber-100 text-amber-700",
    ready: "bg-green-100 text-green-700",
    served: "bg-slate-100 text-slate-500",
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="absolute -inset-6 bg-blue-600/15 blur-3xl rounded-[2rem] animate-glow-float" />

      <div className="relative bg-slate-900 rounded-2xl shadow-2xl border border-slate-700/60 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/80 border-b border-slate-700/50">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <span className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-3 text-slate-400 text-xs font-mono">serva.app/dashboard</span>
        </div>

        <div className="flex h-[380px]">
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

          <div className="flex-1 p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white text-sm font-semibold">{t("mock.greeting")}</p>
                <p className="text-slate-400 text-xs">{t("mock.subtitle")}</p>
              </div>
              <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-medium">{t("mock.live")}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: t("mock.revenue"), value: "148 600", unit: "FCFA", icon: TrendingUp, up: true, delta: "+12%" },
                { label: t("mock.orders"), value: "41", unit: "orders", icon: Bell, up: true, delta: "+5" },
                { label: t("mock.avg"), value: "3 625", unit: "FCFA", icon: Timer, up: false, delta: "-2%" },
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

            <div className="bg-slate-800/40 rounded-xl border border-slate-700/40 overflow-hidden">
              <div className="px-3 py-2 border-b border-slate-700/30 flex items-center justify-between">
                <span className="text-slate-300 text-xs font-semibold">{t("mock.liveOrders")}</span>
                <span className="text-blue-400 text-xs">{t("mock.viewAll")}</span>
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
  const { t } = useLanguage();
  return (
    <section className="relative pt-28 pb-20 bg-white overflow-hidden">
      <div className="bg-line-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_30%_0%,black,transparent)]" />
      <div className="pointer-events-none absolute -top-32 left-1/4 h-72 w-[36rem] rounded-full bg-blue-400/20 blur-[120px]" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <h1 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tight text-balance">
              {t("hero.title.a")}<br />
              <span className="text-blue-600">{t("hero.title.b")}<br />{t("hero.title.c")}</span>
            </h1>

            <p className="mt-6 text-lg text-slate-500 leading-relaxed max-w-md text-balance">
              {t("hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-xl hover:bg-blue-700 transition-all font-semibold text-sm shadow-lg shadow-blue-600/25 hover:shadow-blue-600/45"
              >
                {t("hero.ctaPrimary")}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 text-slate-700 px-6 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-sm"
              >
                {t("hero.ctaSecondary")}
              </a>
              <Link
                href="/demo/table/1"
                className="inline-flex items-center justify-center gap-2 text-blue-600 px-6 py-3.5 rounded-xl border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all font-medium text-sm"
              >
                ✨ Voir la démo
              </Link>
            </div>

            <p className="mt-4 text-xs text-slate-400">{t("hero.fineprint")}</p>

            <div className="mt-10 flex items-center gap-8">
              {[
                { value: t("hero.stat1.value"), label: t("hero.stat1.label") },
                { value: t("hero.stat2.value"), label: t("hero.stat2.label") },
                { value: t("hero.stat3.value"), label: t("hero.stat3.label") },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p className="text-2xl font-black text-slate-900">{value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:pl-6">
            <DashboardMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Benefit blocks ────────────────────────────────────────────────────────────

function BenefitBlocks() {
  const { t } = useLanguage();
  const blocks = [
    {
      kicker: "bloc.01.kicker",
      title: "bloc.01.title",
      body: "bloc.01.body",
      features: ["bloc.01.f1", "bloc.01.f2", "bloc.01.f3"],
    },
    {
      kicker: "bloc.02.kicker",
      title: "bloc.02.title",
      body: "bloc.02.body",
      features: [],
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6 space-y-16">
        {blocks.map((b) => (
          <div key={b.kicker} className="border-t border-slate-100 pt-12 first:border-t-0 first:pt-0">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest text-blue-600 uppercase bg-blue-50 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              {t(b.kicker)}
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl font-black text-slate-900 leading-tight tracking-tight">
              {t(b.title)}
            </h2>
            <p className="mt-4 text-slate-500 leading-relaxed">{t(b.body)}</p>

            {b.features.length > 0 && (
              <ul className="mt-7 space-y-3">
                {b.features.map((key) => (
                  <li key={key} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                    <span className="w-4 h-4 rounded-full border-2 border-blue-500 shrink-0" />
                    {t(key)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// ── How it works ──────────────────────────────────────────────────────────────

function HowItWorks() {
  const { t } = useLanguage();
  const steps = [
    { num: "01", icon: QrCode, title: t("how.s1.title"), desc: t("how.s1.desc") },
    { num: "02", icon: UtensilsCrossed, title: t("how.s2.title"), desc: t("how.s2.desc") },
    { num: "03", icon: ChefHat, title: t("how.s3.title"), desc: t("how.s3.desc") },
    { num: "04", icon: Star, title: t("how.s4.title"), desc: t("how.s4.desc") },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">{t("how.kicker")}</span>
          <h2 className="mt-3 text-4xl font-black text-slate-900 leading-tight tracking-tight">
            {t("how.title.a")}<br />{t("how.title.b")}
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
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-full hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-sm shadow-blue-600/30">
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
  const { t } = useLanguage();
  const backFeatures = ["two.back.f1", "two.back.f2", "two.back.f3", "two.back.f4", "two.back.f5"];
  const clientFeatures = ["two.client.f1", "two.client.f2", "two.client.f3", "two.client.f4", "two.client.f5"];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">{t("two.kicker")}</span>
          <h2 className="mt-3 text-4xl font-black text-slate-900 leading-tight tracking-tight">
            {t("two.title")}
          </h2>
          <p className="mt-4 text-slate-500">
            {t("two.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative bg-slate-900 rounded-3xl p-8 text-white overflow-hidden">
            <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-20" />
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mb-6">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-2">{t("two.back.kicker")}</div>
              <h3 className="text-2xl font-black mb-5 leading-snug">{t("two.back.title")}</h3>
              <ul className="space-y-3 text-slate-300 text-sm">
                {backFeatures.map((key) => (
                  <li key={key} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    {t(key)}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="inline-flex items-center gap-2 mt-8 text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-xl transition-colors">
                {t("two.back.cta")} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 text-white overflow-hidden">
            <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-20" />
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <div className="text-xs font-bold tracking-widest text-blue-200 uppercase mb-2">{t("two.client.kicker")}</div>
              <h3 className="text-2xl font-black mb-5 leading-snug">{t("two.client.title")}</h3>
              <ul className="space-y-3 text-blue-100 text-sm">
                {clientFeatures.map((key) => (
                  <li key={key} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-200 flex-shrink-0 mt-0.5" />
                    {t(key)}
                  </li>
                ))}
              </ul>
              <a href="#how-it-works" className="inline-flex items-center gap-2 mt-8 text-sm font-bold text-blue-600 bg-white hover:bg-blue-50 px-5 py-2.5 rounded-xl transition-colors">
                {t("two.client.cta")} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────────

function Features() {
  const { t } = useLanguage();
  const features = [
    { icon: QrCode, title: "feat.qr.t", desc: "feat.qr.d" },
    { icon: Zap, title: "feat.kitchen.t", desc: "feat.kitchen.d" },
    { icon: ChefHat, title: "feat.kds.t", desc: "feat.kds.d" },
    { icon: Bell, title: "feat.waiter.t", desc: "feat.waiter.d" },
    { icon: Palette, title: "feat.brand.t", desc: "feat.brand.d" },
    { icon: BarChart3, title: "feat.analytics.t", desc: "feat.analytics.d" },
    { icon: Users, title: "feat.tables.t", desc: "feat.tables.d" },
    { icon: Star, title: "feat.reviews.t", desc: "feat.reviews.d" },
    { icon: Shield, title: "feat.roles.t", desc: "feat.roles.d" },
  ];

  return (
    <section id="features" className="py-24 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">{t("feat.kicker")}</span>
          <h2 className="mt-3 text-4xl font-black text-slate-900 leading-tight tracking-tight">
            {t("feat.title.a")}<br />
            <span className="text-slate-400 font-medium text-2xl">{t("feat.title.b")}</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-600 flex items-center justify-center mb-4 transition-colors">
                <Icon className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1.5">{t(title)}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{t(desc)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── AI Section ────────────────────────────────────────────────────────────────

function AISection() {
  const { t } = useLanguage();

  const features = [
    { title: "ai.f1.title", desc: "ai.f1.desc", emoji: "🌿" },
    { title: "ai.f2.title", desc: "ai.f2.desc", emoji: "✨" },
    { title: "ai.f3.title", desc: "ai.f3.desc", emoji: "💬" },
  ];

  const conversation = [
    { role: "user", key: "ai.chat.q1" },
    { role: "assistant", key: "ai.chat.a1" },
    { role: "user", key: "ai.chat.q2" },
    { role: "assistant", key: "ai.chat.a2" },
  ];

  return (
    <section className="py-24 bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <div>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest text-blue-400 uppercase bg-blue-500/10 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              {t("ai.kicker")}
            </span>
            <h2 className="mt-5 text-4xl font-black text-white leading-tight tracking-tight">
              {t("ai.title")}
            </h2>
            <p className="mt-4 text-slate-400 leading-relaxed">
              {t("ai.subtitle")}
            </p>

            <div className="mt-10 space-y-5">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-lg">
                    {f.emoji}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{t(f.title)}</p>
                    <p className="text-slate-400 text-sm mt-0.5">{t(f.desc)}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/demo/table/1"
              className="inline-flex items-center gap-2 mt-10 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/30"
            >
              {t("ai.cta")} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right — chat mockup */}
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-600/10 blur-3xl rounded-3xl" />
            <div className="relative bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-blue-600 px-4 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">💬</div>
                <div>
                  <p className="text-white text-sm font-semibold">{t("chat.title")}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <p className="text-blue-100 text-xs">{t("chat.subtitle")}</p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="p-4 space-y-3 bg-slate-800/50">
                {conversation.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-slate-700 text-slate-100 rounded-bl-sm"
                    }`}>
                      {t(msg.key)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-slate-700 flex gap-2 bg-slate-800">
                <div className="flex-1 bg-slate-700 border border-slate-600 rounded-xl px-3 py-2 text-slate-400 text-sm">
                  {t("chat.placeholder")}
                </div>
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────

function Testimonials() {
  const { t } = useLanguage();
  const testimonials = [
    { quote: "test.q1", role: "test.r1", name: "Mamadou Diallo", initials: "MD" },
    { quote: "test.q2", role: "test.r2", name: "Sophie Tremblay", initials: "ST" },
    { quote: "test.q3", role: "test.r3", name: "James Okafor", initials: "JO" },
  ];

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">{t("test.kicker")}</span>
          <h2 className="mt-3 text-4xl font-black text-slate-900 leading-tight tracking-tight">
            {t("test.title.a")}<br />{t("test.title.b")}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((tm) => (
            <div key={tm.name} className="border border-slate-100 rounded-2xl p-7 hover:border-blue-200 hover:shadow-lg transition-all">
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-slate-700 text-sm leading-relaxed">&ldquo;{t(tm.quote)}&rdquo;</p>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {tm.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{tm.name}</p>
                  <p className="text-xs text-slate-400">{t(tm.role)}</p>
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
  const { t } = useLanguage();
  return (
    <section className="relative py-24 bg-gradient-to-br from-blue-600 to-blue-700 overflow-hidden">
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-5xl font-black text-white leading-tight tracking-tight text-balance">
          {t("cta.title.a")}<br />{t("cta.title.b")}
        </h2>
        <p className="mt-5 text-blue-100 text-lg text-balance">
          {t("cta.subtitle")}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/signup" className="group inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors font-bold text-base shadow-lg">
            {t("cta.primary")}
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link href="/login" className="text-blue-200 hover:text-white transition-colors text-sm font-medium">
            {t("cta.secondary")}
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  const { t } = useLanguage();
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
              {t("footer.blurb")}
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{t("footer.product")}</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: t("nav.features"), href: "#features" },
                { label: t("nav.how"), href: "#how-it-works" },
                { label: t("nav.pricing"), href: "#pricing" },
                { label: t("nav.testimonials"), href: "#testimonials" },
              ].map((l) => (
                <li key={l.href}><a href={l.href} className="hover:text-white transition-colors">{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{t("footer.access")}</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: t("footer.create"), href: "/signup" },
                { label: t("footer.restoDash"), href: "/login" },
                { label: t("footer.kitchen"), href: "/login" },
                { label: t("footer.admin"), href: "/login" },
              ].map((l) => (
                <li key={l.label}><Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-2.5 text-sm">
              {[t("footer.terms"), t("footer.privacy"), t("footer.notice"), t("footer.contact")].map((l) => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">© {new Date().getFullYear()} Serva. {t("footer.rights")}</p>
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
        <BenefitBlocks />
        <HowItWorks />
        <TwoInterfaces />
        <Features />
        <AISection />
        <Pricing />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}

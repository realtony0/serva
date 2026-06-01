"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Billing = "monthly" | "weekly";

type Region = {
  code: string;
  label: string;
  flag: string;
  currency: string;
  monthlyPrices: (string | null)[];
  weeklyPrice: string; // single all-in-one weekly plan
  monthlyPeriod: string;
  weeklyPeriod: string;
};

// ── Regions ───────────────────────────────────────────────────────────────────

const REGIONS: Region[] = [
  {
    code: "SN",
    label: "Sénégal",
    flag: "🇸🇳",
    currency: "FCFA",
    monthlyPrices: ["9 900", "24 900", "49 900", null],
    weeklyPrice: "10 000",
    monthlyPeriod: "/mois",
    weeklyPeriod: "/semaine",
  },
  {
    code: "US",
    label: "United States",
    flag: "🇺🇸",
    currency: "$",
    monthlyPrices: ["29", "79", "149", null],
    weeklyPrice: "69.99",
    monthlyPeriod: "/month",
    weeklyPeriod: "/week",
  },
  {
    code: "CA",
    label: "Canada",
    flag: "🇨🇦",
    currency: "CA$",
    monthlyPrices: ["39", "109", "199", null],
    weeklyPrice: "69.99",
    monthlyPeriod: "/month",
    weeklyPeriod: "/week",
  },
];

const COUNTRY_MAP: Record<string, string> = {
  SN: "SN", ML: "SN", CI: "SN", BF: "SN", NE: "SN", GN: "SN", TG: "SN", BJ: "SN",
  US: "US",
  CA: "CA",
};

function formatPrice(currency: string, raw: string | null) {
  if (raw === null) return "Custom";
  if (currency === "FCFA") return `${raw} FCFA`;
  return `${currency}${raw}`;
}

// ── Monthly plans ─────────────────────────────────────────────────────────────

const MONTHLY_PLANS = [
  {
    name: "Starter",
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
    description: "For active restaurants",
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
    description: "For groups & franchises",
    popular: false,
    features: [
      "Unlimited tables",
      "All Premium features",
      "Multi-location",
      "Group dashboard",
      "Dedicated API",
      "Unlimited accounts",
      "Guaranteed SLA",
    ],
  },
];

// ── Weekly plan features ──────────────────────────────────────────────────────

const WEEKLY_FEATURES = [
  "All tables included",
  "QR code menu",
  "Order management",
  "Kitchen display (KDS)",
  "Customer reviews",
  "Advanced analytics",
  "Custom branding",
  "10 staff accounts",
  "Priority support",
  "No long-term commitment",
  "Cancel anytime",
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Pricing() {
  const [region, setRegion] = useState<Region | null>(null);
  const [detecting, setDetecting] = useState(true);
  const [billing, setBilling] = useState<Billing>("monthly");

  useEffect(() => {
    async function detectRegion() {
      try {
        const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(4000) });
        const data = await res.json();
        const cc: string = data?.country_code ?? "";
        const regionCode = COUNTRY_MAP[cc] ?? "US";
        setRegion(REGIONS.find((r) => r.code === regionCode) ?? REGIONS[1]);
      } catch {
        setRegion(REGIONS[1]);
      } finally {
        setDetecting(false);
      }
    }
    detectRegion();
  }, []);

  const active = region ?? REGIONS[1];

  return (
    <section id="pricing" className="py-20 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">

        <div className="max-w-xl mb-10">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">Pricing</span>
          <h2 className="mt-3 text-4xl font-black text-slate-900 leading-tight">
            Simple and transparent.
          </h2>
          <p className="mt-4 text-slate-500">
            7-day free trial on all plans. No credit card required.
          </p>
        </div>

        {/* Region selector */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            {REGIONS.map((r) => (
              <button
                key={r.code}
                onClick={() => setRegion(r)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active.code === r.code ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="text-base leading-none">{r.flag}</span>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Billing toggle — centered, prominent */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center bg-white border border-slate-200 rounded-2xl p-1.5 shadow-sm gap-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                billing === "monthly"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("weekly")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                billing === "weekly"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Weekly
              <span className="text-[10px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded-full leading-none">NEW</span>
            </button>
          </div>
        </div>

        {/* Detection status */}
        <p className="text-center text-xs text-slate-400 mb-10">
          {detecting ? (
            <span className="inline-flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" /> Detecting your location…</span>
          ) : (
            <span>Detected: {active.flag} {active.label}</span>
          )}
        </p>

        {/* ── WEEKLY plan ── */}
        {billing === "weekly" && (
          <div className="max-w-md mx-auto">
            <div className="bg-blue-600 rounded-2xl p-8 shadow-xl shadow-blue-200 ring-2 ring-blue-600 text-white">
              <span className="text-xs font-bold bg-white/20 text-white px-2.5 py-1 rounded-full">
                WEEKLY SUBSCRIPTION
              </span>
              <h3 className="font-black text-2xl mt-4">All-inclusive</h3>
              <p className="text-blue-100 text-sm mt-1">Everything, no commitment</p>

              <div className="mt-6 flex items-end gap-1">
                <span className="text-5xl font-black text-white">
                  {formatPrice(active.currency, active.weeklyPrice)}
                </span>
                <span className="text-blue-100 text-sm mb-2">{active.weeklyPeriod}</span>
              </div>

              <ul className="mt-8 space-y-2.5">
                {WEEKLY_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-blue-200 flex-shrink-0" />
                    <span className="text-blue-50">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className="mt-8 w-full block text-center py-3.5 rounded-xl text-sm font-bold bg-white text-blue-600 hover:bg-blue-50 transition-colors"
              >
                Start for free — 7 days
              </Link>
              <p className="text-center text-blue-200 text-xs mt-3">
                Cancel anytime · No credit card required
              </p>
            </div>
          </div>
        )}

        {/* ── MONTHLY plans ── */}
        {billing === "monthly" && (
          <div className="grid md:grid-cols-4 gap-5">
            {MONTHLY_PLANS.map((plan, i) => {
              const priceRaw = active.monthlyPrices[i];
              const priceLabel = formatPrice(active.currency, priceRaw);
              const isCustom = priceRaw === null;

              return (
                <div
                  key={plan.name}
                  className={`rounded-2xl p-6 flex flex-col ${
                    plan.popular
                      ? "bg-blue-600 shadow-xl shadow-blue-200 ring-2 ring-blue-600"
                      : "bg-white border border-slate-200"
                  }`}
                >
                  {plan.popular && (
                    <span className="text-xs font-bold bg-white/20 text-white px-2.5 py-1 rounded-full self-start mb-3">
                      MOST POPULAR
                    </span>
                  )}
                  <h3 className={`font-black text-lg ${plan.popular ? "text-white" : "text-slate-900"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs mt-1 ${plan.popular ? "text-blue-100" : "text-slate-500"}`}>
                    {plan.description}
                  </p>
                  <div className="mt-5 flex items-end gap-1">
                    <span className={`text-3xl font-black ${plan.popular ? "text-white" : "text-slate-900"}`}>
                      {priceLabel}
                    </span>
                    {!isCustom && (
                      <span className={`text-sm mb-1 ${plan.popular ? "text-blue-100" : "text-slate-400"}`}>
                        {active.monthlyPeriod}
                      </span>
                    )}
                  </div>
                  <ul className="mt-6 space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className={`w-4 h-4 flex-shrink-0 ${plan.popular ? "text-blue-200" : "text-blue-600"}`} />
                        <span className={plan.popular ? "text-blue-50" : "text-slate-600"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={plan.name === "Enterprise" ? "/contact" : "/signup"}
                    className={`mt-8 w-full text-center py-2.5 rounded-xl text-sm font-bold transition-colors ${
                      plan.popular
                        ? "bg-white text-blue-600 hover:bg-blue-50"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {plan.name === "Enterprise" ? "Contact us" : "Start for free"}
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-xs text-slate-400 mt-8">
          Prices shown in local currency. Taxes may apply.
        </p>
      </div>
    </section>
  );
}

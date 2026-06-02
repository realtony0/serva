"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type Region = {
  code: string;
  label: string;
  flag: string;
  currency: string;
  weeklyPrice: string;
  period: string;
};

// ── Regions ───────────────────────────────────────────────────────────────────

const REGIONS: Region[] = [
  { code: "SN", label: "Sénégal", flag: "🇸🇳", currency: "FCFA", weeklyPrice: "10 000", period: "/semaine" },
  { code: "US", label: "United States", flag: "🇺🇸", currency: "$", weeklyPrice: "69.99", period: "/week" },
  { code: "CA", label: "Canada", flag: "🇨🇦", currency: "CA$", weeklyPrice: "69.99", period: "/week" },
];

const COUNTRY_MAP: Record<string, string> = {
  SN: "SN", ML: "SN", CI: "SN", BF: "SN", NE: "SN", GN: "SN", TG: "SN", BJ: "SN",
  US: "US",
  CA: "CA",
};

function formatPrice(region: Region) {
  if (region.currency === "FCFA") return `${region.weeklyPrice} FCFA`;
  return `${region.currency}${region.weeklyPrice}`;
}

const FEATURES = [
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

        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">Pricing</span>
          <h2 className="mt-3 text-4xl font-black text-slate-900 leading-tight">
            One plan. Everything included.
          </h2>
          <p className="mt-4 text-slate-500">
            7-day free trial. No credit card required. Cancel anytime.
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

        {/* Detection status */}
        <p className="text-center text-xs text-slate-400 mb-10">
          {detecting
            ? <span className="inline-flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" /> Detecting your location…</span>
            : <span>Detected: {active.flag} {active.label}</span>
          }
        </p>

        {/* Plan card */}
        <div className="max-w-md mx-auto">
          <div className="bg-blue-600 rounded-2xl p-8 shadow-xl shadow-blue-200 text-white">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">WEEKLY SUBSCRIPTION</span>
              <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">ALL-INCLUSIVE</span>
            </div>

            <div className="flex items-end gap-1 mb-2">
              <span className="text-5xl font-black">{formatPrice(active)}</span>
              <span className="text-blue-100 text-sm mb-2">{active.period}</span>
            </div>
            <p className="text-blue-100 text-sm mb-8">Everything your restaurant needs, weekly.</p>

            <ul className="space-y-2.5 mb-8">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-blue-200 flex-shrink-0" />
                  <span className="text-blue-50">{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className="w-full block text-center py-4 rounded-xl text-sm font-bold bg-white text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Start for free — 7 days
            </Link>
            <p className="text-center text-blue-200 text-xs mt-3">
              No credit card · Cancel anytime
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          Prices shown in local currency. Taxes may apply.
        </p>
      </div>
    </section>
  );
}

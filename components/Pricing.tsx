"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

// ── Types ─────────────────────────────────────────────────────────────────────

type Region = {
  code: string;
  label: string;
  flag: string;
  currency: string;
  weeklyPrice: string;
  periodKey: "perWeekFr" | "perWeekEn";
};

// ── Regions ───────────────────────────────────────────────────────────────────

const REGIONS: Region[] = [
  { code: "SN", label: "Sénégal", flag: "🇸🇳", currency: "FCFA", weeklyPrice: "10 000", periodKey: "perWeekFr" },
  { code: "US", label: "United States", flag: "🇺🇸", currency: "$", weeklyPrice: "69.99", periodKey: "perWeekEn" },
  { code: "CA", label: "Canada", flag: "🇨🇦", currency: "CA$", weeklyPrice: "69.99", periodKey: "perWeekEn" },
];

const PERIOD_LABEL: Record<Region["periodKey"], string> = {
  perWeekFr: "/semaine",
  perWeekEn: "/week",
};

const COUNTRY_MAP: Record<string, string> = {
  SN: "SN", ML: "SN", CI: "SN", BF: "SN", NE: "SN", GN: "SN", TG: "SN", BJ: "SN",
  US: "US",
  CA: "CA",
};

function formatPrice(region: Region) {
  if (region.currency === "FCFA") return `${region.weeklyPrice} FCFA`;
  return `${region.currency}${region.weeklyPrice}`;
}

const FEATURE_KEYS = [
  "price.f1", "price.f2", "price.f3", "price.f4", "price.f5", "price.f6",
  "price.f7", "price.f8", "price.f9", "price.f10", "price.f11",
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function Pricing() {
  const { t } = useLanguage();
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
    <section id="pricing" className="relative py-24 bg-slate-50 border-y border-slate-100 overflow-hidden">
      <div className="bg-dot-grid pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative max-w-7xl mx-auto px-6">

        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase">{t("price.kicker")}</span>
          <h2 className="mt-3 text-4xl font-black text-slate-900 leading-tight tracking-tight">
            {t("price.title")}
          </h2>
          <p className="mt-4 text-slate-500">
            {t("price.subtitle")}
          </p>
        </div>

        {/* Region selector */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            {REGIONS.map((r) => (
              <button
                key={r.code}
                onClick={() => setRegion(r)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active.code === r.code ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-50"
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
            ? <span className="inline-flex items-center gap-1.5"><Loader2 className="w-3 h-3 animate-spin" /> {t("price.detecting")}</span>
            : <span>{t("price.detected")} {active.flag} {active.label}</span>
          }
        </p>

        {/* Plan card */}
        <div className="max-w-md mx-auto">
          <div className="relative bg-gradient-to-b from-blue-600 to-blue-700 rounded-3xl p-8 shadow-2xl shadow-blue-600/30 text-white">
            <div className="bg-dot-grid pointer-events-none absolute inset-0 rounded-3xl opacity-20" />
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-bold tracking-wide bg-white/20 px-3 py-1 rounded-full">{t("price.weekly")}</span>
                <span className="text-[10px] font-bold tracking-wide bg-white/20 px-3 py-1 rounded-full">{t("price.allIn")}</span>
              </div>

              <div className="flex items-end gap-1 mb-2">
                <span className="text-5xl font-black tracking-tight">{formatPrice(active)}</span>
                <span className="text-blue-100 text-sm mb-2">{PERIOD_LABEL[active.periodKey]}</span>
              </div>
              <p className="text-blue-100 text-sm mb-8">{t("price.tagline")}</p>

              <ul className="space-y-2.5 mb-8">
                {FEATURE_KEYS.map((key) => (
                  <li key={key} className="flex items-center gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-blue-200 flex-shrink-0" />
                    <span className="text-blue-50">{t(key)}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className="w-full block text-center py-4 rounded-xl text-sm font-bold bg-white text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {t("price.cta")}
              </Link>
              <p className="text-center text-blue-200 text-xs mt-3">
                {t("price.fineprint")}
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8">
          {t("price.footnote")}
        </p>
      </div>
    </section>
  );
}

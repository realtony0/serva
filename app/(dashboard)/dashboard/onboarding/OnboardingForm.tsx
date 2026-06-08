"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Zap } from "lucide-react";
import Link from "next/link";

const COUNTRY_CURRENCIES: Record<string, string> = {
  Canada: "CAD",
  USA: "USD",
  Sénégal: "XOF",
};

interface Props {
  userId: string;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function OnboardingForm({ userId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    city: "",
    country: "Canada",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currency = COUNTRY_CURRENCIES[form.country] ?? "CAD";

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const slug = slugify(form.name);

    const { error: insertError } = await supabase.from("restaurants").insert({
      name: form.name,
      slug,
      city: form.city,
      country: form.country,
      currency,
      owner_id: userId,
      is_active: true,
      plan: "starter",
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-7 h-7 bg-blue-600 rounded-md flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
        </div>
        <Link href="/" className="text-lg font-bold text-slate-900 tracking-tight">
          Serva
        </Link>
      </div>

      <h2 className="text-xl font-semibold text-slate-900 mb-1">
        Créer votre restaurant
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Ces informations seront visibles par vos clients.
      </p>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Nom du restaurant
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Le Grand Bistro"
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Ville
          </label>
          <input
            id="city"
            name="city"
            type="text"
            required
            value={form.city}
            onChange={handleChange}
            placeholder="Montréal"
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            Pays
          </label>
          <select
            id="country"
            name="country"
            value={form.country}
            onChange={handleChange}
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>Canada</option>
            <option>USA</option>
            <option>Sénégal</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Devise
          </label>
          <div className="w-full px-3 py-2.5 text-sm border border-slate-100 rounded-lg bg-slate-50 text-slate-500">
            {currency} — sélectionnée automatiquement selon le pays
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm py-2.5 rounded-lg transition-colors mt-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Création en cours…
            </>
          ) : (
            "Créer le restaurant"
          )}
        </button>
      </form>
    </div>
  );
}

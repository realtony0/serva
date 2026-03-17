"use client";

/**
 * Page d'inscription publique pour les restaurateurs
 *
 * Permet aux restaurants de soumettre une demande pour rejoindre SERVA.
 * Aucune authentification requise.
 */

import { useState } from "react";
import Link from "next/link";
import { submitRegistrationRequest } from "@/services/registration-service";
import { RegistrationFormData } from "@/lib/types/registration-request";
import { useToast } from "@/components/ui/Toast";

export default function InscriptionPage() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<RegistrationFormData>({
    restaurantName: "",
    description: "",
    city: "",
    ownerName: "",
    email: "",
    phone: "",
    estimatedTables: 10,
    message: "",
  });

  const updateField = (
    field: keyof RegistrationFormData,
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await submitRegistrationRequest(form);
      setSuccess(true);
      toast.success("Votre demande a bien été envoyée !");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur inconnue";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Page de confirmation
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Demande envoy&eacute;e !
            </h1>
            <p className="text-gray-600 mb-2">
              Merci pour votre int&eacute;r&ecirc;t pour SERVA.
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Notre &eacute;quipe examinera votre demande et vous contactera
              &agrave; l&apos;adresse <strong>{form.email}</strong> dans les
              plus brefs d&eacute;lais.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Retour &agrave; l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SERVA</span>
          </Link>
          <Link
            href="/restaurant/login"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            D&eacute;j&agrave; inscrit ? Se connecter
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Rejoignez SERVA
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Digitalisez votre restaurant en quelques minutes. Commandes en ligne,
          QR codes, suivi en temps r&eacute;el &mdash; tout ce dont vous avez besoin.
        </p>
      </div>

      {/* Formulaire */}
      <div className="max-w-2xl mx-auto px-4 pb-16">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6"
        >
          <h2 className="text-xl font-bold text-gray-900 border-b pb-4">
            Informations du restaurant
          </h2>

          {/* Nom du restaurant */}
          <div>
            <label
              htmlFor="restaurantName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nom du restaurant *
            </label>
            <input
              id="restaurantName"
              type="text"
              required
              value={form.restaurantName}
              onChange={(e) => updateField("restaurantName", e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Ex: Le Maquis du Plateau"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description du restaurant
            </label>
            <textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Type de cuisine, ambiance, sp&eacute;cialit&eacute;s..."
            />
          </div>

          {/* Ville + Nombre de tables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Ville / Quartier *
              </label>
              <input
                id="city"
                type="text"
                required
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Ex: Abidjan, Cocody"
              />
            </div>
            <div>
              <label
                htmlFor="estimatedTables"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre de tables estim&eacute; *
              </label>
              <input
                id="estimatedTables"
                type="number"
                required
                min={1}
                max={500}
                value={form.estimatedTables}
                onChange={(e) =>
                  updateField("estimatedTables", parseInt(e.target.value) || 1)
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 border-b pb-4 pt-2">
            Informations de contact
          </h2>

          {/* Nom propriétaire */}
          <div>
            <label
              htmlFor="ownerName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nom complet du propri&eacute;taire *
            </label>
            <input
              id="ownerName"
              type="text"
              required
              value={form.ownerName}
              onChange={(e) => updateField("ownerName", e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Pr&eacute;nom et nom"
            />
          </div>

          {/* Email + Téléphone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="contact@restaurant.com"
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                T&eacute;l&eacute;phone *
              </label>
              <input
                id="phone"
                type="tel"
                required
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="+225 07 XX XX XX XX"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Message (optionnel)
            </label>
            <textarea
              id="message"
              rows={3}
              value={form.message}
              onChange={(e) => updateField("message", e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="Des questions, des besoins sp&eacute;cifiques ?"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Envoi en cours...
              </span>
            ) : (
              "Envoyer ma demande"
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            En soumettant ce formulaire, vous acceptez d&apos;&ecirc;tre
            contact&eacute; par l&apos;&eacute;quipe SERVA concernant votre
            demande.
          </p>
        </form>
      </div>
    </div>
  );
}

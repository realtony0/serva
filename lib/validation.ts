/**
 * Fonctions de validation centralisées pour SERVA
 *
 * Valide les données AVANT envoi à Firestore.
 * Première ligne de défense côté client — les règles Firestore
 * sont la deuxième ligne côté serveur.
 */

// ── Helpers ────────────────────────────────────────────────

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveNumber(value: unknown): value is number {
  return typeof value === "number" && isFinite(value) && value >= 0;
}

function isPositiveInteger(value: unknown): value is number {
  return isPositiveNumber(value) && Number.isInteger(value) && value > 0;
}

// ── Sanitisation ───────────────────────────────────────────

/**
 * Nettoie une chaîne de caractères (trim + supprime les caractères de contrôle)
 */
export function sanitizeString(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.trim().replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}

/**
 * Limite la longueur d'une chaîne
 */
export function truncate(value: string, maxLength: number): string {
  return value.length > maxLength ? value.slice(0, maxLength) : value;
}

// ── Validations métier ─────────────────────────────────────

/**
 * Valide un ID Firestore (restaurant, table, etc.)
 */
export function validateId(value: unknown, label: string): string {
  if (!isNonEmptyString(value)) {
    throw new Error(`${label} est requis`);
  }
  const cleaned = sanitizeString(value);
  if (cleaned.length === 0 || cleaned.length > 200) {
    throw new Error(`${label} est invalide`);
  }
  return cleaned;
}

/**
 * Valide un prix (nombre positif, max raisonnable en FCFA)
 */
export function validatePrice(value: unknown, label: string): number {
  if (!isPositiveNumber(value)) {
    throw new Error(`${label} doit être un nombre positif`);
  }
  const price = value as number;
  if (price > 10_000_000) {
    throw new Error(`${label} dépasse le maximum autorisé`);
  }
  return Math.round(price * 100) / 100;
}

/**
 * Valide une quantité (entier positif)
 */
export function validateQuantity(value: unknown, label: string): number {
  if (!isPositiveInteger(value)) {
    throw new Error(`${label} doit être un entier positif`);
  }
  const qty = value as number;
  if (qty > 100) {
    throw new Error(`${label} dépasse le maximum autorisé (100)`);
  }
  return qty;
}

/**
 * Valide un nombre de tables (1 à 200)
 */
export function validateTableCount(value: unknown): number {
  if (!isPositiveInteger(value)) {
    throw new Error("Le nombre de tables doit être un entier positif");
  }
  const count = value as number;
  if (count > 200) {
    throw new Error("Maximum 200 tables par restaurant");
  }
  return count;
}

/**
 * Valide un rating (1-5, entier)
 */
export function validateRating(value: unknown): number {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 5) {
    throw new Error("La note doit être un entier entre 1 et 5");
  }
  return value;
}

/**
 * Valide un type de demande de service
 */
export function validateServiceRequestType(value: unknown): "server" | "bill" {
  if (value !== "server" && value !== "bill") {
    throw new Error("Type de demande invalide");
  }
  return value;
}

/**
 * Valide un statut de commande
 */
export function validateOrderStatus(
  value: unknown
): "pending" | "preparing" | "ready" | "delivered" | "cancelled" {
  const validStatuses = ["pending", "preparing", "ready", "delivered", "cancelled"];
  if (typeof value !== "string" || !validStatuses.includes(value)) {
    throw new Error("Statut de commande invalide");
  }
  return value as "pending" | "preparing" | "ready" | "delivered" | "cancelled";
}

/**
 * Valide un nom (restaurant, produit, catégorie...)
 */
export function validateName(value: unknown, label: string, maxLength = 200): string {
  if (!isNonEmptyString(value)) {
    throw new Error(`${label} est requis`);
  }
  const cleaned = sanitizeString(value);
  if (cleaned.length === 0) {
    throw new Error(`${label} ne peut pas être vide`);
  }
  return truncate(cleaned, maxLength);
}

/**
 * Valide une URL (optionnelle)
 */
export function validateUrl(value: unknown, label: string): string {
  if (value === undefined || value === null || value === "") {
    return "";
  }
  if (typeof value !== "string") {
    throw new Error(`${label} doit être une URL valide`);
  }
  const cleaned = sanitizeString(value);
  if (cleaned.length > 2000) {
    throw new Error(`${label} est trop longue`);
  }
  return cleaned;
}

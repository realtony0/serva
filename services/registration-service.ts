/**
 * Service pour les demandes d'inscription restaurant
 */

import {
  setDocument,
  getCollection,
  updateDocument,
  where,
  orderBy,
} from "@/lib/firestore";
import {
  RegistrationRequest,
  RegistrationFormData,
  RegistrationStatus,
} from "@/lib/types/registration-request";
import {
  validateName,
  validateId,
  sanitizeString,
  truncate,
} from "@/lib/validation";

const COLLECTION = "registration_requests";

/**
 * Valide les données du formulaire d'inscription
 */
function validateRegistrationData(data: RegistrationFormData): void {
  validateName(data.restaurantName, "Le nom du restaurant");
  validateName(data.ownerName, "Le nom du propriétaire");

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    throw new Error("L'adresse email est invalide");
  }

  if (!data.phone || data.phone.trim().length < 8) {
    throw new Error("Le numéro de téléphone est invalide (minimum 8 chiffres)");
  }

  if (!data.city || data.city.trim().length === 0) {
    throw new Error("La ville est requise");
  }

  if (
    typeof data.estimatedTables !== "number" ||
    data.estimatedTables < 1 ||
    data.estimatedTables > 500
  ) {
    throw new Error("Le nombre de tables doit être entre 1 et 500");
  }
}

/**
 * Soumet une demande d'inscription (public, sans auth)
 */
export async function submitRegistrationRequest(
  data: RegistrationFormData
): Promise<string> {
  validateRegistrationData(data);

  const id = `reg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const now = new Date().toISOString();

  const request: RegistrationRequest = {
    id,
    restaurantName: sanitizeString(data.restaurantName),
    description: truncate(sanitizeString(data.description || ""), 1000),
    city: sanitizeString(data.city),
    ownerName: sanitizeString(data.ownerName),
    email: data.email.trim().toLowerCase(),
    phone: sanitizeString(data.phone),
    estimatedTables: data.estimatedTables,
    message: truncate(sanitizeString(data.message || ""), 500),
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };

  await setDocument(COLLECTION, id, request);
  return id;
}

/**
 * Récupère toutes les demandes (admin uniquement)
 */
export async function getAllRegistrationRequests(): Promise<
  RegistrationRequest[]
> {
  return getCollection<RegistrationRequest>(
    COLLECTION,
    orderBy("createdAt", "desc")
  );
}

/**
 * Récupère les demandes par statut (admin uniquement)
 */
export async function getRegistrationRequestsByStatus(
  status: RegistrationStatus
): Promise<RegistrationRequest[]> {
  return getCollection<RegistrationRequest>(
    COLLECTION,
    where("status", "==", status),
    orderBy("createdAt", "desc")
  );
}

/**
 * Met à jour le statut d'une demande (admin uniquement)
 */
export async function updateRegistrationStatus(
  id: string,
  status: RegistrationStatus,
  adminNote?: string
): Promise<void> {
  validateId(id, "L'ID de la demande");
  const updateData: Record<string, string> = {
    status,
    updatedAt: new Date().toISOString(),
  };
  if (adminNote !== undefined) {
    updateData.adminNote = truncate(sanitizeString(adminNote), 500);
  }
  await updateDocument(COLLECTION, id, updateData);
}

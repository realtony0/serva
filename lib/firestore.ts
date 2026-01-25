/**
 * Helpers pour Firestore
 * 
 * Fonctions utilitaires pour interagir avec la base de données Firestore
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  QueryConstraint,
  DocumentData,
  QueryDocumentSnapshot,
  CollectionReference,
  DocumentReference,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Écoute les changements d'une collection en temps réel
 * @param collectionName - Nom de la collection
 * @param callback - Fonction appelée à chaque changement
 * @param constraints - Contraintes de requête optionnelles
 * @returns Fonction pour arrêter l'écoute
 */
export const onCollectionChange = <T = DocumentData>(
  collectionName: string,
  callback: (data: T[]) => void,
  ...constraints: QueryConstraint[]
) => {
  if (!db) {
    throw new Error("Firestore n'est pas initialisé");
  }

  const collectionRef = collection(db, collectionName);
  const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;

  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as T)
    );
    callback(data);
  });
};

/**
 * Récupère un document par son ID
 * @param collectionName - Nom de la collection
 * @param documentId - ID du document
 * @returns Le document ou null s'il n'existe pas
 */
export const getDocument = async <T = DocumentData>(
  collectionName: string,
  documentId: string
): Promise<T | null> => {
  if (!db) {
    throw new Error("Firestore n'est pas initialisé");
  }

  const docRef = doc(db, collectionName, documentId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
};

/**
 * Récupère tous les documents d'une collection
 * @param collectionName - Nom de la collection
 * @param constraints - Contraintes de requête optionnelles (where, orderBy, limit, etc.)
 * @returns Tableau de documents
 */
export const getCollection = async <T = DocumentData>(
  collectionName: string,
  ...constraints: QueryConstraint[]
): Promise<T[]> => {
  if (!db) {
    throw new Error("Firestore n'est pas initialisé");
  }

  const collectionRef = collection(db, collectionName);
  const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef;
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as T)
  );
};

/**
 * Crée ou met à jour un document
 * @param collectionName - Nom de la collection
 * @param documentId - ID du document
 * @param data - Données à sauvegarder
 * @param merge - Si true, fusionne avec les données existantes (par défaut: false)
 */
export const setDocument = async <T = DocumentData>(
  collectionName: string,
  documentId: string,
  data: Partial<T>,
  merge: boolean = false
): Promise<void> => {
  if (!db) {
    throw new Error("Firestore n'est pas initialisé");
  }

  const docRef = doc(db, collectionName, documentId);
  await setDoc(docRef, data, { merge });
};

/**
 * Met à jour un document existant
 * @param collectionName - Nom de la collection
 * @param documentId - ID du document
 * @param data - Données à mettre à jour
 */
export const updateDocument = async <T = DocumentData>(
  collectionName: string,
  documentId: string,
  data: Partial<T>
): Promise<void> => {
  if (!db) {
    throw new Error("Firestore n'est pas initialisé");
  }

  const docRef = doc(db, collectionName, documentId);
  await updateDoc(docRef, data);
};

/**
 * Supprime un document
 * @param collectionName - Nom de la collection
 * @param documentId - ID du document à supprimer
 */
export const deleteDocument = async (
  collectionName: string,
  documentId: string
): Promise<void> => {
  if (!db) {
    throw new Error("Firestore n'est pas initialisé");
  }

  const docRef = doc(db, collectionName, documentId);
  await deleteDoc(docRef);
};

/**
 * Récupère une référence de collection (pour usage avancé)
 */
export const getCollectionRef = (
  collectionName: string
): CollectionReference => {
  if (!db) {
    throw new Error("Firestore n'est pas initialisé");
  }
  return collection(db, collectionName);
};

/**
 * Récupère une référence de document (pour usage avancé)
 */
export const getDocumentRef = (
  collectionName: string,
  documentId: string
): DocumentReference => {
  if (!db) {
    throw new Error("Firestore n'est pas initialisé");
  }
  return doc(db, collectionName, documentId);
};

// Export des helpers de requête pour faciliter leur utilisation
export { where, orderBy, limit, increment };



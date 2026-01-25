"use client";

/**
 * Composant pour enregistrer le Service Worker
 * Doit être un composant client
 */

import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/pwa-register";

export default function PWARegister() {
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}



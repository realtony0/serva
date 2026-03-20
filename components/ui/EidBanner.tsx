"use client";

import { useState } from "react";

export default function EidBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative bg-gradient-to-r from-emerald-500 via-yellow-500 to-emerald-500 text-center py-3 px-4 shadow-lg">
      <span className="text-lg font-bold text-white drop-shadow-md">
        &#9770; Eid Mubarak ! Que cette fête soit remplie de joie, de partage et de délicieux repas en famille &#10024;
      </span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-yellow-200 transition-colors text-xl font-bold leading-none"
        aria-label="Fermer"
      >
        &times;
      </button>
    </div>
  );
}

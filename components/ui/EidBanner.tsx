"use client";

import { useState } from "react";

export default function EidBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white text-center py-2 px-4 text-sm font-medium tracking-wide">
      <span>
        &#9770; Eid Mubarak ! Que cette fête soit remplie de joie, de partage et de délicieux repas en famille &#10024;
      </span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors text-lg leading-none"
        aria-label="Fermer"
      >
        &times;
      </button>
    </div>
  );
}

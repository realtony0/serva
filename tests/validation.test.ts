import { describe, it, expect } from "vitest";
import {
  validateId,
  validatePrice,
  validateQuantity,
  validateTableCount,
  validateRating,
  validateServiceRequestType,
  validateOrderStatus,
  validateName,
  validateUrl,
  sanitizeString,
  truncate,
} from "@/lib/validation";

// ── sanitizeString ─────────────────────────────────────────

describe("sanitizeString", () => {
  it("supprime les espaces en début et fin", () => {
    expect(sanitizeString("  hello  ")).toBe("hello");
  });

  it("supprime les caractères de contrôle", () => {
    expect(sanitizeString("hello\x00world")).toBe("helloworld");
    expect(sanitizeString("test\x07string")).toBe("teststring");
  });

  it("garde les retours à la ligne (\\n, \\r)", () => {
    expect(sanitizeString("hello\nworld")).toBe("hello\nworld");
  });
});

// ── truncate ───────────────────────────────────────────────

describe("truncate", () => {
  it("ne tronque pas si plus court que la limite", () => {
    expect(truncate("abc", 10)).toBe("abc");
  });

  it("tronque si plus long que la limite", () => {
    expect(truncate("abcdef", 3)).toBe("abc");
  });
});

// ── validateId ─────────────────────────────────────────────

describe("validateId", () => {
  it("accepte un ID valide", () => {
    expect(validateId("restaurant_123", "ID")).toBe("restaurant_123");
  });

  it("trim les espaces", () => {
    expect(validateId("  abc  ", "ID")).toBe("abc");
  });

  it("rejette une chaîne vide", () => {
    expect(() => validateId("", "ID")).toThrow("ID est requis");
  });

  it("rejette null/undefined", () => {
    expect(() => validateId(null, "ID")).toThrow("ID est requis");
    expect(() => validateId(undefined, "ID")).toThrow("ID est requis");
  });

  it("rejette un nombre", () => {
    expect(() => validateId(123, "ID")).toThrow("ID est requis");
  });

  it("rejette une chaîne trop longue (> 200 chars)", () => {
    expect(() => validateId("a".repeat(201), "ID")).toThrow("ID est invalide");
  });
});

// ── validatePrice ──────────────────────────────────────────

describe("validatePrice", () => {
  it("accepte un prix valide", () => {
    expect(validatePrice(1500, "Prix")).toBe(1500);
  });

  it("accepte 0", () => {
    expect(validatePrice(0, "Prix")).toBe(0);
  });

  it("arrondit à 2 décimales", () => {
    expect(validatePrice(10.999, "Prix")).toBe(11);
    expect(validatePrice(10.555, "Prix")).toBe(10.56);
  });

  it("rejette un prix négatif", () => {
    expect(() => validatePrice(-1, "Prix")).toThrow("nombre positif");
  });

  it("rejette NaN", () => {
    expect(() => validatePrice(NaN, "Prix")).toThrow("nombre positif");
  });

  it("rejette Infinity", () => {
    expect(() => validatePrice(Infinity, "Prix")).toThrow("nombre positif");
  });

  it("rejette un prix > 10 000 000", () => {
    expect(() => validatePrice(10_000_001, "Prix")).toThrow("maximum autorisé");
  });

  it("rejette une chaîne", () => {
    expect(() => validatePrice("1500", "Prix")).toThrow("nombre positif");
  });
});

// ── validateQuantity ───────────────────────────────────────

describe("validateQuantity", () => {
  it("accepte un entier positif", () => {
    expect(validateQuantity(3, "Quantité")).toBe(3);
  });

  it("rejette 0", () => {
    expect(() => validateQuantity(0, "Quantité")).toThrow("entier positif");
  });

  it("rejette un décimal", () => {
    expect(() => validateQuantity(1.5, "Quantité")).toThrow("entier positif");
  });

  it("rejette un nombre négatif", () => {
    expect(() => validateQuantity(-1, "Quantité")).toThrow("entier positif");
  });

  it("rejette > 100", () => {
    expect(() => validateQuantity(101, "Quantité")).toThrow("maximum autorisé");
  });
});

// ── validateTableCount ─────────────────────────────────────

describe("validateTableCount", () => {
  it("accepte 1 à 200", () => {
    expect(validateTableCount(1)).toBe(1);
    expect(validateTableCount(200)).toBe(200);
  });

  it("rejette 0", () => {
    expect(() => validateTableCount(0)).toThrow("entier positif");
  });

  it("rejette > 200", () => {
    expect(() => validateTableCount(201)).toThrow("Maximum 200");
  });
});

// ── validateRating ─────────────────────────────────────────

describe("validateRating", () => {
  it("accepte 1 à 5", () => {
    for (let i = 1; i <= 5; i++) {
      expect(validateRating(i)).toBe(i);
    }
  });

  it("rejette 0", () => {
    expect(() => validateRating(0)).toThrow("entre 1 et 5");
  });

  it("rejette 6", () => {
    expect(() => validateRating(6)).toThrow("entre 1 et 5");
  });

  it("rejette un décimal", () => {
    expect(() => validateRating(3.5)).toThrow("entre 1 et 5");
  });
});

// ── validateServiceRequestType ─────────────────────────────

describe("validateServiceRequestType", () => {
  it("accepte 'server' et 'bill'", () => {
    expect(validateServiceRequestType("server")).toBe("server");
    expect(validateServiceRequestType("bill")).toBe("bill");
  });

  it("rejette tout autre type", () => {
    expect(() => validateServiceRequestType("other")).toThrow("invalide");
    expect(() => validateServiceRequestType("")).toThrow("invalide");
  });
});

// ── validateOrderStatus ────────────────────────────────────

describe("validateOrderStatus", () => {
  it("accepte les statuts valides", () => {
    const valid = ["pending", "preparing", "ready", "delivered", "cancelled"];
    for (const s of valid) {
      expect(validateOrderStatus(s)).toBe(s);
    }
  });

  it("rejette un statut invalide", () => {
    expect(() => validateOrderStatus("unknown")).toThrow("invalide");
  });
});

// ── validateName ───────────────────────────────────────────

describe("validateName", () => {
  it("accepte un nom valide", () => {
    expect(validateName("Le Gourmet", "Nom")).toBe("Le Gourmet");
  });

  it("trim les espaces", () => {
    expect(validateName("  Café  ", "Nom")).toBe("Café");
  });

  it("rejette une chaîne vide", () => {
    expect(() => validateName("", "Nom")).toThrow("requis");
  });

  it("tronque si trop long", () => {
    const long = "a".repeat(300);
    expect(validateName(long, "Nom").length).toBe(200);
  });

  it("respecte le maxLength personnalisé", () => {
    const long = "a".repeat(50);
    expect(validateName(long, "Nom", 10).length).toBe(10);
  });
});

// ── validateUrl ────────────────────────────────────────────

describe("validateUrl", () => {
  it("accepte une URL valide", () => {
    expect(validateUrl("https://example.com/img.png", "URL")).toBe(
      "https://example.com/img.png"
    );
  });

  it("retourne vide si vide/null/undefined", () => {
    expect(validateUrl("", "URL")).toBe("");
    expect(validateUrl(null, "URL")).toBe("");
    expect(validateUrl(undefined, "URL")).toBe("");
  });

  it("rejette une URL trop longue", () => {
    expect(() => validateUrl("https://x.com/" + "a".repeat(2000), "URL")).toThrow(
      "trop longue"
    );
  });
});

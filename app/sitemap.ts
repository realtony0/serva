import { MetadataRoute } from "next";

/**
 * Sitemap dynamique pour SERVA
 *
 * Les pages de restaurants (/r/[id]) sont générées dynamiquement
 * et pourront être ajoutées ici via Firestore si nécessaire.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://serva.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/restaurant/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}

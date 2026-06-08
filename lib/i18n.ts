/**
 * Lightweight i18n for Serva — no external libraries.
 *
 * Exports a `Locale` type and a `translations` object keyed by locale, plus a
 * couple of helpers. The runtime context lives in
 * `components/LanguageProvider.tsx` and exposes `useLanguage()` → { locale, setLocale, t }.
 */

export type Locale = "fr" | "en";

export const LOCALE_STORAGE_KEY = "serva-locale";

type Dict = Record<string, string>;

export const translations: Record<Locale, Dict> = {
  fr: {
    /* ── Navbar ── */
    "nav.features": "Fonctionnalités",
    "nav.how": "Comment ça marche",
    "nav.pricing": "Tarifs",
    "nav.testimonials": "Témoignages",
    "nav.signin": "Connexion",
    "nav.tryFree": "Essai gratuit",

    /* ── Hero ── */
    "hero.badge": "Commande par QR · Sans appli · Cuisine en temps réel",
    "hero.title.a": "Les commandes filent,",
    "hero.title.b": "vous restez",
    "hero.title.c": "en cuisine.",
    "hero.subtitle":
      "Serva digitalise votre restaurant en moins de 10 minutes. La table scanne un QR, la commande arrive instantanément en cuisine — sans serveur pour la prise de commande.",
    "hero.ctaPrimary": "Commencer gratuitement — 7 jours",
    "hero.ctaSecondary": "Voir comment ça marche",
    "hero.fineprint": "Sans carte bancaire · Résiliable à tout moment · Installé en 10 min",
    "hero.stat1.value": "< 2s",
    "hero.stat1.label": "Chargement menu",
    "hero.stat2.value": "0",
    "hero.stat2.label": "Appli à installer",
    "hero.stat3.value": "100%",
    "hero.stat3.label": "Temps réel",

    /* ── Mockup ── */
    "mock.greeting": "Bonjour, Chef 👋",
    "mock.subtitle": "Dimanche 1 juin · Restaurant Le Baobab",
    "mock.live": "8 tables en direct",
    "mock.revenue": "Recette du jour",
    "mock.orders": "Commandes",
    "mock.avg": "Panier moyen",
    "mock.liveOrders": "Commandes en direct",
    "mock.viewAll": "Tout voir",

    /* ── How it works ── */
    "how.kicker": "Comment ça marche",
    "how.title.a": "Quatre étapes.",
    "how.title.b": "Restaurant 100% digital.",
    "how.s1.title": "Scanner & parcourir",
    "how.s1.desc":
      "Le client scanne le QR sur la table. Pas d'appli. Le menu s'affiche en moins de 2 secondes sur son téléphone.",
    "how.s2.title": "Commander & personnaliser",
    "how.s2.desc":
      "Il choisit ses plats, ses options, ajoute une note. Tout est validé en un geste — sans serveur.",
    "how.s3.title": "La cuisine reçoit aussitôt",
    "how.s3.desc":
      "La commande arrive sur l'écran cuisine à la milliseconde où elle est passée. Aucun relais, aucune erreur.",
    "how.s4.title": "Laisser un avis",
    "how.s4.desc":
      "Le repas terminé, le client est invité à noter son expérience. Un retour précieux, sans effort.",

    /* ── Benefit blocks ── */
    "bloc.01.kicker": "Bloc 01 · L'argument business",
    "bloc.01.title": "Tournez plus de tables, sans agrandir la salle.",
    "bloc.01.body":
      "Vos clients commandent dès qu'ils s'assoient et suivent leur repas en direct — sans attendre un serveur, sans lever la main. Le service va plus vite, vous accueillez plus de couverts, vous encaissez plus sur le même nombre de places.",
    "bloc.01.f1": "Commande dès l'arrivée à table",
    "bloc.01.f2": "Suivi de la préparation en temps réel",
    "bloc.01.f3": "Plus de couverts servis par service",
    "bloc.02.kicker": "Bloc 02 · Ce que les clients adorent",
    "bloc.02.title": "Une expérience que vos clients trouvent bluffante.",
    "bloc.02.body":
      "Ils scannent, découvrent le menu en photos, personnalisent chaque plat, suivent la préparation en direct et appellent un serveur d'un simple geste. Fluide, moderne, sans friction. Ils repartent en se disant : « ce resto est en avance. »",

    /* ── Two interfaces ── */
    "two.kicker": "La plateforme",
    "two.title": "Pensée pour deux mondes.",
    "two.subtitle":
      "Une seule plateforme, deux interfaces taillées sur mesure — pour votre équipe et pour vos clients.",
    "two.back.kicker": "Back-office restaurant",
    "two.back.title": "Tout votre service, sur un seul écran.",
    "two.back.f1": "Recette, commandes & état des tables en temps réel",
    "two.back.f2": "Éditeur de menu visuel avec photos & options",
    "two.back.f3": "Générateur de QR par table ou par zone",
    "two.back.f4": "Écran cuisine (KDS) avec gestion des services",
    "two.back.f5": "Statistiques, export & rôles d'équipe",
    "two.back.cta": "Créer mon restaurant",
    "two.client.kicker": "Expérience client",
    "two.client.title": "Commander en quelques secondes. Sans appli, jamais.",
    "two.client.f1": "Menu instantané au scan — sans téléchargement, sans compte",
    "two.client.f2": "Beau menu avec photos, allergènes & options",
    "two.client.f3": "Suivi de commande en direct sur le téléphone",
    "two.client.f4": "Bouton appel serveur, suivi en temps réel",
    "two.client.f5": "Un avis en un geste, une fois servi",
    "two.client.cta": "Voir une démo",

    /* ── Features ── */
    "feat.kicker": "Fonctionnalités",
    "feat.title.a": "Tout au même endroit.",
    "feat.title.b": "Aucune intégration requise.",
    "feat.qr.t": "Un QR par table",
    "feat.qr.d": "Un QR unique par table ou par zone. Le menu en moins de 2 secondes — sans installation, sans friction.",
    "feat.kitchen.t": "Cuisine instantanée",
    "feat.kitchen.d": "Les commandes arrivent sur l'écran cuisine en quelques millisecondes. Zéro erreur de transmission.",
    "feat.kds.t": "Écran cuisine (KDS)",
    "feat.kds.d": "Un écran cuisine conscient des services. Votre équipe sait toujours ce qui suit, ce qui presse, ce qui est prêt.",
    "feat.waiter.t": "Appel serveur",
    "feat.waiter.d": "Le client demande de l'aide en un geste. Votre staff le voit aussitôt sur le tableau de bord.",
    "feat.brand.t": "Votre marque, partout",
    "feat.brand.d": "Logo, couleurs et typo personnalisés. Vos clients voient votre identité — pas une appli générique.",
    "feat.analytics.t": "Des stats qui comptent",
    "feat.analytics.d": "Recette par heure, best-sellers, rotation des tables. Des données exploitables, exportables à tout moment.",
    "feat.tables.t": "Gestion des tables",
    "feat.tables.d": "Plan de salle visuel, état des tables en temps réel. Vous savez quelles tables sont occupées, en attente ou libres.",
    "feat.reviews.t": "Avis automatiques",
    "feat.reviews.d": "Des notes collectées automatiquement après chaque repas. Améliorez le service avec des données réelles.",
    "feat.roles.t": "Rôles & sécurité",
    "feat.roles.d": "Admin, manager, cuisine, serveur — un accès par rôle. Vos données restent les vôtres.",

    /* ── Testimonials ── */
    "test.kicker": "Témoignages",
    "test.title.a": "Vrais restaurants.",
    "test.title.b": "Vrais résultats.",
    "test.q1": "Zéro erreur de commande dès le premier jour. Notre cuisine va plus vite et nos clients reviennent.",
    "test.r1": "Propriétaire · Le Baobab, Dakar",
    "test.q2": "Installation en 9 minutes. Serva fonctionne, point. Nos avis mentionnent la fluidité de la commande.",
    "test.r2": "Manager · Brasserie St-Laurent, Montréal",
    "test.q3": "4 adresses à New York. Le tableau de bord multi-sites me donne une vue complète sans jongler entre outils.",
    "test.r3": "CEO · Fork & Flame Group, New York",

    /* ── Pricing ── */
    "price.kicker": "Tarifs",
    "price.title": "Un seul plan. Tout est inclus.",
    "price.subtitle": "7 jours d'essai gratuit. Sans carte bancaire. Résiliable à tout moment.",
    "price.detecting": "Détection de votre région…",
    "price.detected": "Région détectée :",
    "price.weekly": "ABONNEMENT HEBDOMADAIRE",
    "price.allIn": "TOUT INCLUS",
    "price.tagline": "Tout ce qu'il faut à votre restaurant, chaque semaine.",
    "price.cta": "Commencer gratuitement — 7 jours",
    "price.fineprint": "Sans carte bancaire · Résiliable à tout moment",
    "price.footnote": "Prix affichés en devise locale. Taxes éventuelles en sus.",
    "price.f1": "Toutes les tables incluses",
    "price.f2": "Menu par QR code",
    "price.f3": "Gestion des commandes",
    "price.f4": "Écran cuisine (KDS)",
    "price.f5": "Avis clients",
    "price.f6": "Statistiques avancées",
    "price.f7": "Personnalisation de marque",
    "price.f8": "10 comptes équipe",
    "price.f9": "Support prioritaire",
    "price.f10": "Sans engagement",
    "price.f11": "Résiliable à tout moment",

    /* ── Final CTA ── */
    "cta.title.a": "Votre restaurant,",
    "cta.title.b": "digital dès ce soir.",
    "cta.subtitle": "7 jours d'essai gratuit. Sans carte bancaire. Installation complète en moins de 10 minutes.",
    "cta.primary": "Créer mon compte — c'est gratuit",
    "cta.secondary": "J'ai déjà un compte →",

    /* ── Footer ── */
    "footer.blurb": "La plateforme qui transforme un scan de QR en commande cuisine en moins de 2 secondes.",
    "footer.product": "Produit",
    "footer.access": "Accès",
    "footer.legal": "Légal",
    "footer.create": "Créer un compte",
    "footer.restoDash": "Tableau de bord restaurant",
    "footer.kitchen": "Écran cuisine",
    "footer.admin": "Panneau admin",
    "footer.terms": "Conditions d'utilisation",
    "footer.privacy": "Politique de confidentialité",
    "footer.notice": "Mentions légales",
    "footer.contact": "Contact",
    "footer.rights": "Tous droits réservés.",
    "footer.worldwide": "Conçu pour les restaurateurs du monde entier 🌍",

    /* ── Client ordering page ── */
    "client.table": "Table",
    "client.cat.starters": "Entrées",
    "client.cat.mains": "Plats",
    "client.cat.desserts": "Desserts",
    "client.cat.drinks": "Boissons",
    "client.badge.popular": "Populaire",
    "client.badge.vegan": "Végan",
    "client.badge.spicy": "Épicé",
    "client.add": "Ajouter",
    "client.yourOrder": "Votre commande",
    "client.item": "article",
    "client.items": "articles",
    "client.each": "/ unité",
    "client.notes": "Demandes spéciales ou allergies…",
    "client.total": "Total",
    "client.sendOrder": "Envoyer en cuisine",
    "client.sending": "Envoi en cuisine…",
    "client.serverWillBring": "Un serveur vous apportera votre commande",
    "client.placed": "Commande envoyée !",
    "chat.welcome": "Bonjour 👋 Je peux vous aider à choisir un plat, vérifier les allergènes ou répondre à vos questions sur le menu !",
    "chat.title": "Assistant",
    "chat.subtitle": "Posez-moi vos questions",
    "chat.placeholder": "Ex: quels plats sont sans gluten ?",
    "client.preparing": "Votre commande est en préparation.",
    "client.kitchenGot": "La cuisine l'a reçue instantanément.",
    "client.continue": "Continuer à parcourir",
    "client.viewOrder": "Voir la commande",
    "client.callWaiter": "Appeler un serveur",
    "client.waiterNotified": "Serveur prévenu !",
  },
  en: {
    /* ── Navbar ── */
    "nav.features": "Features",
    "nav.how": "How it works",
    "nav.pricing": "Pricing",
    "nav.testimonials": "Testimonials",
    "nav.signin": "Sign in",
    "nav.tryFree": "Try for free",

    /* ── Hero ── */
    "hero.badge": "QR ordering · No app · Real-time kitchen",
    "hero.title.a": "Orders flow,",
    "hero.title.b": "you focus",
    "hero.title.c": "on cooking.",
    "hero.subtitle":
      "Serva digitizes your restaurant in under 10 minutes. Tables scan a QR, orders land in your kitchen instantly — no waiter needed for taking orders.",
    "hero.ctaPrimary": "Start for free — 7 days",
    "hero.ctaSecondary": "See how it works",
    "hero.fineprint": "No credit card · Cancel anytime · Setup in 10 min",
    "hero.stat1.value": "< 2s",
    "hero.stat1.label": "Menu load",
    "hero.stat2.value": "0",
    "hero.stat2.label": "Apps to install",
    "hero.stat3.value": "100%",
    "hero.stat3.label": "Real-time",

    /* ── Mockup ── */
    "mock.greeting": "Good morning, Chef 👋",
    "mock.subtitle": "Sunday, Jun 1 · Le Baobab Restaurant",
    "mock.live": "8 tables live",
    "mock.revenue": "Revenue today",
    "mock.orders": "Orders",
    "mock.avg": "Avg. order",
    "mock.liveOrders": "Live orders",
    "mock.viewAll": "View all",

    /* ── How it works ── */
    "how.kicker": "How it works",
    "how.title.a": "Four steps.",
    "how.title.b": "Fully digital restaurant.",
    "how.s1.title": "Scan & browse",
    "how.s1.desc":
      "The customer scans the QR on the table. No app. The menu appears in under 2 seconds on their phone.",
    "how.s2.title": "Order & customize",
    "how.s2.desc":
      "They pick dishes, choose options, add notes. Everything is validated in a tap — no waiter needed.",
    "how.s3.title": "Kitchen gets it instantly",
    "how.s3.desc":
      "The order hits your kitchen display the millisecond it's placed. No relay, no errors, no delay.",
    "how.s4.title": "Leave a review",
    "how.s4.desc":
      "Once the meal is done, customers get a quick prompt to rate their experience. Effortless feedback for you.",

    /* ── Two interfaces ── */
    /* ── Benefit blocks ── */
    "bloc.01.kicker": "Block 01 · The business case",
    "bloc.01.title": "Turn more tables, without growing the room.",
    "bloc.01.body":
      "Guests order the moment they sit down and follow their meal live — no waiting on a server, no waving anyone down. Service moves faster, you seat more guests, and you bring in more revenue from the same number of tables.",
    "bloc.01.f1": "Ordering starts the second they sit down",
    "bloc.01.f2": "Live tracking of the kitchen prep",
    "bloc.01.f3": "More covers served per shift",
    "bloc.02.kicker": "Block 02 · What guests love",
    "bloc.02.title": "An experience your guests find genuinely impressive.",
    "bloc.02.body":
      "They scan, browse a menu in photos, customize every dish, follow the prep live, and call a server with a single tap. Smooth, modern, frictionless. They walk out thinking: \"this place is ahead of the curve.\"",

    "two.kicker": "Platform",
    "two.title": "Built for two worlds.",
    "two.subtitle":
      "One platform, two perfectly designed interfaces — for your team and your guests.",
    "two.back.kicker": "Restaurant back-office",
    "two.back.title": "Your entire operation, one screen.",
    "two.back.f1": "Real-time revenue, orders & table status",
    "two.back.f2": "Visual menu editor with images & options",
    "two.back.f3": "QR code generator per table or zone",
    "two.back.f4": "Kitchen display (KDS) with course management",
    "two.back.f5": "Analytics, export & team roles",
    "two.back.cta": "Create my restaurant",
    "two.client.kicker": "Customer experience",
    "two.client.title": "Order in seconds. No app, ever.",
    "two.client.f1": "Instant menu on scan — no download, no login",
    "two.client.f2": "Beautiful menu with photos, allergens & options",
    "two.client.f3": "Live order tracking right on their phone",
    "two.client.f4": "Call waiter button, live order tracking",
    "two.client.f5": "One-tap review when done",
    "two.client.cta": "See a live demo",

    /* ── Features ── */
    "feat.kicker": "Features",
    "feat.title.a": "Everything in one place.",
    "feat.title.b": "No integrations required.",
    "feat.qr.t": "QR per table",
    "feat.qr.d": "One unique QR per table or zone. Customers get the menu in under 2 seconds — no install, no friction.",
    "feat.kitchen.t": "Instant kitchen",
    "feat.kitchen.d": "Orders reach your kitchen display in milliseconds. Zero transmission errors, zero relay.",
    "feat.kds.t": "Kitchen Display (KDS)",
    "feat.kds.d": "Course-aware kitchen screen. Your team always knows what's next, what's urgent, what's done.",
    "feat.waiter.t": "Waiter call",
    "feat.waiter.d": "Guests call for help with one tap. Your staff sees it instantly on the dashboard — no shouting across the room.",
    "feat.brand.t": "Your brand, everywhere",
    "feat.brand.d": "Custom logo, colors, and fonts. Your guests see your identity — not a generic app.",
    "feat.analytics.t": "Analytics that matter",
    "feat.analytics.d": "Revenue by hour, bestsellers, table turnover. Actionable data, exportable anytime.",
    "feat.tables.t": "Table management",
    "feat.tables.d": "Visual floor plan, table status in real time. Know exactly which tables are occupied, waiting, or free.",
    "feat.reviews.t": "Auto reviews",
    "feat.reviews.d": "Ratings collected automatically after each meal. Improve service with real data.",
    "feat.roles.t": "Roles & security",
    "feat.roles.d": "Admin, manager, kitchen, server — custom access per role. Your data stays yours.",

    /* ── Testimonials ── */
    "test.kicker": "Testimonials",
    "test.title.a": "Real restaurants.",
    "test.title.b": "Real results.",
    "test.q1": "We had zero order errors from day one. Our kitchen works faster and our customers keep coming back.",
    "test.r1": "Owner · Le Baobab, Dakar",
    "test.q2": "Setup was 9 minutes. Serva just works. Our reviewers started mentioning the smooth ordering experience.",
    "test.r2": "Manager · Brasserie St-Laurent, Montréal",
    "test.q3": "Running 4 spots across New York. The multi-location dashboard gives me full visibility without hopping between tools.",
    "test.r3": "CEO · Fork & Flame Group, New York",

    /* ── Pricing ── */
    "price.kicker": "Pricing",
    "price.title": "One plan. Everything included.",
    "price.subtitle": "7-day free trial. No credit card required. Cancel anytime.",
    "price.detecting": "Detecting your location…",
    "price.detected": "Detected:",
    "price.weekly": "WEEKLY SUBSCRIPTION",
    "price.allIn": "ALL-INCLUSIVE",
    "price.tagline": "Everything your restaurant needs, weekly.",
    "price.cta": "Start for free — 7 days",
    "price.fineprint": "No credit card · Cancel anytime",
    "price.footnote": "Prices shown in local currency. Taxes may apply.",
    "price.f1": "All tables included",
    "price.f2": "QR code menu",
    "price.f3": "Order management",
    "price.f4": "Kitchen display (KDS)",
    "price.f5": "Customer reviews",
    "price.f6": "Advanced analytics",
    "price.f7": "Custom branding",
    "price.f8": "10 staff accounts",
    "price.f9": "Priority support",
    "price.f10": "No long-term commitment",
    "price.f11": "Cancel anytime",

    /* ── Final CTA ── */
    "cta.title.a": "Your restaurant,",
    "cta.title.b": "digital by tonight.",
    "cta.subtitle": "7-day free trial. No credit card. Full setup in under 10 minutes.",
    "cta.primary": "Create my account — it's free",
    "cta.secondary": "Already have an account →",

    /* ── Footer ── */
    "footer.blurb": "The restaurant platform that turns a QR scan into a kitchen order in under 2 seconds.",
    "footer.product": "Product",
    "footer.access": "Access",
    "footer.legal": "Legal",
    "footer.create": "Create an account",
    "footer.restoDash": "Restaurant dashboard",
    "footer.kitchen": "Kitchen screen",
    "footer.admin": "Admin panel",
    "footer.terms": "Terms of use",
    "footer.privacy": "Privacy policy",
    "footer.notice": "Legal notice",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
    "footer.worldwide": "Built for restaurateurs worldwide 🌍",

    /* ── Client ordering page ── */
    "client.table": "Table",
    "client.cat.starters": "Starters",
    "client.cat.mains": "Mains",
    "client.cat.desserts": "Desserts",
    "client.cat.drinks": "Drinks",
    "client.badge.popular": "Popular",
    "client.badge.vegan": "Vegan",
    "client.badge.spicy": "Spicy",
    "client.add": "Add",
    "client.yourOrder": "Your order",
    "client.item": "item",
    "client.items": "items",
    "client.each": "each",
    "client.notes": "Special requests or allergies…",
    "client.total": "Total",
    "client.sendOrder": "Send order to kitchen",
    "client.sending": "Sending to kitchen…",
    "client.serverWillBring": "A server will bring your order",
    "client.placed": "Order placed!",
    "chat.welcome": "Hi 👋 I can help you choose a dish, check allergens or answer any questions about the menu!",
    "chat.title": "Assistant",
    "chat.subtitle": "Ask me anything",
    "chat.placeholder": "e.g. any gluten-free options?",
    "client.preparing": "Your order is being prepared.",
    "client.kitchenGot": "The kitchen received it instantly.",
    "client.continue": "Continue browsing",
    "client.viewOrder": "View order",
    "client.callWaiter": "Call waiter",
    "client.waiterNotified": "Waiter notified!",
  },
};

export type TranslationKey = keyof (typeof translations)["fr"];

/** Maps an ISO country code (from ipapi.co) to a default locale. */
export function localeForCountry(country?: string | null): Locale {
  // Senegal & Canada default to French; United States and everything else to English.
  if (country === "SN" || country === "CA") return "fr";
  return "en";
}

export function translate(locale: Locale, key: string): string {
  return translations[locale][key] ?? translations.fr[key] ?? key;
}

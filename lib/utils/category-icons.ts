/**
 * Utilitaires pour obtenir les icônes des catégories
 */

/**
 * Retourne l'icône emoji appropriée pour une catégorie selon son nom
 */
export function getCategoryIcon(categoryName: string): string {
  const name = categoryName.toLowerCase();
  
  // Entrées et Salades
  if (name.includes('entrée') || name.includes('salade') || name.includes('starter')) {
    return '🥙';
  }
  
  // Plats Sénégalais
  if (name.includes('sénégalais') || name.includes('senegalais') || name.includes('plat')) {
    return '🍛';
  }
  
  // De l'Océan à l'Assiette
  if (name.includes('océan') || name.includes('ocean') || name.includes('fruits de mer') || name.includes('poisson') || name.includes('crevette') || name.includes('gamba')) {
    return '🦐';
  }
  
  // Burgers & Sandwichs
  if (name.includes('burger') || name.includes('sandwich')) {
    return '🍔';
  }
  
  // Week-end Brunch
  if (name.includes('brunch')) {
    return '🥞';
  }
  
  // Les Douceurs / Desserts
  if (name.includes('douceur') || name.includes('dessert') || name.includes('crêpe') || name.includes('crepe') || name.includes('glace') || name.includes('tarte') || name.includes('cheesecake') || name.includes('pancake')) {
    return '🧁';
  }
  
  // Formules Enfants
  if (name.includes('enfant') || name.includes('kid') || name.includes('child')) {
    return '🎈';
  }
  
  // Accompagnements
  if (name.includes('accompagnement') || name.includes('side')) {
    return '🍟';
  }
  
  // Sauces
  if (name.includes('sauce') || name.includes('condiment')) {
    return '🧂';
  }
  
  // Viandes au Feu de Bois
  if (name.includes('viande') || name.includes('feu') || name.includes('bois') || name.includes('barbecue') || name.includes('grill')) {
    return '🥩';
  }
  
  // Boissons
  if (name.includes('boisson') || name.includes('drink') || name.includes('cocktail') || name.includes('mocktail') || name.includes('jus') || name.includes('café') || name.includes('cafe') || name.includes('bière') || name.includes('biere') || name.includes('vin') || name.includes('alcool')) {
    return '🍹';
  }
  
  // Par défaut
  return '🍽️';
}

/**
 * Mapping explicite des catégories avec leurs icônes recommandées
 * Icônes optimisées pour une meilleure visibilité et représentation
 */
export const CATEGORY_ICONS: Record<string, string> = {
  'Entrées et Salades': '🥙',      // Meilleure représentation des entrées
  'Plats Sénégalais': '🍛',        // Parfait pour les plats traditionnels
  "De l'Océan à l'Assiette": '🦐', // Plus représentatif des fruits de mer
  'Burgers & Sandwichs': '🍔',     // Parfait
  'Week-end Brunch': '🥞',          // Plus représentatif du brunch
  'Les Douceurs': '🧁',             // Plus moderne et appétissant
  'Formules Enfants': '🎈',         // Plus amusant pour les enfants
  'Accompagnements': '🍟',          // Plus spécifique que l'assiette
  'Sauces': '🧂',                   // Parfait
  'Viandes au Feu de Bois': '🥩',   // Plus représentatif de la viande
  'Boissons': '🍹',                 // Plus élégant et représentatif
};

/**
 * Retourne l'icône pour une catégorie en utilisant d'abord le mapping explicite,
 * puis la fonction de détection automatique
 */
export function getCategoryIconSafe(categoryName: string, categoryIcon?: string): string {
  if (categoryIcon) {
    return categoryIcon;
  }
  if (CATEGORY_ICONS[categoryName]) {
    return CATEGORY_ICONS[categoryName];
  }
  return getCategoryIcon(categoryName);
}


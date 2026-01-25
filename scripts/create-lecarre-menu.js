/**
 * Script pour créer le menu complet du restaurant "Le Carré – Sénégal"
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const now = new Date().toISOString();

// Catégories avec icônes recommandées (améliorées)
const categories = [
  { id: 'cat_entrees', name: 'Entrées et Salades', order: 1, icon: '🥙' },
  { id: 'cat_senegalais', name: 'Plats Sénégalais', order: 2, icon: '🍛' },
  { id: 'cat_ocean', name: 'De l\'Océan à l\'Assiette', order: 3, icon: '🦐' },
  { id: 'cat_burgers', name: 'Burgers & Sandwichs', order: 4, icon: '🍔' },
  { id: 'cat_brunch', name: 'Week-end Brunch', order: 5, icon: '🥞' },
  { id: 'cat_desserts', name: 'Les Douceurs', order: 6, icon: '🧁' },
  { id: 'cat_enfants', name: 'Formules Enfants', order: 7, icon: '🎈' },
  { id: 'cat_accompagnements', name: 'Accompagnements', order: 8, icon: '🍟' },
  { id: 'cat_sauces', name: 'Sauces', order: 9, icon: '🧂' },
  { id: 'cat_viandes', name: 'Viandes au Feu de Bois', order: 10, icon: '🥩' },
  { id: 'cat_boissons', name: 'Boissons', order: 11, icon: '🍹' },
];

// Types pour les boissons
const types = [
  { id: 'type_mocktails', name: 'Mocktails', categoryId: 'cat_boissons', order: 1 },
  { id: 'type_cocktails', name: 'Cocktails Alcool', categoryId: 'cat_boissons', order: 2 },
  { id: 'type_softs', name: 'Softs', categoryId: 'cat_boissons', order: 3 },
  { id: 'type_jus_presses', name: 'Jus Pressés', categoryId: 'cat_boissons', order: 4 },
  { id: 'type_jus_locaux', name: 'Jus Locaux', categoryId: 'cat_boissons', order: 5 },
  { id: 'type_cafe', name: 'Café & Chaud', categoryId: 'cat_boissons', order: 6 },
  { id: 'type_bieres', name: 'Bières', categoryId: 'cat_boissons', order: 7 },
  { id: 'type_alcools_blancs', name: 'Alcools Blancs', categoryId: 'cat_boissons', order: 8 },
  { id: 'type_shooters', name: 'Shooters', categoryId: 'cat_boissons', order: 9 },
  { id: 'type_digestifs', name: 'Digestifs', categoryId: 'cat_boissons', order: 10 },
  { id: 'type_liqueurs', name: 'Liqueurs', categoryId: 'cat_boissons', order: 11 },
  { id: 'type_rhums', name: 'Rhums', categoryId: 'cat_boissons', order: 12 },
  { id: 'type_whiskys', name: 'Whiskys', categoryId: 'cat_boissons', order: 13 },
  { id: 'type_vins', name: 'Vins & Champagnes', categoryId: 'cat_boissons', order: 14 },
  // Types génériques pour autres catégories
  { id: 'type_default', name: 'Standard', categoryId: 'cat_entrees', order: 1 },
];

// Produits
const products = [
  // ========== ENTRÉES ET SALADES ==========
  { id: 'prod_salade_fraicheur', name: 'Salade fraîcheur', price: 7000, categoryId: 'cat_entrees', typeId: 'type_default', description: 'Salade, thon, pommes de terre, carottes râpées, tomates, concombres, pamplemousse, olives noires' },
  { id: 'prod_calamars_poivre', name: 'Calamars sautés au poivre vert persillé', price: 7500, categoryId: 'cat_entrees', typeId: 'type_default', description: 'Fried squids seasoned with green pepper' },
  { id: 'prod_salade_exotique', name: 'Salade exotique', price: 7500, categoryId: 'cat_entrees', typeId: 'type_default', description: 'Salade, crevettes, ananas, melon, pamplemousse, maïs, fromage' },
  { id: 'prod_croustillants_crevettes', name: 'Croustillants de crevettes', price: 7500, categoryId: 'cat_entrees', typeId: 'type_default', description: 'Feuille de brique farcie aux crevettes / Crispy shrimp' },
  { id: 'prod_salade_grecque', name: 'Salade grecque', price: 8000, categoryId: 'cat_entrees', typeId: 'type_default', description: 'Salade, feta, tomates, concombres, oignons, olives noires' },

  // ========== PLATS SÉNÉGALAIS ==========
  { id: 'prod_plat_jour', name: 'Plat du jour', price: 6000, categoryId: 'cat_senegalais', typeId: 'type_default', description: 'Today\'s speciality' },
  { id: 'prod_yassa_poisson', name: 'Yassa poisson', price: 6500, categoryId: 'cat_senegalais', typeId: 'type_default', description: 'Fish yassa' },
  { id: 'prod_dibi_agneau', name: 'Dibi agneau de lait', price: 13000, categoryId: 'cat_senegalais', typeId: 'type_default', description: 'Suckling lamb dibi' },

  // ========== DE L'OCÉAN À L'ASSIETTE ==========
  { id: 'prod_linguine_crevettes', name: 'Linguine crevettes', price: 7500, categoryId: 'cat_ocean', typeId: 'type_default', description: 'Pâtes linguine aux crevettes', hasOptions: true },
  { id: 'prod_brochettes_gambas', name: 'Brochettes de gambas grillées sauce maquis', price: 13000, categoryId: 'cat_ocean', typeId: 'type_default', description: 'Grilled prawns skewers with maquis sauce', hasOptions: true },
  { id: 'prod_gambas_provencale', name: 'Gambas sautées sauce provençale', price: 13500, categoryId: 'cat_ocean', typeId: 'type_default', description: 'Sautéed prawns with provençal sauce', hasOptions: true },
  { id: 'prod_risotto_fruits_mer', name: 'Risotto aux fruits de mer', price: 13500, categoryId: 'cat_ocean', typeId: 'type_default', description: 'Seafood risotto', hasOptions: true },
  { id: 'prod_thiot_grille', name: 'Thiot grillé', price: 13500, categoryId: 'cat_ocean', typeId: 'type_default', description: 'Grilled thiot fish', hasOptions: true },
  { id: 'prod_daurade_braisee', name: 'Daurade braisée et ses crevettes', price: 14000, categoryId: 'cat_ocean', typeId: 'type_default', description: 'Braised sea bream with shrimps', hasOptions: true },
  { id: 'prod_colombo_gambas', name: 'Colombo de gambas', price: 14500, categoryId: 'cat_ocean', typeId: 'type_default', description: 'Prawns colombo', hasOptions: true },
  { id: 'prod_seafood_boil', name: 'Seafood boil à partager', price: 26500, categoryId: 'cat_ocean', typeId: 'type_default', description: 'Seafood boil to share - Pour 2 personnes', hasOptions: true },

  // ========== BURGERS & SANDWICHS ==========
  { id: 'prod_cheese_burger', name: 'Cheese burger', price: 6500, categoryId: 'cat_burgers', typeId: 'type_default', description: 'Classic cheese burger' },
  { id: 'prod_double_cheese', name: 'Double cheese', price: 7000, categoryId: 'cat_burgers', typeId: 'type_default', description: 'Double cheese burger' },
  { id: 'prod_chicken_burger', name: 'Chicken burger pané', price: 7500, categoryId: 'cat_burgers', typeId: 'type_default', description: 'Breaded chicken burger' },
  { id: 'prod_lamb_sandwich', name: 'Lamb sandwich', price: 8000, categoryId: 'cat_burgers', typeId: 'type_default', description: 'Sandwich à l\'agneau' },
  { id: 'prod_carre_burger', name: 'Carré burger', price: 8500, categoryId: 'cat_burgers', typeId: 'type_default', description: 'Le burger signature du Carré' },
  { id: 'prod_crispy_shrimp_burger', name: 'Crispy Shrimp Burger', price: 9500, categoryId: 'cat_burgers', typeId: 'type_default', description: 'Burger aux crevettes croustillantes' },

  // ========== WEEK-END BRUNCH ==========
  { id: 'prod_brunch_complet', name: 'Brunch complet', price: 12500, categoryId: 'cat_brunch', typeId: 'type_default', description: 'Viennoiseries, variétés de pain, œufs brouillés, pancakes, charcuterie et fromage, mini brochettes de viande, fruits, jus d\'orange, thé/café/lait' },

  // ========== LES DOUCEURS ==========
  { id: 'prod_crepe_nature', name: 'Crêpe nature', price: 4500, categoryId: 'cat_desserts', typeId: 'type_default', description: 'Crêpe simple' },
  { id: 'prod_crepe_sucre', name: 'Crêpe sucre', price: 4500, categoryId: 'cat_desserts', typeId: 'type_default', description: 'Crêpe au sucre' },
  { id: 'prod_crepe_nutella', name: 'Crêpe Nutella', price: 5000, categoryId: 'cat_desserts', typeId: 'type_default', description: 'Crêpe au Nutella' },
  { id: 'prod_coupe_glace', name: 'Coupe de glace maison', price: 4500, categoryId: 'cat_desserts', typeId: 'type_default', description: 'Glace maison' },
  { id: 'prod_salade_fruits', name: 'Salade de fruits frais', price: 6000, categoryId: 'cat_desserts', typeId: 'type_default', description: 'Fresh fruit salad' },
  { id: 'prod_pain_perdu', name: 'Pain perdu brioche avec glace vanille', price: 6000, categoryId: 'cat_desserts', typeId: 'type_default', description: 'French toast with vanilla ice cream' },
  { id: 'prod_cheesecake_vanille', name: 'Cheese-cake vanille chocolat', price: 6500, categoryId: 'cat_desserts', typeId: 'type_default', description: 'Vanilla chocolate cheesecake' },
  { id: 'prod_tarte_tatin', name: 'Tarte tatin', price: 6500, categoryId: 'cat_desserts', typeId: 'type_default', description: 'Apple tart' },
  { id: 'prod_coeur_coulant', name: 'Cœur coulant au chocolat + glace vanille', price: 6500, categoryId: 'cat_desserts', typeId: 'type_default', description: 'Chocolate lava cake with vanilla ice cream' },
  { id: 'prod_cheesecake_oreo', name: 'Cheese-cake Oreo', price: 7500, categoryId: 'cat_desserts', typeId: 'type_default', description: 'Oreo cheesecake' },
  { id: 'prod_tarte_citron', name: 'Tarte au citron', price: 7500, categoryId: 'cat_desserts', typeId: 'type_default', description: 'Lemon tart' },
  { id: 'prod_pancake_speculos', name: 'Pancake spéculos ou chocolat', price: 8000, categoryId: 'cat_desserts', typeId: 'type_default', description: 'Pancakes with speculoos or chocolate' },
  { id: 'prod_pain_perdu_nutella', name: 'Pain perdu Nutella banane', price: 8000, categoryId: 'cat_desserts', typeId: 'type_default', description: 'French toast with Nutella and banana' },

  // ========== FORMULES ENFANTS ==========
  { id: 'prod_mac_cheese', name: 'Mac and cheese', price: 8000, categoryId: 'cat_enfants', typeId: 'type_default', description: 'Macaroni au fromage - Dessert + jus inclus' },
  { id: 'prod_mini_cheese', name: 'Mini cheese burger', price: 8500, categoryId: 'cat_enfants', typeId: 'type_default', description: 'Mini burger au fromage - Dessert + jus inclus' },
  { id: 'prod_brochette_poulet_enfant', name: 'Brochette de poulet', price: 12500, categoryId: 'cat_enfants', typeId: 'type_default', description: 'Chicken skewer - Dessert + jus inclus' },

  // ========== ACCOMPAGNEMENTS ==========
  // Tous gratuits (0 FCFA) sauf le Gratin dauphinois (2000 FCFA)
  { id: 'prod_frites', name: 'Frites de pomme de terre', price: 0, categoryId: 'cat_accompagnements', typeId: 'type_default', description: 'French fries' },
  { id: 'prod_pommes_sautees', name: 'Pommes sautées à l\'ail', price: 0, categoryId: 'cat_accompagnements', typeId: 'type_default', description: 'Garlic sautéed potatoes' },
  { id: 'prod_jardiniere', name: 'Jardinière de légumes', price: 0, categoryId: 'cat_accompagnements', typeId: 'type_default', description: 'Mixed vegetables' },
  { id: 'prod_riz_blanc', name: 'Riz blanc', price: 0, categoryId: 'cat_accompagnements', typeId: 'type_default', description: 'White rice' },
  { id: 'prod_crudites', name: 'Crudités sur lit de salade', price: 0, categoryId: 'cat_accompagnements', typeId: 'type_default', description: 'Raw vegetables on salad bed' },
  { id: 'prod_aloko', name: 'Aloko', price: 0, categoryId: 'cat_accompagnements', typeId: 'type_default', description: 'Fried plantain' },
  { id: 'prod_attieke', name: 'Attiéké', price: 0, categoryId: 'cat_accompagnements', typeId: 'type_default', description: 'Cassava couscous' },
  { id: 'prod_pommes_rosti', name: 'Pommes rosti', price: 0, categoryId: 'cat_accompagnements', typeId: 'type_default', description: 'Rosti potatoes' },
  { id: 'prod_gratin_dauphinois', name: 'Gratin dauphinois', price: 2000, categoryId: 'cat_accompagnements', typeId: 'type_default', description: 'Potato gratin' },

  // ========== SAUCES ==========
  { id: 'prod_sauce_poivre', name: 'Sauce poivre vert', price: 0, categoryId: 'cat_sauces', typeId: 'type_default', description: 'Green pepper sauce' },
  { id: 'prod_sauce_tomate', name: 'Sauce tomate', price: 0, categoryId: 'cat_sauces', typeId: 'type_default', description: 'Tomato sauce' },
  { id: 'prod_sauce_roquefort', name: 'Sauce roquefort', price: 0, categoryId: 'cat_sauces', typeId: 'type_default', description: 'Roquefort cheese sauce' },
  { id: 'prod_sauce_champignons', name: 'Sauce champignons', price: 0, categoryId: 'cat_sauces', typeId: 'type_default', description: 'Mushroom sauce' },

  // ========== VIANDES AU FEU DE BOIS ==========
  { id: 'prod_demi_poulet', name: 'Demi-poulet grillé à l\'ail et citron', price: 9500, categoryId: 'cat_viandes', typeId: 'type_default', description: 'Half grilled chicken with garlic and lemon', hasOptions: true },
  { id: 'prod_brochettes_poulet_gingembre', name: 'Brochettes de poulet au gingembre', price: 9500, categoryId: 'cat_viandes', typeId: 'type_default', description: 'Ginger chicken skewers', hasOptions: true },
  { id: 'prod_poulet_coco_curry', name: 'Poulet coco curry', price: 11000, categoryId: 'cat_viandes', typeId: 'type_default', description: 'Coconut curry chicken', hasOptions: true },
  { id: 'prod_brochettes_kefta', name: 'Brochettes de kefta épicées', price: 11000, categoryId: 'cat_viandes', typeId: 'type_default', description: 'Spicy kefta skewers', hasOptions: true },
  { id: 'prod_brochettes_poulet_libanaise', name: 'Brochettes de poulet à la libanaise', price: 11500, categoryId: 'cat_viandes', typeId: 'type_default', description: 'Lebanese-style chicken skewers', hasOptions: true },
  { id: 'prod_brochettes_boeuf', name: 'Brochettes de filet de bœuf', price: 12000, categoryId: 'cat_viandes', typeId: 'type_default', description: 'Beef fillet skewers', hasOptions: true },
  { id: 'prod_entrecote', name: 'Entrecôte de bœuf', price: 12500, categoryId: 'cat_viandes', typeId: 'type_default', description: 'Beef rib steak', hasOptions: true },
  { id: 'prod_escalope_champignons', name: 'Escalope de poulet aux champignons', price: 13500, categoryId: 'cat_viandes', typeId: 'type_default', description: 'Chicken escalope with mushrooms', hasOptions: true },
  { id: 'prod_souris_agneau', name: 'Souris d\'agneau', price: 14500, categoryId: 'cat_viandes', typeId: 'type_default', description: 'Lamb shank', hasOptions: true },
  { id: 'prod_filet_mignon_veau', name: 'Filet mignon de veau', price: 14500, categoryId: 'cat_viandes', typeId: 'type_default', description: 'Veal tenderloin', hasOptions: true },
  { id: 'prod_caco_agneau', name: 'Caco agneau aux herbes', price: 17500, categoryId: 'cat_viandes', typeId: 'type_default', description: 'Herb-crusted lamb rack', hasOptions: true },
  { id: 'prod_mixed_grill', name: 'Mixed grill à partager', price: 37500, categoryId: 'cat_viandes', typeId: 'type_default', description: 'Mixed grill to share - Pour 2-3 personnes', hasOptions: true },

  // ========== BOISSONS - MOCKTAILS ==========
  { id: 'prod_virgin_mojito', name: 'Virgin Mojito au choix', price: 5000, categoryId: 'cat_boissons', typeId: 'type_mocktails', description: 'Passion, litchi, mangue, pêche, fraise' },
  { id: 'prod_tress_lova', name: 'Tress Lova', price: 5000, categoryId: 'cat_boissons', typeId: 'type_mocktails', description: 'Jus de mangue, fraise, citron, menthe, eau gazeuse' },
  { id: 'prod_almadies', name: 'Almadies', price: 5000, categoryId: 'cat_boissons', typeId: 'type_mocktails', description: 'Litchi, sirop de curaçao bleu, jus de citron, eau gazeuse' },
  { id: 'prod_baobab', name: 'Baobab', price: 5000, categoryId: 'cat_boissons', typeId: 'type_mocktails', description: 'Banane, jus d\'orange, jus d\'ananas, sirop de grenadine' },
  { id: 'prod_casamance', name: 'Casamance', price: 5000, categoryId: 'cat_boissons', typeId: 'type_mocktails', description: 'Pomme verte, citron vert, eau gazeuse' },
  { id: 'prod_dakar', name: 'Dakar', price: 5000, categoryId: 'cat_boissons', typeId: 'type_mocktails', description: 'Passion, jus de mangue, ananas, fraise' },
  { id: 'prod_mocktail_saison', name: 'Mocktail saisonnier', price: 6000, categoryId: 'cat_boissons', typeId: 'type_mocktails', description: 'Seasonal mocktail' },

  // ========== BOISSONS - COCKTAILS ALCOOL ==========
  { id: 'prod_mojito', name: 'Mojito au choix', price: 5000, categoryId: 'cat_boissons', typeId: 'type_cocktails', description: 'Classic mojito' },
  { id: 'prod_black_magic', name: 'Black Magic', price: 6000, categoryId: 'cat_boissons', typeId: 'type_cocktails', description: 'Cocktail signature' },
  { id: 'prod_le_carre', name: 'Le Carré', price: 6000, categoryId: 'cat_boissons', typeId: 'type_cocktails', description: 'Cocktail signature du restaurant' },
  { id: 'prod_mao', name: 'Mao', price: 6000, categoryId: 'cat_boissons', typeId: 'type_cocktails', description: 'Cocktail Mao' },
  { id: 'prod_mai_tai', name: 'Mai Tai', price: 6000, categoryId: 'cat_boissons', typeId: 'type_cocktails', description: 'Classic Mai Tai' },
  { id: 'prod_pina_colada', name: 'Pina Colada', price: 6000, categoryId: 'cat_boissons', typeId: 'type_cocktails', description: 'Classic Pina Colada' },
  { id: 'prod_cocktail_saison', name: 'Cocktail saisonnier', price: 7000, categoryId: 'cat_boissons', typeId: 'type_cocktails', description: 'Seasonal cocktail' },

  // ========== BOISSONS - SOFTS ==========
  { id: 'prod_coca', name: 'Coca Cola', price: 2000, categoryId: 'cat_boissons', typeId: 'type_softs', description: 'Coca Cola 33cl' },
  { id: 'prod_sprite', name: 'Sprite', price: 2000, categoryId: 'cat_boissons', typeId: 'type_softs', description: 'Sprite 33cl' },
  { id: 'prod_fanta', name: 'Fanta', price: 2000, categoryId: 'cat_boissons', typeId: 'type_softs', description: 'Fanta 33cl' },
  { id: 'prod_tonic', name: 'Tonic', price: 2000, categoryId: 'cat_boissons', typeId: 'type_softs', description: 'Tonic water' },
  { id: 'prod_soda', name: 'Soda', price: 2000, categoryId: 'cat_boissons', typeId: 'type_softs', description: 'Soda' },
  { id: 'prod_eau_05l', name: 'Eau minérale ½ L', price: 1000, categoryId: 'cat_boissons', typeId: 'type_softs', description: 'Mineral water 0.5L' },
  { id: 'prod_eau_1l', name: 'Eau minérale 1L', price: 2000, categoryId: 'cat_boissons', typeId: 'type_softs', description: 'Mineral water 1L' },
  { id: 'prod_kirene_gazeuse', name: 'Kirène gazeuse', price: 2500, categoryId: 'cat_boissons', typeId: 'type_softs', description: 'Sparkling Kirène' },
  { id: 'prod_perrier_petit', name: 'Perrier (petit)', price: 1500, categoryId: 'cat_boissons', typeId: 'type_softs', description: 'Perrier small' },
  { id: 'prod_perrier_grand', name: 'Perrier (grand)', price: 3000, categoryId: 'cat_boissons', typeId: 'type_softs', description: 'Perrier large' },

  // ========== BOISSONS - JUS PRESSÉS ==========
  { id: 'prod_jus_orange', name: 'Jus d\'orange pressé', price: 3000, categoryId: 'cat_boissons', typeId: 'type_jus_presses', description: 'Fresh orange juice' },
  { id: 'prod_jus_citron', name: 'Jus de citron pressé', price: 3000, categoryId: 'cat_boissons', typeId: 'type_jus_presses', description: 'Fresh lemon juice' },

  // ========== BOISSONS - JUS LOCAUX ==========
  { id: 'prod_bissap', name: 'Bissap', price: 2000, categoryId: 'cat_boissons', typeId: 'type_jus_locaux', description: 'Hibiscus juice' },
  { id: 'prod_bouye', name: 'Bouye', price: 2000, categoryId: 'cat_boissons', typeId: 'type_jus_locaux', description: 'Baobab juice' },
  { id: 'prod_gingembre', name: 'Gingembre', price: 2000, categoryId: 'cat_boissons', typeId: 'type_jus_locaux', description: 'Ginger juice' },

  // ========== BOISSONS - CAFÉ & CHAUD ==========
  { id: 'prod_expresso', name: 'Expresso', price: 2000, categoryId: 'cat_boissons', typeId: 'type_cafe', description: 'Espresso coffee' },
  { id: 'prod_cafe_noisette', name: 'Café noisette', price: 2500, categoryId: 'cat_boissons', typeId: 'type_cafe', description: 'Hazelnut coffee' },
  { id: 'prod_cafe_lait', name: 'Café au lait', price: 2500, categoryId: 'cat_boissons', typeId: 'type_cafe', description: 'Coffee with milk' },
  { id: 'prod_cappuccino', name: 'Cappuccino', price: 2500, categoryId: 'cat_boissons', typeId: 'type_cafe', description: 'Cappuccino' },
  { id: 'prod_chocolat_chaud', name: 'Chocolat chaud', price: 2500, categoryId: 'cat_boissons', typeId: 'type_cafe', description: 'Hot chocolate' },
  { id: 'prod_the', name: 'Thé', price: 2500, categoryId: 'cat_boissons', typeId: 'type_cafe', description: 'Tea' },
  { id: 'prod_grogue_sans', name: 'Grogue sans alcool', price: 2500, categoryId: 'cat_boissons', typeId: 'type_cafe', description: 'Non-alcoholic grogue' },
  { id: 'prod_grogue_avec', name: 'Grogue avec alcool', price: 3500, categoryId: 'cat_boissons', typeId: 'type_cafe', description: 'Alcoholic grogue' },
  { id: 'prod_milkshake', name: 'Milkshake', price: 6000, categoryId: 'cat_boissons', typeId: 'type_cafe', description: 'Milkshake' },

  // ========== BOISSONS - BIÈRES ==========
  { id: 'prod_flag', name: 'Flag', price: 2500, categoryId: 'cat_boissons', typeId: 'type_bieres', description: 'Bière Flag' },
  { id: 'prod_gazelle', name: 'Gazelle', price: 2500, categoryId: 'cat_boissons', typeId: 'type_bieres', description: 'Bière Gazelle' },
  { id: 'prod_heineken', name: 'Heineken', price: 3000, categoryId: 'cat_boissons', typeId: 'type_bieres', description: 'Bière Heineken' },
  { id: 'prod_sagres_citron', name: 'Sagres citron', price: 3000, categoryId: 'cat_boissons', typeId: 'type_bieres', description: 'Bière Sagres citron' },
  { id: 'prod_desperados', name: 'Desperados', price: 3500, categoryId: 'cat_boissons', typeId: 'type_bieres', description: 'Bière Desperados' },
  { id: 'prod_flag_pression_25', name: 'Flag pression 25cl', price: 2500, categoryId: 'cat_boissons', typeId: 'type_bieres', description: 'Flag draft 25cl' },
  { id: 'prod_flag_pression_50', name: 'Flag pression 50cl', price: 4000, categoryId: 'cat_boissons', typeId: 'type_bieres', description: 'Flag draft 50cl' },
  { id: 'prod_gazelle_pression_25', name: 'Gazelle pression 25cl', price: 2500, categoryId: 'cat_boissons', typeId: 'type_bieres', description: 'Gazelle draft 25cl' },
  { id: 'prod_gazelle_pression_50', name: 'Gazelle pression 50cl', price: 4000, categoryId: 'cat_boissons', typeId: 'type_bieres', description: 'Gazelle draft 50cl' },

  // ========== BOISSONS - ALCOOLS BLANCS ==========
  { id: 'prod_smirnoff', name: 'Smirnoff', price: 3500, categoryId: 'cat_boissons', typeId: 'type_alcools_blancs', description: 'Vodka Smirnoff' },
  { id: 'prod_gordons', name: 'Gordon\'s', price: 3500, categoryId: 'cat_boissons', typeId: 'type_alcools_blancs', description: 'Gin Gordon\'s' },
  { id: 'prod_bombay', name: 'Bombay Gin', price: 5000, categoryId: 'cat_boissons', typeId: 'type_alcools_blancs', description: 'Bombay Sapphire Gin' },
  { id: 'prod_beefeater', name: 'Beefeater', price: 5000, categoryId: 'cat_boissons', typeId: 'type_alcools_blancs', description: 'Gin Beefeater' },
  { id: 'prod_absolut', name: 'Vodka Absolut', price: 5000, categoryId: 'cat_boissons', typeId: 'type_alcools_blancs', description: 'Vodka Absolut' },
  { id: 'prod_ciroc', name: 'Ciroc', price: 8000, categoryId: 'cat_boissons', typeId: 'type_alcools_blancs', description: 'Vodka Ciroc' },
  { id: 'prod_belvedere', name: 'Vodka Belvedere', price: 10000, categoryId: 'cat_boissons', typeId: 'type_alcools_blancs', description: 'Vodka Belvedere premium' },

  // ========== BOISSONS - SHOOTERS ==========
  { id: 'prod_tequila_boom', name: 'Tequila Boom-Boom', price: 3000, categoryId: 'cat_boissons', typeId: 'type_shooters', description: 'Tequila shooter' },
  { id: 'prod_b52', name: 'B-52', price: 3500, categoryId: 'cat_boissons', typeId: 'type_shooters', description: 'B-52 shooter' },
  { id: 'prod_tequila_fruitee', name: 'Tequila fruitée', price: 4000, categoryId: 'cat_boissons', typeId: 'type_shooters', description: 'Fruity tequila shooter' },

  // ========== BOISSONS - DIGESTIFS ==========
  { id: 'prod_paul_giraud', name: 'Paul Giraud', price: 6000, categoryId: 'cat_boissons', typeId: 'type_digestifs', description: 'Cognac Paul Giraud' },
  { id: 'prod_remy_martin', name: 'Remy Martin', price: 7000, categoryId: 'cat_boissons', typeId: 'type_digestifs', description: 'Cognac Remy Martin' },
  { id: 'prod_hennessy', name: 'Hennessy', price: 8000, categoryId: 'cat_boissons', typeId: 'type_digestifs', description: 'Cognac Hennessy' },

  // ========== BOISSONS - AUTRES ALCOOLS ==========
  { id: 'prod_pastis', name: 'Pastis', price: 3000, categoryId: 'cat_boissons', typeId: 'type_liqueurs', description: 'Pastis' },
  { id: 'prod_ricard', name: 'Ricard', price: 3000, categoryId: 'cat_boissons', typeId: 'type_liqueurs', description: 'Ricard' },
  { id: 'prod_campari', name: 'Campari', price: 3500, categoryId: 'cat_boissons', typeId: 'type_liqueurs', description: 'Campari' },
  { id: 'prod_malibu', name: 'Malibu', price: 3500, categoryId: 'cat_boissons', typeId: 'type_liqueurs', description: 'Malibu coconut rum' },

  // ========== BOISSONS - LIQUEURS ==========
  { id: 'prod_triple_sec', name: 'Triple Sec', price: 3000, categoryId: 'cat_boissons', typeId: 'type_liqueurs', description: 'Triple Sec liqueur' },
  { id: 'prod_get27', name: 'Get 27', price: 3000, categoryId: 'cat_boissons', typeId: 'type_liqueurs', description: 'Get 27 mint liqueur' },
  { id: 'prod_get31', name: 'Get 31', price: 3000, categoryId: 'cat_boissons', typeId: 'type_liqueurs', description: 'Get 31 white mint liqueur' },
  { id: 'prod_baileys', name: 'Bailey\'s', price: 3500, categoryId: 'cat_boissons', typeId: 'type_liqueurs', description: 'Bailey\'s Irish cream' },

  // ========== BOISSONS - RHUMS ==========
  { id: 'prod_bacardi_blanc', name: 'Bacardi Blanc', price: 3500, categoryId: 'cat_boissons', typeId: 'type_rhums', description: 'White Bacardi rum' },
  { id: 'prod_saint_james', name: 'Saint James', price: 4000, categoryId: 'cat_boissons', typeId: 'type_rhums', description: 'Saint James rum' },
  { id: 'prod_bacardi_ambre', name: 'Bacardi Ambré', price: 4000, categoryId: 'cat_boissons', typeId: 'type_rhums', description: 'Amber Bacardi rum' },
  { id: 'prod_clement_vsop', name: 'Clément VSOP', price: 7000, categoryId: 'cat_boissons', typeId: 'type_rhums', description: 'Rhum Clément VSOP' },

  // ========== BOISSONS - WHISKYS ==========
  { id: 'prod_ballantines', name: 'Ballantines', price: 4000, categoryId: 'cat_boissons', typeId: 'type_whiskys', description: 'Whisky Ballantines' },
  { id: 'prod_jb', name: 'J&B', price: 4000, categoryId: 'cat_boissons', typeId: 'type_whiskys', description: 'Whisky J&B' },
  { id: 'prod_jack_daniels', name: 'Jack Daniel\'s', price: 5000, categoryId: 'cat_boissons', typeId: 'type_whiskys', description: 'Tennessee Whiskey' },
  { id: 'prod_red_label', name: 'Red Label', price: 5000, categoryId: 'cat_boissons', typeId: 'type_whiskys', description: 'Johnnie Walker Red Label' },
  { id: 'prod_glenfiddich', name: 'Glenfiddich', price: 8000, categoryId: 'cat_boissons', typeId: 'type_whiskys', description: 'Single Malt Scotch' },
  { id: 'prod_chivas', name: 'Chivas', price: 10000, categoryId: 'cat_boissons', typeId: 'type_whiskys', description: 'Chivas Regal' },

  // ========== BOISSONS - VINS ==========
  { id: 'prod_vin_blanc_verre', name: 'Vin blanc (verre)', price: 4000, categoryId: 'cat_boissons', typeId: 'type_vins', description: 'Glass of white wine' },
  { id: 'prod_vin_rose_verre', name: 'Vin rosé (verre)', price: 4000, categoryId: 'cat_boissons', typeId: 'type_vins', description: 'Glass of rosé wine' },
  { id: 'prod_vin_rouge_verre', name: 'Vin rouge (verre)', price: 4000, categoryId: 'cat_boissons', typeId: 'type_vins', description: 'Glass of red wine' },
  { id: 'prod_chardonnay_bouteille', name: 'Chardonnay (bouteille)', price: 15000, categoryId: 'cat_boissons', typeId: 'type_vins', description: 'Bottle of Chardonnay' },
  { id: 'prod_cabernet_bouteille', name: 'Cabernet Sauvignon (bouteille)', price: 15000, categoryId: 'cat_boissons', typeId: 'type_vins', description: 'Bottle of Cabernet Sauvignon' },
];

async function createMenu() {
  console.log('🚀 Création du menu "Le Carré – Sénégal"...\n');

  // Créer les catégories dans menu_categories
  console.log('📁 Création des catégories...');
  for (const cat of categories) {
    const catData = {
      ...cat,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(doc(db, 'menu_categories', cat.id), catData);
    console.log(`   ✓ ${cat.name}`);
  }

  // Créer les types dans menu_types
  console.log('\n📂 Création des types...');
  for (const type of types) {
    const typeData = {
      ...type,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(doc(db, 'menu_types', type.id), typeData);
    console.log(`   ✓ ${type.name}`);
  }

  // Créer les produits dans menu_products
  console.log('\n🍽️  Création des produits...');
  let count = 0;
  for (const prod of products) {
    const prodData = {
      ...prod,
      imageUrl: '',
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    await setDoc(doc(db, 'menu_products', prod.id), prodData);
    count++;
  }
  console.log(`   ✓ ${count} produits créés`);

  console.log('\n✅ Menu créé avec succès!');
  console.log(`\n📊 Résumé:`);
  console.log(`   - ${categories.length} catégories`);
  console.log(`   - ${types.length} types`);
  console.log(`   - ${products.length} produits`);
  console.log('\n🔗 Testez sur: http://localhost:3001/r/restaurant_lecarre_1767909416291/t/table_restaurant_lecarre_1767909416291_1');

  process.exit(0);
}

createMenu().catch(err => {
  console.error('❌ Erreur:', err.message);
  process.exit(1);
});


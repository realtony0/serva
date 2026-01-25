/**
 * Script pour ajouter les icônes aux catégories existantes dans Firestore
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc, getDoc } = require('firebase/firestore');
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

// Mapping des catégories avec leurs icônes recommandées (améliorées)
const categoryIcons = {
  'cat_entrees': '🥙',      // Entrées et Salades - Plus représentatif
  'cat_senegalais': '🍛',   // Plats Sénégalais - Parfait
  'cat_ocean': '🦐',        // De l'Océan à l'Assiette - Plus représentatif des fruits de mer
  'cat_burgers': '🍔',      // Burgers & Sandwichs - Parfait
  'cat_brunch': '🥞',       // Week-end Brunch - Plus représentatif
  'cat_desserts': '🧁',     // Les Douceurs - Plus moderne et appétissant
  'cat_enfants': '🎈',      // Formules Enfants - Plus amusant
  'cat_accompagnements': '🍟', // Accompagnements - Plus spécifique
  'cat_sauces': '🧂',       // Sauces - Parfait
  'cat_viandes': '🥩',      // Viandes au Feu de Bois - Plus représentatif
  'cat_boissons': '🍹',     // Boissons - Plus élégant
};

async function updateCategoryIcons() {
  console.log('🎨 Mise à jour des icônes des catégories...\n');

  let updated = 0;
  let errors = 0;

  for (const [categoryId, icon] of Object.entries(categoryIcons)) {
    try {
      const categoryRef = doc(db, 'menu_categories', categoryId);
      const categorySnap = await getDoc(categoryRef);

      if (categorySnap.exists()) {
        const data = categorySnap.data();
        await updateDoc(categoryRef, {
          icon: icon,
          updatedAt: new Date().toISOString(),
        });
        console.log(`   ✓ ${data.name}: ${icon}`);
        updated++;
      } else {
        console.log(`   ⚠ Catégorie non trouvée: ${categoryId}`);
        errors++;
      }
    } catch (error) {
      console.error(`   ❌ Erreur pour ${categoryId}:`, error.message);
      errors++;
    }
  }

  console.log(`\n✅ Mise à jour terminée:`);
  console.log(`   - ${updated} catégories mises à jour`);
  if (errors > 0) {
    console.log(`   - ${errors} erreurs`);
  }

  process.exit(0);
}

updateCategoryIcons().catch(err => {
  console.error('❌ Erreur:', err.message);
  process.exit(1);
});


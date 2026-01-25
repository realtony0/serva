/**
 * Script pour mettre à jour les prix des accompagnements
 * Tous les accompagnements sont gratuits (0 FCFA) sauf le Gratin dauphinois (2000 FCFA)
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

// IDs des produits accompagnements (tous à 0 sauf gratin dauphinois)
const sidesToUpdate = [
  { id: 'prod_frites', name: 'Frites de pomme de terre', price: 0 },
  { id: 'prod_pommes_sautees', name: 'Pommes sautées à l\'ail', price: 0 },
  { id: 'prod_jardiniere', name: 'Jardinière de légumes', price: 0 },
  { id: 'prod_riz_blanc', name: 'Riz blanc', price: 0 },
  { id: 'prod_crudites', name: 'Crudités sur lit de salade', price: 0 },
  { id: 'prod_aloko', name: 'Aloko', price: 0 },
  { id: 'prod_attieke', name: 'Attiéké', price: 0 },
  { id: 'prod_pommes_rosti', name: 'Pommes rosti', price: 0 },
  { id: 'prod_gratin_dauphinois', name: 'Gratin dauphinois', price: 2000 }, // Seul payant
];

async function updateSidesPrices() {
  console.log('🔄 Mise à jour des prix des accompagnements...\n');

  let updated = 0;
  let errors = 0;

  for (const side of sidesToUpdate) {
    try {
      const productRef = doc(db, 'menu_products', side.id);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        await updateDoc(productRef, {
          price: side.price,
          updatedAt: new Date().toISOString(),
        });
        console.log(`   ✓ ${side.name}: ${side.price.toLocaleString('fr-FR')} FCFA`);
        updated++;
      } else {
        console.log(`   ⚠ ${side.name}: Produit non trouvé (${side.id})`);
        errors++;
      }
    } catch (error) {
      console.error(`   ❌ Erreur pour ${side.name}:`, error.message);
      errors++;
    }
  }

  console.log(`\n✅ Mise à jour terminée:`);
  console.log(`   - ${updated} produits mis à jour`);
  if (errors > 0) {
    console.log(`   - ${errors} erreurs`);
  }

  process.exit(0);
}

updateSidesPrices().catch(err => {
  console.error('❌ Erreur:', err.message);
  process.exit(1);
});


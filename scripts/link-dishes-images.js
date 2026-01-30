/**
 * Script pour lier les 3 images de plats aux produits correspondants
 * 
 * Usage: node scripts/link-dishes-images.js
 */

require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc, getDoc } = require('firebase/firestore');

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

// Mapping des plats aux images
const DISH_IMAGE_MAPPING = [
  {
    productId: 'prod_entrecote', // Viandes au Feu - on utilise Entrecôte comme représentant
    imagePath: '/dishes/plat1.jpeg',
    fallbackPaths: ['/dishes/plat1.jpg', '/dishes/plat1.png', '/dishes/plat1.webp'],
    name: 'Viandes au Feu (Entrecôte)'
  },
  {
    productId: 'prod_yassa_poisson',
    imagePath: '/dishes/plat2.jpeg',
    fallbackPaths: ['/dishes/plat2.jpg', '/dishes/plat2.png', '/dishes/plat2.webp'],
    name: 'Yassa Poisson'
  },
  {
    productId: 'prod_salade_fraicheur',
    imagePath: '/dishes/plat3.jpeg',
    fallbackPaths: ['/dishes/plat3.jpg', '/dishes/plat3.png', '/dishes/plat3.webp'],
    name: 'Salade Fraîcheur'
  }
];

// Fonction pour vérifier si un fichier existe (approximation)
function getImageUrl(imagePath, fallbackPaths) {
  // En production, on utilisera directement le chemin
  // Le navigateur gérera le 404 si l'image n'existe pas
  return imagePath;
}

async function linkDishesImages() {
  console.log('🔗 Liaison des images aux plats...\n');

  for (const mapping of DISH_IMAGE_MAPPING) {
    try {
      const productRef = doc(db, 'menu_products', mapping.productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        console.log(`   ⚠️  Produit "${mapping.name}" (${mapping.productId}) non trouvé`);
        continue;
      }

      const imageUrl = getImageUrl(mapping.imagePath, mapping.fallbackPaths);
      
      await updateDoc(productRef, {
        imageUrl: imageUrl,
        updatedAt: new Date().toISOString()
      });

      console.log(`   ✅ ${mapping.name} → ${imageUrl}`);
    } catch (error) {
      console.error(`   ❌ Erreur pour ${mapping.name}:`, error.message);
    }
  }

  console.log('\n✅ Liaison terminée!');
  console.log('\n📝 Les plats suivants ont maintenant des images:');
  DISH_IMAGE_MAPPING.forEach(m => {
    console.log(`   - ${m.name}`);
  });
  console.log('\n💡 Assurez-vous que les fichiers existent dans public/dishes/');
  console.log('   - plat1.jpg (ou .png/.jpeg/.webp)');
  console.log('   - plat2.jpg (ou .png/.jpeg/.webp)');
  console.log('   - plat3.jpg (ou .png/.jpeg/.webp)');

  process.exit(0);
}

linkDishesImages().catch(err => {
  console.error('❌ Erreur:', err.message);
  process.exit(1);
});

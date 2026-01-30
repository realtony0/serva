/**
 * Script pour mettre à jour les URLs des QR codes existants
 * Remplace localhost par l'URL de production
 * 
 * Usage: node scripts/update-qr-codes-url.js <production-url>
 * Exemple: node scripts/update-qr-codes-url.js https://votre-domaine.com
 */

require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc, query } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function updateQRCodesUrl(productionUrl) {
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    console.log('🔄 Mise à jour des URLs des QR codes...\n');
    console.log(`📍 URL de production: ${productionUrl}\n`);

    // Récupérer toutes les tables
    const tablesRef = collection(db, 'tables');
    const tablesSnapshot = await getDocs(tablesRef);

    if (tablesSnapshot.empty) {
      console.log('ℹ️  Aucune table trouvée.');
      return;
    }

    let updatedCount = 0;
    let skippedCount = 0;

    for (const tableDoc of tablesSnapshot.docs) {
      const table = tableDoc.data();
      const oldUrl = table.qrCodeUrl;

      // Vérifier si l'URL contient localhost
      if (oldUrl && (oldUrl.includes('localhost') || oldUrl.includes('127.0.0.1'))) {
        // Extraire le chemin de l'URL (ex: /r/restaurant_id/t/table_id)
        const urlMatch = oldUrl.match(/(\/r\/[^\/]+\/t\/[^\/]+)/);
        if (urlMatch) {
          const path = urlMatch[1];
          const newUrl = `${productionUrl}${path}`;
          
          await updateDoc(doc(db, 'tables', tableDoc.id), {
            qrCodeUrl: newUrl,
            updatedAt: new Date().toISOString(),
          });

          console.log(`✅ Table ${table.tableNumber || tableDoc.id}:`);
          console.log(`   Ancienne: ${oldUrl}`);
          console.log(`   Nouvelle: ${newUrl}\n`);
          updatedCount++;
        } else {
          console.log(`⚠️  Impossible de parser l'URL pour la table ${tableDoc.id}: ${oldUrl}`);
          skippedCount++;
        }
      } else {
        console.log(`⏭️  Table ${table.tableNumber || tableDoc.id} déjà à jour: ${oldUrl}`);
        skippedCount++;
      }
    }

    console.log('\n📊 Résumé:');
    console.log(`   ✅ ${updatedCount} table(s) mise(s) à jour`);
    console.log(`   ⏭️  ${skippedCount} table(s) ignorée(s)`);
    console.log(`\n✨ Mise à jour terminée !`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

// Récupérer l'URL de production depuis les arguments ou la variable d'environnement
const productionUrl = process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL;

if (!productionUrl) {
  console.error('❌ Erreur: URL de production manquante');
  console.log('\nUsage:');
  console.log('  node scripts/update-qr-codes-url.js <production-url>');
  console.log('\nExemple:');
  console.log('  node scripts/update-qr-codes-url.js https://votre-domaine.com');
  console.log('\nOu définissez NEXT_PUBLIC_SITE_URL dans .env.local');
  process.exit(1);
}

// Valider l'URL
try {
  new URL(productionUrl);
} catch (error) {
  console.error('❌ Erreur: URL invalide');
  console.log('L\'URL doit être au format: https://votre-domaine.com');
  process.exit(1);
}

updateQRCodesUrl(productionUrl);

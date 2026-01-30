/**
 * Instructions pour générer des modèles 3D à partir d'images
 * 
 * Ce script fournit les instructions pour générer des modèles 3D
 * 
 * Méthode recommandée: Utiliser Meshy.ai ou Luma AI manuellement
 */

const fs = require('fs');
const path = require('path');

console.log('📋 Instructions pour générer des modèles 3D\n');

console.log('🎯 Méthode 1: Meshy.ai (Recommandé - Gratuit)');
console.log('   1. Allez sur https://www.meshy.ai/');
console.log('   2. Créez un compte gratuit');
console.log('   3. Cliquez sur "Image to 3D"');
console.log('   4. Uploadez votre photo de plat');
console.log('   5. Attendez la génération (2-5 minutes)');
console.log('   6. Téléchargez le modèle en format .glb');
console.log('   7. Renommez-le selon le format: plat1.glb, plat2.glb, etc.');
console.log('   8. Placez-le dans public/models/\n');

console.log('🎯 Méthode 2: Luma AI (Gratuit)');
console.log('   1. Allez sur https://lumalabs.ai/');
console.log('   2. Créez un compte');
console.log('   3. Uploadez votre photo');
console.log('   4. Téléchargez le modèle .glb');
console.log('   5. Placez-le dans public/models/\n');

console.log('📁 Structure attendue:');
console.log('   public/models/');
console.log('     ├── plat1.glb');
console.log('     ├── plat2.glb');
console.log('     └── plat3.glb\n');

console.log('✅ Une fois les modèles placés, ils seront automatiquement chargés dans la vue 3D!\n');

// Vérifier si le dossier existe
const modelsDir = path.join(__dirname, '../public/models');
if (!fs.existsSync(modelsDir)) {
	fs.mkdirSync(modelsDir, { recursive: true });
	console.log('✅ Dossier public/models/ créé\n');
}

// Lister les images disponibles
const dishesDir = path.join(__dirname, '../public/dishes');
if (fs.existsSync(dishesDir)) {
	const images = fs.readdirSync(dishesDir)
		.filter(file => /\.(jpeg|jpg|png|webp)$/i.test(file))
		.map(file => file.replace(/\.(jpeg|jpg|png|webp)$/i, ''));
	
	if (images.length > 0) {
		console.log('📸 Images disponibles:');
		images.forEach(img => {
			const modelPath = path.join(modelsDir, `${img}.glb`);
			const exists = fs.existsSync(modelPath);
			console.log(`   ${exists ? '✅' : '⏳'} ${img}.glb ${exists ? '(existe)' : '(à générer)'}`);
		});
		console.log('');
	}
}

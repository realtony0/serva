"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

interface Dish3DViewerProps {
	imageUrl: string;
	isOpen: boolean;
	onClose: () => void;
	dishName: string;
}

// Chargement dynamique pour éviter les erreurs SSR
const Dish3DScene = dynamic(() => import("./Dish3DScene"), {
	ssr: false,
	loading: () => (
		<div className="flex items-center justify-center h-full">
			<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
		</div>
	),
});

// Fonction pour déterminer l'URL du modèle 3D à partir de l'URL de l'image
const getModel3DUrl = (imageUrl: string): string | undefined => {
	// Extraire le nom du fichier (ex: /dishes/plat1.jpeg -> plat1)
	const match = imageUrl.match(/\/([^/]+)\.(jpeg|jpg|png|webp)$/);
	if (!match) return undefined;
	
	const baseName = match[1]; // plat1, plat2, etc.
	
	// Vérifier si le modèle existe (on essaie .glb d'abord, puis .gltf)
	// Le navigateur vérifiera automatiquement lors du chargement
	return `/models/${baseName}.glb`;
};

export default function Dish3DViewer({
	imageUrl,
	isOpen,
	onClose,
	dishName,
}: Dish3DViewerProps) {
	const [mounted, setMounted] = useState(false);
	const [model3DUrl, setModel3DUrl] = useState<string | undefined>(undefined);

	useEffect(() => {
		setMounted(true);
		// Déterminer l'URL du modèle 3D
		setModel3DUrl(getModel3DUrl(imageUrl));
	}, [imageUrl]);

	if (!isOpen || !mounted) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 p-4">
			<div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-black rounded-lg overflow-hidden">
				{/* Header */}
				<div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/90 to-transparent p-4 flex items-center justify-between">
					<div>
						<h2 className="text-xl font-bold text-white">{dishName}</h2>
						{model3DUrl && (
							<p className="text-xs text-green-400 mt-1">✨ Modèle 3D chargé</p>
						)}
					</div>
					<button
						onClick={onClose}
						className="text-white hover:text-red-400 text-3xl font-bold transition-colors bg-black/50 rounded-full w-10 h-10 flex items-center justify-center"
						aria-label="Fermer"
					>
						×
					</button>
				</div>

				{/* Instructions */}
				<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/70 rounded-lg px-4 py-2 text-white text-sm">
					<div className="flex items-center gap-4 flex-wrap justify-center">
						<span>🖱️ Cliquez et glissez pour tourner</span>
						<span>🔍 Molette pour zoomer</span>
						<span>👆 Double-clic pour réinitialiser</span>
					</div>
				</div>

				{/* Canvas 3D */}
				<Dish3DScene imageUrl={imageUrl} model3DUrl={model3DUrl} />
			</div>
		</div>
	);
}

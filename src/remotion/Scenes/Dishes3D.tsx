import React, { Suspense, useMemo } from "react";
import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	spring,
	Easing,
	staticFile,
} from "remotion";
import { Canvas, useLoader } from "@react-three/fiber";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import * as THREE from "three";
import { fps } from "../config";

// Configuration des plats avec leurs photos
const DISHES_CONFIG = [
	{
		id: 1,
		name: "Viandes au Feu",
		photo: staticFile("dishes/plat1.jpeg"),
		fallbackPhoto: staticFile("dishes/plat1.jpg"),
		price: "8 500 FCFA",
		description: "Grillades au choix avec accompagnements",
	},
	{
		id: 2,
		name: "Yassa Poisson",
		photo: staticFile("dishes/plat2.jpeg"),
		fallbackPhoto: staticFile("dishes/plat2.jpg"),
		price: "6 500 FCFA",
		description: "Poisson frais avec oignons et citron",
	},
	{
		id: 3,
		name: "Salade Fraîcheur",
		photo: staticFile("dishes/plat3.jpeg"),
		fallbackPhoto: staticFile("dishes/plat3.jpg"),
		price: "7 000 FCFA",
		description: "Salade, thon, légumes frais",
	},
];

// Composant pour charger et afficher une photo de plat en 3D
const DishPhoto3D: React.FC<{
	imagePath: string;
	fallbackPath?: string;
	rotationSpeed?: number;
}> = ({ imagePath, fallbackPath, rotationSpeed = 0.3 }) => {
	const frame = useCurrentFrame();
	
	// Essayer de charger la texture principale, sinon fallback
	let texture: THREE.Texture;
	try {
		texture = useLoader(THREE.TextureLoader, imagePath);
	} catch {
		try {
			texture = useLoader(THREE.TextureLoader, fallbackPath || imagePath);
		} catch {
			// Si aucune image n'est disponible, créer une texture de couleur
			const canvas = document.createElement("canvas");
			canvas.width = 512;
			canvas.height = 512;
			const ctx = canvas.getContext("2d");
			if (ctx) {
				ctx.fillStyle = "#8B4513";
				ctx.fillRect(0, 0, 512, 512);
			}
			texture = new THREE.CanvasTexture(canvas);
		}
	}

	// Rotation automatique
	const rotationY = (frame * rotationSpeed) / fps;
	
	// Animation de scale (entrée)
	const scale = spring({
		frame: frame - 20,
		fps,
		config: {
			damping: 12,
			stiffness: 120,
		},
	});

	// Animation de flottement subtile
	const floatY = Math.sin(frame / 25) * 0.08;
	const floatX = Math.cos(frame / 30) * 0.05;

	// Animation de zoom léger
	const zoom = 1 + Math.sin(frame / 40) * 0.05;

	return (
		<group
			rotation={[0, rotationY, 0]}
			position={[floatX, floatY, 0]}
			scale={scale * zoom}
		>
			{/* Plan principal avec la photo */}
			<mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
				<planeGeometry args={[3.5, 3.5]} />
				<meshStandardMaterial
					map={texture}
					side={THREE.DoubleSide}
					roughness={0.3}
					metalness={0.1}
				/>
			</mesh>

			{/* Bordure élégante autour de la photo */}
			<mesh position={[0, 0, -0.01]}>
				<ringGeometry args={[1.75, 1.8, 64]} />
				<meshStandardMaterial
					color="#ffffff"
					metalness={0.8}
					roughness={0.2}
					side={THREE.DoubleSide}
				/>
			</mesh>

			{/* Ombre portée réaliste */}
			<mesh
				position={[0, -2, 0.1]}
				rotation={[-Math.PI / 2, 0, 0]}
			>
				<circleGeometry args={[2, 64]} />
				<meshStandardMaterial
					color="#000000"
					opacity={0.4}
					transparent
					side={THREE.DoubleSide}
				/>
			</mesh>

			{/* Reflet sur le sol */}
			<mesh
				position={[0, -2, 0]}
				rotation={[Math.PI / 2, 0, 0]}
			>
				<planeGeometry args={[3.5, 3.5]} />
				<meshStandardMaterial
					map={texture}
					side={THREE.DoubleSide}
					opacity={0.2}
					transparent
				/>
			</mesh>
		</group>
	);
};

// Composant de chargement
const LoadingFallback: React.FC = () => {
	return (
		<mesh>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color="#1a1a1a" />
		</mesh>
	);
};

// Scène 3D principale
const Scene3D: React.FC<{ dishIndex: number }> = ({ dishIndex }) => {
	const frame = useCurrentFrame();
	const dish = DISHES_CONFIG[dishIndex];

	// Animation de la caméra
	const cameraY = spring({
		frame: frame - 30,
		fps,
		config: {
			damping: 12,
			stiffness: 100,
		},
	});

	const cameraZ = interpolate(frame, [0, 60], [6, 5], {
		extrapolateRight: "clamp",
	});

	return (
		<Canvas
			style={{ width: "100%", height: "100%" }}
			gl={{ antialias: true, alpha: true }}
		>
			<PerspectiveCamera
				makeDefault
				position={[0, cameraY * 0.5, cameraZ]}
				fov={50}
			/>
			
			{/* Éclairage professionnel */}
			<ambientLight intensity={0.7} />
			<directionalLight position={[5, 8, 5]} intensity={1.5} color="#ffffff" />
			<directionalLight position={[-5, 5, -5]} intensity={0.8} color="#fff8dc" />
			<pointLight position={[0, 6, 0]} intensity={1} color="#ffffff" />
			<spotLight
				position={[0, 10, 5]}
				angle={0.3}
				penumbra={1}
				intensity={0.8}
				color="#ffffff"
			/>

			{/* Environnement pour les reflets */}
			<Environment preset="sunset" />

			<Suspense fallback={<LoadingFallback />}>
				<DishPhoto3D
					imagePath={dish.photo}
					fallbackPath={dish.fallbackPhoto}
					rotationSpeed={0.25}
				/>
			</Suspense>
		</Canvas>
	);
};

export const Dishes3D: React.FC = () => {
	const frame = useCurrentFrame();
	const dishDuration = fps * 4; // 4 secondes par plat
	const currentDishIndex = Math.min(
		Math.floor(frame / dishDuration),
		DISHES_CONFIG.length - 1
	);

	const dish = DISHES_CONFIG[currentDishIndex];

	// Animation d'opacité globale
	const opacity = interpolate(frame, [0, 30], [0, 1], {
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	// Animation du nom du plat
	const nameOpacity = interpolate(
		frame,
		[currentDishIndex * dishDuration, currentDishIndex * dishDuration + 30],
		[0, 1],
		{
			extrapolateRight: "clamp",
		}
	);

	// Animation du prix
	const priceY = spring({
		frame: frame - (currentDishIndex * dishDuration + 40),
		fps,
		config: {
			damping: 12,
			stiffness: 120,
		},
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "#0a0a0a",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			{/* Titre */}
			<div
				style={{
					position: "absolute",
					top: 50,
					left: 0,
					right: 0,
					textAlign: "center",
					opacity,
					zIndex: 10,
				}}
			>
				<h2
					style={{
						fontSize: 32,
						fontWeight: 300,
						color: "rgba(255,255,255,0.9)",
						margin: 0,
						letterSpacing: "2px",
					}}
				>
					Plats Le Carré
				</h2>
			</div>

			{/* Scène 3D */}
			<div
				style={{
					width: "100%",
					height: "100%",
					opacity,
				}}
			>
				<Scene3D dishIndex={currentDishIndex} />
			</div>

			{/* Informations du plat */}
			<div
				style={{
					position: "absolute",
					bottom: 80,
					left: 0,
					right: 0,
					textAlign: "center",
					opacity: nameOpacity,
					zIndex: 10,
					transform: `translateY(${priceY * 20}px)`,
				}}
			>
				<h3
					style={{
						fontSize: 28,
						fontWeight: 300,
						color: "#ffffff",
						margin: 0,
						marginBottom: 12,
						letterSpacing: "1px",
					}}
				>
					{dish.name}
				</h3>
				<p
					style={{
						fontSize: 18,
						color: "rgba(255,255,255,0.7)",
						margin: 0,
						marginBottom: 8,
						fontWeight: 300,
					}}
				>
					{dish.description}
				</p>
				<p
					style={{
						fontSize: 22,
						color: "#ffffff",
						margin: 0,
						fontWeight: 400,
						letterSpacing: "0.5px",
					}}
				>
					{dish.price}
				</p>
			</div>
		</AbsoluteFill>
	);
};

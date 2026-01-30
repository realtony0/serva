import React from "react";
import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	spring,
	Easing,
} from "remotion";
import { fps } from "../config";

const features = [
	{
		title: "QR Code Unique",
		description: "Chaque table dispose d'un QR code unique pour commander instantanément",
		color: "#6366f1",
	},
	{
		title: "Menu Digital",
		description: "Gérez vos menus, catégories et produits en temps réel",
		color: "#10b981",
	},
	{
		title: "Dashboard Cuisine",
		description: "Suivez les commandes en temps réel avec notifications",
		color: "#f59e0b",
	},
	{
		title: "Statistiques",
		description: "Analysez vos ventes et produits populaires en FCFA",
		color: "#8b5cf6",
	},
];

export const Features: React.FC = () => {
	const frame = useCurrentFrame();

	const featureDuration = Math.floor((fps * 12) / features.length);

	const currentFeatureIndex = Math.min(
		Math.floor(frame / featureDuration),
		features.length - 1
	);
	const featureFrame = frame % featureDuration;

	const currentFeature = features[Math.min(currentFeatureIndex, features.length - 1)];

	const cardScale = spring({
		frame: featureFrame,
		fps,
		config: {
			damping: 15,
			stiffness: 100,
		},
	});

	const cardOpacity = interpolate(featureFrame, [0, 30], [0, 1], {
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	const textY = interpolate(featureFrame, [0, 40], [30, 0], {
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: "#0a0a0a",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				padding: "60px 40px",
			}}
		>
			{/* Titre de section */}
			<div
				style={{
					position: "absolute",
					top: 60,
					left: 0,
					right: 0,
					textAlign: "center",
					opacity: interpolate(frame, [0, 40], [0, 1], {
						extrapolateRight: "clamp",
					}),
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
					Fonctionnalités
				</h2>
			</div>

			{/* Carte feature */}
			<div
				style={{
					transform: `scale(${cardScale})`,
					opacity: cardOpacity,
					width: "100%",
					maxWidth: 900,
					height: 600,
					backgroundColor: "#1a1a1a",
					borderRadius: 24,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
					border: `1px solid ${currentFeature.color}40`,
					padding: "50px 40px",
					boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${currentFeature.color}20`,
				}}
			>
				{/* Ligne de couleur */}
				<div
					style={{
						width: 60,
						height: 3,
						background: currentFeature.color,
						marginBottom: 40,
						borderRadius: 2,
					}}
				/>

				{/* Titre */}
				<h3
					style={{
						fontSize: 40,
						fontWeight: 300,
						color: "#ffffff",
						margin: 0,
						marginBottom: 30,
						letterSpacing: "1px",
						textAlign: "center",
						transform: `translateY(${textY}px)`,
					}}
				>
					{currentFeature.title}
				</h3>

				{/* Description */}
				<p
					style={{
						fontSize: 20,
						color: "rgba(255,255,255,0.7)",
						textAlign: "center",
						lineHeight: 1.6,
						maxWidth: 700,
						fontWeight: 300,
						transform: `translateY(${textY}px)`,
						padding: "0 20px",
					}}
				>
					{currentFeature.description}
				</p>
			</div>

			{/* Indicateurs de progression */}
			<div
				style={{
					position: "absolute",
					bottom: 60,
					left: 0,
					right: 0,
					display: "flex",
					justifyContent: "center",
					gap: 10,
				}}
			>
				{features.map((_, index) => {
					const isActive = index === currentFeatureIndex;
					return (
						<div
							key={index}
							style={{
								width: isActive ? 32 : 6,
								height: 6,
								borderRadius: 3,
								backgroundColor: isActive
									? "rgba(255,255,255,0.9)"
									: "rgba(255,255,255,0.2)",
								transition: "all 0.3s",
							}}
						/>
					);
				})}
			</div>
		</AbsoluteFill>
	);
};

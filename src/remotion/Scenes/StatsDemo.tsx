import React from "react";
import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	spring,
	Easing,
} from "remotion";
import { fps } from "../config";

export const StatsDemo: React.FC = () => {
	const frame = useCurrentFrame();

	const statsScale = spring({
		frame,
		fps,
		config: {
			damping: 12,
			stiffness: 100,
		},
	});

	const statsOpacity = interpolate(frame, [0, 40], [0, 1], {
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	const bar1Height = spring({
		frame: frame - 90,
		fps,
		config: {
			damping: 12,
			stiffness: 100,
		},
	});

	const bar2Height = spring({
		frame: frame - 120,
		fps,
		config: {
			damping: 12,
			stiffness: 100,
		},
	});

	const bar3Height = spring({
		frame: frame - 150,
		fps,
		config: {
			damping: 12,
			stiffness: 100,
		},
	});

	const ordersCount = Math.floor(interpolate(frame, [210, 270], [0, 47], {
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	}));

	const revenueCount = Math.floor(interpolate(frame, [230, 290], [0, 385000], {
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	}));

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
			{/* Titre */}
			<div
				style={{
					position: "absolute",
					top: 50,
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
					Statistiques
				</h2>
			</div>

			{/* Dashboard Stats */}
			<div
				style={{
					transform: `scale(${statsScale})`,
					opacity: statsOpacity,
					width: "100%",
					maxWidth: 900,
					height: 1400,
					backgroundColor: "#1a1a1a",
					borderRadius: 24,
					padding: "40px 30px",
					boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
					display: "flex",
					flexDirection: "column",
					gap: 30,
					border: "1px solid rgba(255,255,255,0.05)",
				}}
			>
				{/* Stats Cards */}
				<div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
					{/* Commandes du jour */}
					<div
						style={{
							backgroundColor: "#1f1f1f",
							borderRadius: 16,
							padding: 30,
							border: "1px solid rgba(255,255,255,0.05)",
						}}
					>
						<p
							style={{
								fontSize: 16,
								color: "rgba(255,255,255,0.6)",
								margin: 0,
								marginBottom: 15,
								fontWeight: 300,
							}}
						>
							Commandes du jour
						</p>
						<p
							style={{
								fontSize: 48,
								color: "#ffffff",
								fontWeight: 300,
								margin: 0,
								letterSpacing: "1px",
							}}
						>
							{ordersCount}
						</p>
					</div>

					{/* Chiffre d'affaires */}
					<div
						style={{
							backgroundColor: "#1f1f1f",
							borderRadius: 16,
							padding: 30,
							border: "1px solid rgba(255,255,255,0.05)",
						}}
					>
						<p
							style={{
								fontSize: 16,
								color: "rgba(255,255,255,0.6)",
								margin: 0,
								marginBottom: 15,
								fontWeight: 300,
							}}
						>
							Chiffre d&apos;affaires
						</p>
						<p
							style={{
								fontSize: 36,
								color: "#ffffff",
								fontWeight: 300,
								margin: 0,
								letterSpacing: "0.5px",
							}}
						>
							{revenueCount.toLocaleString("fr-FR")} FCFA
						</p>
					</div>

					{/* Temps moyen */}
					<div
						style={{
							backgroundColor: "#1f1f1f",
							borderRadius: 16,
							padding: 30,
							border: "1px solid rgba(255,255,255,0.05)",
						}}
					>
						<p
							style={{
								fontSize: 16,
								color: "rgba(255,255,255,0.6)",
								margin: 0,
								marginBottom: 15,
								fontWeight: 300,
							}}
						>
							Temps moyen
						</p>
						<p
							style={{
								fontSize: 48,
								color: "#ffffff",
								fontWeight: 300,
								margin: 0,
								letterSpacing: "1px",
							}}
						>
							18 min
						</p>
					</div>
				</div>

				{/* Produits populaires */}
				<div
					style={{
						flex: 1,
						backgroundColor: "#1f1f1f",
						borderRadius: 16,
						padding: 30,
						border: "1px solid rgba(255,255,255,0.05)",
					}}
				>
					<h3
						style={{
							fontSize: 22,
							color: "#ffffff",
							fontWeight: 300,
							margin: 0,
							marginBottom: 25,
							letterSpacing: "0.5px",
						}}
					>
						Produits les plus commandés
					</h3>
					<div style={{ display: "flex", gap: 15, alignItems: "flex-end", height: 300 }}>
						{/* Barre 1 */}
						<div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
							<div
								style={{
									width: "100%",
									height: `${bar1Height * 250}px`,
									backgroundColor: "#6366f1",
									borderRadius: "8px 8px 0 0",
									marginBottom: 15,
									display: "flex",
									alignItems: "flex-end",
									justifyContent: "center",
									paddingBottom: 10,
								}}
							>
								<span
									style={{
										color: "#ffffff",
										fontSize: 16,
										fontWeight: 400,
									}}
								>
									45
								</span>
							</div>
							<p
								style={{
									color: "rgba(255,255,255,0.7)",
									fontSize: 14,
									margin: 0,
									textAlign: "center",
									fontWeight: 300,
								}}
							>
								Viandes au Feu
							</p>
						</div>

						{/* Barre 2 */}
						<div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
							<div
								style={{
									width: "100%",
									height: `${bar2Height * 200}px`,
									backgroundColor: "#10b981",
									borderRadius: "8px 8px 0 0",
									marginBottom: 15,
									display: "flex",
									alignItems: "flex-end",
									justifyContent: "center",
									paddingBottom: 10,
								}}
							>
								<span
									style={{
										color: "#ffffff",
										fontSize: 16,
										fontWeight: 400,
									}}
								>
									32
								</span>
							</div>
							<p
								style={{
									color: "rgba(255,255,255,0.7)",
									fontSize: 14,
									margin: 0,
									textAlign: "center",
									fontWeight: 300,
								}}
							>
								Poissons
							</p>
						</div>

						{/* Barre 3 */}
						<div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
							<div
								style={{
									width: "100%",
									height: `${bar3Height * 150}px`,
									backgroundColor: "#f59e0b",
									borderRadius: "8px 8px 0 0",
									marginBottom: 15,
									display: "flex",
									alignItems: "flex-end",
									justifyContent: "center",
									paddingBottom: 10,
								}}
							>
								<span
									style={{
										color: "#ffffff",
										fontSize: 16,
										fontWeight: 400,
									}}
								>
									18
								</span>
							</div>
							<p
								style={{
									color: "rgba(255,255,255,0.7)",
									fontSize: 14,
									margin: 0,
									textAlign: "center",
									fontWeight: 300,
								}}
							>
								Salades
							</p>
						</div>
					</div>
				</div>
			</div>
		</AbsoluteFill>
	);
};

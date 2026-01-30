import React from "react";
import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	spring,
	Easing,
} from "remotion";
import { fps } from "../config";

export const ClientDemo: React.FC = () => {
	const frame = useCurrentFrame();

	const phoneScale = spring({
		frame,
		fps,
		config: {
			damping: 12,
			stiffness: 100,
		},
	});

	const phoneOpacity = interpolate(frame, [0, 40], [0, 1], {
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	const qrScale = spring({
		frame: frame - 30,
		fps,
		config: {
			damping: 10,
			stiffness: 120,
		},
	});

	const menuX = interpolate(frame, [90, 150], [-400, 0], {
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	const cartY = spring({
		frame: frame - 210,
		fps,
		config: {
			damping: 12,
			stiffness: 120,
		},
	});

	const orderOpacity = interpolate(frame, [330, 360], [0, 1], {
		extrapolateRight: "clamp",
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
					Expérience Client
				</h2>
			</div>

			{/* Téléphone */}
			<div
				style={{
					transform: `scale(${phoneScale})`,
					opacity: phoneOpacity,
					width: 360,
					height: 700,
					backgroundColor: "#000000",
					borderRadius: 35,
					padding: 18,
					boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
					display: "flex",
					flexDirection: "column",
					position: "relative",
					overflow: "hidden",
					border: "1px solid rgba(255,255,255,0.1)",
				}}
			>
				{/* Header */}
				<div
					style={{
						height: 100,
						background: "linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)",
						borderRadius: 25,
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						marginBottom: 20,
						border: "1px solid rgba(255,255,255,0.05)",
					}}
				>
					<h3
						style={{
							fontSize: 20,
							fontWeight: 400,
							color: "#ffffff",
							margin: 0,
							letterSpacing: "0.5px",
						}}
					>
						Le Carré
					</h3>
					<p
						style={{
							fontSize: 12,
							color: "rgba(255,255,255,0.5)",
							margin: 6,
							letterSpacing: "0.5px",
						}}
					>
						Table 12
					</p>
				</div>

				{/* QR Code Animation */}
				{frame < 110 && (
					<div
						style={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: `translate(-50%, -50%) scale(${qrScale})`,
							opacity: interpolate(frame, [30, 70, 100], [0, 1, 0], {
								extrapolateRight: "clamp",
							}),
						}}
					>
						<div
							style={{
								width: 180,
								height: 180,
								backgroundColor: "#ffffff",
								borderRadius: 14,
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								border: "2px solid rgba(255,255,255,0.1)",
							}}
						>
							<svg width="140" height="140" viewBox="0 0 100 100">
								<rect x="10" y="10" width="20" height="20" fill="#000" />
								<rect x="70" y="10" width="20" height="20" fill="#000" />
								<rect x="10" y="70" width="20" height="20" fill="#000" />
								<rect x="30" y="30" width="10" height="10" fill="#000" />
								<rect x="60" y="30" width="10" height="10" fill="#000" />
								<rect x="30" y="60" width="10" height="10" fill="#000" />
								<rect x="60" y="60" width="10" height="10" fill="#000" />
							</svg>
						</div>
					</div>
				)}

				{/* Menu */}
				{frame >= 90 && (
					<div
						style={{
							flex: 1,
							transform: `translateX(${menuX}px)`,
							opacity: interpolate(frame, [90, 120], [0, 1], {
								extrapolateRight: "clamp",
							}),
						}}
					>
						<div
							style={{
								backgroundColor: "#1a1a1a",
								borderRadius: 14,
								padding: 16,
								marginBottom: 12,
								border: "1px solid rgba(255,255,255,0.05)",
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: 6,
								}}
							>
								<h4
									style={{
										fontSize: 16,
										color: "#ffffff",
										margin: 0,
										fontWeight: 400,
									}}
								>
									Viandes au Feu
								</h4>
								<span
									style={{
										fontSize: 14,
										color: "rgba(255,255,255,0.7)",
										fontWeight: 300,
									}}
								>
									8 500 FCFA
								</span>
							</div>
							<p
								style={{
									fontSize: 12,
									color: "rgba(255,255,255,0.5)",
									margin: 0,
								}}
							>
								Grillades au choix avec accompagnements
							</p>
						</div>

						<div
							style={{
								backgroundColor: "#1a1a1a",
								borderRadius: 14,
								padding: 16,
								marginBottom: 12,
								border: "1px solid rgba(255,255,255,0.05)",
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: 6,
								}}
							>
								<h4
									style={{
										fontSize: 16,
										color: "#ffffff",
										margin: 0,
										fontWeight: 400,
									}}
								>
									Poissons
								</h4>
								<span
									style={{
										fontSize: 14,
										color: "rgba(255,255,255,0.7)",
										fontWeight: 300,
									}}
								>
									7 500 FCFA
								</span>
							</div>
							<p
								style={{
									fontSize: 12,
									color: "rgba(255,255,255,0.5)",
									margin: 0,
								}}
							>
								Poissons frais du jour
							</p>
						</div>
					</div>
				)}

				{/* Panier */}
				{frame >= 210 && (
					<div
						style={{
							position: "absolute",
							bottom: 18,
							left: 18,
							right: 18,
							transform: `translateY(${cartY * 80}px)`,
							backgroundColor: "#1a1a1a",
							borderRadius: 18,
							padding: 18,
							border: "1px solid rgba(255,255,255,0.1)",
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<div>
								<p
									style={{
										fontSize: 12,
										color: "rgba(255,255,255,0.6)",
										margin: 0,
										fontWeight: 300,
									}}
								>
									2 articles
								</p>
								<p
									style={{
										fontSize: 18,
										color: "#ffffff",
										margin: 5,
										fontWeight: 400,
									}}
								>
									16 000 FCFA
								</p>
							</div>
							<button
								style={{
									backgroundColor: "#ffffff",
									color: "#000000",
									border: "none",
									borderRadius: 10,
									padding: "10px 24px",
									fontSize: 14,
									fontWeight: 400,
									cursor: "pointer",
									letterSpacing: "0.5px",
								}}
							>
								Commander
							</button>
						</div>
					</div>
				)}

				{/* Notification de commande */}
				{frame >= 330 && (
					<div
						style={{
							position: "absolute",
							top: "50%",
							left: "50%",
							transform: "translate(-50%, -50%)",
							opacity: orderOpacity,
							backgroundColor: "#1a1a1a",
							borderRadius: 18,
							padding: "24px 40px",
							border: "1px solid rgba(255,255,255,0.1)",
							boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
						}}
					>
						<p
							style={{
								fontSize: 20,
								color: "#ffffff",
								fontWeight: 400,
								margin: 0,
								textAlign: "center",
								letterSpacing: "0.5px",
							}}
						>
							Commande envoyée
						</p>
					</div>
				)}
			</div>
		</AbsoluteFill>
	);
};

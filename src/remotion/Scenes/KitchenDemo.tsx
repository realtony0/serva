import React from "react";
import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	spring,
	Easing,
} from "remotion";
import { fps } from "../config";

export const KitchenDemo: React.FC = () => {
	const frame = useCurrentFrame();

	const dashboardScale = spring({
		frame,
		fps,
		config: {
			damping: 12,
			stiffness: 100,
		},
	});

	const dashboardOpacity = interpolate(frame, [0, 40], [0, 1], {
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	const order1Y = spring({
		frame: frame - 80,
		fps,
		config: {
			damping: 12,
			stiffness: 120,
		},
	});

	const order2Y = spring({
		frame: frame - 170,
		fps,
		config: {
			damping: 12,
			stiffness: 120,
		},
	});

	const notificationOpacity = interpolate(frame, [260, 290, fps * 12 - 30, fps * 12], [0, 1, 1, 0], {
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
					Dashboard Cuisine
				</h2>
			</div>

			{/* Dashboard */}
			<div
				style={{
					transform: `scale(${dashboardScale})`,
					opacity: dashboardOpacity,
					width: "100%",
					maxWidth: 900,
					height: 1200,
					backgroundColor: "#1a1a1a",
					borderRadius: 24,
					padding: "40px 30px",
					boxShadow: "0 30px 80px rgba(0,0,0,0.8)",
					display: "flex",
					flexDirection: "column",
					gap: 25,
					border: "1px solid rgba(255,255,255,0.05)",
				}}
			>
				{/* Header */}
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						paddingBottom: 20,
						borderBottom: "1px solid rgba(255,255,255,0.1)",
					}}
				>
					<h3
						style={{
							fontSize: 28,
							fontWeight: 300,
							color: "#ffffff",
							margin: 0,
							letterSpacing: "1px",
						}}
					>
						Commandes en Cours
					</h3>
					<div
						style={{
							backgroundColor: "rgba(255,255,255,0.1)",
							color: "#ffffff",
							padding: "6px 16px",
							borderRadius: 10,
							fontSize: 14,
							fontWeight: 300,
							border: "1px solid rgba(255,255,255,0.1)",
						}}
					>
						2 nouvelles
					</div>
				</div>

				{/* Commandes */}
				<div style={{ display: "flex", flexDirection: "column", gap: 18, flex: 1, overflowY: "auto" }}>
					{/* Commande 1 */}
					{frame >= 80 && (
						<div
							style={{
								transform: `translateY(${order1Y * 40}px)`,
								opacity: interpolate(frame, [80, 110], [0, 1], {
									extrapolateRight: "clamp",
								}),
								backgroundColor: "#1f1f1f",
								borderRadius: 16,
								padding: 24,
								borderLeft: "3px solid #6366f1",
								border: "1px solid rgba(255,255,255,0.05)",
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: 16,
								}}
							>
								<div>
									<h4
										style={{
											fontSize: 22,
											color: "#ffffff",
											margin: 0,
											fontWeight: 400,
										}}
									>
										Table 12
									</h4>
									<p
										style={{
											fontSize: 14,
											color: "rgba(255,255,255,0.5)",
											margin: 5,
											fontWeight: 300,
										}}
									>
										Il y a 2 min
									</p>
								</div>
								<span
									style={{
										backgroundColor: "rgba(255,255,255,0.1)",
										color: "#ffffff",
										padding: "5px 14px",
										borderRadius: 8,
										fontSize: 12,
										fontWeight: 300,
										border: "1px solid rgba(255,255,255,0.1)",
									}}
								>
									En attente
								</span>
							</div>
							<div style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, fontWeight: 300 }}>
								<p style={{ margin: "5px 0" }}>2x Viandes au Feu</p>
								<p style={{ margin: "5px 0" }}>1x Poissons</p>
								<p
									style={{
										margin: "10px 0 0",
										fontSize: 18,
										fontWeight: 400,
										color: "#ffffff",
									}}
								>
									Total: 24 500 FCFA
								</p>
							</div>
							<div style={{ marginTop: 16, display: "flex", gap: 12 }}>
								<button
									style={{
										backgroundColor: "#ffffff",
										color: "#000000",
										border: "none",
										borderRadius: 10,
										padding: "8px 24px",
										fontSize: 14,
										fontWeight: 400,
										cursor: "pointer",
									}}
								>
									En préparation
								</button>
							</div>
						</div>
					)}

					{/* Commande 2 */}
					{frame >= 170 && (
						<div
							style={{
								transform: `translateY(${order2Y * 40}px)`,
								opacity: interpolate(frame, [170, 200], [0, 1], {
									extrapolateRight: "clamp",
								}),
								backgroundColor: "#1f1f1f",
								borderRadius: 16,
								padding: 24,
								borderLeft: "3px solid #10b981",
								border: "1px solid rgba(255,255,255,0.05)",
							}}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									marginBottom: 16,
								}}
							>
								<div>
									<h4
										style={{
											fontSize: 22,
											color: "#ffffff",
											margin: 0,
											fontWeight: 400,
										}}
									>
										Table 8
									</h4>
									<p
										style={{
											fontSize: 14,
											color: "rgba(255,255,255,0.5)",
											margin: 5,
											fontWeight: 300,
										}}
									>
										Il y a 5 min
									</p>
								</div>
								<span
									style={{
										backgroundColor: "rgba(16,185,129,0.2)",
										color: "#10b981",
										padding: "5px 14px",
										borderRadius: 8,
										fontSize: 12,
										fontWeight: 300,
										border: "1px solid rgba(16,185,129,0.3)",
									}}
								>
									Prête
								</span>
							</div>
							<div style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, fontWeight: 300 }}>
								<p style={{ margin: "5px 0" }}>1x Salades</p>
								<p
									style={{
										margin: "10px 0 0",
										fontSize: 18,
										fontWeight: 400,
										color: "#ffffff",
									}}
								>
									Total: 5 000 FCFA
								</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Notification */}
			{frame >= 260 && (
				<div
					style={{
						position: "absolute",
						top: 80,
						right: 40,
						opacity: notificationOpacity,
						backgroundColor: "#1a1a1a",
						borderRadius: 14,
						padding: "16px 24px",
						border: "1px solid rgba(255,255,255,0.1)",
						boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
					}}
				>
					<p
						style={{
							fontSize: 16,
							color: "#ffffff",
							margin: 0,
							fontWeight: 400,
						}}
					>
						Nouvelle commande
					</p>
					<p
						style={{
							fontSize: 12,
							color: "rgba(255,255,255,0.5)",
							margin: "5px 0 0",
							fontWeight: 300,
						}}
					>
						Table 12
					</p>
				</div>
			)}
		</AbsoluteFill>
	);
};

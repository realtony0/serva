import React from "react";
import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	spring,
	Easing,
} from "remotion";
import { fps } from "../config";

export const Intro: React.FC = () => {
	const frame = useCurrentFrame();

	const logoScale = spring({
		frame,
		fps,
		config: {
			damping: 10,
			stiffness: 100,
			mass: 0.5,
		},
	});

	const logoOpacity = interpolate(frame, [0, 50], [0, 1], {
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	const titleY = spring({
		frame: frame - 30,
		fps,
		config: {
			damping: 15,
			stiffness: 100,
		},
	});

	const subtitleOpacity = interpolate(frame, [60, 120], [0, 1], {
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	return (
		<AbsoluteFill
			style={{
				background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0f0f0f 100%)",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				position: "relative",
			}}
		>
			{/* Subtle grid overlay */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					backgroundImage: `
						linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
						linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
					`,
					backgroundSize: "60px 60px",
				}}
			/>

			{/* Logo/Titre principal */}
			<div
				style={{
					transform: `scale(${logoScale})`,
					opacity: logoOpacity,
					textAlign: "center",
					position: "relative",
				}}
			>
				<h1
					style={{
						fontSize: 100,
						fontWeight: 300,
						color: "#ffffff",
						margin: 0,
						letterSpacing: "12px",
						fontFamily: "system-ui, -apple-system, sans-serif",
						transform: `translateY(${titleY * 20}px)`,
					}}
				>
					SERVA
				</h1>
				<div
					style={{
						width: 80,
						height: 2,
						background: "linear-gradient(90deg, transparent, #ffffff, transparent)",
						margin: "20px auto 0",
						opacity: subtitleOpacity,
					}}
				/>
			</div>

			{/* Sous-titre */}
			<div
				style={{
					opacity: subtitleOpacity,
					marginTop: 40,
					textAlign: "center",
					padding: "0 40px",
				}}
			>
				<p
					style={{
						fontSize: 24,
						color: "rgba(255,255,255,0.8)",
						fontWeight: 300,
						margin: 0,
						letterSpacing: "1px",
						lineHeight: 1.4,
					}}
				>
					Solution de gestion pour restaurants
				</p>
				<p
					style={{
						fontSize: 16,
						color: "rgba(255,255,255,0.5)",
						fontWeight: 300,
						marginTop: 15,
						letterSpacing: "0.5px",
					}}
				>
					Disponible au Sénégal
				</p>
			</div>
		</AbsoluteFill>
	);
};

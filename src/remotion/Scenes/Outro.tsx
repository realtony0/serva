import React from "react";
import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	spring,
	Easing,
} from "remotion";
import { fps } from "../config";

export const Outro: React.FC = () => {
	const frame = useCurrentFrame();

	const logoScale = spring({
		frame,
		fps,
		config: {
			damping: 10,
			stiffness: 100,
		},
	});

	const logoOpacity = interpolate(frame, [0, 40], [0, 1], {
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	const textY = spring({
		frame: frame - 30,
		fps,
		config: {
			damping: 15,
			stiffness: 100,
		},
	});

	const textOpacity = interpolate(frame, [50, 100], [0, 1], {
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	const ctaScale = spring({
		frame: frame - 80,
		fps,
		config: {
			damping: 10,
			stiffness: 120,
		},
	});

	const ctaOpacity = interpolate(frame, [100, 140], [0, 1], {
		extrapolateRight: "clamp",
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

			{/* Logo */}
			<div
				style={{
					transform: `scale(${logoScale})`,
					opacity: logoOpacity,
					textAlign: "center",
					marginBottom: 60,
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
					}}
				/>
			</div>

			{/* Texte */}
			<div
				style={{
					opacity: textOpacity,
					transform: `translateY(${textY * 20}px)`,
					textAlign: "center",
					marginBottom: 70,
					padding: "0 40px",
				}}
			>
				<p
					style={{
						fontSize: 28,
						color: "rgba(255,255,255,0.9)",
						fontWeight: 300,
						margin: 0,
						marginBottom: 25,
						letterSpacing: "1px",
						lineHeight: 1.4,
					}}
				>
					Prêt à transformer votre restaurant ?
				</p>
				<p
					style={{
						fontSize: 18,
						color: "rgba(255,255,255,0.6)",
						fontWeight: 300,
						letterSpacing: "0.5px",
					}}
				>
					Rejoignez SERVA dès aujourd&apos;hui
				</p>
			</div>

			{/* CTA Button */}
			<div
				style={{
					transform: `scale(${ctaScale})`,
					opacity: ctaOpacity,
				}}
			>
				<button
					style={{
						backgroundColor: "#ffffff",
						color: "#000000",
						border: "none",
						borderRadius: 12,
						padding: "16px 40px",
						fontSize: 16,
						fontWeight: 400,
						cursor: "pointer",
						letterSpacing: "0.5px",
					}}
				>
					Commencer maintenant
				</button>
			</div>

			{/* Footer */}
			<div
				style={{
					position: "absolute",
					bottom: 40,
					left: 0,
					right: 0,
					textAlign: "center",
					opacity: interpolate(frame, [120, 160], [0, 1], {
						extrapolateRight: "clamp",
					}),
				}}
			>
				<p
					style={{
						fontSize: 14,
						color: "rgba(255,255,255,0.4)",
						margin: 0,
						fontWeight: 300,
					}}
				>
					© {new Date().getFullYear()} SERVA. Tous droits réservés.
				</p>
			</div>
		</AbsoluteFill>
	);
};

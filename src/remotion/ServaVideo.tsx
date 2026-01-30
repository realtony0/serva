import React from "react";
import {
	AbsoluteFill,
	interpolate,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	spring,
} from "remotion";
import { Intro } from "./Scenes/Intro";
import { Features } from "./Scenes/Features";
import { ClientDemo } from "./Scenes/ClientDemo";
import { KitchenDemo } from "./Scenes/KitchenDemo";
import { StatsDemo } from "./Scenes/StatsDemo";
import { Outro } from "./Scenes/Outro";
import { fps } from "./config";

export const ServaVideo: React.FC = () => {
	const frame = useCurrentFrame();
	const { fps: videoFps } = useVideoConfig();

	// Durées des scènes (en frames)
	const introDuration = fps * 5; // 5 secondes
	const featuresDuration = fps * 12; // 12 secondes
	const clientDemoDuration = fps * 15; // 15 secondes
	const kitchenDemoDuration = fps * 12; // 12 secondes
	const statsDemoDuration = fps * 10; // 10 secondes
	const outroDuration = fps * 6; // 6 secondes

	// Positions de début de chaque scène
	const introStart = 0;
	const featuresStart = introStart + introDuration;
	const clientDemoStart = featuresStart + featuresDuration;
	const kitchenDemoStart = clientDemoStart + clientDemoDuration;
	const statsDemoStart = kitchenDemoStart + kitchenDemoDuration;
	const outroStart = statsDemoStart + statsDemoDuration;

	return (
		<AbsoluteFill style={{ backgroundColor: "#0a0a0a" }}>
			{/* Intro */}
			<Sequence from={introStart} durationInFrames={introDuration}>
				<Intro />
			</Sequence>

			{/* Features */}
			<Sequence from={featuresStart} durationInFrames={featuresDuration}>
				<Features />
			</Sequence>

			{/* Client Demo */}
			<Sequence from={clientDemoStart} durationInFrames={clientDemoDuration}>
				<ClientDemo />
			</Sequence>

			{/* Kitchen Demo */}
			<Sequence from={kitchenDemoStart} durationInFrames={kitchenDemoDuration}>
				<KitchenDemo />
			</Sequence>

			{/* Stats Demo */}
			<Sequence from={statsDemoStart} durationInFrames={statsDemoDuration}>
				<StatsDemo />
			</Sequence>

			{/* Outro */}
			<Sequence from={outroStart} durationInFrames={outroDuration}>
				<Outro />
			</Sequence>
		</AbsoluteFill>
	);
};

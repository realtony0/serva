import React from "react";
import { Composition } from "remotion";
import { ServaVideo } from "./ServaVideo";
import { fps, durationInFrames, width, height } from "./config";

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="ServaVideo"
				component={ServaVideo}
				durationInFrames={durationInFrames}
				fps={fps}
				width={width}
				height={height}
				defaultProps={{}}
			/>
		</>
	);
};

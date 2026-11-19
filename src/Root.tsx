import React from "react";
import { Composition } from "remotion";
import {
  SafarSathiHoneymoonReel,
  TOTAL_DURATION_FRAMES,
} from "./SafarSathiHoneymoonReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 9:16 Vertical Reel (1080x1920) @ 30fps, 30.0s */}
      <Composition
        id="SafarSathiHoneymoonReel"
        component={SafarSathiHoneymoonReel}
        durationInFrames={TOTAL_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};

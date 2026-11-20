import React from "react";
import { Composition } from "remotion";
import {
  SafarSathiHoneymoonReel,
  TOTAL_DURATION_FRAMES,
} from "./SafarSathiHoneymoonReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 1. Cinematic Romantic BGM (Yeh Dooriyan Cinematic Strings & Piano) */}
      <Composition
        id="SafarSathiHoneymoonReel"
        component={SafarSathiHoneymoonReel}
        durationInFrames={TOTAL_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          audioTrack: "audio/yeh_dooriyan_romantic_30s.mp3",
        }}
      />

      {/* 2. Cozy Mountain Acoustic Guitar (Choo Lo Fingerstyle Acoustic) */}
      <Composition
        id="SafarSathiHoneymoon-ChooLo"
        component={SafarSathiHoneymoonReel}
        durationInFrames={TOTAL_DURATION_FRAMES}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          audioTrack: "audio/choo_lo_romantic_30s.mp3",
        }}
      />
    </>
  );
};

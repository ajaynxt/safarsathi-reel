import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface SceneData {
  id: string;
  durationInFrames: number;
  image: string;
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  zoomDirection: "in" | "out" | "pan-right" | "pan-left";
}

export const HONEYMOON_SCENES: SceneData[] = [
  {
    id: "01_hook",
    durationInFrames: 135, // 4.5s
    image: "images/shimla_sunset_balcony.jpg",
    badge: "🏔️ HIMACHAL HONEYMOON SPECIAL",
    title: "Planning a Romantic Mountain Trip to Shimla & Manali?",
    highlight: "Shimla & Manali?",
    subtitle: "Experience Handcrafted Honeymoon Packages with Safar Sathi ❤️",
    zoomDirection: "in",
  },
  {
    id: "02_private_cab",
    durationInFrames: 135, // 4.5s
    image: "images/cab.jpg",
    badge: "🚗 DEDICATED PRIVATE CAB",
    title: "Delhi & Chandigarh Pickup to Drop Included",
    highlight: "Pickup to Drop Included",
    subtitle: "No Shared Cabs • Scenic Road Drives • 24x7 Local Assistance",
    zoomDirection: "pan-right",
  },
  {
    id: "03_cozy_stay",
    durationInFrames: 150, // 5.0s
    image: "images/manali_wooden_suite.jpg",
    badge: "❄️ LUXURY WOODEN SUITES",
    title: "Warm Wooden Stays with Panoramic Valley Views",
    highlight: "Panoramic Valley Views",
    subtitle: "Wake Up to Pine Forests, Fresh Snow & Mountain Sunrise ☕",
    zoomDirection: "out",
  },
  {
    id: "04_romantic_inclusions",
    durationInFrames: 150, // 5.0s
    image: "images/mountain_dining.jpg",
    badge: "🌹 SPECIAL COUPLE SURPRISES",
    title: "Candlelight Dinner & Flower Bed Decoration",
    highlight: "Candlelight Dinner",
    subtitle: "Complimentary Cake • Wood Bonfires • Memorable Photoshoots",
    zoomDirection: "in",
  },
  {
    id: "05_destinations",
    durationInFrames: 150, // 5.0s
    image: "images/pine_forest_terrace.jpg",
    badge: "📍 SHIMLA • KUFRI • MANALI • SOLANG",
    title: "Snow Activities, Atal Tunnel & Mall Road Walks",
    highlight: "Snow Activities & Mall Road",
    subtitle: "Complete Sightseeing with Transparent Local Pricing",
    zoomDirection: "pan-left",
  },
  {
    id: "06_outro",
    durationInFrames: 180, // 6.0s
    image: "images/shimla_sunset_balcony.jpg",
    badge: "✨ DIRECT LOCAL HIMACHAL RATES",
    title: "Book Your 5N/6D Himachal Honeymoon",
    highlight: "5N/6D Himachal Honeymoon",
    subtitle: "Customise According to Your Budget & Preferred Dates",
    zoomDirection: "out",
  },
];

export const TOTAL_DURATION_FRAMES = HONEYMOON_SCENES.reduce(
  (acc, scene) => acc + scene.durationInFrames,
  0
); // 900 frames = 30.0s @ 30fps

// Typewriter text generator
const TypewriterText: React.FC<{
  text: string;
  startFrame: number;
  charsPerFrame?: number;
  style?: React.CSSProperties;
}> = ({ text, startFrame, charsPerFrame = 1.2, style }) => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - startFrame);
  const visibleChars = Math.min(text.length, Math.floor(elapsed * charsPerFrame));
  const displayedText = text.slice(0, visibleChars);
  const isComplete = visibleChars >= text.length;

  return (
    <span style={style}>
      {displayedText}
      {!isComplete && (
        <span
          style={{
            display: "inline-block",
            width: "3px",
            height: "1em",
            backgroundColor: "#E0A96D",
            marginLeft: "4px",
            verticalAlign: "middle",
            opacity: frame % 10 < 5 ? 1 : 0,
          }}
        />
      )}
    </span>
  );
};

// Subtle drifting snow particles
const SnowOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const flakes = React.useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      x: (i * 47) % 100,
      speedY: 1.5 + (i % 5) * 0.7,
      size: 4 + (i % 6) * 1.5,
      opacity: 0.3 + (i % 4) * 0.15,
      drift: ((i % 3) - 1) * 0.5,
    }));
  }, []);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {flakes.map((f, i) => {
        const y = (frame * f.speedY + i * 80) % 1920;
        const xOffset = Math.sin((frame + i * 30) * 0.03) * 20;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${f.x}%`,
              top: `${y}px`,
              width: `${f.size}px`,
              height: `${f.size}px`,
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              opacity: f.opacity,
              filter: "blur(1px)",
              transform: `translateX(${xOffset}px)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Single scene renderer
export const SceneItem: React.FC<{
  scene: SceneData;
  isOutro?: boolean;
}> = ({ scene, isOutro = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Ken Burns Camera Animation
  let scale = 1.0;
  let translateY = 0;
  let translateX = 0;

  if (scene.zoomDirection === "in") {
    scale = interpolate(frame, [0, scene.durationInFrames], [1.0, 1.15], {
      extrapolateRight: "clamp",
    });
  } else if (scene.zoomDirection === "out") {
    scale = interpolate(frame, [0, scene.durationInFrames], [1.18, 1.02], {
      extrapolateRight: "clamp",
    });
  } else if (scene.zoomDirection === "pan-right") {
    scale = 1.12;
    translateX = interpolate(frame, [0, scene.durationInFrames], [-25, 25], {
      extrapolateRight: "clamp",
    });
  } else if (scene.zoomDirection === "pan-left") {
    scale = 1.12;
    translateX = interpolate(frame, [0, scene.durationInFrames], [25, -25], {
      extrapolateRight: "clamp",
    });
  }

  // Cross-dissolve entrance
  const entranceOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Entrance spring for card
  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  return (
    <AbsoluteFill style={{ opacity: entranceOpacity, backgroundColor: "#080E1A" }}>
      {/* Background Image with Ken Burns */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile(scene.image)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
            filter: "brightness(0.92) contrast(1.05)",
          }}
        />
        {/* Soft Vignette & Gradients */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(8, 14, 26, 0.45) 0%, rgba(0, 0, 0, 0.1) 40%, rgba(8, 14, 26, 0.88) 100%)",
          }}
        />
      </AbsoluteFill>

      {/* Floating Snow Effect */}
      <SnowOverlay />

      {/* Top Header Branding (Persistent) */}
      <div
        style={{
          position: "absolute",
          top: "60px",
          left: "50px",
          right: "50px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            background: "rgba(11, 19, 43, 0.65)",
            backdropFilter: "blur(12px)",
            padding: "10px 22px",
            borderRadius: "40px",
            border: "1px solid rgba(224, 169, 109, 0.35)",
            boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Img
            src={staticFile("images/logo.png")}
            style={{ width: "36px", height: "36px", objectFit: "contain" }}
          />
          <span
            style={{
              color: "#FFFFFF",
              fontSize: "24px",
              fontWeight: 800,
              letterSpacing: "1px",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            SAFAR SATHI
          </span>
        </div>

        <div
          style={{
            background: "rgba(224, 169, 109, 0.9)",
            color: "#1A1A1A",
            padding: "8px 18px",
            borderRadius: "30px",
            fontSize: "18px",
            fontWeight: 800,
            letterSpacing: "0.5px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            boxShadow: "0 4px 15px rgba(224, 169, 109, 0.4)",
          }}
        >
          📞 +91 83519 87587
        </div>
      </div>

      {/* Main Content Area */}
      {!isOutro ? (
        <div
          style={{
            position: "absolute",
            bottom: "160px",
            left: "40px",
            right: "40px",
            transform: `translateY(${(1 - cardSpring) * 40}px)`,
            opacity: cardSpring,
            zIndex: 10,
          }}
        >
          {/* Frosted Glassmorphism Card */}
          <div
            style={{
              background: "rgba(8, 14, 26, 0.78)",
              backdropFilter: "blur(20px)",
              padding: "36px 36px 32px 36px",
              borderRadius: "28px",
              border: "1.5px solid rgba(224, 169, 109, 0.4)",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.55)",
            }}
          >
            {/* Top Category Badge */}
            <div
              style={{
                display: "inline-block",
                padding: "8px 18px",
                borderRadius: "20px",
                background: "rgba(224, 169, 109, 0.18)",
                border: "1px solid rgba(224, 169, 109, 0.5)",
                color: "#FFD166",
                fontSize: "19px",
                fontWeight: 700,
                letterSpacing: "1px",
                marginBottom: "18px",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              {scene.badge}
            </div>

            {/* Main Headline (Typewriter effect) */}
            <h1
              style={{
                margin: "0 0 16px 0",
                fontSize: "44px",
                fontWeight: 800,
                lineHeight: 1.25,
                color: "#FFFFFF",
                fontFamily: "system-ui, -apple-system, sans-serif",
                textShadow: "0 2px 10px rgba(0,0,0,0.4)",
              }}
            >
              <TypewriterText text={scene.title} startFrame={5} charsPerFrame={1.1} />
            </h1>

            {/* Subtitle / Bullet Highlights */}
            <div
              style={{
                fontSize: "24px",
                color: "rgba(255, 255, 255, 0.88)",
                lineHeight: 1.4,
                fontWeight: 500,
                fontFamily: "system-ui, -apple-system, sans-serif",
                borderTop: "1px solid rgba(255, 255, 255, 0.12)",
                paddingTop: "14px",
              }}
            >
              {scene.subtitle}
            </div>
          </div>
        </div>
      ) : (
        /* Outro Conversion Card */
        <div
          style={{
            position: "absolute",
            top: "200px",
            bottom: "120px",
            left: "40px",
            right: "40px",
            transform: `scale(${interpolate(cardSpring, [0, 1], [0.92, 1])})`,
            opacity: cardSpring,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              background: "rgba(8, 14, 26, 0.88)",
              backdropFilter: "blur(24px)",
              padding: "48px 36px",
              borderRadius: "32px",
              border: "2px solid rgba(224, 169, 109, 0.6)",
              boxShadow: "0 25px 60px rgba(0, 0, 0, 0.65)",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Logo */}
            <Img
              src={staticFile("images/logo.png")}
              style={{
                width: "120px",
                height: "120px",
                objectFit: "contain",
                marginBottom: "18px",
                filter: "drop-shadow(0 8px 20px rgba(224, 169, 109, 0.3))",
              }}
            />

            <div
              style={{
                color: "#E0A96D",
                fontSize: "22px",
                fontWeight: 800,
                letterSpacing: "3px",
                textTransform: "uppercase",
                marginBottom: "8px",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              SAFAR SATHI TRAVELS
            </div>

            <h2
              style={{
                margin: "0 0 20px 0",
                fontSize: "48px",
                fontWeight: 900,
                color: "#FFFFFF",
                lineHeight: 1.2,
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              Shimla & Manali Tour Packages
            </h2>

            {/* Inclusions Pill Grid */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                justifyContent: "center",
                marginBottom: "32px",
              }}
            >
              {[
                "🚗 Dedicated Cab",
                "🏨 Mountain Stays",
                "🕯️ Candlelight Dinner",
                "🌹 Flower Bed Decor",
                "☕ Daily Breakfast & Dinner",
                "❄️ Solang Snow Tour",
              ].map((inc, idx) => (
                <div
                  key={idx}
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    color: "#FFFFFF",
                    fontSize: "18px",
                    fontWeight: 600,
                  }}
                >
                  {inc}
                </div>
              ))}
            </div>

            {/* Call To Action Button */}
            <div
              style={{
                background: "linear-gradient(135deg, #E0A96D 0%, #D48C46 100%)",
                color: "#111827",
                padding: "20px 36px",
                borderRadius: "40px",
                fontSize: "28px",
                fontWeight: 900,
                letterSpacing: "0.5px",
                boxShadow: "0 10px 30px rgba(224, 169, 109, 0.4)",
                marginBottom: "20px",
                width: "90%",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              BOOK YOUR DATES NOW
            </div>

            {/* Contact and Website Details */}
            <div
              style={{
                fontSize: "30px",
                fontWeight: 800,
                color: "#FFFFFF",
                marginBottom: "8px",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              📞 +91 83519 87587
            </div>

            <div
              style={{
                fontSize: "24px",
                fontWeight: 600,
                color: "#E0A96D",
                letterSpacing: "1px",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              🌐 safarsathi.in
            </div>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

// Main Composition with Audio and Sequential Scenes
export const SafarSathiHoneymoonReel: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#080E1A" }}>
      {/* Background Audio Track */}
      <Audio
        src={staticFile("audio/travel_bgm_30s.mp3")}
        volume={0.8}
        startFrom={0}
        endAt={TOTAL_DURATION_FRAMES}
      />

      {/* Scene Sequences */}
      {HONEYMOON_SCENES.map((scene, index) => {
        const fromFrame = HONEYMOON_SCENES.slice(0, index).reduce(
          (sum, s) => sum + s.durationInFrames,
          0
        );
        const isOutro = index === HONEYMOON_SCENES.length - 1;

        return (
          <Sequence
            key={scene.id}
            from={fromFrame}
            durationInFrames={scene.durationInFrames}
          >
            <SceneItem scene={scene} isOutro={isOutro} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

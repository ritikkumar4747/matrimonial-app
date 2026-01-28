import { useCallback } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticlesBackground() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <Particles
        init={particlesInit}
        options={{
          fullScreen: false,
          background: { color: "transparent" },
          particles: {
            number: {
              value: 40,
              density: { enable: true, area: 800 }
            },
            color: {
              value: ["#ec4899", "#a855f7"]
            },
            opacity: {
              value: 0.2
            },
            size: {
              value: 2
            },
            move: {
              enable: true,
              speed: 0.4
            },
            links: {
              enable: true,
              distance: 140,
              color: "#a855f7",
              opacity: 0.15,
              width: 1
            }
          },
          detectRetina: true
        }}
      />
    </div>
  );
}

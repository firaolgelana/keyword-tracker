"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function AnimatedParticlesBg() {
  const pathname = usePathname()
  const [particles, setParticles] = useState<Array<{ x: number; y: number; r: number; dur: number }>>([])

  // Define themes
  const themes = {
    home: {
      bgFrom: "#0b0f2f",
      bgTo: "#050617",
      particle: "rgba(120,140,255,0.25)" // Standard Blue/Purple
    },
    rankTracker: {
      bgFrom: "#0f1c2e", // Dark Slate
      bgTo: "#020617",   // Almost Black
      particle: "rgba(6, 182, 212, 0.2)" // Cyan/Teal
    },
    default: {
      bgFrom: "#0b0f2f",
      bgTo: "#050617",
      particle: "rgba(120,140,255,0.25)"
    }
  }

  // Select theme based on path
  const getTheme = () => {
    if (pathname === "/" || pathname === "/home") return themes.home
    if (pathname?.startsWith("/rank-tracker")) return themes.rankTracker
    return themes.default
  }

  const currentTheme = getTheme()

  useEffect(() => {
    // Re-generate particles on mount to ensure hydration match
    // ideally we might want stable particles but for bg it's fine
    const newParticles = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * 1000,
      y: Math.random() * 500,
      r: Math.random() * 6 + 2,
      dur: Math.random() * 10 + 10,
    }))
    setParticles(newParticles)
  }, []) // Empty deps = run once on mount

  return (
    <svg
      viewBox="0 0 1000 500"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full -z-10 pointer-events-none transition-colors duration-700 ease-in-out"
    >
      {/* Background */}
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor={currentTheme.bgFrom} className="transition-all duration-700" />
          <stop offset="100%" stopColor={currentTheme.bgTo} className="transition-all duration-700" />
        </radialGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#bg)" />

      {/* Particles */}
      {particles.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={p.r}
          fill={currentTheme.particle}
          className="transition-colors duration-700"
        >
          {/* Floating movement */}
          <animateTransform
            attributeName="transform"
            type="translate"
            from="0 0"
            to="0 -40"
            dur={`${p.dur}s`}
            repeatCount="indefinite"
            direction="alternate"
          />

          {/* Fade in/out */}
          <animate
            attributeName="opacity"
            from="0.2"
            to="0.6"
            dur={`${p.dur / 2}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  )
}

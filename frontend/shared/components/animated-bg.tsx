"use client"

import { useEffect, useState } from "react"

export default function AnimatedParticlesBg() {
  const [particles, setParticles] = useState<Array<{ x: number; y: number; r: number; dur: number }>>([])

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * 1000,
      y: Math.random() * 500,
      r: Math.random() * 6 + 2,
      dur: Math.random() * 10 + 10,
    }))
    setParticles(newParticles)
  }, [])

  return (
    <svg
      viewBox="0 0 1000 500"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full -z-10 pointer-events-none"
    >
      {/* Background */}
      <defs>
        <radialGradient id="bg" cx="50%" cy="50%" r="80%">
          <stop offset="0%" stopColor="#0b0f2f" />
          <stop offset="100%" stopColor="#050617" />
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
          fill="rgba(120,140,255,0.25)"
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

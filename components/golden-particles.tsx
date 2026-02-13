"use client"

import { useEffect, useRef } from "react"

export function GoldenParticles() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const particles: HTMLDivElement[] = []
    const count = 30

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div")
      particle.className = "golden-particle"
      particle.style.left = `${Math.random() * 100}%`
      particle.style.animationDuration = `${8 + Math.random() * 12}s`
      particle.style.animationDelay = `${Math.random() * 10}s`
      particle.style.width = `${2 + Math.random() * 3}px`
      particle.style.height = particle.style.width
      particle.style.opacity = `${0.3 + Math.random() * 0.5}`
      container.appendChild(particle)
      particles.push(particle)
    }

    return () => {
      particles.forEach((p) => p.remove())
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  )
}

"use client"

import Image from "next/image"

interface HSEMLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  animated?: boolean
  className?: string
}

const sizeMap = {
  sm: { width: 40, height: 40 },
  md: { width: 60, height: 60 },
  lg: { width: 100, height: 100 },
  xl: { width: 160, height: 160 },
}

export function HSEMLogo({ size = "md", animated = true, className = "" }: HSEMLogoProps) {
  const dimensions = sizeMap[size]

  return (
    <div
      className={`relative inline-flex items-center ${animated ? "animate-logo-entrance" : ""} ${className}`}
    >
      <Image
        src="/images/hsem-logo.jpg"
        alt="HoteliaSEM - Logo HSEM"
        width={dimensions.width}
        height={dimensions.height}
        className="rounded-full object-cover"
        priority
      />
      {animated && (
        <div
          className="absolute inset-0 rounded-full animate-pulse-glow"
          aria-hidden="true"
        />
      )}
    </div>
  )
}

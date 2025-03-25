"use client"

import { useEffect, useRef } from "react"

export default function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const devicePixelRatio = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * devicePixelRatio
      canvas.height = rect.height * devicePixelRatio
      ctx.scale(devicePixelRatio, devicePixelRatio)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Globe parameters
    const width = canvas.width
    const height = canvas.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) * 0.4

    // Points on the globe
    const points = []
    for (let i = 0; i < 200; i++) {
      const lat = Math.random() * Math.PI - Math.PI / 2
      const lng = Math.random() * Math.PI * 2
      points.push({ lat, lng })
    }

    // Animation variables
    let rotation = 0
    const rotationSpeed = 0.005

    // Draw function
    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw globe outline
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(100, 100, 255, 0.2)"
      ctx.stroke()

      // Draw grid lines (meridians)
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + rotation
        ctx.beginPath()
        ctx.ellipse(centerX, centerY, radius, radius * Math.abs(Math.cos(angle)), 0, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(100, 100, 255, 0.1)"
        ctx.stroke()
      }

      // Draw grid lines (parallels)
      for (let i = 1; i < 6; i++) {
        const r = radius * (i / 6)
        ctx.beginPath()
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(100, 100, 255, 0.1)"
        ctx.stroke()
      }

      // Draw points
      points.forEach((point) => {
        const lng = point.lng + rotation
        const x = centerX + radius * Math.cos(point.lat) * Math.sin(lng)
        const y = centerY - radius * Math.sin(point.lat)
        const z = Math.cos(point.lat) * Math.cos(lng)

        // Only draw points on the visible side of the globe
        if (z > 0) {
          const size = 2 + z * 2
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(100, 100, 255, ${0.3 + z * 0.5})`
          ctx.fill()
        }
      })

      // Update rotation
      rotation += rotationSpeed

      // Request next frame
      requestAnimationFrame(draw)
    }

    // Start animation
    draw()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
}


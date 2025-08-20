"use client"

import { useEffect, useRef } from "react"

interface Star {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  trail: { x: number; y: number; opacity: number }[]
}

export function StarfallBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createStar = (): Star => ({
      x: Math.random() * canvas.width,
      y: -10,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      trail: [],
    })

    const initStars = () => {
      starsRef.current = []
      for (let i = 0; i < 50; i++) {
        const star = createStar()
        star.y = Math.random() * canvas.height
        starsRef.current.push(star)
      }
    }

    const updateStars = () => {
      starsRef.current.forEach((star, index) => {
        // Add current position to trail
        star.trail.push({ x: star.x, y: star.y, opacity: star.opacity })

        // Limit trail length
        if (star.trail.length > 15) {
          star.trail.shift()
        }

        // Update position
        star.y += star.speed
        star.x += Math.sin(star.y * 0.01) * 0.5

        // Reset star when it goes off screen
        if (star.y > canvas.height + 10) {
          starsRef.current[index] = createStar()
        }
      })

      // Occasionally add new stars
      if (Math.random() < 0.02 && starsRef.current.length < 80) {
        starsRef.current.push(createStar())
      }
    }

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      starsRef.current.forEach((star) => {
        // Draw trail
        star.trail.forEach((point, index) => {
          const trailOpacity = point.opacity * (index / star.trail.length) * 0.3
          ctx.fillStyle = `rgba(147, 197, 253, ${trailOpacity})`
          ctx.beginPath()
          ctx.arc(point.x, point.y, star.size * 0.5, 0, Math.PI * 2)
          ctx.fill()
        })

        // Draw main star
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 2)
        gradient.addColorStop(0, `rgba(147, 197, 253, ${star.opacity})`)
        gradient.addColorStop(0.5, `rgba(147, 197, 253, ${star.opacity * 0.5})`)
        gradient.addColorStop(1, "rgba(147, 197, 253, 0)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2)
        ctx.fill()

        // Draw bright center
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.8})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const animate = () => {
      updateStars()
      drawStars()
      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    initStars()
    animate()

    window.addEventListener("resize", resizeCanvas)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ background: "transparent" }} />
  )
}

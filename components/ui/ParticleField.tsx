// components/ui/ParticleField.tsx
"use client"

import { useRef, useState, useEffect } from "react"
import { useReducedMotion } from "framer-motion"

type Particle = {
  x: number
  y: number
  originalX: number // Original grid position X
  originalY: number // Original grid position Y
  size: number
  opacity: number
  targetOpacity: number // Target opacity to animate towards
  velocity: { x: number, y: number } // Velocity vector for smoother movement
  color: string
  shape: "circle" | "star" | "dot"
  glowing: boolean
}

interface ParticleFieldProps {
  count?: number
  speed?: number 
  density?: "low" | "medium" | "high"
  colors?: string[]
  interactive?: boolean
  interactionStrength?: number
  className?: string
  gridBased?: boolean // New option to use grid-based particles
}

export default function ParticleField({
  count = 100,
  speed = 0.5,
  density = "medium",
  colors = ["#ffffff", "#e2e8f0", "#94a3b8"],
  interactive = true,
  interactionStrength = 1,
  className = "",
  gridBased = true, // Default to grid-based for dark mode
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const lastFrameTimeRef = useRef<number>(0)
  const animationActiveRef = useRef<boolean>(true)

  // Initialize particles
  useEffect(() => {
    if (prefersReducedMotion) return

    const initializeParticles = () => {
      const newParticles: Particle[] = []
      
      if (gridBased) {
        // Create grid-based particles at intersections
        const { width, height } = canvasSize
        
        // Calculate grid size based on density
        const gridMultiplier = density === "low" ? 1.5 : density === "high" ? 0.6 : 1
        const cellSize = Math.floor(50 * gridMultiplier)
        
        // Calculate rows and columns
        const cols = Math.floor(width / cellSize)
        const rows = Math.floor(height / cellSize)
        
        for (let i = 0; i <= cols; i++) {
          for (let j = 0; j <= rows; j++) {
            const x = i * cellSize
            const y = j * cellSize
            
            // Add minimal randomness to grid positions (reduced from previous)
            const offsetX = Math.random() * 3 - 1.5
            const offsetY = Math.random() * 3 - 1.5
            
            // Create different types of particles
            const type = Math.random()
            const shape = type < 0.75 ? "dot" : type < 0.95 ? "circle" : "star"
            const glowing = Math.random() < 0.15
            
            // Base opacity depends on particle type
            const baseOpacity = shape === "star" ? 0.6 : 
                              shape === "circle" ? 0.3 : 0.2
            
            newParticles.push({
              x: x + offsetX,
              y: y + offsetY,
              originalX: x,
              originalY: y,
              size: shape === "dot" ? Math.random() * 1.2 + 0.5 :
                    shape === "circle" ? Math.random() * 1.8 + 1 :
                    Math.random() * 2 + 1,
              opacity: baseOpacity,
              targetOpacity: baseOpacity,
              velocity: { x: 0, y: 0 }, // Start with zero velocity
              color: colors[Math.floor(Math.random() * colors.length)],
              shape,
              glowing
            })
          }
        }
      } else {
        // Original random particle distribution
        const adjustedCount = getAdjustedCount()
        
        for (let i = 0; i < adjustedCount; i++) {
          const type = Math.random()
          const shape = type < 0.7 ? "dot" : type < 0.9 ? "circle" : "star"
          const glowing = Math.random() < 0.2
          
          const x = Math.random() * canvasSize.width
          const y = Math.random() * canvasSize.height
          const baseOpacity = shape === "star" ? 0.6 : shape === "circle" ? 0.3 : 0.2
          
          newParticles.push({
            x,
            y,
            originalX: x,
            originalY: y,
            size: shape === "dot" ? Math.random() * 1.5 + 0.5 :
                  shape === "circle" ? Math.random() * 2 + 1 :
                  Math.random() * 2 + 1,
            opacity: baseOpacity,
            targetOpacity: baseOpacity,
            velocity: { 
              x: (Math.random() - 0.5) * speed * 0.05, // Further reduced initial velocity
              y: (Math.random() - 0.5) * speed * 0.05 
            },
            color: colors[Math.floor(Math.random() * colors.length)],
            shape,
            glowing
          })
        }
      }
      
      particlesRef.current = newParticles
    }

    // Determine actual count based on density and screen size
    const getAdjustedCount = () => {
      const baseCount = count
      const multiplier = density === "low" ? 0.5 : density === "high" ? 2 : 1
      
      // Adjust for screen size
      const screenFactor = Math.min(window.innerWidth, window.innerHeight) / 1000
      return Math.floor(baseCount * multiplier * screenFactor) + 20 // Minimum of 20 particles
    }

    // Update canvas size and initialize
    const updateSize = () => {
      if (!canvasRef.current) return
      
      const canvas = canvasRef.current
      const parent = canvas.parentElement

      if (parent) {
        const { width, height } = parent.getBoundingClientRect()
        canvas.width = width
        canvas.height = height
        setCanvasSize({ width, height })
      }
    }

    updateSize()
    
    // Only initialize after canvas size is set
    if (canvasSize.width > 0 && canvasSize.height > 0) {
      initializeParticles()
    }

    const resizeHandler = () => {
      updateSize()
      // Re-initialize particles after a brief delay to ensure canvas size is updated
      setTimeout(initializeParticles, 100)
    }

    window.addEventListener('resize', resizeHandler)
    return () => window.removeEventListener('resize', resizeHandler)
  }, [count, density, colors, prefersReducedMotion, speed, canvasSize.width, canvasSize.height, gridBased])

  // Mouse event handlers
  useEffect(() => {
    if (!interactive || prefersReducedMotion) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return
      
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      }
    }

    const handleMouseLeave = () => {
      // Instead of setting active to false, just move cursor out of view
      // This keeps the animation running even when cursor is outside
      mouseRef.current = {
        x: -1000, // Position far outside the canvas
        y: -1000,
        active: true // Keep active so animation continues to run
      }
    }

    // Initial mouse position (off-screen)
    mouseRef.current = {
      x: -1000,
      y: -1000,
      active: true // Always keep active
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    
    // Enable smooth visibility transitions when tab/window is not active
    const handleVisibilityChange = () => {
      animationActiveRef.current = !document.hidden;
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [interactive, prefersReducedMotion])

  // Animation logic with delta time caps to prevent speed issues
  useEffect(() => {
    if (prefersReducedMotion || !canvasRef.current) return

    const drawParticles = (timestamp: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      
      // If tab is not active, use minimal animation
      if (!animationActiveRef.current) {
        animationRef.current = requestAnimationFrame(drawParticles)
        return
      }
      
      // Calculate delta time for smooth animations regardless of frame rate
      let deltaTime = timestamp - lastFrameTimeRef.current || 16.67 // Default to ~60fps
      
      // Cap delta time to prevent huge jumps if the tab was inactive
      deltaTime = Math.min(deltaTime, 50) // Cap at 50ms (20fps minimum)
      
      lastFrameTimeRef.current = timestamp
      const timeMultiplier = Math.min(deltaTime / 16.67, 3) // Normalize to expected 60fps, with a cap
      
      // Clear canvas 
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update and draw particles
      particlesRef.current.forEach(particle => {
        // Mouse interaction - smoother, more controlled repulsion
        const mouseX = mouseRef.current.x
        const mouseY = mouseRef.current.y
        
        const dx = mouseX - particle.x
        const dy = mouseY - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        // Configure repulsion parameters for a more professional look
        const interactionRadius = 120 // Smaller radius for more focused effect
        const maxRepulsionDistance = 40 // Maximum distance particles will move from origin
        const returnForce = 0.03 * timeMultiplier // Stronger return force for snappier animation
        const repulsionStrength = 0.02 * interactionStrength * timeMultiplier // Decreased for gentler effect
        
        // Particles repel from mouse cursor with a smooth falloff
        if (distance < interactionRadius) {
          // Calculate repulsion strength with smooth falloff
          const repulsionFactor = (1 - distance / interactionRadius) * repulsionStrength
          
          // Push particles away from cursor with a vector approach
          if (distance > 0) { // Prevent division by zero
            // Calculate repulsion vector
            const repulsionX = (dx / distance) * repulsionFactor
            const repulsionY = (dy / distance) * repulsionFactor
            
            // Apply repulsion to velocity
            particle.velocity.x -= repulsionX
            particle.velocity.y -= repulsionY
            
            // Increase opacity when affected by mouse
            particle.targetOpacity = Math.min(0.9, particle.shape === "star" ? 0.8 : 0.6)
          }
        } else {
          // Reset target opacity when not influenced by mouse
          particle.targetOpacity = particle.shape === "star" ? 0.6 : 
                                  particle.shape === "circle" ? 0.3 : 0.2
        }
        
        // Gradually animate to target opacity for smoother transitions
        particle.opacity += (particle.targetOpacity - particle.opacity) * 0.1 * timeMultiplier
        
        // Apply velocity limits for more controlled movement
        const maxVelocity = 1.2 // Lower maximum velocity
        const currentSpeed = Math.sqrt(
          particle.velocity.x * particle.velocity.x + 
          particle.velocity.y * particle.velocity.y
        )
        
        if (currentSpeed > maxVelocity) {
          particle.velocity.x = (particle.velocity.x / currentSpeed) * maxVelocity
          particle.velocity.y = (particle.velocity.y / currentSpeed) * maxVelocity
        }
        
        // Update particle position with controlled multiplier
        particle.x += particle.velocity.x
        particle.y += particle.velocity.y
        
        // Calculate distance from original position
        const homeX = particle.originalX - particle.x
        const homeY = particle.originalY - particle.y
        const homeDistance = Math.sqrt(homeX * homeX + homeY * homeY)
        
        // Prevent particles from moving too far from their original position
        if (homeDistance > maxRepulsionDistance) {
          // Strong return force when too far
          particle.x += homeX * 0.1
          particle.y += homeY * 0.1
        } else {
          // Regular spring force return to original position
          particle.velocity.x += homeX * returnForce
          particle.velocity.y += homeY * returnForce
        }
        
        // Apply stronger velocity damping for stability
        particle.velocity.x *= 0.9
        particle.velocity.y *= 0.9
        
        // Draw particle with enhanced visual effects
        ctx.save()
        
        // Enhanced glow effect
        if (particle.glowing) {
          ctx.shadowBlur = particle.size * (2 + Math.sin(timestamp / 1000) * 0.5) // Pulsing glow
          ctx.shadowColor = particle.color
        }
        
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        
        if (particle.shape === "circle") {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (particle.shape === "star") {
          drawStar(ctx, particle.x, particle.y, 5, particle.size, particle.size/2)
        } else { // dot
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()
        }
        
        ctx.restore()
      })
      
      animationRef.current = requestAnimationFrame(drawParticles)
    }
    
    // Helper function to draw stars
    function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, spikes: number, outerRadius: number, innerRadius: number) {
      let rot = Math.PI / 2 * 3
      let step = Math.PI / spikes
      
      ctx.beginPath()
      ctx.moveTo(x, y - outerRadius)
      
      for (let i = 0; i < spikes; i++) {
        ctx.lineTo(x + Math.cos(rot) * outerRadius, y + Math.sin(rot) * outerRadius)
        rot += step
        ctx.lineTo(x + Math.cos(rot) * innerRadius, y + Math.sin(rot) * innerRadius)
        rot += step
      }
      
      ctx.lineTo(x, y - outerRadius)
      ctx.closePath()
      ctx.fill()
    }
    
    // Start animation
    animationRef.current = requestAnimationFrame(drawParticles)
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [prefersReducedMotion, interactive, interactionStrength, gridBased])

  if (prefersReducedMotion) return null

  return (
    <canvas 
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ opacity: 0.8 }}
    />
  )
}
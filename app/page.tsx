"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import dynamic from "next/dynamic"
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion"

import HeroSection from "@/components/home/HeroSection"

// Dynamic imports with proper loading strategies
const BentoGridSection = dynamic(() => import("@/components/home/BentoGridSection"), { 
  ssr: false,
  loading: () => <div className="h-96 flex items-center justify-center bg-slate-50/20 dark:bg-slate-900/20 backdrop-blur rounded-lg" />
})
const HowItWorksSection = dynamic(() => import("@/components/home/HowItWorksSection"), { ssr: false })
const FeaturesSection = dynamic(() => import("@/components/home/FeaturesSection"), { ssr: false })
const NotificationsSection = dynamic(() => import("@/components/home/NotificationsSection"), { ssr: false })
const TestimonialsSection = dynamic(() => import("@/components/home/TestimonialsSection"), { ssr: false })
const CtaSection = dynamic(() => import("@/components/home/CtaSection"), { ssr: false })

// Enhanced animated background component with professional grid/subtle animations
const AnimatedBackground = () => {
  const prefersReducedMotion = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const gridDotsRef = useRef<Array<{
    x: number
    y: number
    opacity: number
    baseOpacity: number
    pulsePhase: number
  }>>([])
  
  const [isDark, setIsDark] = useState(false)

  // Check theme
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'))
    }
    
    checkTheme()
    
    // Watch for theme changes
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  // Initialize grid dots
  const initializeGridDots = useCallback((canvas: HTMLCanvasElement) => {
    const dots: typeof gridDotsRef.current = []
    const gridSize = 60
    const cols = Math.ceil(canvas.width / gridSize)
    const rows = Math.ceil(canvas.height / gridSize)
    
    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        const x = i * gridSize
        const y = j * gridSize
        const baseOpacity = Math.random() * 0.15 + 0.05
        dots.push({
          x,
          y,
          opacity: baseOpacity,
          baseOpacity,
          pulsePhase: Math.random() * Math.PI * 2
        })
      }
    }
    
    gridDotsRef.current = dots
  }, [])

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      }
    }
  }, [])

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (isDark) {
      // Professional dot grid for dark theme
      const mouse = mouseRef.current
      const time = Date.now() * 0.001
      const interactionRadius = 120

      gridDotsRef.current.forEach(dot => {
        // Calculate distance from mouse
        const dx = dot.x - mouse.x
        const dy = dot.y - mouse.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Base opacity with subtle pulse
        let opacity = dot.baseOpacity + Math.sin(time * 0.5 + dot.pulsePhase) * 0.02

        // Mouse interaction - subtle glow effect
        if (distance < interactionRadius) {
          const influence = 1 - (distance / interactionRadius)
          opacity += influence * 0.2
        }

        dot.opacity = Math.min(opacity, 0.3)

        // Draw dot
        ctx.save()
        ctx.globalAlpha = dot.opacity
        ctx.fillStyle = '#e2e8f0'
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2)
        ctx.fill()
        
        // Add very subtle connection lines to nearby dots
        if (distance < interactionRadius && distance > 0) {
          gridDotsRef.current.forEach(otherDot => {
            if (otherDot === dot) return
            
            const dx2 = otherDot.x - dot.x
            const dy2 = otherDot.y - dot.y
            const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2)
            
            if (distance2 < 80 && distance2 > 0) {
              const lineOpacity = (1 - distance2 / 80) * 0.05 * (1 - distance / interactionRadius)
              ctx.globalAlpha = lineOpacity
              ctx.strokeStyle = '#e2e8f0'
              ctx.lineWidth = 0.5
              ctx.beginPath()
              ctx.moveTo(dot.x, dot.y)
              ctx.lineTo(otherDot.x, otherDot.y)
              ctx.stroke()
            }
          })
        }
        
        ctx.restore()
      })
    } else {
      // Minimal grid for light theme
      const gridSize = 60
      ctx.strokeStyle = '#e2e8f0'
      ctx.lineWidth = 0.3
      ctx.globalAlpha = 0.2

      // Draw subtle grid lines
      for (let i = 0; i <= canvas.width; i += gridSize) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, canvas.height)
        ctx.stroke()
      }

      for (let j = 0; j <= canvas.height; j += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, j)
        ctx.lineTo(canvas.width, j)
        ctx.stroke()
      }

      // Add intersection dots
      ctx.fillStyle = '#cbd5e1'
      ctx.globalAlpha = 0.1
      for (let i = 0; i <= canvas.width; i += gridSize) {
        for (let j = 0; j <= canvas.height; j += gridSize) {
          ctx.beginPath()
          ctx.arc(i, j, 1, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    if (!prefersReducedMotion) {
      animationRef.current = requestAnimationFrame(animate)
    }
  }, [isDark, prefersReducedMotion])

  // Setup canvas and event listeners
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initializeGridDots(canvas)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('mousemove', handleMouseMove)

    // Start animation
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate, initializeGridDots, handleMouseMove])

  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className={`w-full h-full ${isDark ? 'opacity-10' : 'opacity-20'}`}
          style={{
            backgroundImage: isDark 
              ? `radial-gradient(circle at 25px 25px, #e2e8f0 1px, transparent 1px)`
              : `
                linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
              `,
            backgroundSize: isDark ? '60px 60px' : '60px 60px'
          }}
        />
      </div>
    )
  }
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  )
}

// Improved intersection observer section for smoother loading
function LazySection({ children, id, priority = false }: any) {
  const [isVisible, setIsVisible] = useState(priority)
  const [hasIntersected, setHasIntersected] = useState(false)

  useEffect(() => {
    // Skip for SSR or if already visible
    if (typeof window === 'undefined' || isVisible) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasIntersected) {
          // Add small delay for smoother appearance
          setTimeout(() => setIsVisible(true), 100)
          setHasIntersected(true)
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '200px 0px', threshold: 0.05 }
    )

    const element = document.getElementById(id)
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [id, isVisible, hasIntersected])

  return (
    <section id={id} className="relative">
      {isVisible ? children : <div className="min-h-[200px] flex items-center justify-center" />}
    </section>
  )
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {mounted ? (
        <LazyMotion features={domAnimation} strict>
          {/* Updated background to match the professional black theme */}
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
            <AnimatedBackground />

            {/* Main Content with optimized flow */}
            <div className="relative z-10">
              {/* Above the fold content */}
              <HeroSection />

              {/* Strategically ordered sections */}
              <div className="space-y-16 md:space-y-24">
                <LazySection id="bento" priority={true}>
                  <BentoGridSection />
                </LazySection>

                <LazySection id="how-it-works">
                  <HowItWorksSection />
                </LazySection>

                <LazySection id="features">
                  <FeaturesSection />
                </LazySection>

                <LazySection id="notifications">
                  <NotificationsSection />
                </LazySection>

                <LazySection id="cta">
                  <CtaSection />
                </LazySection>
              </div>
            </div>
          </div>
        </LazyMotion>
      ) : (
        /* Improved initial loading state with consistent background */
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300">
          <div className="relative z-10">
            <HeroSection />
            <div className="space-y-16 md:space-y-24">
              <section id="bento" className="min-h-[300px] flex items-center justify-center"></section>
              <section id="how-it-works" className="min-h-[200px]"></section>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
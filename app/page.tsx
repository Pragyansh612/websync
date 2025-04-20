"use client"

import type React from "react"

import { useRef } from "react"
import { LazyMotion, domAnimation, m } from "framer-motion"
import { useInView, useReducedMotion } from "framer-motion"

import HeroSection from "@/components/home/HeroSection"
import NotificationsSection from "@/components/home/NotificationsSection"
import FeaturesSection from "@/components/home/FeaturesSection"
import HowItWorksSection from "@/components/home/HowItWorksSection"
import BenefitsSection from "@/components/home/BenefitsSection"
import CtaSection from "@/components/home/CtaSection"
import BentoGridSection from "@/components/home/BentoGridSection"
import TestimonialsSection from "@/components/home/TestimonialsSection"

interface AnimatedSectionProps {
  children: React.ReactNode
  id: string
}

const AnimatedBackground = () => {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {!prefersReducedMotion && (
        <>
          <m.div
            className="absolute top-[5%] right-[5%] w-[40%] h-[40%] rounded-full bg-slate-400/5 dark:bg-slate-500/5 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <m.div
            className="absolute bottom-[10%] left-[5%] w-[30%] h-[30%] rounded-full bg-slate-400/5 dark:bg-slate-500/5 blur-3xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </>
      )}
    </div>
  )
}

const AnimatedSection = ({ children, id }: AnimatedSectionProps) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { amount: 0.1, once: true })

  return (
    <section ref={ref} id={id} className="relative">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </m.div>
    </section>
  )
}

export default function Home() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <LazyMotion features={domAnimation}>
      <div className="flex flex-col min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        {/* Optimized background elements */}
        <AnimatedBackground />

        {/* Main Content with optimized spacing */}
        <div className="relative z-10">
          <HeroSection />

          <div className="space-y-12 md:space-y-16 lg:space-y-20">
            <AnimatedSection id="bento">
              <BentoGridSection />
            </AnimatedSection>

            <AnimatedSection id="how-it-works">
              <HowItWorksSection />
            </AnimatedSection>

            <AnimatedSection id="features">
              <FeaturesSection />
            </AnimatedSection>

            <AnimatedSection id="notifications">
              <NotificationsSection />
            </AnimatedSection>

            <AnimatedSection id="testimonials">
              <TestimonialsSection />
            </AnimatedSection>

            <AnimatedSection id="benefits">
              <BenefitsSection />
            </AnimatedSection>

            <AnimatedSection id="cta">
              <CtaSection />
            </AnimatedSection>
          </div>
        </div>
      </div>
    </LazyMotion>
  )
}

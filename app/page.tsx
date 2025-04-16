"use client"

import { motion } from "framer-motion"

import HeroSection from "@/components/home/HeroSection"
import NotificationsSection from "@/components/home/NotificationsSection"
import FeaturesSection from "@/components/home/FeaturesSection"
import HowItWorksSection from "@/components/home/HowItWorksSection"
import BenefitsSection from "@/components/home/BenefitsSection"
import CtaSection from "@/components/home/CtaSection"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-950 dark:to-blue-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          className="absolute top-[5%] right-[5%] w-[40%] h-[40%] rounded-full bg-blue-400/10 dark:bg-blue-500/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-[10%] left-[5%] w-[30%] h-[30%] rounded-full bg-indigo-400/10 dark:bg-indigo-500/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-[40%] left-[15%] w-[25%] h-[25%] rounded-full bg-purple-400/5 dark:bg-purple-500/10 blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <HeroSection />
        <NotificationsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <BenefitsSection />
        <CtaSection />
      </div>
    </div>
  )
}
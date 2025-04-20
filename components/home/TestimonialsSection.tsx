"use client"

import { useRef } from "react"
import { m, useInView } from "framer-motion"
import Image from "next/image"
import { Star } from "lucide-react"

export default function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CTO, TechFront",
      content:
        "WebSync has transformed how we monitor our web applications. The AI-powered insights have helped us reduce downtime by 78% and improve our response time to critical issues.",
      avatar: "/placeholder.svg?height=80&width=80",
      stars: 5,
    },
    {
      name: "Michael Chen",
      role: "Lead Developer, Stackify",
      content:
        "I've tried many monitoring tools, but WebSync stands out with its intuitive interface and proactive alerts. It's like having an extra team member watching our sites 24/7.",
      avatar: "/placeholder.svg?height=80&width=80",
      stars: 5,
    },
    {
      name: "Emily Rodriguez",
      role: "DevOps Engineer, CloudNative",
      content:
        "The detailed analytics and custom alert options have been game-changers for our team. We can now identify and fix issues before they impact our users.",
      avatar: "/placeholder.svg?height=80&width=80",
      stars: 4,
    },
  ]

  // Animation variants
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <section className="w-full py-20 md:py-28 relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/50" ref={ref}>
      <div className="container px-4 md:px-6 mx-auto">
        <m.div
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-2 max-w-[800px]">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What our customers say</h2>
            <p className="text-slate-600 dark:text-slate-400 md:text-xl/relaxed">
              Join thousands of satisfied teams who trust WebSync for their monitoring needs
            </p>
          </div>
        </m.div>

        <m.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerAnimation}
        >
          {testimonials.map((testimonial, index) => (
            <m.div
              key={index}
              className="relative group"
              variants={itemAnimation}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="h-full premium-glass-card rounded-2xl p-6 flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.stars ? "text-yellow-500 fill-yellow-500" : "text-slate-300 dark:text-slate-700"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm italic flex-grow">"{testimonial.content}"</p>
              </div>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
  )
}

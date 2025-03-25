"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const headerRef = useRef(null)
  const plansRef = useRef(null)
  const faqRef = useRef(null)

  const headerInView = useInView(headerRef, { once: true, amount: 0.3 })
  const plansInView = useInView(plansRef, { once: true, amount: 0.2 })
  const faqInView = useInView(faqRef, { once: true, amount: 0.2 })

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
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const plans = [
    {
      name: "Free",
      description: "Perfect for personal projects and small websites",
      price: {
        monthly: "$0",
        yearly: "$0",
      },
      features: [
        "3 websites monitoring",
        "5-minute check intervals",
        "24 hours data retention",
        "Email notifications",
        "Basic uptime reports",
        "Community support",
      ],
      popular: false,
      badge: "Forever Free",
    },
    {
      name: "Pro",
      description: "Ideal for professionals and small businesses",
      price: {
        monthly: "$19",
        yearly: "$190",
      },
      features: [
        "10 websites monitoring",
        "1-minute check intervals",
        "30 days data retention",
        "Email & SMS notifications",
        "Advanced performance analytics",
        "API access",
        "Priority support",
      ],
      popular: true,
      badge: "Most Popular",
    },
    {
      name: "Business",
      description: "For growing businesses with multiple websites",
      price: {
        monthly: "$49",
        yearly: "$490",
      },
      features: [
        "25 websites monitoring",
        "30-second check intervals",
        "90 days data retention",
        "All notification channels",
        "Custom reporting",
        "Team access",
        "API access",
        "24/7 priority support",
      ],
      popular: false,
      badge: null,
    },
    {
      name: "Enterprise",
      description: "Custom solutions for large organizations",
      price: {
        monthly: "Custom",
        yearly: "Custom",
      },
      features: [
        "Unlimited websites monitoring",
        "Custom check intervals",
        "1 year data retention",
        "Custom integrations",
        "Dedicated account manager",
        "SLA guarantees",
        "On-premise deployment option",
        "24/7 premium support",
      ],
      popular: false,
      badge: "Contact Sales",
    },
  ]

  const faqs = [
    {
      question: "Can I try WebSync before committing to a paid plan?",
      answer:
        "Yes! WebSync offers a forever-free plan with no credit card required. You can monitor up to 3 websites and experience the core features before deciding to upgrade.",
    },
    {
      question: "How does the billing cycle work?",
      answer:
        "You can choose between monthly or annual billing. Annual billing offers a 20% discount compared to paying monthly.",
    },
    {
      question: "Can I upgrade or downgrade my plan later?",
      answer:
        "Absolutely. You can upgrade your plan at any time, and the new features will be immediately available. If you downgrade, the changes will take effect at the start of your next billing cycle.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for annual Enterprise plans.",
    },
    {
      question: "Is there a refund policy?",
      answer:
        "Yes, we offer a 14-day money-back guarantee for all paid plans. If you're not satisfied with our service, contact our support team within 14 days of your purchase for a full refund.",
    },
    {
      question: "What's included in the Enterprise plan?",
      answer:
        "The Enterprise plan is customized to your organization's specific needs. It includes unlimited website monitoring, custom check intervals, extended data retention, dedicated support, and optional on-premise deployment.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-hero overflow-hidden" ref={headerRef}>
        <div className="container px-4 md:px-6 relative">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              className="absolute -top-[30%] -right-[10%] w-[80%] h-[80%] rounded-full bg-primary/5 blur-3xl"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.7, 0.5],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 10,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </div>

          <motion.div
            className="flex flex-col items-center justify-center text-center space-y-4 relative"
            variants={containerAnimation}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemAnimation}>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Simple, Transparent <span className="gradient-text">Pricing</span>
              </h1>
            </motion.div>
            <motion.p className="max-w-[700px] text-muted-foreground md:text-xl" variants={itemAnimation}>
              Choose the perfect plan for your website monitoring needs. All plans include our core AI-powered
              monitoring features.
            </motion.p>
            <motion.div
              className="flex items-center space-x-2 bg-muted/50 p-1 rounded-lg mt-6"
              variants={itemAnimation}
            >
              <button
                className={`px-4 py-2 rounded-md transition-all ${
                  billingCycle === "monthly"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setBillingCycle("monthly")}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 rounded-md transition-all ${
                  billingCycle === "yearly"
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setBillingCycle("yearly")}
              >
                Yearly <span className="text-xs text-primary">Save 20%</span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="w-full py-12 md:py-24 bg-muted/30 dark:bg-muted/10 relative overflow-hidden" ref={plansRef}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-[10%] right-[5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 12,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl"
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        <div className="container px-4 md:px-6 relative">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate={plansInView ? "visible" : "hidden"}
            variants={containerAnimation}
          >
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                variants={itemAnimation}
                className={`${plan.popular ? "lg:-mt-4 lg:mb-4" : ""}`}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.2 },
                }}
              >
                <Card
                  className={`h-full card-hover-enhanced glass-card overflow-hidden ${
                    plan.popular ? "border-primary/40 shadow-lg shadow-primary/10" : "border-border/40"
                  }`}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className={plan.popular ? "gradient-text" : ""}>{plan.name}</CardTitle>
                        <CardDescription className="mt-1">{plan.description}</CardDescription>
                      </div>
                      {plan.badge && (
                        <Badge
                          className={`${
                            plan.popular
                              ? "bg-primary/20 text-primary hover:bg-primary/30"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {plan.badge}
                        </Badge>
                      )}
                    </div>
                    <div className="mt-4">
                      <span className="text-3xl font-bold">{plan.price[billingCycle]}</span>
                      {plan.price[billingCycle] !== "Custom" && plan.price[billingCycle] !== "$0" && (
                        <span className="text-muted-foreground ml-1">
                          /{billingCycle === "monthly" ? "month" : "year"}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full h-10"></div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-12 md:py-24 relative overflow-hidden" ref={faqRef}>
        <div className="container px-4 md:px-6 relative">
          <motion.div
            className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={faqInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Frequently Asked Questions</h2>
            <p className="text-muted-foreground md:text-lg max-w-[700px]">
              Find answers to common questions about our pricing and plans
            </p>
          </motion.div>

          <motion.div
            className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto"
            initial="hidden"
            animate={faqInView ? "visible" : "hidden"}
            variants={containerAnimation}
          >
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemAnimation} className="card-hover-enhanced glass-card">
                <Card className="h-full border-0 bg-transparent">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}


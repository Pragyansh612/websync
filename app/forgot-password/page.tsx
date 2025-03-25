"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Mail, CheckCircle2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const formRef = useRef(null)
  const formInView = useInView(formRef, { once: true, amount: 0.3 })
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid")
      return
    }

    setError("")
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      toast({
        title: "Reset Link Sent",
        description: "Check your email for instructions to reset your password.",
        duration: 5000,
      })
    }, 1500)
  }

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

  return (
    <div className="container max-w-md py-10 px-4 md:px-6">
      <div className="mb-8">
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2 transition-colors"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Login
        </Link>
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Reset Password</h1>
        <p className="text-muted-foreground">Enter your email to receive a password reset link</p>
      </div>

      <motion.div
        ref={formRef}
        initial="hidden"
        animate={formInView ? "visible" : "hidden"}
        variants={containerAnimation}
      >
        <Card className="enhanced-glass-card enhanced-gradient-border">
          <CardHeader className="space-y-1">
            <motion.div variants={itemAnimation}>
              <CardTitle className="text-2xl">Forgot Password</CardTitle>
              <CardDescription className="text-base">
                We'll send you instructions to reset your password
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <motion.div
                className="flex flex-col items-center justify-center py-6 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium">Check Your Email</h3>
                <p className="mt-2 text-base text-muted-foreground">
                  We've sent a password reset link to <span className="font-medium">{email}</span>. Please check your
                  inbox and follow the instructions to reset your password.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Didn't receive the email? Check your spam folder or
                </p>
                <Button variant="link" className="h-auto p-0 text-base" onClick={() => setIsSubmitted(false)}>
                  try again with a different email
                </Button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <motion.div className="grid gap-4" variants={containerAnimation}>
                  <motion.div className="space-y-2" variants={itemAnimation}>
                    <Label htmlFor="email" className="text-base font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="pl-9 glass-form-element h-11"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (error) setError("")
                        }}
                      />
                    </div>
                    {error && <p className="text-xs text-destructive mt-1">{error}</p>}
                  </motion.div>
                  <motion.div variants={itemAnimation}>
                    <Button
                      type="submit"
                      className="w-full enhanced-glass-card bg-primary/90 text-primary-foreground border-primary/50 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 hover:shadow-primary/20 btn-shine h-11 text-base"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Reset Link...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <motion.div variants={itemAnimation}>
              <p className="text-base text-muted-foreground">
                Remember your password?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Back to login
                </Link>
              </p>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}


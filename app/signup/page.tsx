"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Check, Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabaseClient"

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("email")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: "",
    signupError: "",
  })

  const router = useRouter()
  const { toast } = useToast()
  const formRef = useRef(null)
  const benefitsRef = useRef(null)
  const formInView = useInView(formRef, { once: true, amount: 0.3 })
  const benefitsInView = useInView(benefitsRef, { once: true, amount: 0.3 })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeTerms: checked }))
    if (errors.agreeTerms) {
      setErrors((prev) => ({ ...prev, agreeTerms: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: "",
      signupError: "",
    }

    let isValid = true

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
      isValid = false
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
      isValid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      isValid = false
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and privacy policy"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    // Reset previous signup errors
    setErrors((prev) => ({ ...prev, signupError: "" }))
  
    if (!validateForm()) return
  
    setIsLoading(true)
  
    try {
      // Supabase signup with explicit metadata
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`,
          }
        }
      })
  
      if (error) {
        // Handle signup error
        setErrors((prev) => ({ ...prev, signupError: error.message }))
        setIsLoading(false)
        return
      }
  
      // Additional debug logging
      console.log('Signup Data:', data)
  
      // Successful signup
      toast({
        title: "Account created successfully!",
        description: "Please check your email to verify your account.",
        duration: 5000,
      })
  
      // Redirect or handle successful signup
      router.push("/dashboard")
    } catch (catchError) {
      console.error('Signup Catch Error:', catchError)
      
      // Catch any unexpected errors
      setErrors((prev) => ({
        ...prev,
        signupError: "An unexpected error occurred. Please try again."
      }))
      setIsLoading(false)
    }
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
    <div className="container max-w-6xl py-10 px-4 md:px-6">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2 transition-colors"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Create Your Account</h1>
        <p className="text-muted-foreground">Join WebSync and start monitoring your websites in minutes</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <motion.div
          className="lg:col-span-3"
          ref={formRef}
          initial="hidden"
          animate={formInView ? "visible" : "hidden"}
          variants={containerAnimation}
        >
          <Card className="enhanced-glass-card enhanced-gradient-border overflow-hidden">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Sign up</CardTitle>
              <CardDescription className="text-base">
                Create an account to start monitoring your websites with WebSync
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 glass-tabs">
                  <TabsTrigger value="email" className="glass-tab data-[state=active]:bg-primary/10 text-base">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="google" className="glass-tab data-[state=active]:bg-primary/10 text-base">
                    <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    Google
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="email" className="space-y-4">
                  <form onSubmit={handleSubmit}>
                    {errors.signupError && (
                      <div className="text-destructive text-sm mb-4 text-center">
                        {errors.signupError}
                      </div>
                    )}
                    <motion.div className="grid gap-4" variants={containerAnimation}>
                      <motion.div className="grid grid-cols-2 gap-4" variants={itemAnimation}>
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-base font-medium">
                            First Name
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="firstName"
                              name="firstName"
                              placeholder="John"
                              className="pl-9 glass-form-element h-11"
                              value={formData.firstName}
                              onChange={handleChange}
                            />
                          </div>
                          {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-base font-medium">
                            Last Name
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="lastName"
                              name="lastName"
                              placeholder="Doe"
                              className="pl-9 glass-form-element h-11"
                              value={formData.lastName}
                              onChange={handleChange}
                            />
                          </div>
                          {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
                        </div>
                      </motion.div>
                      <motion.div className="space-y-2" variants={itemAnimation}>
                        <Label htmlFor="email" className="text-base font-medium">
                          Email
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john.doe@example.com"
                            className="pl-9 glass-form-element h-11"
                            value={formData.email}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                      </motion.div>
                      <motion.div className="space-y-2" variants={itemAnimation}>
                        <Label htmlFor="password" className="text-base font-medium">
                          Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-9 glass-form-element h-11"
                            value={formData.password}
                            onChange={handleChange}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                          </Button>
                        </div>
                        {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                        <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
                      </motion.div>
                      <motion.div className="space-y-2" variants={itemAnimation}>
                        <Label htmlFor="confirmPassword" className="text-base font-medium">
                          Confirm Password
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-9 glass-form-element h-11"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                          />
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>
                        )}
                      </motion.div>
                      <motion.div className="flex items-start space-x-2 pt-2" variants={itemAnimation}>
                        <Checkbox id="terms" checked={formData.agreeTerms} onCheckedChange={handleCheckboxChange} />
                        <div className="grid gap-1.5 leading-none">
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            I agree to the{" "}
                            <Link href="/terms" className="text-primary hover:underline">
                              terms of service
                            </Link>{" "}
                            and{" "}
                            <Link href="/privacy" className="text-primary hover:underline">
                              privacy policy
                            </Link>
                          </label>
                          {errors.agreeTerms && <p className="text-xs text-destructive">{errors.agreeTerms}</p>}
                        </div>
                      </motion.div>
                      <motion.div variants={itemAnimation}>
                        <Button
                          type="submit"
                          className="w-full enhanced-glass-card bg-primary/90 text-primary-foreground border-primary/50 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 hover:shadow-primary/20 btn-shine h-11 text-base"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating Account...
                            </>
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  </form>
                </TabsContent>
                <TabsContent value="google">
                  <div className="flex flex-col items-center justify-center space-y-4 py-6">
                    <Button
                      variant="outline"
                      className="w-full h-11 glass-button border-white/30 dark:border-white/10 hover:bg-primary/10 hover:border-primary/30 text-base"
                      onClick={() => {
                        setIsLoading(true)
                        setTimeout(() => {
                          setIsLoading(false)
                          toast({
                            title: "Google Sign-Up",
                            description: "This would connect to Google in a real application.",
                            duration: 3000,
                          })
                        }, 1000)
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                          <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                      )}
                      Sign up with Google
                    </Button>
                    <p className="text-sm text-muted-foreground">We'll never post anything without your permission</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Already have an account?</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full glass-button border-white/30 dark:border-white/10 hover:bg-primary/10 hover:border-primary/30"
                asChild
              >
                <Link href="/login">Log in</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          className="lg:col-span-2"
          ref={benefitsRef}
          initial="hidden"
          animate={benefitsInView ? "visible" : "hidden"}
          variants={containerAnimation}
        >
          <motion.div variants={itemAnimation}>
            <Card className="enhanced-glass-card enhanced-gradient-border h-full">
              <CardHeader>
                <CardTitle className="text-2xl">Why Join WebSync?</CardTitle>
                <CardDescription className="text-base">
                  Discover the benefits of creating your WebSync account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 bg-primary/10 p-1.5 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Real-time Monitoring</h3>
                      <p className="text-base text-muted-foreground">
                        Monitor your websites 24/7 with instant email alerts when issues arise
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 bg-primary/10 p-1.5 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">AI-Powered Analysis</h3>
                      <p className="text-base text-muted-foreground">
                        Get detailed AI insights to quickly identify and fix website issues
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 bg-primary/10 p-1.5 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Free Starter Plan</h3>
                      <p className="text-base text-muted-foreground">
                        Start with our free plan and upgrade as your needs grow
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 bg-primary/10 p-1.5 rounded-full">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Easy Setup</h3>
                      <p className="text-base text-muted-foreground">
                        Add your websites in minutes with our simple onboarding process
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 bg-primary/20 p-1.5 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 text-primary"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Customer Testimonial</h3>
                      <p className="text-base text-muted-foreground italic mt-1">
                        "WebSync has been a game-changer for our team. We've reduced downtime by 80% and can now fix
                        issues before our customers even notice them."
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">— Sarah Johnson, CTO at TechStart</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}


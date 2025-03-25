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
import { ArrowLeft, Eye, EyeOff, Loader2, Mail, Lock, Shield, AlertCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("email")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  const router = useRouter()
  const { toast } = useToast()
  const formRef = useRef(null)
  const securityRef = useRef(null)
  const formInView = useInView(formRef, { once: true, amount: 0.3 })
  const securityInView = useInView(securityRef, { once: true, amount: 0.3 })

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    }

    let isValid = true

    if (!email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!password) {
      newErrors.password = "Password is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Login successful!",
        description: "Welcome back to WebSync.",
        duration: 3000,
      })
      router.push("/dashboard")
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
    <div className="container max-w-6xl py-10 px-4 md:px-6">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2 transition-colors"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Welcome Back</h1>
        <p className="text-muted-foreground">Log in to your WebSync account to access your dashboard</p>
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
              <CardTitle className="text-2xl">Log in</CardTitle>
              <CardDescription className="text-base">
                Enter your credentials to access your WebSync dashboard
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
                            placeholder="john.doe@example.com"
                            className="pl-9 glass-form-element h-11"
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value)
                              if (errors.email) setErrors({ ...errors, email: "" })
                            }}
                          />
                        </div>
                        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                      </motion.div>
                      <motion.div className="space-y-2" variants={itemAnimation}>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-base font-medium">
                            Password
                          </Label>
                          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                            Forgot password?
                          </Link>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-9 glass-form-element h-11"
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value)
                              if (errors.password) setErrors({ ...errors, password: "" })
                            }}
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
                      </motion.div>
                      <motion.div className="flex items-center space-x-2 pt-2" variants={itemAnimation}>
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(!!checked)}
                        />
                        <label
                          htmlFor="remember"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Remember me
                        </label>
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
                              Logging in...
                            </>
                          ) : (
                            "Log in"
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
                            title: "Google Login",
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
                      Log in with Google
                    </Button>
                    <p className="text-sm text-muted-foreground">Secure login with your Google account</p>
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
                  <span className="bg-background px-2 text-muted-foreground">Don't have an account?</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full glass-button border-white/30 dark:border-white/10 hover:bg-primary/10 hover:border-primary/30"
                asChild
              >
                <Link href="/signup">Sign up</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          className="lg:col-span-2"
          ref={securityRef}
          initial="hidden"
          animate={securityInView ? "visible" : "hidden"}
          variants={containerAnimation}
        >
          <motion.div variants={itemAnimation}>
            <Card className="enhanced-glass-card enhanced-gradient-border h-full">
              <CardHeader>
                <CardTitle className="text-2xl">Secure Access</CardTitle>
                <CardDescription className="text-base">WebSync takes your security seriously</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 bg-primary/10 p-1.5 rounded-full">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">End-to-End Encryption</h3>
                      <p className="text-base text-muted-foreground">
                        All your data is encrypted in transit and at rest
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 bg-primary/10 p-1.5 rounded-full">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Two-Factor Authentication</h3>
                      <p className="text-base text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 bg-primary/10 p-1.5 rounded-full">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Regular Security Audits</h3>
                      <p className="text-base text-muted-foreground">
                        We regularly test our systems for vulnerabilities
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 bg-primary/20 p-1.5 rounded-full">
                      <AlertCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Security Tip</h3>
                      <p className="text-base text-muted-foreground mt-1">
                        Always use a strong, unique password for your WebSync account. Consider using a password manager
                        to generate and store complex passwords.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-base text-muted-foreground">
                    Need help logging in?{" "}
                    <Link href="/contact" className="text-primary hover:underline">
                      Contact Support
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}


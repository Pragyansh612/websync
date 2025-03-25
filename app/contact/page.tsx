"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  Globe,
  ArrowRight,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [inquiryType, setInquiryType] = useState("")
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    inquiryType: "",
  })

  const formRef = useRef(null)
  const contactInfoRef = useRef(null)
  const faqRef = useRef(null)
  const { toast } = useToast()

  const formInView = useInView(formRef, { once: true, amount: 0.3 })
  const contactInfoInView = useInView(contactInfoRef, { once: true, amount: 0.3 })
  const faqInView = useInView(faqRef, { once: true, amount: 0.3 })

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      subject: "",
      message: "",
      inquiryType: "",
    }

    let isValid = true

    if (!name.trim()) {
      newErrors.name = "Name is required"
      isValid = false
    }

    if (!email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!subject.trim()) {
      newErrors.subject = "Subject is required"
      isValid = false
    }

    if (!message.trim()) {
      newErrors.message = "Message is required"
      isValid = false
    }

    if (!inquiryType) {
      newErrors.inquiryType = "Please select an inquiry type"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      // Reset form after submission
      setName("")
      setEmail("")
      setSubject("")
      setMessage("")
      setInquiryType("")

      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. We'll respond to your inquiry shortly.",
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
    <div className="container max-w-6xl py-10 px-4 md:px-6">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2 transition-colors"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold tracking-tight gradient-text">Contact Us</h1>
        <p className="text-muted-foreground max-w-2xl">
          Have questions about WebSync? Our team is here to help. Fill out the form below or use one of our other
          contact methods to get in touch.
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-12">
        <motion.div
          className="lg:col-span-7"
          ref={formRef}
          initial="hidden"
          animate={formInView ? "visible" : "hidden"}
          variants={containerAnimation}
        >
          <Card className="enhanced-glass-card enhanced-gradient-border">
            <CardHeader>
              <motion.div variants={itemAnimation}>
                <CardTitle className="text-2xl">Send us a message</CardTitle>
                <CardDescription className="text-base">
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-8 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                    <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">Message Sent!</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md">
                    Thank you for reaching out. Our team will review your message and respond to your inquiry shortly.
                    We typically respond within 24 hours during business days.
                  </p>
                  <Button className="mt-6 glass-button" variant="outline" onClick={() => setIsSubmitted(false)}>
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div className="grid gap-4" variants={containerAnimation}>
                    <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-4" variants={itemAnimation}>
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-base font-medium">
                          Name
                        </Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          required
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value)
                            if (errors.name) setErrors({ ...errors, name: "" })
                          }}
                          className="glass-form-element h-11"
                        />
                        {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-base font-medium">
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Your email address"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            if (errors.email) setErrors({ ...errors, email: "" })
                          }}
                          className="glass-form-element h-11"
                        />
                        {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                      </div>
                    </motion.div>
                    <motion.div className="space-y-2" variants={itemAnimation}>
                      <Label htmlFor="inquiryType" className="text-base font-medium">
                        Inquiry Type
                      </Label>
                      <Select
                        value={inquiryType}
                        onValueChange={(value) => {
                          setInquiryType(value)
                          if (errors.inquiryType) setErrors({ ...errors, inquiryType: "" })
                        }}
                      >
                        <SelectTrigger className="glass-form-element h-11">
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                        <SelectContent className="glass-dropdown">
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="support">Technical Support</SelectItem>
                          <SelectItem value="billing">Billing Question</SelectItem>
                          <SelectItem value="feature">Feature Request</SelectItem>
                          <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.inquiryType && <p className="text-xs text-destructive mt-1">{errors.inquiryType}</p>}
                    </motion.div>
                    <motion.div className="space-y-2" variants={itemAnimation}>
                      <Label htmlFor="subject" className="text-base font-medium">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        placeholder="What is your message about?"
                        required
                        value={subject}
                        onChange={(e) => {
                          setSubject(e.target.value)
                          if (errors.subject) setErrors({ ...errors, subject: "" })
                        }}
                        className="glass-form-element h-11"
                      />
                      {errors.subject && <p className="text-xs text-destructive mt-1">{errors.subject}</p>}
                    </motion.div>
                    <motion.div className="space-y-2" variants={itemAnimation}>
                      <Label htmlFor="message" className="text-base font-medium">
                        Message
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="How can we help you?"
                        rows={5}
                        required
                        value={message}
                        onChange={(e) => {
                          setMessage(e.target.value)
                          if (errors.message) setErrors({ ...errors, message: "" })
                        }}
                        className="glass-form-element min-h-[120px]"
                      />
                      {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
                    </motion.div>
                    <motion.div variants={itemAnimation}>
                      <Button
                        type="submit"
                        className="w-full enhanced-glass-card bg-primary/90 text-primary-foreground border-primary/50 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 hover:shadow-primary/20 btn-shine h-11 text-base"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending Message
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                    </motion.div>
                  </motion.div>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="lg:col-span-5 space-y-8">
          <motion.div
            ref={contactInfoRef}
            initial="hidden"
            animate={contactInfoInView ? "visible" : "hidden"}
            variants={containerAnimation}
          >
            <Card className="enhanced-glass-card enhanced-gradient-border">
              <CardHeader>
                <motion.div variants={itemAnimation}>
                  <CardTitle className="text-2xl">Contact Information</CardTitle>
                  <CardDescription className="text-base">Other ways to get in touch with our team</CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent className="space-y-6">
                <motion.div className="flex items-start gap-4" variants={itemAnimation}>
                  <div className="rounded-full bg-primary/10 p-2">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Email</h3>
                    <p className="text-base text-muted-foreground">For general inquiries and support</p>
                    <a
                      href="mailto:support@websync.io"
                      className="text-base text-primary hover:underline transition-colors"
                    >
                      support@websync.io
                    </a>
                  </div>
                </motion.div>
                <motion.div className="flex items-start gap-4" variants={itemAnimation}>
                  <div className="rounded-full bg-primary/10 p-2">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Phone</h3>
                    <p className="text-base text-muted-foreground">Available Monday-Friday, 9am-5pm EST</p>
                    <a href="tel:+1-555-123-4567" className="text-base text-primary hover:underline transition-colors">
                      +1 (555) 123-4567
                    </a>
                  </div>
                </motion.div>
                <motion.div className="flex items-start gap-4" variants={itemAnimation}>
                  <div className="rounded-full bg-primary/10 p-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Live Chat</h3>
                    <p className="text-base text-muted-foreground">Chat with our support team in real-time</p>
                    <Button variant="link" className="h-auto p-0 text-base text-primary">
                      Start a chat
                    </Button>
                  </div>
                </motion.div>
                <motion.div className="flex items-start gap-4" variants={itemAnimation}>
                  <div className="rounded-full bg-primary/10 p-2">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Office Location</h3>
                    <p className="text-base text-muted-foreground">123 Tech Avenue, Suite 400</p>
                    <p className="text-base text-muted-foreground">San Francisco, CA 94107</p>
                  </div>
                </motion.div>
                <motion.div className="flex items-start gap-4" variants={itemAnimation}>
                  <div className="rounded-full bg-primary/10 p-2">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Business Hours</h3>
                    <p className="text-base text-muted-foreground">Monday-Friday: 9am-5pm EST</p>
                    <p className="text-base text-muted-foreground">Saturday-Sunday: Closed</p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            ref={faqRef}
            initial="hidden"
            animate={faqInView ? "visible" : "hidden"}
            variants={containerAnimation}
            className="w-full"
          >
            <Card className="enhanced-glass-card enhanced-gradient-border w-full">
              <CardHeader>
                <motion.div variants={itemAnimation}>
                  <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
                  <CardDescription className="text-base">Quick answers to common questions</CardDescription>
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div variants={itemAnimation} className="w-full">
                  <Accordion type="single" collapsible className="w-full glass-accordion">
                    <AccordionItem value="item-1" className="glass-accordion-item">
                      <AccordionTrigger className="glass-accordion-trigger text-base font-medium py-4 px-4">
                        What is WebSync?
                      </AccordionTrigger>
                      <AccordionContent className="glass-accordion-content text-base px-4 pb-4">
                        WebSync is an AI-powered website monitoring platform that helps you detect issues before your
                        users do. It continuously monitors your websites for downtime, performance issues, and other
                        problems, alerting you when something goes wrong.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="glass-accordion-item">
                      <AccordionTrigger className="glass-accordion-trigger text-base font-medium py-4 px-4">
                        How does the pricing work?
                      </AccordionTrigger>
                      <AccordionContent className="glass-accordion-content text-base px-4 pb-4">
                        WebSync offers a free plan for basic monitoring needs. We also have premium plans with
                        additional features and higher monitoring frequency. Visit our pricing page for detailed
                        information.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="glass-accordion-item">
                      <AccordionTrigger className="glass-accordion-trigger text-base font-medium py-4 px-4">
                        How quickly will I receive notifications?
                      </AccordionTrigger>
                      <AccordionContent className="glass-accordion-content text-base px-4 pb-4">
                        Our system sends notifications within seconds of detecting an issue with your website. You'll
                        receive instant email alerts with detailed information about the problem and AI-powered
                        suggestions for resolving it.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4" className="glass-accordion-item">
                      <AccordionTrigger className="glass-accordion-trigger text-base font-medium py-4 px-4">
                        How do I get started?
                      </AccordionTrigger>
                      <AccordionContent className="glass-accordion-content text-base px-4 pb-4">
                        Getting started with WebSync is easy! Simply sign up for an account, add your website URLs, and
                        configure your notification preferences. Our platform will immediately begin monitoring your
                        websites and alert you of any issues.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </motion.div>
              </CardContent>
              <CardFooter>
                <motion.div className="w-full" variants={itemAnimation}>
                  <Button
                    variant="outline"
                    className="w-full glass-button border-white/30 dark:border-white/10 hover:bg-primary/10 hover:border-primary/30 text-base"
                    asChild
                  >
                    <Link href="/faq">
                      View All FAQs
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={contactInfoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="enhanced-glass-card bg-primary/5 enhanced-gradient-border">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/20 p-2">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">Global Support</h3>
                    <p className="text-base text-muted-foreground mt-1">
                      Our support team is available worldwide to help you with any questions or issues you may have with
                      WebSync.
                    </p>
                    <Button variant="link" className="h-auto p-0 text-base text-primary mt-2" asChild>
                      <Link href="/support">
                        Visit Support Center
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="mt-12 rounded-lg overflow-hidden enhanced-glass-card enhanced-gradient-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="h-[300px] w-full bg-muted relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0968143067466!2d-122.41941638468173!3d37.77492997975903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c6c8f4459%3A0xb10ed6d9b5050fa5!2s123+Tech+Avenue%2C+San+Francisco%2C+CA+94107!5e0!3m2!1sen!2sus!4v1565285396245!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="WebSync Office Location"
            className="filter grayscale"
          ></iframe>
        </div>
      </motion.div>
    </div>
  )
}


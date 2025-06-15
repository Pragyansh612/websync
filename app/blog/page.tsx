"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Calendar,
  Clock,
  Monitor,
  Bell,
  Activity,
  BarChart3,
  Code,
  Server,
  Search,
  Target,
  Mail,
  Globe,
  Zap,
  TrendingUp,
  Shield,
  Brain,
  AlertTriangle
} from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"

export default function BlogPage() {
  const headerRef = useRef(null)
  const gridRef = useRef(null)
  const categoriesRef = useRef(null)
  
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const headerInView = useInView(headerRef, { once: true, amount: 0.3 })
  const gridInView = useInView(gridRef, { once: true, amount: 0.2 })
  const categoriesInView = useInView(categoriesRef, { once: true, amount: 0.3 })

  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  }

  const itemAnimation = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  const blogPosts = [
    {
      id: 1,
      slug: "real-time-website-monitoring-complete-guide",
      title: "Real-Time Website Monitoring: The Complete Guide",
      excerpt: "Learn how to implement comprehensive website monitoring that detects downtime, performance issues, and errors before they impact your users.",
      category: "Monitoring",
      date: "June 12, 2025",
      readTime: "8 min read",
      featured: true,
      size: "large",
      icon: <Monitor className="h-5 w-5" />,
      tags: ["Real-time", "Alerts", "Performance"],
      bgColor: "bg-blue-500/10 border-blue-500/20",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      id: 2,
      slug: "ai-powered-website-analysis",
      title: "AI-Powered Website Analysis: Getting Actionable Insights",
      excerpt: "Discover how AI analysis identifies performance bottlenecks, predicts potential issues, and provides actionable recommendations.",
      category: "AI Analysis",
      date: "June 10, 2025",
      readTime: "6 min read",
      size: "medium",
      icon: <Brain className="h-5 w-5" />,
      tags: ["AI", "Analysis", "Insights"],
      bgColor: "bg-purple-500/10 border-purple-500/20",
      iconColor: "text-purple-600 dark:text-purple-400"
    },
    {
      id: 3,
      slug: "email-notifications-downtime-alerts",
      title: "Email Notifications for Downtime Alerts",
      excerpt: "Configure intelligent email alerts that notify you instantly when your website experiences issues.",
      category: "Alerts",
      date: "June 8, 2025",
      readTime: "5 min read",
      size: "small",
      icon: <Mail className="h-5 w-5" />,
      tags: ["Email", "Notifications"],
      bgColor: "bg-green-500/10 border-green-500/20",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      id: 4,
      slug: "uptime-monitoring-sla-compliance",
      title: "Uptime Monitoring and SLA Compliance",
      excerpt: "Ensure your website maintains 99.9% uptime with advanced monitoring strategies and automated reporting.",
      category: "Infrastructure",
      date: "June 6, 2025",
      readTime: "7 min read",
      size: "medium",
      icon: <Activity className="h-5 w-5" />,
      tags: ["Uptime", "SLA", "Compliance"],
      bgColor: "bg-red-500/10 border-red-500/20",
      iconColor: "text-red-600 dark:text-red-400"
    },
    {
      id: 5,
      slug: "performance-metrics-optimization",
      title: "Essential Performance Metrics to Track",
      excerpt: "Monitor key performance indicators including page load times, TTFB, and Core Web Vitals.",
      category: "Performance",
      date: "June 4, 2025",
      readTime: "6 min read",
      size: "small",
      icon: <BarChart3 className="h-5 w-5" />,
      tags: ["Metrics", "Performance"],
      bgColor: "bg-orange-500/10 border-orange-500/20",
      iconColor: "text-orange-600 dark:text-orange-400"
    },
    {
      id: 6,
      slug: "global-monitoring-multi-region",
      title: "Global Website Monitoring Across Multiple Regions",
      excerpt: "Monitor your website's performance from multiple global locations to ensure optimal user experience worldwide.",
      category: "Global",
      date: "June 2, 2025",
      readTime: "9 min read",
      size: "large",
      icon: <Globe className="h-5 w-5" />,
      tags: ["Global", "CDN", "Performance"],
      bgColor: "bg-cyan-500/10 border-cyan-500/20",
      iconColor: "text-cyan-600 dark:text-cyan-400"
    },
    {
      id: 7,
      slug: "automated-incident-response",
      title: "Automated Incident Response Workflows",
      excerpt: "Implement automated workflows that reduce downtime and speed up problem resolution.",
      category: "Automation",
      date: "May 30, 2025",
      readTime: "8 min read",
      size: "small",
      icon: <Shield className="h-5 w-5" />,
      tags: ["Automation", "Workflows"],
      bgColor: "bg-emerald-500/10 border-emerald-500/20",
      iconColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      id: 8,
      slug: "api-endpoint-monitoring",
      title: "API Endpoint Monitoring and Status Pages",
      excerpt: "Comprehensive guide to API monitoring with custom status pages for better user communication.",
      category: "API",
      date: "May 28, 2025",
      readTime: "7 min read",
      size: "medium",
      icon: <Code className="h-5 w-5" />,
      tags: ["API", "Status Pages"],
      bgColor: "bg-violet-500/10 border-violet-500/20",
      iconColor: "text-violet-600 dark:text-violet-400"
    }
  ]

  const categories = [
    { name: "All", count: blogPosts.length, icon: <Target className="h-4 w-4" /> },
    { name: "Monitoring", count: 12, icon: <Monitor className="h-4 w-4" /> },
    { name: "AI Analysis", count: 6, icon: <Brain className="h-4 w-4" /> },
    { name: "Alerts", count: 8, icon: <Bell className="h-4 w-4" /> },
    { name: "Performance", count: 15, icon: <Zap className="h-4 w-4" /> },
    { name: "Infrastructure", count: 10, icon: <Server className="h-4 w-4" /> },
    { name: "API", count: 9, icon: <Code className="h-4 w-4" /> },
    { name: "Global", count: 7, icon: <Globe className="h-4 w-4" /> }
  ]

  const getGridClass = (size: string) => {
    switch (size) {
      case 'large':
        return 'md:col-span-2'
      case 'medium':
        return 'md:col-span-1'
      case 'small':
        return 'md:col-span-1'
      default:
        return 'md:col-span-1'
    }
  }

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-16 lg:py-20 relative overflow-hidden" ref={headerRef}>
        <div className="container px-4 md:px-6 relative">
          <motion.div
            className="flex flex-col items-center justify-center space-y-6 text-center max-w-4xl mx-auto"
            variants={containerAnimation}
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemAnimation} className="space-y-4">
              <div className="inline-flex items-center justify-center p-2.5 rounded-xl bg-muted/50 border border-border/50">
                <Monitor className="h-6 w-6" />
              </div>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Website Monitoring Insights
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Expert insights on website monitoring, uptime tracking, performance optimization, 
                and AI-powered analysis to keep your digital services running smoothly.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="w-full py-8 border-y border-border/50" ref={categoriesRef}>
        <div className="container px-4 md:px-6">
          <motion.div
            className="space-y-6"
            initial="hidden"
            animate={categoriesInView ? "visible" : "hidden"}
            variants={containerAnimation}
          >
            {/* Search Bar */}
            <motion.div variants={itemAnimation} className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/50 transition-all"
                />
              </div>
            </motion.div>

            {/* Categories */}
            <motion.div variants={itemAnimation} className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all hover:scale-105 ${
                    selectedCategory === category.name
                      ? 'bg-foreground text-background shadow-md'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted/80 hover:text-foreground border border-border/50'
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                  <span className="opacity-70 text-xs">({category.count})</span>
                </button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="w-full py-12" ref={gridRef}>
        <div className="container px-4 md:px-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            animate={gridInView ? "visible" : "hidden"}
            variants={containerAnimation}
          >
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                className={`${getGridClass(post.size)} group cursor-pointer`}
                variants={itemAnimation}
                custom={index}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <Card className={`h-full ${post.bgColor} hover:shadow-lg transition-all duration-300 border`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className="bg-background/80 text-muted-foreground border border-border/50 text-xs">
                          <span className={post.iconColor}>{post.icon}</span>
                          <span className="ml-1">{post.category}</span>
                        </Badge>
                        {post.featured && (
                          <Badge className="bg-foreground text-background border-0 text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <CardTitle className={`${post.size === 'large' ? 'text-xl' : 'text-lg'} font-semibold leading-tight line-clamp-2 mb-2`}>
                        {post.title}
                      </CardTitle>
                      <CardDescription className={`text-sm text-muted-foreground leading-relaxed ${post.size === 'small' ? 'line-clamp-2' : 'line-clamp-3'}`}>
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.slice(0, post.size === 'large' ? 3 : 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs bg-background/50 border-border/30 text-muted-foreground px-2 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{post.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{post.readTime}</span>
                          </div>
                        </div>
                        <div className="inline-flex items-center gap-1 text-foreground font-medium text-xs group/link">
                          Read More
                          <ArrowRight className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.article>
            ))}
          </motion.div>

          {filteredPosts.length === 0 && (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center p-3 rounded-xl bg-muted/30">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">No articles found</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Try adjusting your search terms or category filters to find what you're looking for.
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("All")
                  }}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Clear Filters
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="w-full py-12 bg-muted/30 border-t border-border/50">
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center justify-center space-y-6 text-center max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border/50 text-sm">
                <Bell className="h-4 w-4" />
                Stay Updated
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">
                Get Weekly Monitoring Insights
              </h2>
              <p className="text-muted-foreground">
                Join thousands of developers receiving our weekly digest of monitoring best practices and platform updates.
              </p>
            </div>
            <motion.div
              className="flex flex-col sm:flex-row gap-2 w-full max-w-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-3 py-2.5 rounded-lg bg-background border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 focus:border-foreground/50 transition-all"
              />
              <Button className="px-4 py-2.5 bg-foreground text-background hover:bg-foreground/90 rounded-lg text-sm font-medium transition-all">
                Subscribe
              </Button>
            </motion.div>
            <p className="text-xs text-muted-foreground">
              No spam. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
"use client"

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Head from 'next/head'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    ArrowLeft,
    Calendar,
    Clock,
    Monitor,
    Brain,
    Mail,
    Activity,
    BarChart3,
    Globe,
    Shield,
    Code,
    Share2,
    BookOpen,
    CheckCircle,
    TrendingUp,
    Bell,
    Zap
} from 'lucide-react'
import { motion } from 'framer-motion'

// Icon mapping for different categories
const iconMap = {
    Monitor: Monitor,
    Brain: Brain,
    Mail: Mail,
    Activity: Activity,
    BarChart3: BarChart3,
    Globe: Globe,
    Shield: Shield,
    Code: Code,
    Bell: Bell,
    Zap: Zap
}

interface BlogPost {
    title: string
    excerpt: string
    category: string
    date: string
    readTime: string
    featured: boolean
    tags: string[]
    bgColor: string
    iconColor: string
    icon: string
    metaDescription: string
    content: {
        introduction: string
        sections: Array<{
            title: string
            content: string
        }>
        conclusion: string
    }
}

interface BlogData {
    [key: string]: BlogPost
}

export default function BlogSlugPage() {
    const params = useParams()
    const slug = params?.slug as string
    const [blogData, setBlogData] = useState<BlogData | null>(null)
    const [post, setPost] = useState<BlogPost | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const response = await fetch('/blog-content.json')
                if (!response.ok) {
                    throw new Error('Failed to fetch blog data')
                }
                const data: BlogData = await response.json()
                setBlogData(data)

                if (slug && typeof slug === 'string') {
                    const postData = data[slug]
                    if (postData) {
                        setPost(postData)
                    } else {
                        setError('Post not found')
                    }
                }
            } catch (err) {
                setError('Failed to load blog post')
                console.error('Error fetching blog data:', err)
            } finally {
                setLoading(false)
            }
        }

        if (slug) {
            fetchBlogData()
        }
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="animate-pulse">
                            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
                            <div className="space-y-4">
                                <div className="h-4 bg-muted rounded"></div>
                                <div className="h-4 bg-muted rounded w-5/6"></div>
                                <div className="h-4 bg-muted rounded w-4/6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
                        <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
                        <Link href="/blog">
                            <Button variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Blog
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const IconComponent = iconMap[post.icon as keyof typeof iconMap] || Monitor
    const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: shareUrl,
                })
            } catch (err) {
                console.log('Share cancelled')
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareUrl)
        }
    }

    return (
        <>
            <Head>
                <title>{post.title} - Website Monitoring Insights</title>
                <meta name="description" content={post.metaDescription} />
                <meta name="keywords" content={post.tags.join(', ')} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.metaDescription} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={shareUrl} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.title} />
                <meta name="twitter:description" content={post.metaDescription} />
                <link rel="canonical" href={shareUrl} />
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        "headline": post.title,
                        "description": post.metaDescription,
                        "datePublished": post.date,
                        "author": {
                            "@type": "Organization",
                            "name": "Website Monitoring Service"
                        },
                        "publisher": {
                            "@type": "Organization",
                            "name": "Website Monitoring Service"
                        },
                        "mainEntityOfPage": {
                            "@type": "WebPage",
                            "@id": shareUrl
                        }
                    })}
                </script>
            </Head>

            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="sticky top-0 z-[100]">
                    <div className="container mx-auto px-4 py-4">
                        <Link href="/blog">
                            <Button variant="ghost" size="sm" className="hover:bg-muted/50">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Blog
                            </Button>
                        </Link>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container mx-auto px-4 py-8 lg:py-12">
                    <article className="max-w-4xl mx-auto">
                        {/* Article Header */}
                        <motion.header
                            className="mb-8 lg:mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center gap-2 mb-4">
                                <Badge className={`${post.bgColor} border-0 text-foreground`}>
                                    <IconComponent className={`w-4 h-4 mr-1 ${post.iconColor}`} />
                                    {post.category}
                                </Badge>
                                {post.featured && (
                                    <Badge className="bg-foreground text-background">
                                        Featured
                                    </Badge>
                                )}
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
                                {post.title}
                            </h1>

                            <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
                                {post.excerpt}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <time dateTime={post.date}>{post.date}</time>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{post.readTime}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <BookOpen className="w-4 h-4" />
                                    <span>{post.content.sections.length} sections</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleShare}
                                    className="ml-auto hover:bg-muted/50"
                                >
                                    <Share2 className="w-4 h-4 mr-1" />
                                    Share
                                </Button>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {post.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="outline"
                                        className="bg-muted/30 hover:bg-muted/50 transition-colors"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </motion.header>

                        {/* Table of Contents */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <Card className="mb-8 bg-muted/20 border-muted/50">
                                <CardContent className="p-6">
                                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5" />
                                        Table of Contents
                                    </h2>
                                    <nav className="space-y-2">
                                        {post.content.sections.map((section, index) => (
                                            <a
                                                key={index}
                                                href={`#section-${index}`}
                                                className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1 hover:underline"
                                            >
                                                {index + 1}. {section.title}
                                            </a>
                                        ))}
                                    </nav>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Article Content */}
                        <motion.div
                            className="prose prose-lg dark:prose-invert max-w-none"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            {/* Introduction */}
                            <div className="mb-8">
                                <p className="text-lg leading-relaxed text-muted-foreground">
                                    {post.content.introduction}
                                </p>
                            </div>

                            {/* Sections */}
                            {post.content.sections.map((section, index) => (
                                <motion.section
                                    key={index}
                                    id={`section-${index}`}
                                    className="mb-8"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                                >
                                    <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-foreground/10 text-foreground font-semibold text-sm">
                                            {index + 1}
                                        </span>
                                        {section.title}
                                    </h2>
                                    <div className="pl-11">
                                        <p className="text-muted-foreground leading-relaxed text-base">
                                            {section.content}
                                        </p>
                                    </div>
                                    {index < post.content.sections.length - 1 && (
                                        <Separator className="mt-8 bg-border/50" />
                                    )}
                                </motion.section>
                            ))}

                            {/* Conclusion */}
                            <motion.section
                                className="mt-12 p-6 rounded-lg bg-muted/20 border border-border/50"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1 }}
                            >
                                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-6 h-6 text-green-500" />
                                    Key Takeaways
                                </h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    {post.content.conclusion}
                                </p>
                            </motion.section>
                        </motion.div>

                        {/* Call to Action */}
                        <motion.section
                            className="mt-12 p-8 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.2 }}
                        >
                            <div className="max-w-2xl mx-auto">
                                <h3 className="text-2xl font-bold mb-4">Ready to Monitor Your Website?</h3>
                                <p className="text-muted-foreground mb-6">
                                    Start monitoring your website's uptime, performance, and get AI-powered insights
                                    with instant email alerts when issues occur.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href='/signup'>
                                        <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90">
                                            <Monitor className="w-5 h-5 mr-2" />
                                            Start Monitoring
                                        </Button>
                                    </Link>
                                    <Link href='/features'>
                                        <Button variant="outline" size="lg">
                                            <TrendingUp className="w-5 h-5 mr-2" />
                                            View Features
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.section>

                        {/* Related Articles */}
                        <motion.section
                            className="mt-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 1.4 }}
                        >
                            <h3 className="text-2xl font-bold mb-6">Continue Reading</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Brain className="w-5 h-5 text-purple-500" />
                                            <Badge variant="outline" className="text-xs">AI Analysis</Badge>
                                        </div>
                                        <h4 className="font-semibold mb-2 group-hover:text-purple-500 transition-colors">
                                            AI-Powered Website Analysis
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Discover how AI identifies bottlenecks and predicts issues before they impact users.
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Activity className="w-5 h-5 text-red-500" />
                                            <Badge variant="outline" className="text-xs">Infrastructure</Badge>
                                        </div>
                                        <h4 className="font-semibold mb-2 group-hover:text-red-500 transition-colors">
                                            Uptime Monitoring & SLA Compliance
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                            Ensure 99.9% uptime with advanced monitoring and automated reporting.
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.section>
                    </article>
                </main>
            </div>
        </>
    )
}
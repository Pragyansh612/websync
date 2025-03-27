"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut, User } from "lucide-react"
import { motion } from "framer-motion"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

const routes = [
  { name: "Home", path: "/" },
  { name: "Features", path: "/features" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Contact", path: "/contact" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsLoggedIn(!!session)
      setUserEmail(session?.user?.email ?? null)
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session)
      setUserEmail(session?.user?.email ?? null)
    })

    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [supabase])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      toast({
        title: "Logout Error",
        description: "Unable to log out. Please try again.",
        variant: "destructive"
      })
    } else {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
      router.push('/')
    }
  }

  const navAnimation = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemAnimation = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  }

  const AuthButtons = () => {
    if (isLoggedIn) {
      return (
        <div className="flex items-center gap-2">
          <motion.div variants={itemAnimation} className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <User className="h-4 w-4" />
              <span>{userEmail}</span>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="glass-button border-white/30 dark:border-white/10 hover:bg-primary/5 hover:border-primary/30"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </motion.div>
        </div>
      )
    }

    return (
      <>
        <motion.div variants={itemAnimation}>
          <Link href="/login">
            <Button
              variant="outline"
              className="glass-button border-white/30 dark:border-white/10 hover:bg-primary/5 hover:border-primary/30"
            >
              Log In
            </Button>
          </Link>
        </motion.div>
        <motion.div variants={itemAnimation}>
          <Link href="/signup">
            <Button className="enhanced-glass-card bg-primary/90 text-primary-foreground border-primary/50 shadow-sm transition-all hover:shadow-md hover:shadow-primary/20 hover:-translate-y-0.5 btn-shine">
              Sign Up
            </Button>
          </Link>
        </motion.div>
      </>
    )
  }

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-50 w-full glass-navbar transition-all duration-300",
        scrolled ? "shadow-md backdrop-blur-xl bg-background/80" : "bg-background/70",
      )}
      initial="hidden"
      animate="visible"
      variants={navAnimation}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <motion.div variants={itemAnimation}>
            <Link href="/" className="flex items-center space-x-2 transition-all hover:scale-105">
              <span className="text-2xl font-bold gradient-text">WebSync</span>
            </Link>
          </motion.div>
          <nav className="hidden md:flex gap-6">
            <NavigationMenu>
              <NavigationMenuList>
                {routes.map((route) => (
                  <motion.div key={route.path} variants={itemAnimation}>
                    <NavigationMenuItem>
                      <Link href={route.path} legacyBehavior passHref>
                        <NavigationMenuLink
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "cursor-pointer transition-all glass-button border-0",
                            pathname === route.path
                              ? "text-primary font-medium bg-primary/10"
                              : "text-muted-foreground hover:text-primary hover:bg-primary/5",
                          )}
                          active={pathname === route.path}
                        >
                          {route.name}
                        </NavigationMenuLink>
                      </Link>
                    </NavigationMenuItem>
                  </motion.div>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <motion.div variants={itemAnimation}>
            <ThemeToggle />
          </motion.div>
          <div className="hidden md:flex gap-2">
            <AuthButtons />
          </div>
          <motion.div variants={itemAnimation} className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button
                  variant="outline"
                  size="icon"
                  className="glass-button border-white/30 dark:border-white/10 hover:bg-primary/5 hover:border-primary/30"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] frosted-glass border-0">
                <nav className="flex flex-col gap-4 mt-8">
                  {routes.map((route) => (
                    <Link
                      key={route.path}
                      href={route.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-lg font-medium transition-all hover:text-primary hover:translate-x-1 glass-button px-4 py-2 border-0",
                        pathname === route.path ? "text-primary bg-primary/10" : "text-muted-foreground",
                      )}
                    >
                      {route.name}
                    </Link>
                  ))}
                  {isLoggedIn ? (
                    <div className="flex flex-col gap-2 mt-4">
                      <div className="text-muted-foreground text-sm flex items-center gap-2 px-4">
                        <User className="h-4 w-4" />
                        <span>{userEmail}</span>
                      </div>
                      <Button 
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full glass-button border-white/30 dark:border-white/10"
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 mt-4">
                      <Link href="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full glass-button border-white/30 dark:border-white/10">
                          Log In
                        </Button>
                      </Link>
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        <Button className="w-full enhanced-glass-card bg-primary/90 text-primary-foreground border-primary/50">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </motion.div>
        </div>
      </div>
    </motion.header>
  )
}
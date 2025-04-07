"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MessageSquare, Menu, X } from "lucide-react"
import { useAnimationSettings } from "@/hooks/use-animation-settings"
import { ThemeToggle } from "@/components/theme-toggle"

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 },
  },
}

const floatingAnimation = {
  y: ["-10px", "10px", "-10px"],
  transition: {
    duration: 4,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut",
  },
}

export default function LandingHero() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { speed: animationSpeed, intensity: animationIntensity, enabled: animationsEnabled } = useAnimationSettings()

  return (
    <section className="relative bg-gradient-to-b from-muted to-background dark:from-background dark:to-muted pt-16 pb-24 overflow-hidden">
      {/* Navigation */}
      <nav className="container mx-auto px-4 mb-12">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={animationsEnabled ? { rotate: 0, scale: 1 } : {}}
              transition={{ duration: 0.5 * animationSpeed }}
            >
              <Image src="/blipp.svg" alt="blipp" width={32} height={32} />
            </motion.div>
            <span className="text-xl font-bold">blipp</span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden mt-4 py-4 bg-card rounded-lg shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 * animationSpeed }}
          >
            <div className="flex flex-col space-y-4 px-4">
              <Link href="/features" className="text-foreground/80 hover:text-primary transition-colors py-2">
                Features
              </Link>
              <Link href="/pricing" className="text-foreground/80 hover:text-primary transition-colors py-2">
                Pricing
              </Link>
              <Link href="/about" className="text-foreground/80 hover:text-primary transition-colors py-2">
                About
              </Link>
              <Link href="/login" className="py-2">
                <Button variant="ghost" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/register" className="py-2">
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero content */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Text content */}
          <motion.div
            className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
              variants={itemVariants}
            >
              Connect with friends <span className="text-primary">instantly</span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-foreground/80 mb-8 max-w-lg mx-auto lg:mx-0"
              variants={itemVariants}
            >
              Experience real-time messaging with a modern, secure, and feature-rich chat application.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={itemVariants}
            >
              <Button asChild size="lg">
                <Link href="/register">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">Login</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Image/illustration */}
          <div className="lg:w-1/2 relative">
            <motion.div
              className="relative z-10"
              animate={animationsEnabled ? floatingAnimation : {}}
              style={{ animationDuration: `${4 / animationSpeed}s` }}
            >
              <Image
                src="/placeholder.svg?height=600&width=600"
                alt="Chat App Interface"
                width={600}
                height={600}
                className="rounded-lg shadow-2xl"
              />
            </motion.div>

            {/* Decorative elements */}
            <motion.div
              className="absolute top-1/4 -left-8 w-16 h-16 bg-primary/10 rounded-full"
              animate={
                animationsEnabled
                  ? {
                      scale: [1, 1.2, 1],
                      transition: { duration: 3 * animationSpeed, repeat: Number.POSITIVE_INFINITY },
                    }
                  : {}
              }
            />
            <motion.div
              className="absolute bottom-1/4 -right-4 w-24 h-24 bg-primary/20 rounded-full"
              animate={
                animationsEnabled
                  ? {
                      scale: [1, 1.1, 1],
                      transition: { duration: 2.5 * animationSpeed, repeat: Number.POSITIVE_INFINITY, delay: 0.5 },
                    }
                  : {}
              }
            />
            <motion.div
              className="absolute -bottom-8 left-1/4 w-20 h-20 bg-muted rounded-full"
              animate={
                animationsEnabled
                  ? {
                      scale: [1, 1.15, 1],
                      transition: { duration: 3.5 * animationSpeed, repeat: Number.POSITIVE_INFINITY, delay: 1 },
                    }
                  : {}
              }
            />
          </div>
        </div>
      </div>
    </section>
  )
}


"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const menuVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  }

  const itemVariants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -10 },
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glassmorphism">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold gradient-text">SuperHire-o</h1>
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/features">Features</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
            <Button variant="glow" asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        <motion.div
          className="md:hidden overflow-hidden"
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={menuVariants}
        >
          <div className="flex flex-col space-y-4 py-4">
            <MobileNavLink href="/" variants={itemVariants}>
              Home
            </MobileNavLink>
            <MobileNavLink href="/features" variants={itemVariants}>
              Features
            </MobileNavLink>
            <MobileNavLink href="/about" variants={itemVariants}>
              About
            </MobileNavLink>
            <MobileNavLink href="/contact" variants={itemVariants}>
              Contact
            </MobileNavLink>
            <motion.div variants={itemVariants}>
              <Button variant="glow" className="w-full" asChild>
                <Link href="/login">Get Started</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-gray-200 hover:text-blue-400 transition-colors relative group">
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full" />
    </Link>
  )
}

function MobileNavLink({
  href,
  children,
  variants,
}: {
  href: string
  children: React.ReactNode
  variants: any
}) {
  return (
    <motion.div variants={variants}>
      <Link href={href} className="block text-gray-200 hover:text-blue-400 transition-colors py-2">
        {children}
      </Link>
    </motion.div>
  )
}


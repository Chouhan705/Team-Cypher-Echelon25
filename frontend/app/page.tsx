"use client"

import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, Cpu, Database, Users } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import { Navbar } from "@/components/navbar"
import { ParticlesBackground } from "@/components/particles-background"

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const features = [
    {
      icon: <Cpu className="h-10 w-10 text-blue-400" />,
      title: "AI-Powered Analysis",
      description:
        "Our advanced AI algorithms analyze resumes and match candidates to your job requirements with incredible accuracy.",
    },
    {
      icon: <Database className="h-10 w-10 text-blue-400" />,
      title: "Smart Candidate Ranking",
      description:
        "Automatically rank candidates based on skills, experience, and cultural fit to find your perfect match.",
    },
    {
      icon: <Users className="h-10 w-10 text-blue-400" />,
      title: "Role-Based Access",
      description: "Separate recruiter and handler roles with tailored interfaces for efficient team collaboration.",
    },
  ]

  return (
    <div className="min-h-screen">
      <ParticlesBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="container px-4 mx-auto">
          <motion.div className="max-w-4xl mx-auto text-center" initial="hidden" animate="visible" variants={fadeIn}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
              Revolutionize Your Hiring Process with AI
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              SuperHire-o uses advanced AI to analyze resumes, rank candidates, and help you make better hiring
              decisions faster than ever before.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="gradient" size="lg" asChild>
                <Link href="/login">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="glass" size="lg">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">Powerful Features</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with intuitive design to streamline your hiring process.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="h-full glassmorphism hover3d glow">
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle className="text-xl text-blue-300">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">{feature.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" className="text-blue-400 p-0 hover:text-blue-300">
                      Learn more <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">Why Choose SuperHire-o?</h2>
              <p className="text-gray-300 mb-6">
                SuperHire-o is designed by recruiters for recruiters. We understand the challenges of modern hiring and
                have built a platform that addresses them head-on.
              </p>

              <ul className="space-y-4">
                {[
                  "Save up to 70% of time spent on resume screening",
                  "Improve candidate quality with AI-powered matching",
                  "Reduce hiring bias with objective analysis",
                  "Streamline team collaboration with role-based access",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="h-6 w-6 text-blue-400 mr-2 shrink-0 mt-0.5" />
                    <span className="text-gray-200">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <Card className="glassmorphism glow">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-300">About Our Platform</CardTitle>
                  <CardDescription className="text-gray-300">
                    Built with the latest technology to transform your hiring process
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-gray-300">
                  <p>
                    SuperHire-o combines advanced AI algorithms with intuitive design to create a seamless hiring
                    experience. Our platform analyzes resumes, ranks candidates, and provides valuable insights to help
                    you make better hiring decisions.
                  </p>
                  <p>
                    With role-based access for recruiters and handlers, your team can collaborate efficiently and focus
                    on what matters most: finding the right talent for your organization.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="gradient">Learn More</Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 mx-auto">
          <motion.div
            className="max-w-3xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Card className="glassmorphism">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold gradient-text">Get in Touch</CardTitle>
                <CardDescription className="text-gray-300">
                  Have questions? We're here to help. Reach out to our team.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FloatingLabelInput id="name" label="Your Name" className="bg-slate-800/50 border-slate-700" />
                    <FloatingLabelInput
                      id="email"
                      type="email"
                      label="Your Email"
                      className="bg-slate-800/50 border-slate-700"
                    />
                  </div>
                  <FloatingLabelInput id="subject" label="Subject" className="bg-slate-800/50 border-slate-700" />
                  <div className="relative">
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Your Message"
                      className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    />
                  </div>
                  <Button type="submit" variant="gradient" className="w-full">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold gradient-text">SuperHire-o</h2>
              <p className="text-gray-400">AI-Powered Hiring Platform</p>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-6 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} SuperHire-o. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


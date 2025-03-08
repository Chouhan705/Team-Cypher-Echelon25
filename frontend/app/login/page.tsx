"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ParticlesBackground } from "@/components/particles-background"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("recruiter")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)

      // Redirect based on role
      if (activeTab === "recruiter") {
        router.push("/recruiter-dashboard")
      } else {
        router.push("/handler-dashboard")
      }
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <ParticlesBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="glassmorphism glow">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold gradient-text">SuperHire-o</CardTitle>
            <CardDescription className="text-gray-300">Sign in to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="recruiter" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
                <TabsTrigger value="handler">Handler</TabsTrigger>
              </TabsList>

              <TabsContent value="recruiter">
                <form onSubmit={handleLogin} className="space-y-4">
                  <FloatingLabelInput
                    id="recruiter-email"
                    type="email"
                    label="Email"
                    className="bg-slate-800/50 border-slate-700"
                  />
                  <FloatingLabelInput
                    id="recruiter-password"
                    type="password"
                    label="Password"
                    className="bg-slate-800/50 border-slate-700"
                  />
                  <Button type="submit" variant="gradient" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In as Recruiter"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="handler">
                <form onSubmit={handleLogin} className="space-y-4">
                  <FloatingLabelInput
                    id="handler-email"
                    type="email"
                    label="Email"
                    className="bg-slate-800/50 border-slate-700"
                  />
                  <FloatingLabelInput
                    id="handler-password"
                    type="password"
                    label="Password"
                    className="bg-slate-800/50 border-slate-700"
                  />
                  <Button type="submit" variant="gradient" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In as Handler"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-gray-400 text-center">
              <span>Demo credentials: any email and password will work</span>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}


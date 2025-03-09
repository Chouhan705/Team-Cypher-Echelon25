"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FloatingLabelInput } from "@/components/ui/floating-label-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ParticlesBackground } from "@/components/particles-background"
import { API_ENDPOINTS, API_TIMEOUT } from "@/lib/config"
import { ApiStatus } from "@/components/api-status"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("recruiter")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // For development/testing - mock login if backend is not available
      const mockLoginForDevelopment = async () => {
        console.warn("Using mock login for development. In production, connect to a real backend.")
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock authentication logic
        if (username === "recruiter" && password === "password123") {
          localStorage.setItem("token", "mock-token-recruiter")
          localStorage.setItem("role", "recruiter")
          return { role: "recruiter" }
        } else if (username === "handler" && password === "password123") {
          localStorage.setItem("token", "mock-token-handler")
          localStorage.setItem("role", "handler")
          return { role: "handler" }
        } else {
          throw new Error("Invalid credentials")
        }
      }

      let response
      try {
        // Try to connect to the real backend first
        const formData = new FormData()
        formData.append("username", username)
        formData.append("password", password)

        response = await axios.post(API_ENDPOINTS.LOGIN, formData, {
          timeout: API_TIMEOUT,
        })

        // Store token and role in localStorage
        localStorage.setItem("token", response.data.access_token)
        localStorage.setItem("role", response.data.role)
      } catch (err) {
        console.error("Backend connection failed, using mock login:", err)
        // If backend connection fails, use mock login for development
        response = { data: await mockLoginForDevelopment() }
      }

      // Redirect based on role
      if (response.data.role === "recruiter") {
        router.push("/recruiter-dashboard")
      } else {
        router.push("/handler-dashboard")
      }
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.detail || err.message || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
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
                    type="text"
                    label="Username"
                    className="bg-slate-800/50 border-slate-700"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <FloatingLabelInput
                    id="recruiter-password"
                    type="password"
                    label="Password"
                    className="bg-slate-800/50 border-slate-700"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
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
                    type="text"
                    label="Username"
                    className="bg-slate-800/50 border-slate-700"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <FloatingLabelInput
                    id="handler-password"
                    type="password"
                    label="Password"
                    className="bg-slate-800/50 border-slate-700"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
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
              <span>Demo credentials: recruiter/password123 or handler/password123</span>
            </div>
            <ApiStatus />
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}


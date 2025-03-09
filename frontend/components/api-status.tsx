"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { API_ENDPOINTS, API_TIMEOUT } from "@/lib/config"

export function ApiStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [message, setMessage] = useState<string>("")

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.HEALTH, {
          timeout: API_TIMEOUT / 2, // Use shorter timeout for health check
        })

        if (response.data.status === "ok") {
          setStatus("connected")
          setMessage("Backend API is connected")
        } else {
          setStatus("error")
          setMessage("Backend API returned unexpected response")
        }
      } catch (error) {
        setStatus("error")
        setMessage("Cannot connect to backend API")
        console.error("API health check failed:", error)
      }
    }

    checkApiStatus()
  }, [])

  if (status === "loading") {
    return (
      <div className="flex items-center text-gray-400 text-xs">
        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
        <span>Checking API connection...</span>
      </div>
    )
  }

  if (status === "connected") {
    return (
      <div className="flex items-center text-green-400 text-xs">
        <CheckCircle className="h-3 w-3 mr-1" />
        <span>{message}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center text-amber-400 text-xs">
      <AlertCircle className="h-3 w-3 mr-1" />
      <span>{message} - Using mock data</span>
    </div>
  )
}


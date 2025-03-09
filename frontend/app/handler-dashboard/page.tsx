"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Upload, FileText, X, Filter, Loader2 } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Navbar } from "@/components/navbar"

export default function HandlerDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [jobPositions, setJobPositions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedJobId, setSelectedJobId] = useState("")
  const [resumeText, setResumeText] = useState("")
  const router = useRouter()

  // Get token from localStorage
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }

  // Check if user is authenticated and has the handler role
  useEffect(() => {
    const token = getToken()
    const role = localStorage.getItem("role")

    if (!token) {
      router.push("/login")
    } else if (role !== "handler") {
      router.push("/recruiter-dashboard")
    } else {
      fetchJobPositions()
    }
  }, [router])

  // Fetch job positions from the API
  const fetchJobPositions = async () => {
    try {
      setIsLoading(true)
      const token = getToken()

      try {
        // Try to fetch from the real API
        const response = await axios.get("http://localhost:8000/api/job-positions", {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 3000, // Set a timeout for faster fallback
        })
        setJobPositions(response.data)
      } catch (err) {
        console.warn("Backend connection failed, using mock data:", err)
        // Fallback to mock data if API is unavailable
        setJobPositions([
          {
            id: 1,
            title: "Senior Frontend Developer",
            department: "Engineering",
            location: "Remote",
            candidates: 24,
            status: "In Progress",
            deadline: "2023-08-15",
          },
          {
            id: 2,
            title: "UX Designer",
            department: "Design",
            location: "New York",
            candidates: 18,
            status: "In Progress",
            deadline: "2023-08-20",
          },
          {
            id: 3,
            title: "Product Manager",
            department: "Product",
            location: "San Francisco",
            candidates: 32,
            status: "In Progress",
            deadline: "2023-08-10",
          },
        ])
      }

      setError("")
    } catch (err) {
      console.error(err)
      setError("Failed to fetch job positions. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredPositions = jobPositions.filter(
    (position) =>
      position.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      setSelectedFile(file)
      readFileContent(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setSelectedFile(file)
      readFileContent(file)
    }
  }

  const readFileContent = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setResumeText(content || "")
    }
    reader.readAsText(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedJobId) return

    setIsUploading(true)

    try {
      const token = getToken()
      await axios.post(
        "http://localhost:8000/api/upload-resume",
        {
          jobId: Number.parseInt(selectedJobId),
          resumeText: resumeText,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      setUploadSuccess(true)

      // Reset after showing success message
      setTimeout(() => {
        setUploadSuccess(false)
        setSelectedFile(null)
        setResumeText("")
        setSelectedJobId("")
        setIsUploadDialogOpen(false)
      }, 1500)
    } catch (err) {
      console.error(err)
      setError("Failed to upload resume. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-16">
      <Navbar />

      <main className="container mx-auto px-4 pt-24">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Handler Dashboard</h1>
          <p className="text-gray-300">Process candidates and manage job positions</p>
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search positions, departments..."
              className="pl-10 bg-slate-800/50 border-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                onClick={() => setSearchTerm("")}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <Button variant="glass">
              <Filter className="mr-2 h-4 w-4" /> Filter
            </Button>
            <Button variant="gradient" onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" /> Upload Resume
            </Button>
          </div>
        </motion.div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredPositions.map((position) => (
            <motion.div key={position.id} variants={fadeIn}>
              <Link href={`/job-details/${position.id}`}>
                <Card className="glassmorphism hover3d glow h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-blue-300">{position.title}</CardTitle>
                        <CardDescription className="text-gray-300">
                          {position.department} • {position.location}
                        </CardDescription>
                      </div>
                      <Badge variant="default" className="bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {position.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-gray-300 mb-2">
                      <span className="text-sm">Deadline: {new Date(position.deadline).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center text-gray-300">
                      <FileText className="h-4 w-4 mr-2 text-blue-400" />
                      <span>{position.candidates?.length || 0} Candidates</span>
                    </div>
                    <Button variant="ghost" className="text-blue-400 p-0 hover:text-blue-300">
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filteredPositions.length === 0 && !isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">No job positions found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or check back later</p>
          </motion.div>
        )}
      </main>

      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent glass className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-text">Upload Resume</DialogTitle>
            <DialogDescription className="text-gray-300">
              Upload a candidate's resume to analyze and match with job positions
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging
                  ? "border-blue-400 bg-blue-500/10"
                  : selectedFile
                    ? "border-green-400 bg-green-500/10"
                    : "border-slate-700 hover:border-slate-500"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {!selectedFile ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Upload className="h-12 w-12 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 mb-2">Drag and drop your file here, or</p>
                    <Button variant="glass" onClick={() => document.getElementById("resume-upload")?.click()}>
                      Browse Files
                    </Button>
                    <input
                      type="file"
                      id="resume-upload"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleFileChange}
                    />
                  </div>
                  <p className="text-xs text-gray-400">Supported formats: PDF, DOC, DOCX, TXT</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4"
                >
                  <div className="flex justify-center">
                    <FileText className="h-12 w-12 text-green-400" />
                  </div>
                  <p className="text-gray-200 font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-gray-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null)
                      setResumeText("")
                    }}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    Remove
                  </Button>
                </motion.div>
              )}
            </div>

            {selectedFile && (
              <div className="mt-4">
                <div className="grid gap-2">
                  <label htmlFor="position" className="text-sm text-gray-300">
                    Select Job Position
                  </label>
                  <select
                    id="position"
                    className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                  >
                    <option value="">Select a position...</option>
                    {jobPositions.map((position) => (
                      <option key={position.id} value={position.id}>
                        {position.title} - {position.department}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsUploadDialogOpen(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button
              variant="gradient"
              onClick={handleUpload}
              disabled={!selectedFile || !selectedJobId || isUploading}
              className="relative"
            >
              {isUploading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : uploadSuccess ? (
                <span className="flex items-center">
                  <svg
                    className="h-4 w-4 mr-2 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Uploaded!
                </span>
              ) : (
                <span>Upload & Analyze</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


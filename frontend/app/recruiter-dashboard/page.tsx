"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Briefcase, Users, Filter, X, Loader2 } from "lucide-react"
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

export default function RecruiterDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [jobOpenings, setJobOpenings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [newJob, setNewJob] = useState({
    title: "",
    department: "",
    location: "",
    skills: "",
    description: "",
    requirements: "",
    deadline: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  // Get token from localStorage
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }

  // Check if user is authenticated and has the recruiter role
  useEffect(() => {
    const token = getToken()
    const role = localStorage.getItem("role")

    if (!token) {
      router.push("/login")
    } else if (role !== "recruiter") {
      router.push("/handler-dashboard")
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
        setJobOpenings(response.data)
      } catch (err) {
        console.warn("Backend connection failed, using mock data:", err)
        // Fallback to mock data if API is unavailable
        setJobOpenings([
          {
            id: 1,
            title: "Senior Frontend Developer",
            department: "Engineering",
            location: "Remote",
            applicants: 24,
            status: "Active",
            skills: ["React", "TypeScript", "Next.js"],
            requirements: ["5+ years of experience", "Strong React knowledge"],
            description: "We are looking for a Senior Frontend Developer",
            deadline: "2023-12-31",
          },
          {
            id: 2,
            title: "UX Designer",
            department: "Design",
            location: "New York",
            applicants: 18,
            status: "Active",
            skills: ["Figma", "UI/UX", "Prototyping"],
            requirements: ["3+ years of experience", "Strong design portfolio"],
            description: "We are looking for a UX Designer",
            deadline: "2023-12-31",
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

  // Handle input change for new job form
  const handleInputChange = (e) => {
    const { id, value } = e.target
    setNewJob((prev) => ({ ...prev, [id]: value }))
  }

  // Handle job creation
  const handleCreateJob = async () => {
    try {
      setIsSubmitting(true)
      const token = getToken()

      // Format the job data
      const jobData = {
        title: newJob.title,
        department: newJob.department,
        location: newJob.location,
        description: newJob.description,
        requirements: newJob.requirements.split("\n").filter((req) => req.trim() !== ""),
        skills: newJob.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
        deadline: newJob.deadline,
        status: "Active",
      }

      await axios.post("http://localhost:8000/api/job-positions", jobData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      // Reset form and close dialog
      setNewJob({
        title: "",
        department: "",
        location: "",
        skills: "",
        description: "",
        requirements: "",
        deadline: "",
      })
      setIsDialogOpen(false)

      // Refresh job positions
      fetchJobPositions()
    } catch (err) {
      console.error(err)
      setError("Failed to create job. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredJobs = jobOpenings.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())),
  )

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
          <h1 className="text-3xl font-bold gradient-text mb-2">Recruiter Dashboard</h1>
          <p className="text-gray-300">Manage your job openings and candidates</p>
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
              placeholder="Search jobs, departments, skills..."
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
            <Button variant="gradient" onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Job
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
          {filteredJobs.map((job) => (
            <motion.div key={job.id} variants={fadeIn}>
              <Link href={`/job-details/${job.id}`}>
                <Card className="glassmorphism hover3d glow h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl text-blue-300">{job.title}</CardTitle>
                        <CardDescription className="text-gray-300">
                          {job.department} • {job.location}
                        </CardDescription>
                      </div>
                      <Badge variant="default" className="bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {job.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="skill">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center text-gray-300">
                      <Users className="h-4 w-4 mr-2 text-blue-400" />
                      <span>{job.candidates?.length || 0} Applicants</span>
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

        {filteredJobs.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <Briefcase className="h-16 w-16 mx-auto text-gray-500 mb-4" />
            <h3 className="text-xl font-medium text-gray-300 mb-2">No job openings found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or create a new job opening</p>
            <Button variant="gradient" onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add New Job
            </Button>
          </motion.div>
        )}
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent glass className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-text">Create New Job Opening</DialogTitle>
            <DialogDescription className="text-gray-300">
              Fill in the details below to create a new job opening
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm text-gray-300">
                Job Title
              </label>
              <Input
                id="title"
                className="bg-slate-800/50 border-slate-700"
                value={newJob.title}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="department" className="text-sm text-gray-300">
                  Department
                </label>
                <Input
                  id="department"
                  className="bg-slate-800/50 border-slate-700"
                  value={newJob.department}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="location" className="text-sm text-gray-300">
                  Location
                </label>
                <Input
                  id="location"
                  className="bg-slate-800/50 border-slate-700"
                  value={newJob.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="skills" className="text-sm text-gray-300">
                Required Skills (comma separated)
              </label>
              <Input
                id="skills"
                className="bg-slate-800/50 border-slate-700"
                value={newJob.skills}
                onChange={handleInputChange}
                placeholder="React, TypeScript, Next.js"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="deadline" className="text-sm text-gray-300">
                Application Deadline
              </label>
              <Input
                id="deadline"
                type="date"
                className="bg-slate-800/50 border-slate-700"
                value={newJob.deadline}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="requirements" className="text-sm text-gray-300">
                Requirements (one per line)
              </label>
              <textarea
                id="requirements"
                rows={3}
                className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={newJob.requirements}
                onChange={handleInputChange}
                placeholder="5+ years of experience in frontend development&#10;Strong knowledge of React, TypeScript, and Next.js"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm text-gray-300">
                Job Description
              </label>
              <textarea
                id="description"
                rows={5}
                className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={newJob.description}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="gradient"
              onClick={handleCreateJob}
              disabled={isSubmitting || !newJob.title || !newJob.department}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Job"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


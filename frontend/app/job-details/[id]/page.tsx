"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Download, Filter, User, MapPin, Building, Calendar, FileText, X, Loader2 } from "lucide-react"
import Link from "next/link"
import axios from "axios"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "@/components/navbar"

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("best")
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [jobDetails, setJobDetails] = useState(null)
  const [candidates, setCandidates] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const jobId = params.id

  // Get token from localStorage
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }

  // Check if user is authenticated
  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.push("/login")
    } else {
      fetchJobDetails()
      fetchCandidates()
    }
  }, [router, jobId])

  // Fetch job details
  const fetchJobDetails = async () => {
    try {
      setIsLoading(true)
      const token = getToken()

      try {
        // Try to fetch from the real API
        const response = await axios.get(`http://localhost:8000/api/job-positions/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 3000, // Set a timeout for faster fallback
        })
        setJobDetails(response.data)
      } catch (err) {
        console.warn("Backend connection failed, using mock data:", err)
        // Fallback to mock data if API is unavailable
        setJobDetails({
          id: Number.parseInt(jobId),
          title: "Senior Frontend Developer",
          department: "Engineering",
          location: "Remote",
          postedDate: "2023-07-15",
          deadline: "2023-08-15",
          description:
            "We are looking for a Senior Frontend Developer to join our team. The ideal candidate will have experience with React, TypeScript, and Next.js.",
          requirements: [
            "5+ years of experience in frontend development",
            "Strong knowledge of React, TypeScript, and Next.js",
            "Experience with state management libraries",
            "Good understanding of web performance optimization",
            "Excellent communication skills",
          ],
          skills: ["React", "TypeScript", "Next.js", "Redux", "CSS-in-JS", "Testing"],
        })
      }

      setError("")
    } catch (err) {
      console.error(err)
      setError("Failed to fetch job details. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch candidates for this job
  const fetchCandidates = async () => {
    try {
      const token = getToken()

      try {
        // Try to fetch from the real API
        const response = await axios.get(`http://localhost:8000/api/candidates?job_id=${jobId}`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 3000, // Set a timeout for faster fallback
        })
        setCandidates(response.data)
      } catch (err) {
        console.warn("Backend connection failed, using mock data:", err)
        // Fallback to mock data if API is unavailable
        setCandidates([
          {
            id: 1,
            name: "Alex Johnson",
            location: "New York, USA",
            experience: "7 years",
            education: "M.S. Computer Science",
            matchScore: 95,
            skills: ["React", "TypeScript", "Next.js", "Redux", "GraphQL"],
            category: "best",
            summary: "Highly skilled frontend developer with extensive experience in React ecosystem.",
          },
          {
            id: 2,
            name: "Sarah Williams",
            location: "San Francisco, USA",
            experience: "6 years",
            education: "B.S. Computer Science",
            matchScore: 92,
            skills: ["React", "TypeScript", "Vue.js", "CSS-in-JS", "Testing"],
            category: "best",
            summary: "Versatile developer with strong testing and UI component skills.",
          },
          {
            id: 3,
            name: "Michael Chen",
            location: "Toronto, Canada",
            experience: "5 years",
            education: "B.S. Software Engineering",
            matchScore: 88,
            skills: ["React", "JavaScript", "Next.js", "Tailwind CSS", "Redux"],
            category: "better",
            summary: "Frontend specialist with focus on responsive design and performance.",
          },
        ])
      }
    } catch (err) {
      console.error(err)
      setError("Failed to fetch candidates. Please try again.")
    }
  }

  // Filter candidates based on active tab
  const filteredCandidates = candidates.filter((candidate) => {
    if (activeTab === "all") return true
    return candidate.category === activeTab
  })

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "best":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "better":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "good":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "poor":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "best":
        return "Best Match"
      case "better":
        return "Better Match"
      case "good":
        return "Good Match"
      case "poor":
        return "Can Be Better"
      default:
        return "Unknown"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!jobDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-2">Job Not Found</h2>
          <p className="text-gray-300 mb-4">The job position you're looking for doesn't exist or has been removed.</p>
          <Button variant="gradient" asChild>
            <Link href="/recruiter-dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-16">
      <Navbar />

      <main className="container mx-auto px-4 pt-24">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/recruiter-dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold gradient-text">{jobDetails.title}</h1>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-gray-300">
              <Building className="h-4 w-4 mr-2 text-blue-400" />
              <span>{jobDetails.department}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <MapPin className="h-4 w-4 mr-2 text-blue-400" />
              <span>{jobDetails.location}</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Calendar className="h-4 w-4 mr-2 text-blue-400" />
              <span>Deadline: {new Date(jobDetails.deadline).toLocaleDateString()}</span>
            </div>
          </div>

          <Card className="glassmorphism mb-8">
            <CardHeader>
              <CardTitle className="text-xl text-blue-300">Job Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">{jobDetails.description}</p>

              <div>
                <h3 className="text-lg font-medium text-blue-300 mb-2">Requirements</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  {jobDetails.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium text-blue-300 mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {jobDetails.skills.map((skill, index) => (
                    <Badge key={index} variant="skill">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-blue-300">Candidates</h2>

            <div className="flex gap-3">
              <Button variant="glass" onClick={() => setIsFilterDialogOpen(true)}>
                <Filter className="mr-2 h-4 w-4" /> Filter Candidates
              </Button>
              <Button variant="gradient">
                <Download className="mr-2 h-4 w-4" /> Export
              </Button>
            </div>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <Tabs defaultValue="best" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-5 w-full max-w-3xl">
              <TabsTrigger value="best">Best</TabsTrigger>
              <TabsTrigger value="better">Better</TabsTrigger>
              <TabsTrigger value="good">Good</TabsTrigger>
              <TabsTrigger value="poor">Can Be Better</TabsTrigger>
              <TabsTrigger value="all">All</TabsTrigger>
            </TabsList>
          </Tabs>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCandidates.map((candidate) => (
              <motion.div key={candidate.id} variants={fadeIn}>
                <Card
                  className="glassmorphism hover3d glow h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-300" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-blue-300">{candidate.name}</CardTitle>
                          <CardDescription className="text-gray-300">{candidate.location}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getCategoryColor(candidate.category)}>{candidate.matchScore}%</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <p className="text-gray-300 text-sm">{candidate.summary}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {candidate.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="skill">
                          {skill}
                        </Badge>
                      ))}
                      {candidate.skills.length > 3 && (
                        <Badge variant="outline" className="text-gray-400 border-gray-700">
                          +{candidate.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center text-gray-300">
                      <FileText className="h-4 w-4 mr-2 text-blue-400" />
                      <span>{candidate.experience} exp</span>
                    </div>
                    <Badge className={getCategoryColor(candidate.category)}>
                      {getCategoryLabel(candidate.category)}
                    </Badge>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredCandidates.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <User className="h-16 w-16 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-300 mb-2">No candidates found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your filters or upload more resumes</p>
              <Button variant="gradient" onClick={() => router.push("/handler-dashboard")}>
                Upload Resumes
              </Button>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Candidate Detail Dialog */}
      <Dialog open={!!selectedCandidate} onOpenChange={(open) => !open && setSelectedCandidate(null)}>
        <DialogContent glass className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedCandidate && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl gradient-text">Candidate Profile</DialogTitle>
              </DialogHeader>

              <div className="py-4">
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="relative w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mx-auto md:mx-0">
                    <User className="h-10 w-10 text-blue-300" />
                  </div>

                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-blue-300 mb-1">{selectedCandidate.name}</h2>
                    <p className="text-gray-300 mb-3">{selectedCandidate.location}</p>

                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <Badge className={getCategoryColor(selectedCandidate.category)}>
                        {getCategoryLabel(selectedCandidate.category)} ({selectedCandidate.matchScore}%)
                      </Badge>
                      <Badge variant="outline" className="text-gray-300 border-gray-700">
                        {selectedCandidate.experience} Experience
                      </Badge>
                      <Badge variant="outline" className="text-gray-300 border-gray-700">
                        {selectedCandidate.education}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-blue-300 mb-3">Summary</h3>
                    <p className="text-gray-300">{selectedCandidate.summary}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-blue-300 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.skills.map((skill, index) => (
                        <Badge key={index} variant="skill">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-blue-300 mb-3">Match Analysis</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-300">Skills Match</span>
                          <span className="text-sm text-blue-300">
                            {Math.round(selectedCandidate.matchScore * 0.6)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.round(selectedCandidate.matchScore * 0.6)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-300">Experience Match</span>
                          <span className="text-sm text-blue-300">
                            {Math.round(selectedCandidate.matchScore * 0.3)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.round(selectedCandidate.matchScore * 0.3)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-300">Education Match</span>
                          <span className="text-sm text-blue-300">
                            {Math.round(selectedCandidate.matchScore * 0.1)}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${Math.round(selectedCandidate.matchScore * 0.1)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="glass">
                      <Download className="mr-2 h-4 w-4" /> Download Resume
                    </Button>
                    <Button variant="gradient" onClick={() => router.push(`/final-selection/${selectedCandidate.id}`)}>
                      Move to Final Selection
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent glass className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-text">Filter Candidates</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-6">
            <div>
              <h3 className="text-lg font-medium text-blue-300 mb-3">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {jobDetails.skills.map((skill, index) => (
                  <Badge key={index} variant="skill" className="cursor-pointer hover:bg-indigo-500/30">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-blue-300 mb-3">Experience</h3>
              <div className="flex flex-wrap gap-2">
                {["1+ years", "3+ years", "5+ years", "7+ years"].map((exp, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-700/50 text-gray-300 border-gray-700"
                  >
                    {exp}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-blue-300 mb-3">Location</h3>
              <div className="flex flex-wrap gap-2">
                {["USA", "Canada", "Europe", "Remote"].map((loc, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-slate-700/50 text-gray-300 border-gray-700"
                  >
                    {loc}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="ghost" onClick={() => setIsFilterDialogOpen(false)}>
                <X className="mr-2 h-4 w-4" /> Clear Filters
              </Button>
              <Button variant="gradient" onClick={() => setIsFilterDialogOpen(false)}>
                Apply Filters
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}


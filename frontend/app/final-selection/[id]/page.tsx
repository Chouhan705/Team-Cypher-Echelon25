"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Download, User, Check, X, FileText } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Navbar } from "@/components/navbar"

// Mock data for job details
const jobDetails = {
  id: 1,
  title: "Senior Frontend Developer",
  department: "Engineering",
  location: "Remote",
}

// Mock data for candidates
const bestCandidates = [
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
]

const optionalCandidates = [
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
  {
    id: 4,
    name: "Emily Rodriguez",
    location: "Austin, USA",
    experience: "4 years",
    education: "B.A. Computer Science",
    matchScore: 85,
    skills: ["React", "TypeScript", "CSS", "Jest", "Webpack"],
    category: "better",
    summary: "Detail-oriented developer with strong testing and optimization skills.",
  },
  {
    id: 5,
    name: "David Kim",
    location: "Seattle, USA",
    experience: "6 years",
    education: "M.S. Web Development",
    matchScore: 82,
    skills: ["React", "JavaScript", "Redux", "SCSS", "Accessibility"],
    category: "good",
    summary: "Frontend developer with strong focus on accessibility and user experience.",
  },
]

export default function FinalSelectionPage({ params }: { params: { id: string } }) {
  const [selectedCandidate, setSelectedCandidate] = useState<(typeof bestCandidates)[0] | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = () => {
    setIsExporting(true)

    // Simulate export
    setTimeout(() => {
      setIsExporting(false)
    }, 2000)
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

  return (
    <div className="min-h-screen pb-16">
      <Navbar />

      <main className="container mx-auto px-4 pt-24">
        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/job-details/1">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold gradient-text">Final Selection</h1>
          </div>

          <div className="flex items-center text-gray-300 mb-6">
            <span className="text-xl">{jobDetails.title}</span>
            <span className="mx-2">•</span>
            <span>{jobDetails.department}</span>
            <span className="mx-2">•</span>
            <span>{jobDetails.location}</span>
          </div>

          <div className="flex justify-end mb-6">
            <Button variant="gradient" onClick={handleExport} disabled={isExporting}>
              {isExporting ? (
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
                  Exporting...
                </span>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> Export Selection
                </>
              )}
            </Button>
          </div>

          <div className="space-y-10">
            {/* Best Candidates Section */}
            <div>
              <h2 className="text-2xl font-bold text-green-400 mb-6 flex items-center">
                <Check className="h-5 w-5 mr-2" /> Best Candidates
              </h2>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {bestCandidates.map((candidate) => (
                  <motion.div key={candidate.id} variants={fadeIn}>
                    <Card
                      className="glassmorphism hover3d glow h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-l-4 border-l-green-500"
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                              <User className="h-5 w-5 text-green-400" />
                            </div>
                            <div>
                              <CardTitle className="text-lg text-green-400">{candidate.name}</CardTitle>
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
                          <FileText className="h-4 w-4 mr-2 text-green-400" />
                          <span>{candidate.experience} exp</span>
                        </div>
                        <Button variant="ghost" className="text-green-400 p-0 hover:text-green-300">
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Optional Candidates Section */}
            <div>
              <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center">
                <Check className="h-5 w-5 mr-2" /> Optional Candidates
              </h2>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {optionalCandidates.map((candidate) => (
                  <motion.div key={candidate.id} variants={fadeIn}>
                    <Card
                      className={`glassmorphism hover3d glow h-full cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-l-4 ${
                        candidate.category === "better"
                          ? "border-l-blue-500"
                          : candidate.category === "good"
                            ? "border-l-yellow-500"
                            : "border-l-gray-500"
                      }`}
                      onClick={() => setSelectedCandidate(candidate)}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div
                              className={`relative w-10 h-10 rounded-full flex items-center justify-center ${
                                candidate.category === "better"
                                  ? "bg-blue-500/20"
                                  : candidate.category === "good"
                                    ? "bg-yellow-500/20"
                                    : "bg-gray-500/20"
                              }`}
                            >
                              <User
                                className={`h-5 w-5 ${
                                  candidate.category === "better"
                                    ? "text-blue-400"
                                    : candidate.category === "good"
                                      ? "text-yellow-400"
                                      : "text-gray-400"
                                }`}
                              />
                            </div>
                            <div>
                              <CardTitle
                                className={`text-lg ${
                                  candidate.category === "better"
                                    ? "text-blue-400"
                                    : candidate.category === "good"
                                      ? "text-yellow-400"
                                      : "text-gray-400"
                                }`}
                              >
                                {candidate.name}
                              </CardTitle>
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
                          <FileText
                            className={`h-4 w-4 mr-2 ${
                              candidate.category === "better"
                                ? "text-blue-400"
                                : candidate.category === "good"
                                  ? "text-yellow-400"
                                  : "text-gray-400"
                            }`}
                          />
                          <span>{candidate.experience} exp</span>
                        </div>
                        <Button
                          variant="ghost"
                          className={`p-0 ${
                            candidate.category === "better"
                              ? "text-blue-400 hover:text-blue-300"
                              : candidate.category === "good"
                                ? "text-yellow-400 hover:text-yellow-300"
                                : "text-gray-400 hover:text-gray-300"
                          }`}
                        >
                          View Details
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
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
                  <div
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center shrink-0 mx-auto md:mx-0 ${
                      selectedCandidate.category === "best"
                        ? "bg-green-500/20"
                        : selectedCandidate.category === "better"
                          ? "bg-blue-500/20"
                          : selectedCandidate.category === "good"
                            ? "bg-yellow-500/20"
                            : "bg-gray-500/20"
                    }`}
                  >
                    <User
                      className={`h-10 w-10 ${
                        selectedCandidate.category === "best"
                          ? "text-green-400"
                          : selectedCandidate.category === "better"
                            ? "text-blue-400"
                            : selectedCandidate.category === "good"
                              ? "text-yellow-400"
                              : "text-gray-400"
                      }`}
                    />
                  </div>

                  <div className="text-center md:text-left">
                    <h2
                      className={`text-2xl font-bold mb-1 ${
                        selectedCandidate.category === "best"
                          ? "text-green-400"
                          : selectedCandidate.category === "better"
                            ? "text-blue-400"
                            : selectedCandidate.category === "good"
                              ? "text-yellow-400"
                              : "text-gray-400"
                      }`}
                    >
                      {selectedCandidate.name}
                    </h2>
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
                    <div className="space-x-2">
                      <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10">
                        <X className="mr-2 h-4 w-4" /> Remove
                      </Button>
                      <Button variant="gradient">
                        <Check className="mr-2 h-4 w-4" /> Select
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


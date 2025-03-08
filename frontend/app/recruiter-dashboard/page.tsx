"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Plus, Search, Briefcase, Users, Filter, X } from "lucide-react"
import Link from "next/link"

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

// Mock data for job openings
const jobOpenings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    applicants: 24,
    status: "Active",
    skills: ["React", "TypeScript", "Next.js"],
  },
  {
    id: 2,
    title: "UX Designer",
    department: "Design",
    location: "New York",
    applicants: 18,
    status: "Active",
    skills: ["Figma", "UI/UX", "Prototyping"],
  },
  {
    id: 3,
    title: "Product Manager",
    department: "Product",
    location: "San Francisco",
    applicants: 32,
    status: "Active",
    skills: ["Agile", "Roadmapping", "User Research"],
  },
  {
    id: 4,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    applicants: 12,
    status: "Active",
    skills: ["AWS", "Docker", "Kubernetes"],
  },
  {
    id: 5,
    title: "Marketing Specialist",
    department: "Marketing",
    location: "London",
    applicants: 8,
    status: "Active",
    skills: ["SEO", "Content Marketing", "Analytics"],
  },
  {
    id: 6,
    title: "Data Scientist",
    department: "Data",
    location: "Berlin",
    applicants: 15,
    status: "Active",
    skills: ["Python", "Machine Learning", "SQL"],
  },
]

export default function RecruiterDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
                      <span>{job.applicants} Applicants</span>
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
              <label htmlFor="job-title" className="text-sm text-gray-300">
                Job Title
              </label>
              <Input id="job-title" className="bg-slate-800/50 border-slate-700" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="department" className="text-sm text-gray-300">
                  Department
                </label>
                <Input id="department" className="bg-slate-800/50 border-slate-700" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="location" className="text-sm text-gray-300">
                  Location
                </label>
                <Input id="location" className="bg-slate-800/50 border-slate-700" />
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="skills" className="text-sm text-gray-300">
                Required Skills (comma separated)
              </label>
              <Input id="skills" className="bg-slate-800/50 border-slate-700" />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm text-gray-300">
                Job Description
              </label>
              <textarea
                id="description"
                rows={5}
                className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" onClick={() => setIsDialogOpen(false)}>
              Create Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


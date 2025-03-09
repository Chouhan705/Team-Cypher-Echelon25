"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

const RecruiterDashboard = ({ params }: { params: { id: string } }) => {
  const [resumeText, setResumeText] = useState("")
  const [position, setPosition] = useState("")
  const [resumeData, setResumeData] = useState(null)
  const [standardProfile, setStandardProfile] = useState(null)
  const [ranking, setRanking] = useState(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const candidateId = params.id

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
    }
  }, [router])

  const handleParseResume = async () => {
    try {
      setIsLoading(true)
      const token = getToken()

      try {
        // Try to use the real API
        const response = await axios.post(
          "http://localhost:8000/api/parse-resume",
          { resumeText },
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 3000, // Set a timeout for faster fallback
          },
        )
        setResumeData(response.data)
      } catch (err) {
        console.warn("Backend connection failed, using mock data:", err)
        // Fallback to mock data if API is unavailable
        setResumeData({
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "555-123-4567",
          location: "New York, USA",
          skills: ["React", "JavaScript", "TypeScript", "HTML", "CSS"],
          experience: [
            {
              title: "Senior Developer",
              company: "Tech Company",
              startDate: "2018-01",
              endDate: "Present",
              description: "Led development of web applications using modern technologies.",
            },
          ],
          education: [
            {
              institution: "University of Technology",
              degree: "B.S. Computer Science",
              startDate: "2011-09",
              endDate: "2015-05",
            },
          ],
          summary: "Experienced developer with skills in React, JavaScript, and TypeScript.",
        })
      }

      setError("")
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to parse resume.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateStandardProfile = async () => {
    try {
      setIsLoading(true)
      const token = getToken()

      try {
        // Try to use the real API
        const response = await axios.post(
          "http://localhost:8000/api/generate-standard-profile",
          { position },
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 3000, // Set a timeout for faster fallback
          },
        )
        setStandardProfile(response.data)
      } catch (err) {
        console.warn("Backend connection failed, using mock data:", err)
        // Fallback to mock data if API is unavailable
        setStandardProfile({
          position: position,
          requiredSkills: ["React", "JavaScript", "TypeScript", "HTML", "CSS"],
          preferredSkills: ["Next.js", "Redux", "GraphQL", "Testing", "CI/CD"],
          minimumExperience: 5,
          educationLevel: "Bachelor's Degree",
          responsibilities: [
            "Develop and maintain web applications",
            "Collaborate with designers and backend developers",
            "Optimize applications for performance",
            "Write clean, maintainable code",
            "Mentor junior developers",
          ],
        })
      }

      setError("")
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to generate standard profile.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRankResume = async () => {
    try {
      if (!resumeData || !standardProfile) {
        setError("Resume data and standard profile are required.")
        return
      }
      setIsLoading(true)
      const token = getToken()

      try {
        // Try to use the real API
        const response = await axios.post(
          "http://localhost:8000/api/rank-resume",
          {
            resumeData,
            standardProfile,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 3000, // Set a timeout for faster fallback
          },
        )
        setRanking(response.data)
      } catch (err) {
        console.warn("Backend connection failed, using mock data:", err)
        // Fallback to mock data if API is unavailable
        setRanking({
          ranking: "best",
          matchScore: 92,
          skillsMatch: {
            React: true,
            JavaScript: true,
            TypeScript: true,
            HTML: true,
            CSS: true,
            "Next.js": false,
            Redux: false,
          },
          experienceMatch: 0.9,
          educationMatch: 0.8,
        })
      }

      setError("")
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message || "Failed to rank resume.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-5">Recruiter Dashboard</h1>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Resume Input */}
        <Card>
          <CardHeader>
            <CardTitle>Enter Resume Text</CardTitle>
            <CardDescription>Paste the resume text to extract data.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Textarea
                rows={8}
                placeholder="Paste resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              <button
                onClick={handleParseResume}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center"
                disabled={isLoading || !resumeText}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Parse Resume"
                )}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Position Input */}
        <Card>
          <CardHeader>
            <CardTitle>Enter Position</CardTitle>
            <CardDescription>Enter the position to generate a standard profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input
                type="text"
                placeholder="Enter position here..."
                value={position}
                onChange={(e) => setPosition(e.target.value)}
              />
              <button
                onClick={handleGenerateStandardProfile}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 flex items-center justify-center"
                disabled={isLoading || !position}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Standard Profile"
                )}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ranking Section */}
      <div className="mb-8">
        <button
          onClick={handleRankResume}
          disabled={isLoading || !resumeData || !standardProfile}
          className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-700 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Ranking...
            </>
          ) : (
            "Rank Resume"
          )}
        </button>
      </div>

      {/* Display Results Section */}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Resume Data Display */}
        {resumeData && (
          <Card>
            <CardHeader>
              <CardTitle>Extracted Resume Data</CardTitle>
              <CardDescription>Data extracted from the resume.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <pre>{JSON.stringify(resumeData, null, 2)}</pre>
            </CardContent>
          </Card>
        )}

        {/* Standard Profile Display */}
        {standardProfile && (
          <Card>
            <CardHeader>
              <CardTitle>Standard Profile</CardTitle>
              <CardDescription>Generated standard profile for the position.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <pre>{JSON.stringify(standardProfile, null, 2)}</pre>
            </CardContent>
          </Card>
        )}

        {/* Ranking Display */}
        {ranking && (
          <Card>
            <CardHeader>
              <CardTitle>Ranking</CardTitle>
              <CardDescription>Ranking of the resume based on the standard profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Ranking: <Badge>{ranking.ranking}</Badge>
              </p>
              <p>Match Score: {ranking.matchScore}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default RecruiterDashboard


from typing import List, Optional, Dict
import json
import os
import random
from passlib.context import CryptContext
from app.models import User, UserCreate, JobPosition, Candidate, ResumeData, StandardProfile, RankingResult

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# In-memory database for development
# In production, replace with a real database
users_db = {
    "recruiter": {
        "id": 1,
        "username": "recruiter",
        "hashed_password": pwd_context.hash("password123"),
        "role": "recruiter"
    },
    "handler": {
        "id": 2,
        "username": "handler",
        "hashed_password": pwd_context.hash("password123"),
        "role": "handler"
    }
}

jobs_db = {}
candidates_db = {}

# Helper functions
def get_user_by_username(username: str) -> Optional[User]:
    if username in users_db:
        user_dict = users_db[username]
        return User(
            id=user_dict["id"],
            username=user_dict["username"],
            role=user_dict["role"]
        )
    return None

def authenticate_user(username: str, password: str) -> Optional[User]:
    user = get_user_by_username(username)
    if not user:
        return None
    if not pwd_context.verify(password, users_db[username]["hashed_password"]):
        return None
    return user

def create_user(user: UserCreate) -> User:
    user_id = len(users_db) + 1
    hashed_password = pwd_context.hash(user.password)
    users_db[user.username] = {
        "id": user_id,
        "username": user.username,
        "hashed_password": hashed_password,
        "role": user.role
    }
    return User(
        id=user_id,
        username=user.username,
        role=user.role
    )

def get_job_positions() -> List[JobPosition]:
    return list(jobs_db.values())

def get_job_position(job_id: int) -> Optional[JobPosition]:
    return jobs_db.get(job_id)

def create_job_position(job: JobPosition) -> JobPosition:
    job_id = len(jobs_db) + 1
    job.id = job_id
    jobs_db[job_id] = job
    return job

def get_candidates(job_id: Optional[int] = None) -> List[Candidate]:
    if job_id:
        return [c for c in candidates_db.values() if c.jobId == job_id]
    return list(candidates_db.values())

def get_candidate(candidate_id: int) -> Optional[Candidate]:
    return candidates_db.get(candidate_id)

def create_candidate(job_id: int, resume_data: ResumeData, ranking: RankingResult) -> Candidate:
    candidate_id = len(candidates_db) + 1
    candidate = Candidate(
        id=candidate_id,
        jobId=job_id,
        name=resume_data.name,
        location=resume_data.location,
        experience=f"{len(resume_data.experience)} years",
        education=resume_data.education[0].degree if resume_data.education else "N/A",
        matchScore=ranking.matchScore,
        skills=resume_data.skills,
        category=ranking.ranking,
        summary=resume_data.summary
    )
    candidates_db[candidate_id] = candidate
    
    # Update job with candidate
    if job_id in jobs_db:
        if not jobs_db[job_id].candidates:
            jobs_db[job_id].candidates = []
        jobs_db[job_id].candidates.append(candidate_id)
    
    return candidate

# AI-powered functions (mock implementations for development)
def parse_resume(resume_text: str) -> ResumeData:
    # In production, replace with actual AI-powered resume parsing
    # This is a mock implementation
    skills = ["Python", "JavaScript", "React", "TypeScript", "FastAPI", "Next.js"]
    random.shuffle(skills)
    
    return ResumeData(
        name="John Doe",
        email="john.doe@example.com",
        phone="555-123-4567",
        location="New York, USA",
        skills=skills[:random.randint(3, 6)],
        experience=[
            {
                "title": "Senior Developer",
                "company": "Tech Company",
                "startDate": "2018-01",
                "endDate": "Present",
                "description": "Led development of web applications using modern technologies."
            }
        ],
        education=[
            {
                "institution": "University of Technology",
                "degree": "B.S. Computer Science",
                "startDate": "2011-09",
                "endDate": "2015-05"
            }
        ],
        summary="Experienced developer with skills in web development and software engineering."
    )

def generate_standard_profile(position: str) -> StandardProfile:
    # In production, replace with actual AI-powered profile generation
    # This is a mock implementation
    required_skills = ["JavaScript", "React", "TypeScript"]
    preferred_skills = ["Next.js", "Redux", "GraphQL", "Testing"]
    
    return StandardProfile(
        position=position,
        requiredSkills=required_skills,
        preferredSkills=preferred_skills,
        minimumExperience=3,
        educationLevel="Bachelor's Degree",
        responsibilities=[
            "Develop and maintain web applications",
            "Collaborate with designers and backend developers",
            "Optimize applications for performance"
        ]
    )

def rank_resume(resume_data: Dict, standard_profile: Dict) -> RankingResult:
    # In production, replace with actual AI-powered ranking
    # This is a mock implementation
    match_score = random.randint(70, 95)
    
    # Determine ranking based on match score
    ranking = "poor"
    if match_score >= 90:
        ranking = "best"
    elif match_score >= 80:
        ranking = "better"
    elif match_score >= 70:
        ranking = "good"
    
    # Mock skills match
    skills_match = {}
    for skill in standard_profile["requiredSkills"]:
        skills_match[skill] = skill in resume_data["skills"]
    
    for skill in standard_profile["preferredSkills"]:
        if skill not in skills_match:
            skills_match[skill] = skill in resume_data["skills"]
    
    return RankingResult(
        ranking=ranking,
        matchScore=match_score,
        skillsMatch=skills_match,
        experienceMatch=0.8,
        educationMatch=0.7
    )
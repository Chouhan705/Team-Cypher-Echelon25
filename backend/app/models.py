from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class UserBase(BaseModel):
    username: str
    role: str = "handler"  # Default role is handler

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    
    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class TokenData(BaseModel):
    username: Optional[str] = None

class JobPosition(BaseModel):
    id: Optional[int] = None
    title: str
    department: str
    location: str
    description: str
    requirements: List[str]
    skills: List[str]
    deadline: str
    status: str = "Active"
    candidates: Optional[List[int]] = []
    
    class Config:
        orm_mode = True

class Experience(BaseModel):
    title: str
    company: str
    startDate: str
    endDate: str
    description: str

class Education(BaseModel):
    institution: str
    degree: str
    startDate: str
    endDate: str

class ResumeData(BaseModel):
    name: str
    email: str
    phone: str
    location: str
    skills: List[str]
    experience: List[Experience]
    education: List[Education]
    summary: str
    
    class Config:
        orm_mode = True

class StandardProfile(BaseModel):
    position: str
    requiredSkills: List[str]
    preferredSkills: List[str]
    minimumExperience: int
    educationLevel: str
    responsibilities: List[str]
    
    class Config:
        orm_mode = True

class RankingResult(BaseModel):
    ranking: str  # "best", "better", "good", "poor"
    matchScore: int
    skillsMatch: Dict[str, bool]
    experienceMatch: float
    educationMatch: float
    
    class Config:
        orm_mode = True

class Candidate(BaseModel):
    id: Optional[int] = None
    jobId: int
    name: str
    location: str
    experience: str
    education: str
    matchScore: int
    skills: List[str]
    category: str  # "best", "better", "good", "poor"
    summary: str
    
    class Config:
        orm_mode = Trues
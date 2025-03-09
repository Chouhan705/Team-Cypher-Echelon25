from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
import jwt
import uvicorn
import os
from dotenv import load_dotenv
from app.models import (
    User, JobPosition, Candidate, ResumeData, 
    StandardProfile, RankingResult, UserCreate, 
    UserLogin, Token, TokenData
)
import app.database as db

# Load environment variables
load_dotenv()

app = FastAPI(title="SuperHire-o API")

# Configure CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-for-jwt")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Authentication functions
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except jwt.PyJWTError:
        raise credentials_exception
    user = db.get_user_by_username(token_data.username)
    if user is None:
        raise credentials_exception
    return user

# Auth endpoints
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

@app.post("/register", response_model=User)
async def register_user(user: UserCreate):
    db_user = db.get_user_by_username(user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return db.create_user(user)

# Job positions endpoints
@app.get("/api/job-positions", response_model=List[JobPosition])
async def get_job_positions(current_user: User = Depends(get_current_user)):
    return db.get_job_positions()

@app.get("/api/job-positions/{job_id}", response_model=JobPosition)
async def get_job_position(job_id: int, current_user: User = Depends(get_current_user)):
    job = db.get_job_position(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job position not found")
    return job

@app.post("/api/job-positions", response_model=JobPosition)
async def create_job_position(job: JobPosition, current_user: User = Depends(get_current_user)):
    if current_user.role != "recruiter":
        raise HTTPException(status_code=403, detail="Not authorized")
    return db.create_job_position(job)

# Candidates endpoints
@app.get("/api/candidates", response_model=List[Candidate])
async def get_candidates(job_id: Optional[int] = None, current_user: User = Depends(get_current_user)):
    return db.get_candidates(job_id)

@app.get("/api/candidates/{candidate_id}", response_model=Candidate)
async def get_candidate(candidate_id: int, current_user: User = Depends(get_current_user)):
    candidate = db.get_candidate(candidate_id)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return candidate

# Resume processing endpoints
@app.post("/api/parse-resume", response_model=ResumeData)
async def parse_resume(data: dict, current_user: User = Depends(get_current_user)):
    resume_text = data.get("resumeText", "")
    if not resume_text:
        raise HTTPException(status_code=400, detail="Resume text is required")
    return db.parse_resume(resume_text)

@app.post("/api/generate-standard-profile", response_model=StandardProfile)
async def generate_standard_profile(data: dict, current_user: User = Depends(get_current_user)):
    position = data.get("position", "")
    if not position:
        raise HTTPException(status_code=400, detail="Position is required")
    return db.generate_standard_profile(position)

@app.post("/api/rank-resume", response_model=RankingResult)
async def rank_resume(data: dict, current_user: User = Depends(get_current_user)):
    resume_data = data.get("resumeData")
    standard_profile = data.get("standardProfile")
    if not resume_data or not standard_profile:
        raise HTTPException(status_code=400, detail="Resume data and standard profile are required")
    return db.rank_resume(resume_data, standard_profile)

@app.post("/api/upload-resume", response_model=Candidate)
async def upload_resume(data: dict, current_user: User = Depends(get_current_user)):
    job_id = data.get("jobId")
    resume_text = data.get("resumeText")
    if not job_id or not resume_text:
        raise HTTPException(status_code=400, detail="Job ID and resume text are required")
    
    # Process the resume
    resume_data = db.parse_resume(resume_text)
    
    # Get the standard profile for the job
    job = db.get_job_position(job_id)
    standard_profile = db.generate_standard_profile(job.title)
    
    # Rank the resume
    ranking = db.rank_resume(resume_data, standard_profile)
    
    # Create a candidate
    candidate = db.create_candidate(job_id, resume_data, ranking)
    
    return candidate

# Add a simple health check endpoint that doesn't require authentication
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "API is running"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
from fastapi import FastAPI, HTTPException, APIRouter
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from . import crud, schemas, database
import os

app = FastAPI()

# CORS configuration: explicit origins only (no wildcard in production)
VERCEL_URL = os.getenv("VERCEL_URL", "")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "")  # Optional: comma-separated list for custom domains
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
if VERCEL_URL:
    origins.append(f"https://{VERCEL_URL}")
    origins.append(f"https://www.{VERCEL_URL}")
if CORS_ORIGINS:
    origins.extend(o.strip() for o in CORS_ORIGINS.split(",") if o.strip())

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

api_router = APIRouter(prefix="/api")

@api_router.get("/")
def read_root():
    return {"message": "Portfolio Backend is running"}

@api_router.get("/profile", response_model=schemas.Profile)
def get_profile():
    profile = crud.get_profile(database.supabase)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@api_router.post("/profile", response_model=schemas.Profile)
def create_profile(profile: schemas.ProfileCreate):
    # Check if email exists
    existing = crud.get_profile_by_email(database.supabase, profile.email)
    if existing:
         raise HTTPException(status_code=400, detail="Email already registered")
    
    return crud.create_profile(database.supabase, profile)

@api_router.put("/profile/{profile_id}", response_model=schemas.Profile)
def update_profile(profile_id: str, profile: schemas.ProfileCreate):
    return crud.update_profile(database.supabase, profile_id, profile)

from pydantic import BaseModel

class LoginRequest(BaseModel):
    email: str
    password: str

@api_router.post("/login")
def login(request: LoginRequest):
    profile = crud.get_profile_by_email(database.supabase, request.email)
    if not profile:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Simple cleartext comparison for now as requested
    # In production, use bcrypt/argon2
    if profile.get("password") == request.password:
        return {"success": True}
    else:
        raise HTTPException(status_code=401, detail="Invalid password")


from typing import List, Optional

@api_router.get("/projects")
def get_projects(profile_id: Optional[str] = None):
    return crud.get_projects(database.supabase, profile_id)

@api_router.post("/projects", response_model=List[schemas.Project])
def create_project(project: schemas.ProjectCreate):
    return crud.create_project(database.supabase, project)

@api_router.delete("/projects/{project_id}")
def delete_project(project_id: str):
    return crud.delete_project(database.supabase, project_id)

@api_router.put("/projects/{project_id}", response_model=schemas.Project)
def update_project(project_id: str, project: schemas.ProjectCreate):
    updated = crud.update_project(database.supabase, project_id, project)
    if not updated:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated

@api_router.get("/certificates")
def get_certificates(profile_id: Optional[str] = None):
    return crud.get_certificates(database.supabase, profile_id)

@api_router.post("/certificates", response_model=List[schemas.Certificate])
def create_certificate(certificate: schemas.CertificateCreate):
    return crud.create_certificate(database.supabase, certificate)

@api_router.delete("/certificates/{certificate_id}")
def delete_certificate(certificate_id: str):
    return crud.delete_certificate(database.supabase, certificate_id)

@api_router.put("/certificates/{certificate_id}", response_model=schemas.Certificate)
def update_certificate(certificate_id: str, certificate: schemas.CertificateCreate):
    updated = crud.update_certificate(database.supabase, certificate_id, certificate)
    if not updated:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return updated

@api_router.get("/certificates/{slug}", response_model=schemas.Certificate)
def get_certificate_by_slug(slug: str):
    cert = crud.get_certificate_by_slug(database.supabase, slug)
    if not cert:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return cert

@api_router.get("/experiences", response_model=List[schemas.Experience])
def get_experiences(profile_id: str):
    return crud.get_experiences(database.supabase, profile_id)

@api_router.post("/experiences", response_model=schemas.Experience)
def create_experience(experience: schemas.ExperienceCreate):
    return crud.create_experience(database.supabase, experience)

@api_router.delete("/experiences/{experience_id}")
def delete_experience(experience_id: str):
    return crud.delete_experience(database.supabase, experience_id)

@api_router.get("/interests", response_model=List[schemas.Interest])
def get_interests(profile_id: str):
    return crud.get_interests(database.supabase, profile_id)

@api_router.post("/interests", response_model=schemas.Interest)
def create_interest(interest: schemas.InterestCreate):
    return crud.create_interest(database.supabase, interest)

@api_router.delete("/interests/{interest_id}")
def delete_interest(interest_id: str):
    return crud.delete_interest(database.supabase, interest_id)

@api_router.get("/services", response_model=List[schemas.Service])
def get_services(profile_id: str):
    return crud.get_services(database.supabase, profile_id)

@api_router.post("/services", response_model=schemas.Service)
def create_service(service: schemas.ServiceCreate):
    return crud.create_service(database.supabase, service)

@api_router.delete("/services/{service_id}")
def delete_service(service_id: str):
    return crud.delete_service(database.supabase, service_id)

app.include_router(api_router)

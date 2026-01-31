from pydantic import BaseModel, Field
from typing import List, Optional, Dict

class ProjectBase(BaseModel):
    title: str
    description: str
    longDescription: Optional[str] = Field(None, alias="long_description")
    image: str
    category: str
    tags: List[str] = []
    profile_id: Optional[str] = None
    githubUrl: Optional[str] = Field(None, alias="github_url")
    liveUrl: Optional[str] = Field(None, alias="live_url")
    status: str = "completed"
    date: Optional[str] = Field(None, alias="project_date")
    duration: Optional[str] = None
    client: Optional[str] = None
    features: List[str] = []
    technologies: Dict = {}
    metrics: Dict = {}
    featured: bool = False

    class Config:
        populate_by_name = True
        from_attributes = True


class CertificateBase(BaseModel):
    slug: str
    title: str
    issuer: str
    date: str = Field(..., alias="certificate_date")
    image: str
    description: str
    credentialUrl: str = Field(..., alias="credential_url")

    longDescription: Optional[str] = Field(None, alias="long_description")
    skills: List[str] = []
    level: Optional[str] = None
    modules: List[str] = []
    profile_id: Optional[str] = None

    class Config:
        populate_by_name = True
        from_attributes = True

class CertificateCreate(CertificateBase):
    pass

class Certificate(CertificateBase):
    id: Optional[str] = None
    created_at: Optional[str] = None

    class Config:
        from_attributes = True

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: Optional[str] = None
    created_at: Optional[str] = None

    class Config:
        from_attributes = True


class ProfileBase(BaseModel):
    name: str
    role: Optional[str] = None
    tagline: Optional[str] = None
    bio: Optional[str] = None
    email: Optional[str] = None
    mobile_number: Optional[str] = Field(None, alias="mobile_number")
    location: Optional[str] = None
    availability: Optional[str] = None
    github_url: Optional[str] = Field(None, alias="github_url")
    linkedin_url: Optional[str] = Field(None, alias="linkedin_url")
    instagram_url: Optional[str] = Field(None, alias="instagram_url")
    twitter_url: Optional[str] = Field(None, alias="twitter_url")
    skills: List[str] = []
    about_text: Optional[str] = None
    image_url: Optional[str] = None # For profile picture
    resume_url: Optional[str] = None # For downloadable resume
    password: Optional[str] = None # Added for auth

    class Config:
        populate_by_name = True

class ProfileCreate(ProfileBase):
    pass

    class Config:
        from_attributes = True

class ExperienceBase(BaseModel):
    role: str
    company: str
    period: str
    description: str

class ExperienceCreate(ExperienceBase):
    profile_id: str

class Experience(ExperienceBase):
    id: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True

class InterestBase(BaseModel):
    title: str
    description: str
    icon: str

class InterestCreate(InterestBase):
    profile_id: str

class Interest(InterestBase):
    id: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True

class ServiceBase(BaseModel):
    title: str
    description: str
    icon: str

class ServiceCreate(ServiceBase):
    profile_id: str

class Service(ServiceBase):
    id: str
    created_at: Optional[str] = None

    class Config:
        from_attributes = True

# Update Profile to include these optional lists
class Profile(ProfileBase):
    id: str
    created_at: Optional[str] = None
    # Exclude password from response
    password: Optional[str] = Field(None, exclude=True)
    password: Optional[str] = Field(None, exclude=True)
    about_text: Optional[str] = None
    image_url: Optional[str] = None
    resume_url: Optional[str] = None
    experiences: List[Experience] = []
    interests: List[Interest] = []
    services: List[Service] = []

    class Config:
        from_attributes = True

from supabase import Client
from . import schemas

def get_projects(db: Client, profile_id: str = None):
    query = db.table("projects").select("*")
    if profile_id:
        query = query.eq("profile_id", profile_id)
    response = query.execute()
    return response.data

def get_profile(db: Client):
    # This function seems legacy or for debugging, potentially returning *any* profile if not limited
    # But let's leave it as is for now as get_profile_by_email is main auth
    response = db.table("profiles").select("*").limit(1).execute()
    if not response.data:
        return None
    
    profile = response.data[0]
    # Fetch related data
    try:
        profile['experiences'] = get_experiences(db, profile['id'])
        profile['interests'] = get_interests(db, profile['id'])
        profile['services'] = get_services(db, profile['id'])
    except Exception as e:
        print(f"Error fetching related data: {e}")
        profile['experiences'] = []
        profile['interests'] = []
        profile['services'] = []
    return profile

def get_profile_by_email(db: Client, email: str):
    response = db.table("profiles").select("*").eq("email", email).limit(1).execute()
    return response.data[0] if response.data else None

def update_profile(db: Client, profile_id: str, profile: schemas.ProfileCreate):
    profile_data = profile.dict(by_alias=True, exclude_unset=True)
    # Remove password if not provided or empty to avoid overwriting with None/empty (though exclude_unset handles None)
    if 'password' in profile_data and not profile_data['password']:
         del profile_data['password']

    response = db.table("profiles").update(profile_data).eq("id", profile_id).execute()
    return response.data[0] if response.data else None

def create_profile(db: Client, profile: schemas.ProfileCreate):
    profile_data = profile.dict(by_alias=True)
    response = db.table("profiles").insert(profile_data).execute()
    return response.data[0] if response.data else None


def create_project(db: Client, project: schemas.ProjectCreate):
    project_data = project.dict(by_alias=True)
    response = db.table("projects").insert(project_data).execute()
    return response.data

def delete_project(db: Client, project_id: str):
    response = db.table("projects").delete().eq("id", project_id).execute()
    return response.data

def update_project(db: Client, project_id: str, project: schemas.ProjectCreate):
    project_data = project.dict(by_alias=True, exclude_unset=True)
    response = db.table("projects").update(project_data).eq("id", project_id).execute()
    return response.data[0] if response.data else None

def get_certificates(db: Client, profile_id: str = None):
    query = db.table("certificates").select("*")
    if profile_id:
        query = query.eq("profile_id", profile_id)
    response = query.execute()
    return response.data

def create_certificate(db: Client, certificate: schemas.CertificateCreate):
    cert_data = certificate.dict(by_alias=True)
    response = db.table("certificates").insert(cert_data).execute()
    return response.data

def delete_certificate(db: Client, certificate_id: str):
    response = db.table("certificates").delete().eq("id", certificate_id).execute()
    return response.data

    response = db.table("certificates").update(cert_data).eq("id", certificate_id).execute()
    return response.data[0] if response.data else None

def get_certificate_by_slug(db: Client, slug: str):
    response = db.table("certificates").select("*").eq("slug", slug).execute()
    return response.data[0] if response.data else None

def get_experiences(db: Client, profile_id: str):
    response = db.table("experiences").select("*").eq("profile_id", profile_id).execute()
    return response.data

def create_experience(db: Client, experience: schemas.ExperienceCreate):
    data = experience.dict()
    response = db.table("experiences").insert(data).execute()
    return response.data[0] if response.data else None

def delete_experience(db: Client, experience_id: str):
    response = db.table("experiences").delete().eq("id", experience_id).execute()
    return response.data

def get_interests(db: Client, profile_id: str):
    response = db.table("interests").select("*").eq("profile_id", profile_id).execute()
    return response.data

def create_interest(db: Client, interest: schemas.InterestCreate):
    data = interest.dict()
    response = db.table("interests").insert(data).execute()
    return response.data[0] if response.data else None

def delete_interest(db: Client, interest_id: str):
    response = db.table("interests").delete().eq("id", interest_id).execute()
    return response.data

def get_services(db: Client, profile_id: str):
    response = db.table("services").select("*").eq("profile_id", profile_id).execute()
    return response.data

def create_service(db: Client, service: schemas.ServiceCreate):
    data = service.dict()
    response = db.table("services").insert(data).execute()
    return response.data[0] if response.data else None

def delete_service(db: Client, service_id: str):
    response = db.table("services").delete().eq("id", service_id).execute()
    return response.data

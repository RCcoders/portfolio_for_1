const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface Project {
    id?: string;
    title: string;
    description: string;
    longDescription?: string;
    image: string;
    category: string;
    tags: string[];
    githubUrl?: string;
    liveUrl?: string;
    status: 'completed' | 'in-progress' | 'planned';
    date?: string;
    duration?: string;
    client?: string;
    features?: string[];
    technologies?: Record<string, string[]>;
    metrics?: Record<string, string>;
    featured?: boolean;
    profile_id?: string;
}

export const api = {
    getProjects: async (profileId?: string): Promise<Project[]> => {
        const url = profileId ? `${API_URL}/projects?profile_id=${profileId}` : `${API_URL}/projects`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        return response.json();
    },

    createProject: async (project: Project): Promise<Project> => {
        const response = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        });
        if (!response.ok) {
            throw new Error('Failed to create project');
        }
        const data = await response.json();
        return data[0];
    },

    deleteProject: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/projects/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete project');
        }
    },

    updateProject: async (id: string, project: Project): Promise<Project> => {
        const response = await fetch(`${API_URL}/projects/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(project),
        });
        if (!response.ok) {
            throw new Error('Failed to update project');
        }
        return response.json();
    },

    getCertificates: async (profileId?: string): Promise<Certificate[]> => {
        const url = profileId ? `${API_URL}/certificates?profile_id=${profileId}` : `${API_URL}/certificates`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch certificates');
        }
        return response.json();
    },

    createCertificate: async (certificate: Certificate): Promise<Certificate> => {
        const response = await fetch(`${API_URL}/certificates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(certificate),
        });
        if (!response.ok) {
            throw new Error('Failed to create certificate');
        }
        const data = await response.json();
        return data[0];
    },

    deleteCertificate: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/certificates/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete certificate');
        }
    },

    updateCertificate: async (id: string, certificate: Certificate): Promise<Certificate> => {
        const response = await fetch(`${API_URL}/certificates/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(certificate),
        });
        if (!response.ok) {
            throw new Error('Failed to update certificate');
        }
        return response.json();
    },

    getCertificateBySlug: async (slug: string): Promise<Certificate> => {
        // This might arguably need profile_id/filtering too if slugs collide, but likely unique globally or filtered by slug
        const response = await fetch(`${API_URL}/certificates/${slug}`);
        if (!response.ok) {
            throw new Error('Failed to fetch certificate');
        }
        return response.json();
    },

    getProfile: async (): Promise<Profile> => {
        const response = await fetch(`${API_URL}/profile`);
        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }
        return response.json();
    },

    createProfile: async (profile: Profile): Promise<Profile> => {
        const response = await fetch(`${API_URL}/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profile),
        });
        if (!response.ok) {
            throw new Error('Failed to create profile');
        }
        const data = await response.json();
        return data; // Backend might return the created object or list
    },

    updateProfile: async (id: string, profile: Partial<Profile>): Promise<Profile> => {
        const response = await fetch(`${API_URL}/profile/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profile),
        });
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        return response.json();
    },

    login: async (email: string, password: string): Promise<boolean> => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) return false;
        return true;
    },

    getExperiences: async (profileId: string): Promise<Experience[]> => {
        const response = await fetch(`${API_URL}/experiences?profile_id=${profileId}`);
        if (!response.ok) throw new Error('Failed to fetch experiences');
        return response.json();
    },

    createExperience: async (experience: Omit<Experience, 'id' | 'created_at'> & { profile_id: string }): Promise<Experience> => {
        const response = await fetch(`${API_URL}/experiences`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(experience)
        });
        if (!response.ok) throw new Error('Failed to create experience');
        return response.json();
    },

    deleteExperience: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/experiences/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete experience');
    },

    getInterests: async (profileId: string): Promise<Interest[]> => {
        const response = await fetch(`${API_URL}/interests?profile_id=${profileId}`);
        if (!response.ok) throw new Error('Failed to fetch interests');
        return response.json();
    },

    createInterest: async (interest: Omit<Interest, 'id' | 'created_at'> & { profile_id: string }): Promise<Interest> => {
        const response = await fetch(`${API_URL}/interests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(interest)
        });
        if (!response.ok) throw new Error('Failed to create interest');
        return response.json();
    },

    deleteInterest: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/interests/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete interest');
    },

    getServices: async (profileId: string): Promise<Service[]> => {
        const response = await fetch(`${API_URL}/services?profile_id=${profileId}`);
        if (!response.ok) throw new Error('Failed to fetch services');
        return response.json();
    },

    createService: async (service: Omit<Service, 'id' | 'created_at'> & { profile_id: string }): Promise<Service> => {
        const response = await fetch(`${API_URL}/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(service)
        });
        if (!response.ok) throw new Error('Failed to create service');
        return response.json();
    },

    deleteService: async (id: string): Promise<void> => {
        const response = await fetch(`${API_URL}/services/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete service');
    }
};

export interface Certificate {
    id?: string;
    slug: string;
    title: string;
    issuer: string;
    date: string;
    image: string;
    description: string;
    credentialUrl: string;
    longDescription?: string;
    skills?: string[];
    duration?: string;
    level?: string;
    modules?: string[];
    profile_id?: string;
}

export interface Profile {
    id?: string;
    name: string;
    role: string;
    tagline: string;
    bio: string;
    email?: string;
    mobile_number?: string;
    location?: string;
    availability: string;
    github?: string;
    linkedin?: string;
    instagram?: string;
    twitter?: string;
    skills: string[];
    password?: string;
    about_text?: string;
    image_url?: string;
    resume_url?: string;
    experiences?: Experience[];
    interests?: Interest[];
    services?: Service[];
}

export interface Experience {
    id: string;
    profile_id?: string;
    role: string;
    company: string;
    period: string;
    description: string;
    created_at?: string;
}

export interface Interest {
    id: string;
    profile_id?: string;
    title: string;
    description: string;
    icon: string;
    created_at?: string;
}

export interface Service {
    id: string;
    profile_id?: string;
    title: string;
    description: string;
    icon: string;
    created_at?: string;
}

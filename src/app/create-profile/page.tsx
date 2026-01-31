'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, Profile } from '@/lib/api';

export default function CreateProfile() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Profile & { confirmPassword?: string }>({
        name: 'Raghav Chawla',
        role: 'Python Developer & Data Science Enthusiast',
        tagline: 'Hi, I am Raghav Chawla',
        bio: 'Crafting intelligent solutions with AI, Machine Learning, and Modern Web Tech.',
        email: 'chawlaraghav78@gmail.com',
        mobile_number: '',
        location: 'Chandigarh, India',
        availability: 'Available for freelance work',
        github: 'https://github.com/RCcoders',
        linkedin: 'https://www.linkedin.com/in/raghav-chawla-29255b275/',
        instagram: 'https://instagram.com/_nx.raghav._',
        twitter: 'https://twitter.com/raghavchawla',
        skills: ['React', 'Next.js', 'Python', 'AWS'],
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const skills = e.target.value.split(',').map(s => s.trim());
        setFormData(prev => ({ ...prev, skills }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        if (!formData.password) {
            alert("Password is required!");
            return;
        }

        setLoading(true);
        try {
            // Remove confirmPassword before sending
            const { confirmPassword, ...profileData } = formData;
            await api.createProfile(profileData);
            alert('Profile created successfully!');

            // Auto-login after creation
            localStorage.setItem('isLoggedIn', 'true');
            router.push('/');
        } catch (error) {
            console.error(error);
            alert('Failed to create profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white py-20 px-4">
            <div className="max-w-2xl mx-auto bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
                <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-sky-400 to-green-400 bg-clip-text text-transparent">Create Your Profile</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none transition-all" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Role / Title</label>
                            <input name="role" value={formData.role} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none transition-all" required />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Tagline</label>
                        <input name="tagline" value={formData.tagline} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none transition-all" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Bio</label>
                        <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none transition-all" required />
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 border-l-4 border-l-sky-500">
                        <h3 className="text-lg font-semibold text-sky-400 mb-4">Security</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                                <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none transition-all" required placeholder="Create a password" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Confirm Password</label>
                                <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none transition-all" required placeholder="Confirm password" />
                            </div>
                        </div>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                            <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none transition-all" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Mobile Number</label>
                            <input name="mobile_number" value={formData.mobile_number} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none transition-all" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
                        <input name="location" value={formData.location} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none transition-all" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Availability</label>
                        <input name="availability" value={formData.availability} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none transition-all" />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-700">
                        <h2 className="text-xl font-semibold text-slate-300">Social Links</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="github" placeholder="GitHub URL" value={formData.github} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none" />
                            <input name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none" />
                            <input name="instagram" placeholder="Instagram URL" value={formData.instagram} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none" />
                            <input name="twitter" placeholder="Twitter URL" value={formData.twitter} onChange={handleChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none" />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700">
                        <label className="block text-sm font-medium text-slate-400 mb-1">Skills (comma separated)</label>
                        <input name="skills" value={formData.skills.join(', ')} onChange={handleSkillsChange} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-500 outline-none transition-all" />
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-sky-600 to-green-600 text-white font-bold py-3 rounded-lg hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-8">
                        {loading ? 'Creating...' : 'Create Profile'}
                    </button>

                    <div className="text-center mt-6">
                        <p className="text-slate-400">
                            Already have an account?{' '}
                            <Link href="/login" className="text-sky-400 hover:text-sky-300 transition-colors hover:underline">
                                Login here
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

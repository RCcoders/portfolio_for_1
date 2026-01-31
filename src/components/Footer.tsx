'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api, Profile } from '@/lib/api';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export default function Footer() {
    const [profile, setProfile] = useState<Profile | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await api.getProfile();
                setProfile(data);
            } catch (error) {
                console.error('Failed to fetch profile for footer', error);
            }
        };
        fetchProfile();
    }, []);

    // Fallback data if profile isn't loaded yet
    const displayProfile = profile || {
        name: 'Portfolio',
        bio: '', // Empty by default to avoid showing incorrect static text
        email: '',
        location: '',
        availability: '',
        github: '',
        linkedin: '',
        twitter: ''
    };

    return (
        <footer className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    {/* Left side - Brand and description */}
                    <div className="text-center md:text-left">
                        <h3 className="text-lg font-semibold text-white mb-2">{displayProfile.name}</h3>
                        <p className="text-gray-500 text-xs mt-2">
                            © {new Date().getFullYear()} {displayProfile.name}. All rights reserved.
                        </p>
                    </div>

                    {/* Center - Quick Links */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-6 text-sm">
                            <Link
                                href="/about"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                About
                            </Link>
                            <Link
                                href="/projects"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                Projects
                            </Link>
                            <Link
                                href="/certifications"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                Certifications
                            </Link>
                            <Link
                                href="/contact"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                Contact
                            </Link>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4">
                            {displayProfile.github && (
                                <a
                                    href={displayProfile.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-200 group"
                                    aria-label="GitHub"
                                >
                                    <FaGithub className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                </a>
                            )}
                            {displayProfile.linkedin && (
                                <a
                                    href={displayProfile.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-200 group"
                                    aria-label="LinkedIn"
                                >
                                    <FaLinkedin className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                </a>
                            )}
                            {displayProfile.twitter && (
                                <a
                                    href={displayProfile.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-200 group"
                                    aria-label="Twitter"
                                >
                                    <FaTwitter className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                </a>
                            )}
                            {displayProfile.email && (
                                <a
                                    href={`mailto:${displayProfile.email}`}
                                    className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-200 group"
                                    aria-label="Email"
                                >
                                    <Mail className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right side - Legal links */}
                    <div className="flex flex-col items-center md:items-end gap-4">
                        <div className="flex gap-4 text-sm">
                            <Link
                                href="/privacy"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                Privacy
                            </Link>
                            <Link
                                href="/terms"
                                className="text-gray-400 hover:text-white transition-colors duration-200"
                            >
                                Terms
                            </Link>
                        </div>

                        {/* Contact info */}
                        <div className="text-center md:text-right">
                            {displayProfile.location && (
                                <p className="text-gray-500 text-xs">Based in {displayProfile.location}</p>
                            )}
                            {displayProfile.availability && (
                                <p className="text-gray-500 text-xs">{displayProfile.availability}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

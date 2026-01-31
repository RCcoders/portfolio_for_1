'use client'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Github, Linkedin, Mail, ArrowDown, TrendingUp, Instagram } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageTransition from '@/components/ui/PageTransition'
import GlowCard from '@/components/ui/GlowCard'
import Hero3D from '@/components/canvas/Hero3D'
import { portfolioData } from '@/data/portfolio'
import { api, Profile, Project } from '@/lib/api'

interface PortfolioContentProps {
    profile: Profile | null;
}

export default function PortfolioContent({ profile }: PortfolioContentProps) {
    const [displayText, setDisplayText] = useState('')
    const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])

    useEffect(() => {
        const fetchProjects = async () => {
            if (!profile?.id) return; // Wait for profile
            try {
                const data = await api.getProjects(profile.id)
                setFeaturedProjects(data.slice(0, 3))
            } catch (error) {
                console.error("Failed to fetch projects", error)
            }
        }
        fetchProjects()
    }, [profile?.id])

    // fallback to portfolioData if no profile passed (shouldn't happen with new logic but good for safety)
    const displayProfile = profile || portfolioData.personal;
    const fullText = displayProfile.name

    useEffect(() => {
        if (!fullText) return;
        let index = 0

        const timer = setInterval(() => {
            if (index <= fullText.length) {
                setDisplayText(fullText.slice(0, index))
                index++
            } else {
                clearInterval(timer)
            }
        }, 150)

        return () => clearInterval(timer)
    }, [fullText])

    return (
        <PageTransition>
            <div className="min-h-screen relative overflow-hidden">
                {/* 3D Background */}
                <Hero3D />

                {/* Main content */}
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center pointer-events-none">
                    {/* Hero section */}
                    <div className="max-w-5xl mx-auto pointer-events-auto">
                        {/* Main heading */}
                        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight tracking-tighter">
                            <motion.span
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1 }}
                                className="inline-block"
                            >
                                Hi, I am
                            </motion.span>
                            <br />
                            <motion.span
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="inline-block bg-gradient-to-r from-sky-400 via-blue-500 to-green-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]"
                            >
                                {displayText}
                                <span className="animate-blink">|</span>
                            </motion.span>
                        </h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed font-light"
                        >
                            {displayProfile.role}. <br className="hidden md:block" />
                            {displayProfile.bio}
                        </motion.p>

                        {/* Tech stack tags - use profile skills if available, else static */}
                        <div className="flex flex-wrap justify-center gap-3 mb-12">
                            {(profile?.skills || portfolioData.skills).map((tech: string, index: number) => (
                                <motion.span
                                    key={tech}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                                    whileHover={{ scale: 1.1, borderColor: '#38BDF8', boxShadow: '0 0 15px rgba(56,189,248,0.3)' }}
                                    className="px-4 py-2 bg-white/5 backdrop-blur-md rounded-full text-sm text-sky-200 border border-white/10 transition-all duration-300 cursor-default shadow-lg"
                                >
                                    {tech}
                                </motion.span>
                            ))}
                        </div>

                        {/* CTA buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.2 }}
                            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
                        >
                            <Link href="/projects" className="group">
                                <button className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-600 to-green-600 text-white rounded-full font-semibold shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.6)] transition-all duration-300 hover:scale-105 transform border border-white/10">
                                    View My Work
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <Link href="/contact" className="group">
                                <button className="flex items-center gap-2 px-8 py-4 bg-white/5 backdrop-blur-md text-white rounded-full font-semibold border border-white/10 hover:bg-white/10 hover:border-sky-500/50 transition-all duration-300 hover:scale-105 transform shadow-lg">
                                    Contact Me
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                        </motion.div>
                    </div>

                    {/* Social links */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1.5 }}
                        className="flex gap-6 mb-8 pointer-events-auto"
                    >
                        {[
                            { icon: Github, href: (profile?.github ?? portfolioData.social.github) || '#', label: 'GitHub' },
                            { icon: Linkedin, href: (profile?.linkedin ?? portfolioData.social.linkedin) || '#', label: 'LinkedIn' },
                            { icon: Instagram, href: (profile?.instagram ?? portfolioData.social.instagram) || '#', label: 'Instagram' },
                            { icon: Mail, href: `mailto:${displayProfile.email}`, label: 'Email' }
                        ].map((social, index) => (
                            <a
                                key={index}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={social.label}
                                className="p-4 bg-white/5 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-white/10 hover:border-sky-500/50 hover:text-sky-300 transition-all duration-300 hover:scale-110 transform shadow-lg hover:shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                            >
                                <social.icon className="w-6 h-6" />
                            </a>
                        ))}
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 1 }}
                        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce pointer-events-auto"
                    >
                        <ArrowDown className="w-6 h-6 text-sky-400" />
                    </motion.div>
                </div>

                {/* Featured work preview section */}
                <div className="relative z-10 px-4 py-24 bg-gradient-to-t from-black via-black/90 to-transparent">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Featured Work</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-green-500 mx-auto rounded-full"></div>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredProjects.map((project: Project, index: number) => {
                                const ProjectIcon = TrendingUp;

                                return (
                                    <motion.div
                                        key={project.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.2 }}
                                    >
                                        <GlowCard className="h-full flex flex-col">
                                            <div className="w-full h-56 bg-gradient-to-br from-sky-500/10 to-green-500/10 rounded-xl mb-6 overflow-hidden relative group-hover:scale-[1.02] transition-transform duration-500 border border-white/5">
                                                {project.image ? (
                                                    <Image
                                                        src={project.image}
                                                        alt={project.title}
                                                        width={400}
                                                        height={250}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                                        <div className="text-center p-6">
                                                            <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-4 mx-auto border border-white/10 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                                                                <ProjectIcon className="w-8 h-8 text-sky-400" />
                                                            </div>
                                                            <span className="text-white/60 text-sm font-medium tracking-wider uppercase">{project.title}</span>
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300"></div>
                                            </div>

                                            <div className="flex-1 flex flex-col">
                                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-sky-300 transition-colors">{project.title}</h3>
                                                <p className="text-gray-400 text-sm mb-6 leading-relaxed flex-1">{project.description}</p>

                                                <div className="flex gap-2 flex-wrap mt-auto">
                                                    {project.tags.map((tag: string, idx: number) => (
                                                        <span
                                                            key={idx}
                                                            className="px-3 py-1 bg-sky-500/10 text-sky-300 text-xs font-medium rounded-full border border-sky-500/20"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </GlowCard>
                                    </motion.div>
                                );
                            })}
                        </div>
                        <div className="text-center mt-16">
                            <Link href="/projects">
                                <button className="px-10 py-4 bg-gradient-to-r from-sky-600 to-green-600 text-white rounded-full font-semibold shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.6)] transition-all duration-300 hover:scale-105 transform border border-white/10">
                                    View All Projects
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Custom animations */}
                <style jsx>{`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
          .animate-blink {
            animation: blink 1s infinite;
          }
        `}</style>
            </div>
        </PageTransition>
    )
}

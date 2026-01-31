'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Github,
  ExternalLink,
  Calendar,
  Code,
  Brain,
  Globe,
  Search,
  ChevronRight,
  Play,
  Award,
  Users,
  Plus,
  Trash2,
  Sparkles,
  Zap,
  Layers,
  Edit2,
  Upload
} from 'lucide-react';
import { api, Project, Profile } from '@/lib/api';
import AddProjectModal from '@/components/AddProjectModal';
import EditProjectModal from '@/components/EditProjectModal';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';
import GlowCard from '@/components/ui/GlowCard';

// Define the Category type
interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userProfile = await api.getProfile();
        setProfile(userProfile);
        if (userProfile?.id) {
          const data = await api.getProjects(userProfile.id);
          setProjects(data);
        } else {
          // Fallback or empty if no profile found
          setProjects([]);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchProjects = async () => {
    // Re-fetch helper if needed, but main load is above
    // Ideally refactor this to reuse the logic
    try {
      const profile = await api.getProfile();
      if (profile?.id) {
        const data = await api.getProjects(profile.id);
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const handleAddProject = (newProject: Project) => {
    setProjects([...projects, newProject]);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.deleteProject(id);
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project');
    }
  };

  const categories: Category[] = [
    { id: 'all', name: 'All Projects', icon: Layers, count: projects.length },
    { id: 'machine-learning', name: 'Machine Learning', icon: Brain, count: projects.filter(p => p.category === 'machine-learning').length },
    { id: 'python-development', name: 'Python Model', icon: Zap, count: projects.filter(p => p.category === 'python-development').length },
    { id: 'web-development', name: 'Development', icon: Globe, count: projects.filter(p => p.category === 'web-development').length }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = activeFilter === 'all' || project.category === activeFilter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const ProjectCard = ({ project }: { project: Project }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [projectImage, setProjectImage] = useState(project.image);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      const savedImage = localStorage.getItem(`project-image-${project.id}`);
      if (savedImage) {
        setProjectImage(savedImage);
      }
    }, [project.id]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setProjectImage(base64String);
          if (project.id) {
            localStorage.setItem(`project-image-${project.id}`, base64String);
          }
        };
        reader.readAsDataURL(file);
      }
    };

    const triggerFileInput = () => {
      fileInputRef.current?.click();
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'completed': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
        case 'in-progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        case 'planned': return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
        default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'completed': return <Award className="w-3 h-3" />;
        case 'in-progress': return <Play className="w-3 h-3" />;
        case 'planned': return <Calendar className="w-3 h-3" />;
        default: return <Code className="w-3 h-3" />;
      }
    };

    return (
      <GlowCard className="h-full flex flex-col group hover:bg-white/5 transition-all duration-300">
        {/* Action Buttons */}
        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(project);
            }}
            className="p-2 bg-blue-500/80 hover:bg-blue-600 text-white rounded-full transition-all transform hover:scale-110 shadow-lg"
            title="Edit Project"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (project.id) handleDeleteProject(project.id);
            }}
            className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-all transform hover:scale-110 shadow-lg"
            title="Delete Project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Project Image */}
        <div className="relative h-56 overflow-hidden rounded-xl mb-6 border border-white/5">
          <Image
            src={projectImage}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 600px"
            priority
            onError={() => setProjectImage('https://via.placeholder.com/600x400?text=Project+Image')}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>

          {/* Image Upload Overlay */}
          <div
            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer z-10"
            onClick={(e) => {
              e.stopPropagation();
              triggerFileInput();
            }}
          >
            <div className="text-white flex flex-col items-center">
              <div className="p-3 bg-white/10 rounded-full mb-2 backdrop-blur-sm">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">Change Photo</span>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <div className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-md ${getStatusColor(project.status)}`}>
              {getStatusIcon(project.status)}
              <span className="ml-1.5 capitalize tracking-wide">{project.status.replace('-', ' ')}</span>
            </div>
          </div>

          {/* Category Badge */}
          <div className="absolute bottom-4 left-4">
            <div className="bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 flex items-center">
              <Sparkles className="w-3 h-3 mr-1.5 text-yellow-400" />
              {project.category.replace('-', ' ').toUpperCase()}
            </div>
          </div>
        </div>

        {/* Project Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400 transition-colors">
              {project.title}
            </h3>

            <div className="flex items-center text-gray-400 text-sm mb-4 flex-wrap gap-y-2">
              <div className="flex items-center mr-4">
                <Calendar className="w-4 h-4 mr-1.5 text-blue-400" />
                <span>{project.date ? new Date(project.date).toLocaleDateString() : 'No Date'}</span>
              </div>
              {project.duration && (
                <div className="flex items-center mr-4">
                  <span className="w-1 h-1 bg-gray-500 rounded-full mr-4"></span>
                  <span>{project.duration}</span>
                </div>
              )}
              {project.client && (
                <div className="flex items-center">
                  <span className="w-1 h-1 bg-gray-500 rounded-full mr-4"></span>
                  <span>{project.client}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm mb-6 leading-relaxed flex-1">
            {isExpanded ? (project.longDescription || project.description) : project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.slice(0, isExpanded ? project.tags.length : 4).map((tag, index) => (
              <span key={index} className="px-2.5 py-1 bg-blue-500/10 text-blue-300 rounded-md text-xs font-medium border border-blue-500/20">
                {tag}
              </span>
            ))}
            {!isExpanded && project.tags.length > 4 && (
              <span className="px-2.5 py-1 bg-gray-700/50 text-gray-400 rounded-md text-xs border border-gray-600">
                +{project.tags.length - 4} more
              </span>
            )}
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6 mb-6 overflow-hidden border-t border-gray-700/50 pt-4"
              >
                {/* Features */}
                {project.features && project.features.length > 0 && (
                  <div>
                    <h4 className="text-white font-semibold mb-3 text-sm flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                      Key Features
                    </h4>
                    <ul className="text-gray-300 text-sm space-y-2">
                      {project.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technologies */}
                {project.technologies && Object.keys(project.technologies).length > 0 && (
                  <div>
                    <h4 className="text-white font-semibold mb-3 text-sm flex items-center">
                      <Code className="w-4 h-4 mr-2 text-green-400" />
                      Technology Stack
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(project.technologies).map(([category, techs]) => (
                        <div key={category} className="text-sm bg-gray-800/50 p-3 rounded-lg border border-gray-700/50">
                          <span className="text-blue-400 font-medium capitalize block mb-1">{category}</span>
                          <span className="text-gray-300">{Array.isArray(techs) ? techs.join(', ') : techs}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metrics */}
                {project.metrics && Object.keys(project.metrics).length > 0 && (
                  <div>
                    <h4 className="text-white font-semibold mb-3 text-sm flex items-center">
                      <Award className="w-4 h-4 mr-2 text-green-400" />
                      Project Metrics
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(project.metrics).map(([key, value]) => (
                        <div key={key} className="bg-gray-800/50 p-3 rounded-lg text-center border border-gray-700/50">
                          <div className="text-blue-400 font-bold text-lg">{value as string}</div>
                          <div className="text-gray-400 text-xs capitalize mt-1">{key.replace(/([A-Z])/g, ' $1')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-700/50">
            <div className="flex space-x-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all duration-200 text-sm font-medium border border-gray-700 hover:border-gray-600"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Code
                </a>
              )}

              {project.liveUrl && project.liveUrl !== '#' && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </a>
              )}
            </div>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors duration-200 flex items-center"
            >
              {isExpanded ? 'Show Less' : 'Show More'}
              <ChevronRight className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${isExpanded ? 'rotate-[-90deg]' : 'rotate-90'}`} />
            </button>
          </div>
        </div>
      </GlowCard>
    );
  };

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
        </div>

        <AddProjectModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onProjectAdded={handleAddProject}
          profileId={profile?.id}
        />

        {editingProject && (
          <EditProjectModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingProject(null);
            }}
            onProjectUpdated={handleUpdateProject}
            project={editingProject}
          />
        )}

        {/* Hero Section */}
        <div className="relative">
          <div className="relative max-w-7xl mx-auto px-4 py-24">
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Portfolio Showcase
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                  My{' '}
                  <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
                    Projects
                  </span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12 font-light"
              >
                A showcase of my Python development projects including GUI applications,
                web development, machine learning, and game development. Each project
                demonstrates different aspects of software development and problem-solving.
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-3 gap-3 md:gap-6 max-w-2xl mx-auto"
              >
                <div className="bg-white/5 backdrop-blur-sm px-4 md:px-6 py-4 rounded-2xl border border-white/10 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-1">{projects.length}</div>
                  <div className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider">Projects</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm px-4 md:px-6 py-4 rounded-2xl border border-white/10 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-emerald-400 mb-1">
                    {projects.filter(p => p.status === 'completed').length}
                  </div>
                  <div className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider">Completed</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm px-4 md:px-6 py-4 rounded-2xl border border-white/10 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-sky-400 mb-1">
                    {projects.filter(p => p.status === 'in-progress').length}
                  </div>
                  <div className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider">In Progress</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-24">
          {/* Filters and Search */}
          <div className="mb-16">
            {/* Search Bar and Add Button */}
            <div className="flex flex-col md:flex-row gap-6 mb-10">
              <div className="relative flex-1 group">
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search projects by name, description, or technology..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
                />
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-sky-600 to-green-600 hover:from-sky-700 hover:to-green-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-sky-600/20 hover:shadow-sky-600/40 hover:scale-105 transform"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Project
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 border ${activeFilter === category.id
                    ? 'bg-sky-600 text-white border-sky-500 shadow-lg shadow-sky-600/25'
                    : 'bg-gray-800/30 text-gray-400 hover:bg-gray-700/50 border-gray-700 hover:text-white'
                    }`}
                >
                  <category.icon className={`w-4 h-4 mr-2 ${activeFilter === category.id ? 'text-white' : 'text-gray-500'}`} />
                  <span className="font-medium">{category.name}</span>
                  <span className={`ml-3 px-2 py-0.5 rounded-full text-xs font-bold ${activeFilter === category.id ? 'bg-white/20 text-white' : 'bg-gray-700 text-gray-400'}`}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="text-center py-32">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-sky-500/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-sky-500 rounded-full animate-spin"></div>
              </div>
              <p className="text-gray-400 text-lg font-medium">Loading projects...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <AnimatePresence>
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id || Math.random()}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* No Results */}
          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/5">
              <div className="bg-gray-800/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-gray-500 opacity-50" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">No projects found</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                We couldn&apos;t find any projects matching your search terms or filters. Try adjusting your criteria.
              </p>
              <button
                onClick={() => { setSearchTerm(''); setActiveFilter('all'); }}
                className="mt-8 px-6 py-3 bg-sky-600/20 text-sky-400 hover:bg-sky-600/30 rounded-xl font-medium transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-24 text-center bg-gradient-to-r from-sky-900/20 to-green-900/20 p-16 rounded-3xl border border-white/10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-green-500"></div>
            <div className="bg-sky-500/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-12">
              <Users className="w-10 h-10 text-sky-400" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">Interested in Working Together?</h2>
            <p className="text-gray-300 mb-10 max-w-2xl mx-auto text-lg">
              I am always excited to take on new challenges and bring innovative ideas to life.
              Let us discuss how we can create something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => window.open('https://codesandbox.io', '_blank')}
                className="flex items-center px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-xl transition-all duration-300 font-bold shadow-lg hover:scale-105 transform">
                <Users className="w-5 h-5 mr-2" />
                Start a Project
              </button>
              <button
                onClick={() => window.open('https://github.com/RCCoders', '_blank')}
                className="flex items-center px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all duration-300 font-bold border border-gray-700 hover:border-gray-600 shadow-lg hover:scale-105 transform">
                <Github className="w-5 h-5 mr-2" />
                View All on GitHub
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

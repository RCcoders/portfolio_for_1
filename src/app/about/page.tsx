'use client';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Award,
  BookOpen,
  MapPin,
  Mail,
  Edit,
  Globe,
  Plus,
  Trash2,
  Heart,
  Sparkles,
  Download,
  Github,
  Linkedin,
  Zap,
  Cpu,
  Upload // Added Upload icon
} from 'lucide-react';
import {
  FaPython, FaJava, FaJs, FaCode,
  FaProjectDiagram, FaBrain,
  FaHtml5, FaCss3Alt, FaReact,
  FaDatabase,
  FaGitAlt, FaGithub,
  FaUsers, FaComments, FaLightbulb
} from "react-icons/fa";
import {
  SiCplusplus,
  SiNextdotjs, SiTailwindcss,
  SiMysql, SiPostgresql, SiMongodb
} from "react-icons/si";
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';
import GlowCard from '@/components/ui/GlowCard';

import { api, Profile, Experience, Interest, Service } from '@/lib/api';
import AddExperienceModal from '@/components/AddExperienceModal';
import AddInterestModal from '@/components/AddInterestModal';
import AddServiceModal from '@/components/AddServiceModal';
import EditOverviewModal from '@/components/EditOverviewModal';
import EditProfileAssetsModal from '@/components/EditProfileAssetsModal';

// Map icon names to components
const IconMap: { [key: string]: any } = {
  // Lucide defaults
  Globe, Award, Heart,

  // React Icons
  // Programming Languages
  FaPython, FaJava, FaJs, FaCode, SiCplusplus,

  // DSA
  FaProjectDiagram, FaBrain,

  // Web Dev
  FaHtml5, FaCss3Alt, FaReact, SiNextdotjs, SiTailwindcss,

  // Database
  FaDatabase, SiMysql, SiPostgresql, SiMongodb,

  // Version Control
  FaGitAlt, FaGithub,

  // Soft Skills
  FaUsers, FaComments, FaLightbulb
};

export default function AboutPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Modals
  const [showAddExperience, setShowAddExperience] = useState(false);
  const [showAddInterest, setShowAddInterest] = useState(false);
  const [showAddService, setShowAddService] = useState(false);
  const [showEditOverview, setShowEditOverview] = useState(false);
  const [showEditAssets, setShowEditAssets] = useState(false);

  useEffect(() => {
    const checkauth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
    };
    checkauth();

    const fetchData = async () => {
      try {
        const profileData = await api.getProfile();
        if (profileData) {
          setProfile(profileData);
          // If the backend returns them nested (as per my cached crud update), use them
          // Otherwise fetch separately
          if (profileData.experiences) setExperiences(profileData.experiences);
          else {
            const exps = await api.getExperiences(profileData.id!);
            setExperiences(exps);
          }

          if (profileData.interests) setInterests(profileData.interests);
          else {
            const ints = await api.getInterests(profileData.id!);
            setInterests(ints);
          }

          if (profileData.services) setServices(profileData.services);
          else {
            const servs = await api.getServices(profileData.id!);
            setServices(servs);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  const handleDeleteExperience = async (id: string) => {
    if (confirm('Are you sure you want to delete this experience?')) {
      try {
        await api.deleteExperience(id);
        setExperiences(prev => prev.filter(e => e.id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteInterest = async (id: string) => {
    if (confirm('Are you sure you want to delete this interest?')) {
      try {
        await api.deleteInterest(id);
        setInterests(prev => prev.filter(i => i.id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDeleteService = async (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      try {
        await api.deleteService(id);
        setServices(prev => prev.filter(s => s.id !== id));
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (!profile) return <div className="text-white text-center py-20">Loading profile...</div>;

  return (
    <PageTransition>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
        </div>

        {/* Hero Section */}
        <div className="relative">
          <div className="relative max-w-7xl mx-auto px-4 py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-blue-500/10 rounded-lg mr-3 border border-blue-500/20">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-blue-400 font-medium tracking-wide uppercase text-sm">Welcome to my world</span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
                  Hi, I am{' '}
                  <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-green-400 bg-clip-text text-transparent">
                    {profile.name}
                  </span>
                </h1>

                <p className="text-xl text-gray-300 mb-10 leading-relaxed font-light border-l-4 border-green-500/50 pl-6">
                  {profile.role} <br />
                  <span className="text-sm mt-2 block opacity-75">{profile.bio}</span>
                </p>

                <div className="flex flex-wrap gap-4 mb-10">
                  {profile.resume_url && (
                    <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" download>
                      <button className="flex items-center px-8 py-4 bg-gradient-to-r from-sky-600 to-green-600 hover:from-sky-700 hover:to-green-700 text-white rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] hover:scale-105 transform font-medium">
                        <Download className="w-5 h-5 mr-2" />
                        Download Resume
                      </button>
                    </a>
                  )}
                  {isLoggedIn && (
                    <button
                      onClick={() => setShowEditAssets(true)}
                      className="flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 border border-white/10 hover:border-green-500/50 hover:scale-105 transform font-medium"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      {profile.resume_url ? 'Update Resume/Image' : 'Upload Resume/Image'}
                    </button>
                  )}
                  <a
                    href="/contact"
                    className="flex items-center px-8 py-4 border border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all duration-300 hover:border-green-500/50 hover:scale-105 transform backdrop-blur-sm font-medium"
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    Get In Touch
                  </a>
                </div>

                <div className="flex items-center space-x-8 pt-8 border-t border-white/10">
                  <div className="flex items-center text-gray-400">
                    <MapPin className="w-5 h-5 mr-2 text-green-400" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex space-x-4">
                    {profile.github && (
                      <a href={profile.github} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all hover:scale-110 group">
                        <Github className="w-5 h-5 text-gray-400 group-hover:text-white" />
                      </a>
                    )}
                    {profile.linkedin && (
                      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-all hover:scale-110 group">
                        <Linkedin className="w-5 h-5 text-gray-400 group-hover:text-white" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Right Content - Profile Image */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative flex justify-center lg:justify-end"
              >
                {/* Image display logic remains (omitted for brevity if using next/image fallback) */}
                <div className="relative w-80 h-80 lg:w-96 lg:h-96 group">
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-500 to-green-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 animate-pulse"></div>
                  <div className="relative w-full h-full rounded-full p-2 border-2 border-dashed border-white/20 animate-[spin_10s_linear_infinite]"></div>
                  <div className="absolute inset-2 z-30 rounded-full overflow-hidden border-4 border-white/10 group-hover:border-green-500/50 transition-colors duration-500 shadow-2xl relative">
                    <Image
                      src={profile.image_url || '/images/MyImage.jpeg'}
                      alt={profile.name}
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-700"
                      priority
                    />
                    {isLoggedIn && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => setShowEditAssets(true)}>
                        <div className="text-white flex flex-col items-center">
                          <Edit className="w-8 h-8 mb-2" />
                          <span className="font-medium">Change Photo</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        {/* Keeping hardcoded stats for now as they aren't in schema yet */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* ... Stats grid ... */}
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 pb-24">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-16">
            <div className="bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 flex flex-wrap justify-center gap-2">
              {[
                { id: 'overview', label: 'Overview', icon: Globe },
                { id: 'experience', label: 'Experience', icon: Award },
                { id: 'interests', label: 'Interests', icon: Heart }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 md:px-6 py-2.5 md:py-3 rounded-full transition-all duration-300 font-medium text-sm md:text-base ${activeTab === tab.id
                    ? 'text-white bg-gradient-to-r from-sky-600 to-green-600 shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <tab.icon className="w-4 h-4 mr-1.5 md:mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-16"
                >
                  <div className="space-y-8">
                    <div className="flex justify-between items-center">
                      <h2 className="text-3xl font-bold text-white flex items-center">
                        <span className="w-1 h-8 bg-blue-500 rounded-full mr-4"></span>
                        Professional Overview
                      </h2>
                      {isLoggedIn && (
                        <button onClick={() => setShowEditOverview(true)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                          <Edit className="w-5 h-5 text-sky-400" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-6 text-gray-300 leading-relaxed text-lg font-light whitespace-pre-line">
                      {profile.about_text || "No overview provided yet."}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-3xl font-bold text-white flex items-center">
                        <span className="w-1 h-8 bg-green-500 rounded-full mr-4"></span>
                        What I Do
                      </h2>
                      {isLoggedIn && (
                        <button onClick={() => setShowAddService(true)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                          <Plus className="w-5 h-5 text-green-400" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {services.map((service, index) => {
                        const IconComponent = IconMap[service.icon] || Zap;
                        return (
                          <GlowCard key={service.id || index} className="flex items-center space-x-6 p-6 hover:bg-white/5 transition-colors relative group">
                            {isLoggedIn && (
                              <button
                                onClick={() => handleDeleteService(service.id)}
                                className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                              <IconComponent className="w-8 h-8 text-sky-400" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-white mb-1">{service.title}</h3>
                              <p className="text-gray-400">{service.description}</p>
                            </div>
                          </GlowCard>
                        );
                      })}
                      {services.length === 0 && <p className="text-gray-500">No services added yet.</p>}
                    </div>
                  </div>
                </motion.div>
              )}


              {/* Experience Tab */}
              {activeTab === 'experience' && (
                <motion.div
                  key="experience"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-bold text-white text-center w-full">Professional Journey</h2>
                    {isLoggedIn && (
                      <button
                        onClick={() => setShowAddExperience(true)}
                        className="absolute right-0 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        <Plus className="w-5 h-5 mr-1" /> Add
                      </button>
                    )}
                  </div>

                  <div className="space-y-12 relative">
                    {/* Timeline Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sky-500 via-green-500 to-transparent hidden md:block"></div>

                    {experiences.map((exp, index) => (
                      <motion.div
                        key={exp.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="relative pl-0 md:pl-20"
                      >
                        {/* Timeline Dot */}
                        <div className="absolute left-[27px] top-8 w-4 h-4 bg-blue-500 rounded-full ring-4 ring-black hidden md:block shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>

                        <GlowCard className="p-8 group hover:bg-white/5 transition-colors relative">
                          {isLoggedIn && (
                            <button
                              onClick={() => handleDeleteExperience(exp.id)}
                              className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div>
                              <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{exp.role}</h3>
                              <p className="text-gray-400 font-medium flex items-center text-lg">
                                <Award className="w-5 h-5 mr-2 text-green-400" />
                                {exp.company}
                              </p>
                            </div>
                            <span className="mt-2 md:mt-0 text-blue-300 font-medium bg-blue-500/10 px-4 py-2 rounded-full text-sm border border-blue-500/20">{exp.period}</span>
                          </div>
                          <p className="text-gray-300 leading-relaxed text-lg font-light whitespace-pre-line">{exp.description}</p>
                        </GlowCard>
                      </motion.div>
                    ))}
                    {experiences.length === 0 && <p className="text-gray-500 text-center">No experiences added yet.</p>}
                  </div>
                </motion.div>
              )}

              {/* Interests Tab */}
              {activeTab === 'interests' && (
                <motion.div
                  key="interests"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-12 relative">
                    <h2 className="text-3xl font-bold text-white w-full text-center">What Drives Me</h2>
                    {isLoggedIn && (
                      <button
                        onClick={() => setShowAddInterest(true)}
                        className="absolute right-0 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        <Plus className="w-5 h-5 mr-1" /> Add
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {interests.map((interest, index) => {
                      const IconComponent = IconMap[interest.icon] || Heart;
                      return (
                        <motion.div
                          key={interest.id || index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <GlowCard className="p-8 h-full hover:bg-white/5 transition-all duration-300 group relative">
                            {isLoggedIn && (
                              <button
                                onClick={() => handleDeleteInterest(interest.id)}
                                className="absolute top-4 right-4 p-2 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            )}
                            <div className="flex items-center mb-6">
                              <div className="bg-gradient-to-br from-sky-600/20 to-green-600/20 p-4 rounded-2xl mr-5 group-hover:scale-110 transition-transform duration-300 border border-white/5">
                                <IconComponent className="w-8 h-8 text-blue-400" />
                              </div>
                              <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">{interest.title}</h3>
                            </div>
                            <p className="text-gray-300 leading-relaxed text-lg">{interest.description}</p>
                          </GlowCard>
                        </motion.div>
                      );
                    })}
                    {interests.length === 0 && <p className="text-gray-500 text-center col-span-2">No interests added yet.</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddExperienceModal
        isOpen={showAddExperience}
        onClose={() => setShowAddExperience(false)}
        onAdd={(newExp) => setExperiences([...experiences, newExp])}
        profileId={profile.id!}
      />

      <AddInterestModal
        isOpen={showAddInterest}
        onClose={() => setShowAddInterest(false)}
        onAdd={(newInt) => setInterests([...interests, newInt])}
        profileId={profile.id!}
      />

      <AddServiceModal
        isOpen={showAddService}
        onClose={() => setShowAddService(false)}
        onAdd={(newService) => setServices([...services, newService])}
        profileId={profile.id!}
      />

      <EditOverviewModal
        isOpen={showEditOverview}
        onClose={() => setShowEditOverview(false)}
        onSave={(text) => setProfile({ ...profile, about_text: text })}
        currentText={profile.about_text || ''}
        profileId={profile.id!}
        profileData={profile}
      />

      <EditProfileAssetsModal
        isOpen={showEditAssets}
        onClose={() => setShowEditAssets(false)}
        onSave={(updated) => setProfile(updated)}
        profile={profile}
      />

    </PageTransition>
  );
}

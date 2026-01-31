'use client';

import React, { useState, useEffect } from 'react';
import CertCard from '@/components/CertCard';
import { api, Certificate, Profile } from '@/lib/api';
import AddCertificateModal from '@/components/AddCertificateModal';
import EditCertificateModal from '@/components/EditCertificateModal';
import { Plus, Trash2, Edit2, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';
import GlowCard from '@/components/ui/GlowCard';

// Certification Card Component
interface CertificationCardProps {
  cert: Certificate;
  index: number;
  onEdit: (cert: Certificate) => void;
  onDelete: (id: string) => void;
}

function CertificationCard({ cert, index, onEdit, onDelete }: CertificationCardProps) {
  const [certImage, setCertImage] = React.useState(cert.image);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const savedImage = localStorage.getItem(`cert-image-${cert.id}`);
    if (savedImage) {
      setCertImage(savedImage);
    }
  }, [cert.id]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCertImage(base64String);
        if (cert.id) {
          localStorage.setItem(`cert-image-${cert.id}`, base64String);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      {/* Action Buttons */}
      <div className="absolute top-2 right-2 z-20 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => {
            e.preventDefault();
            onEdit(cert);
          }}
          className="p-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-full transition-all transform hover:scale-110 shadow-lg"
          title="Edit Certificate"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            if (cert.id) onDelete(cert.id);
          }}
          className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition-all transform hover:scale-110 shadow-lg"
          title="Delete Certificate"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Image Upload Overlay */}
      <div
        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 rounded-xl pointer-events-none"
      >
        <div
          className="text-white flex flex-col items-center cursor-pointer pointer-events-auto"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            triggerFileInput();
          }}
        >
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

      <CertCard
        slug={cert.slug}
        title={cert.title}
        issuer={cert.issuer}
        date={cert.date}
        imageUrl={certImage}
        description={cert.description}
        credentialUrl={cert.credentialUrl}
      />
    </motion.div>
  );
}

// Main Certifications Page Component
// ... imports
export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certificate[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userProfile = await api.getProfile();
        setProfile(userProfile);
        if (userProfile?.id) {
          const data = await api.getCertificates(userProfile.id);
          setCertifications(data);
        } else {
          setCertifications([]);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchCertifications = async () => {
    try {
      if (profile?.id) {
        const data = await api.getCertificates(profile.id);
        setCertifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    }
  };

  const handleAddCertificate = (newCert: Certificate) => {
    setCertifications([...certifications, newCert]);
  };

  const handleUpdateCertificate = (updatedCert: Certificate) => {
    setCertifications(certifications.map(c => c.id === updatedCert.id ? updatedCert : c));
  };

  const handleEditClick = (certificate: Certificate) => {
    setEditingCertificate(certificate);
    setIsEditModalOpen(true);
  };

  const handleDeleteCertificate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    try {
      await api.deleteCertificate(id);
      setCertifications(certifications.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete certificate:', error);
      alert('Failed to delete certificate');
    }
  };

  // 🔹 Dynamic Stats
  const totalCerts = certifications.length;
  const uniqueProviders = new Set(certifications.map(cert => cert.issuer)).size;

  const validYears = certifications
    .map(cert => new Date(cert.date).getFullYear())
    .filter(year => !isNaN(year));

  const latestYear = validYears.length > 0 ? Math.max(...validYears) : new Date().getFullYear();

  return (
    <PageTransition>
      <div className="min-h-screen">
        <AddCertificateModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onCertificateAdded={handleAddCertificate}
          profileId={profile?.id}
        />

        {editingCertificate && (
          <EditCertificateModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingCertificate(null);
            }}
            onCertificateUpdated={handleUpdateCertificate}
            certificate={editingCertificate}
          />
        )}

        <div className="max-w-6xl mx-auto py-12 px-4">
          {/* Header Section */}
          <div className="text-center mb-12 relative">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl font-bold mb-4 bg-gradient-to-r from-sky-400 to-green-500 bg-clip-text text-transparent"
            >
              Professional Certifications
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-400 text-lg max-w-2xl mx-auto"
            >
              A collection of professional certifications demonstrating expertise across various technologies and domains
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-6 flex justify-center gap-4"
            >
              <div className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full text-sm font-medium border border-blue-500/30">
                {totalCerts} Certifications Earned
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors shadow-lg shadow-blue-600/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Certificate
              </button>
            </motion.div>
          </div>

          {/* Certifications Grid */}
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading certifications...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certifications.map((cert, index) => (
                <CertificationCard
                  key={cert.id || cert.slug}
                  cert={cert}
                  index={index}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteCertificate}
                />
              ))}
            </div>
          )}

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <GlowCard className="text-center p-6">
                <div className="text-3xl font-bold text-blue-400 mb-2">{totalCerts}</div>
                <div className="text-gray-400">Total Certifications</div>
              </GlowCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <GlowCard className="text-center p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">{uniqueProviders}</div>
                <div className="text-gray-400">Different Providers</div>
              </GlowCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <GlowCard className="text-center p-6">
                <div className="text-3xl font-bold text-sky-400 mb-2">{latestYear}</div>
                <div className="text-gray-400">Latest Achievement</div>
              </GlowCard>
            </motion.div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Certificate, api } from '@/lib/api';

interface AddCertificateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCertificateAdded: (certificate: Certificate) => void;
    profileId?: string;
}

export default function AddCertificateModal({ isOpen, onClose, onCertificateAdded, profileId }: AddCertificateModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Certificate>>({
        title: '',
        issuer: '',
        date: '',
        image: '',
        description: '',
        credentialUrl: '',
        slug: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newCertificate: Certificate = {
                title: formData.title || 'Untitled',
                issuer: formData.issuer || '',
                date: formData.date || new Date().toISOString().split('T')[0],
                image: formData.image || 'https://via.placeholder.com/300x200',
                description: formData.description || '',
                credentialUrl: formData.credentialUrl || '#',
                slug: formData.slug || (formData.title || 'untitled').toLowerCase().replace(/\s+/g, '-'),
                longDescription: formData.longDescription,
                skills: formData.skills || [],
                duration: formData.duration,
                level: formData.level,
                modules: formData.modules || [],
                profile_id: profileId
            };

            const created = await api.createCertificate(newCertificate);
            onCertificateAdded(created);
            onClose();
        } catch (error) {
            console.error('Failed to create certificate:', error);
            alert('Failed to create certificate. See console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Add New Certificate</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Issuer</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.issuer}
                                onChange={e => setFormData({ ...formData, issuer: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                            <input
                                type="date"
                                required
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Slug (optional)</label>
                            <input
                                type="text"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.slug}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="auto-generated-if-empty"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea
                            required
                            rows={3}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                            <input
                                type="text"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.image}
                                onChange={e => setFormData({ ...formData, image: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Credential URL</label>
                            <input
                                type="text"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.credentialUrl}
                                onChange={e => setFormData({ ...formData, credentialUrl: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Long Description (Optional)</label>
                        <textarea
                            rows={3}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.longDescription || ''}
                            onChange={e => setFormData({ ...formData, longDescription: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Duration (e.g., &quot;4 weeks&quot;)</label>
                            <input
                                type="text"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.duration || ''}
                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Level (e.g., &quot;Intermediate&quot;)</label>
                            <input
                                type="text"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.level || ''}
                                onChange={e => setFormData({ ...formData, level: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Skills (comma separated)</label>
                        <input
                            type="text"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Python, Data Analysis, ..."
                            value={formData.skills ? formData.skills.join(', ') : ''}
                            onChange={e => setFormData({ ...formData, skills: e.target.value.split(',').map(s => s.trim()) })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Modules (comma separated)</label>
                        <textarea
                            rows={2}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Module 1, Module 2, ..."
                            value={formData.modules ? formData.modules.join(', ') : ''}
                            onChange={e => setFormData({ ...formData, modules: e.target.value.split(',').map(s => s.trim()) })}
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Adding...' : 'Add Certificate'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

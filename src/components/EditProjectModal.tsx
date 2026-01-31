'use client';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Project, api } from '@/lib/api';

interface EditProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProjectUpdated: (project: Project) => void;
    project: Project;
}

export default function EditProjectModal({ isOpen, onClose, onProjectUpdated, project }: EditProjectModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Project>>({});
    const [tagsInput, setTagsInput] = useState('');
    const [featuresInput, setFeaturesInput] = useState('');
    const [technologiesInput, setTechnologiesInput] = useState('');
    const [metricsInput, setMetricsInput] = useState('');

    useEffect(() => {
        if (isOpen && project) {
            setFormData(project);
            setTagsInput(project.tags?.join(', ') || '');
            setFeaturesInput(project.features?.join('\n') || '');

            // Convert technologies object to string
            const techStr = Object.entries(project.technologies || {})
                .map(([category, techs]) => `${category}: ${Array.isArray(techs) ? techs.join(', ') : techs}`)
                .join('\n');
            setTechnologiesInput(techStr);

            // Convert metrics object to string
            const metricsStr = Object.entries(project.metrics || {})
                .map(([key, value]) => `${key}: ${value}`)
                .join('\n');
            setMetricsInput(metricsStr);
        }
    }, [isOpen, project]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedProject: Project = {
                ...project,
                title: formData.title || 'Untitled',
                description: formData.description || '',
                image: formData.image || 'https://via.placeholder.com/600x400',
                category: formData.category || 'web-development',
                status: (formData.status as Project['status']) || 'planned',
                tags: tagsInput.split(',').map(t => t.trim()).filter(t => t),
                githubUrl: formData.githubUrl,
                liveUrl: formData.liveUrl,
                longDescription: formData.longDescription,
                duration: formData.duration,
                client: formData.client,
                features: featuresInput.split('\n').filter(line => line.trim()),
                technologies: (() => {
                    const techs: Record<string, string[]> = {};
                    technologiesInput.split('\n').forEach(line => {
                        const [category, items] = line.split(':');
                        if (category && items) {
                            techs[category.trim()] = items.split(',').map(i => i.trim()).filter(i => i);
                        }
                    });
                    return techs;
                })(),
                metrics: (() => {
                    const metrics: Record<string, string> = {};
                    metricsInput.split('\n').forEach(line => {
                        const [key, value] = line.split(':');
                        if (key && value) {
                            metrics[key.trim()] = value.trim();
                        }
                    });
                    return metrics;
                })()
            };

            if (project.id) {
                const updated = await api.updateProject(project.id, updatedProject);
                onProjectUpdated(updated);
                onClose();
            }
        } catch (error) {
            console.error('Failed to update project:', error);
            alert('Failed to update project. See console for details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">Edit Project</h2>
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
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 outline-none"
                                value={formData.title || ''}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                            <select
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 outline-none"
                                value={formData.category || 'web-development'}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="web-development">Web Development</option>
                                <option value="python-development">Python Development</option>
                                <option value="machine-learning">Machine Learning</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea
                            required
                            rows={3}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.description || ''}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                            <input
                                type="text"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 outline-none"
                                value={formData.image || ''}
                                onChange={e => setFormData({ ...formData, image: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                            <select
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 outline-none"
                                value={formData.status || 'planned'}
                                onChange={e => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                            >
                                <option value="planned">Planned</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">GitHub URL</label>
                            <input
                                type="text"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 outline-none"
                                value={formData.githubUrl || ''}
                                onChange={e => setFormData({ ...formData, githubUrl: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Live URL</label>
                            <input
                                type="text"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 outline-none"
                                value={formData.liveUrl || ''}
                                onChange={e => setFormData({ ...formData, liveUrl: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Duration</label>
                            <input
                                type="text"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 outline-none"
                                value={formData.duration || ''}
                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                placeholder="e.g., 3 months"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Client</label>
                            <input
                                type="text"
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 outline-none"
                                value={formData.client || ''}
                                onChange={e => setFormData({ ...formData, client: e.target.value })}
                                placeholder="e.g., Company Name"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma separated)</label>
                        <input
                            type="text"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={tagsInput}
                            onChange={e => setTagsInput(e.target.value)}
                            placeholder="React, TypeScript, Tailwind..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Long Description (Optional)</label>
                        <textarea
                            rows={4}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.longDescription || ''}
                            onChange={e => setFormData({ ...formData, longDescription: e.target.value })}
                            placeholder="Detailed description of the project..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Features (One per line)</label>
                        <textarea
                            rows={3}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="User Authentication&#10;Real-time Updates&#10;Responsive Design"
                            value={featuresInput}
                            onChange={e => setFeaturesInput(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Technologies (Category: Tech1, Tech2... one per line)</label>
                        <textarea
                            rows={3}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Frontend: React, Tailwind&#10;Backend: Python, FastAPI&#10;Database: PostgreSQL"
                            value={technologiesInput}
                            onChange={e => setTechnologiesInput(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Metrics (Label: Value one per line)</label>
                        <textarea
                            rows={2}
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Performance: 98/100&#10;Users: 10k+"
                            value={metricsInput}
                            onChange={e => setMetricsInput(e.target.value)}
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
                            className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating...' : 'Update Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

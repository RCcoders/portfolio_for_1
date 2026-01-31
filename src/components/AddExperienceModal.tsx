import React, { useState } from 'react';
import { X } from 'lucide-react';
import { api, Experience } from '@/lib/api';

interface AddExperienceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (experience: Experience) => void;
    profileId: string;
}

export default function AddExperienceModal({ isOpen, onClose, onAdd, profileId }: AddExperienceModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        role: '',
        company: '',
        period: '',
        description: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newExperience = await api.createExperience({ ...formData, profile_id: profileId });
            onAdd(newExperience);
            onClose();
            setFormData({ role: '', company: '', period: '', description: '' });
        } catch (error) {
            console.error(error);
            alert('Failed to add experience');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-2xl w-full max-w-lg border border-slate-700 shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">Add Experience</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Role</label>
                        <input
                            required
                            value={formData.role}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 outline-none"
                            placeholder="e.g. Senior Developer"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Company</label>
                        <input
                            required
                            value={formData.company}
                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 outline-none"
                            placeholder="e.g. Google"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Period</label>
                        <input
                            required
                            value={formData.period}
                            onChange={e => setFormData({ ...formData, period: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 outline-none"
                            placeholder="e.g. 2020 - Present"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 outline-none"
                            placeholder="Describe your responsibilities..."
                        />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-gradient-to-r from-sky-600 to-green-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50"
                        >
                            {loading ? 'Adding...' : 'Add Experience'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

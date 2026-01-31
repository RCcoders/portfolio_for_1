import React, { useState } from 'react';
import { X } from 'lucide-react';
import { api, Profile } from '@/lib/api';

interface EditProfileAssetsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedProfile: Profile) => void;
    profile: Profile;
}

export default function EditProfileAssetsModal({ isOpen, onClose, onSave, profile }: EditProfileAssetsModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        image_url: profile.image_url || '',
        resume_url: profile.resume_url || ''
    });

    React.useEffect(() => {
        setFormData({
            image_url: profile.image_url || '',
            resume_url: profile.resume_url || ''
        });
    }, [profile]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updated = await api.updateProfile(profile.id!, {
                ...formData,
                id: profile.id
            });
            onSave(updated);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to update assets');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-2xl w-full max-w-lg border border-slate-700 shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">Edit Assets</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Profile Image URL</label>
                        <input
                            type="url"
                            value={formData.image_url}
                            onChange={e => setFormData({ ...formData, image_url: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 outline-none"
                            placeholder="https://example.com/my-image.jpg"
                        />
                        <p className="text-xs text-slate-500 mt-1">Direct link to your profile picture.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Resume URL</label>
                        <input
                            type="url"
                            value={formData.resume_url}
                            onChange={e => setFormData({ ...formData, resume_url: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 outline-none"
                            placeholder="https://example.com/resume.pdf"
                        />
                        <p className="text-xs text-slate-500 mt-1">Link to your PDF resume (e.g. Google Drive, Dropbox).</p>
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
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

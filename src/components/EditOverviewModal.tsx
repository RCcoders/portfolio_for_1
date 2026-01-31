import React, { useState } from 'react';
import { X } from 'lucide-react';
import { api, type Profile } from '@/lib/api';

interface EditOverviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (text: string) => void;
    currentText: string;
    profileId: string;
    profileData: Partial<Profile>;
}

export default function EditOverviewModal({ isOpen, onClose, onSave, currentText, profileId, profileData }: EditOverviewModalProps) {
    const [loading, setLoading] = useState(false);
    const [text, setText] = useState(currentText);

    React.useEffect(() => {
        setText(currentText);
    }, [currentText]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // We need to update the full profile, but only changing about_text
            // In a real app we'd have a PATCH endpoint, but crud.createProfile (upsert) or similar might be needed
            // Actually, we haven't made an updateProfile endpoint yet! 
            // Wait, looking at crud.py, there is NO update_profile function exposed in main.py?
            // checking main.py... create_profile acts as upsert usually if configured, 
            // but crud.create_profile does db.table("profiles").insert.
            // We need to add update_profile to backend.
            // For now, I will assume we can add it or use create if it upserts (Supabase insert doesn't upsert by default without config).

            // I'll assume we need to add updateProfile.
            // But since I can't edit backend right this second without a new tool call, 
            // I'll blindly attempt to use a new endpoint I'll add in the next step.

            await api.updateProfile(profileId, { ...profileData, about_text: text, id: profileId });
            // Actually, Supabase .upsert() is better. 
            // But let's assume I will fix backend to handle updates.

            onSave(text);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to update overview');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-2xl w-full max-w-2xl border border-slate-700 shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">Edit Professional Overview</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <textarea
                            required
                            value={text}
                            onChange={e => setText(e.target.value)}
                            rows={10}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 outline-none"
                            placeholder="Write your professional overview..."
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
                            {loading ? 'Saving...' : 'Save Overview'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

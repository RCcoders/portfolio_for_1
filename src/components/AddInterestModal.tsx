import React, { useState } from 'react';
import { X } from 'lucide-react';
import { api, Interest } from '@/lib/api';

interface AddInterestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (interest: Interest) => void;
    profileId: string;
}

export default function AddInterestModal({ isOpen, onClose, onAdd, profileId }: AddInterestModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        icon: 'FaCode' // Default icon
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const newInterest = await api.createInterest({ ...formData, profile_id: profileId });
            onAdd(newInterest);
            onClose();
            setFormData({ title: '', description: '', icon: 'Code' });
        } catch (error) {
            console.error(error);
            alert('Failed to add interest');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-2xl w-full max-w-lg border border-slate-700 shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white">Add Interest</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                        <input
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 outline-none"
                            placeholder="e.g. Artificial Intelligence"
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
                            placeholder="Short description..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Icon</label>
                        <select
                            value={formData.icon}
                            onChange={e => setFormData({ ...formData, icon: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 outline-none"
                        >
                            <optgroup label="Programming Languages">
                                <option value="FaPython">Python</option>
                                <option value="FaJava">Java</option>
                                <option value="FaJs">JavaScript</option>
                                <option value="SiCplusplus">C++</option>
                                <option value="FaCode">Generic Coding</option>
                            </optgroup>
                            <optgroup label="Data Structures & Algorithms">
                                <option value="FaProjectDiagram">DSA</option>
                                <option value="FaBrain">Problem Solving</option>
                            </optgroup>
                            <optgroup label="Web Development">
                                <option value="FaHtml5">HTML</option>
                                <option value="FaCss3Alt">CSS</option>
                                <option value="FaReact">React</option>
                                <option value="SiNextdotjs">Next.js</option>
                                <option value="SiTailwindcss">Tailwind</option>
                            </optgroup>
                            <optgroup label="Database">
                                <option value="FaDatabase">SQL Generic</option>
                                <option value="SiMysql">MySQL</option>
                                <option value="SiPostgresql">PostgreSQL</option>
                                <option value="SiMongodb">MongoDB</option>
                            </optgroup>
                            <optgroup label="Version Control">
                                <option value="FaGitAlt">Git</option>
                                <option value="FaGithub">GitHub</option>
                            </optgroup>
                            <optgroup label="Soft Skills / Misc">
                                <option value="FaUsers">Teamwork</option>
                                <option value="FaComments">Communication</option>
                                <option value="FaLightbulb">Creativity</option>
                                <option value="Heart">Interest (Heart)</option>
                                <option value="Globe">Interest (Globe)</option>
                            </optgroup>
                        </select>
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
                            {loading ? 'Adding...' : 'Add Interest'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

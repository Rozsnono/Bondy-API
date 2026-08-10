'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit, X, Minus, Maximize2 } from 'lucide-react';
import { IPetTemplate, PetCategory } from '@/types/db';

export default function PetTemplatesAdminPage() {
    const [templates, setTemplates] = useState<IPetTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        category: 'mammal' as PetCategory,
        description: '',
        eggUrl: '',
        idleUrl: '',
        eatingUrl: '',
        bathingUrl: '',
        playingUrl: '',
        sleepingUrl: '',
        sickUrl: '',
        deadUrl: '',
        walkInUrl: '',
        baseHungerDecayRate: 5,
        baseMoodDecayRate: 5,
        baseCleanlinessDecayRate: 4,
        baseEnergyDecayRate: 3,
        isActive: true,
    });

    const fetchTemplates = () => {
        fetch('/api/admin/pet-templates')
            .then((res) => res.json())
            .then((data) => {
                setTemplates(data.templates || []);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleOpenCreate = () => {
        setEditingId(null);
        setFormData({
            name: '',
            category: 'mammal',
            description: '',
            eggUrl: '',
            idleUrl: '',
            eatingUrl: '',
            bathingUrl: '',
            playingUrl: '',
            sleepingUrl: '',
            sickUrl: '',
            deadUrl: '',
            walkInUrl: '',
            baseHungerDecayRate: 5,
            baseMoodDecayRate: 5,
            baseCleanlinessDecayRate: 4,
            baseEnergyDecayRate: 3,
            isActive: true,
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (t: IPetTemplate) => {
        setEditingId(t._id.toString());
        setFormData({
            name: t.name,
            category: t.category,
            description: t.description,
            eggUrl: t.lottieUrls.eggUrl || '',
            idleUrl: t.lottieUrls.idleUrl || '',
            eatingUrl: t.lottieUrls.eatingUrl || '',
            bathingUrl: t.lottieUrls.bathingUrl || '',
            playingUrl: t.lottieUrls.playingUrl || '',
            sleepingUrl: t.lottieUrls.sleepingUrl || '',
            sickUrl: t.lottieUrls.sickUrl || '',
            deadUrl: t.lottieUrls.deadUrl || '',
            walkInUrl: t.lottieUrls.walkInUrl || '',
            baseHungerDecayRate: t.baseHungerDecayRate,
            baseMoodDecayRate: t.baseMoodDecayRate,
            baseCleanlinessDecayRate: t.baseCleanlinessDecayRate,
            baseEnergyDecayRate: t.baseEnergyDecayRate,
            isActive: t.isActive,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            id: editingId,
            name: formData.name,
            category: formData.category,
            description: formData.description,
            lottieUrls: {
                eggUrl: formData.eggUrl || undefined,
                idleUrl: formData.idleUrl,
                eatingUrl: formData.eatingUrl,
                bathingUrl: formData.bathingUrl,
                playingUrl: formData.playingUrl,
                sleepingUrl: formData.sleepingUrl,
                sickUrl: formData.sickUrl,
                deadUrl: formData.deadUrl,
                walkInUrl: formData.walkInUrl || undefined,
            },
            baseHungerDecayRate: formData.baseHungerDecayRate,
            baseMoodDecayRate: formData.baseMoodDecayRate,
            baseCleanlinessDecayRate: formData.baseCleanlinessDecayRate,
            baseEnergyDecayRate: formData.baseEnergyDecayRate,
            isActive: formData.isActive,
        };

        const method = editingId ? 'PUT' : 'POST';
        await fetch('/api/admin/pet-templates', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        setIsModalOpen(false);
        fetchTemplates();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete species?')) {
            await fetch(`/api/admin/pet-templates?id=${id}`, { method: 'DELETE' });
            fetchTemplates();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex-1 bg-slate-900/70 border border-white/10 rounded-2xl backdrop-blur-3xl shadow-2xl flex flex-col overflow-hidden"
        >
            {/* Window Title Bar */}
            <div className="h-10 bg-slate-950/80 border-b border-white/10 px-4 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500 border border-rose-600/50 flex items-center justify-center cursor-pointer">
                        <X className="w-2 h-2 text-rose-950 opacity-0 hover:opacity-100" />
                    </div>
                    <div className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600/50 flex items-center justify-center cursor-pointer">
                        <Minus className="w-2 h-2 text-amber-950 opacity-0 hover:opacity-100" />
                    </div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600/50 flex items-center justify-center cursor-pointer">
                        <Maximize2 className="w-2 h-2 text-emerald-950 opacity-0 hover:opacity-100" />
                    </div>
                </div>

                <span className="text-xs font-semibold text-slate-300">Pet Species App — Dynamic Lottie Engine Manager</span>

                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-1.5 px-3 py-1 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" /> Add Species
                </button>
            </div>

            {/* Body Grid */}
            <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                    <p className="text-xs text-slate-500">Loading species templates...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {templates.map((t) => (
                            <div
                                key={t._id.toString()}
                                className="p-4 bg-black/40 border border-white/5 rounded-xl flex flex-col justify-between space-y-3 shadow-lg"
                            >
                                <div>
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-pink-500/10 text-pink-400 rounded-md border border-pink-500/20">
                                            {t.category}
                                        </span>
                                        <span className="text-[10px] text-emerald-400 font-semibold">{t.isActive ? 'Active' : 'Disabled'}</span>
                                    </div>
                                    <h3 className="text-base font-bold text-white mt-1.5">{t.name}</h3>
                                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">{t.description}</p>
                                </div>

                                <div className="flex gap-2 border-t border-white/5 pt-2.5">
                                    <button
                                        onClick={() => handleOpenEdit(t)}
                                        className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-xs text-white font-medium rounded-lg transition-colors"
                                    >
                                        <Edit className="w-3.5 h-3.5 mx-auto" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(t._id.toString())}
                                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* macOS System Sheet Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                        <motion.div
                            initial={{ scale: 0.94, y: -20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.94, y: 20, opacity: 0 }}
                            className="bg-slate-900/95 border border-white/15 rounded-2xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl backdrop-blur-3xl"
                        >
                            {/* macOS Dialog Title Bar */}
                            <div className="h-9 bg-slate-950/80 border-b border-white/10 px-3.5 flex items-center justify-between flex-shrink-0">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-3 h-3 rounded-full bg-rose-500 border border-rose-600/50 flex items-center justify-center group"
                                    >
                                        <X className="w-2 h-2 text-rose-950 opacity-0 group-hover:opacity-100" />
                                    </button>
                                    <div className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600/50" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600/50" />
                                </div>

                                <span className="text-xs font-bold text-white tracking-wide">
                                    {editingId ? 'Edit Species Settings' : 'Add New Species Template'}
                                </span>

                                <div className="w-12" />
                            </div>

                            {/* Form Content */}
                            <form onSubmit={handleSubmit} className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-slate-300 font-medium">Species Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Shiba Inu, Dragon"
                                            className="w-full mt-1.5 p-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-slate-300 font-medium">Taxonomy Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value as PetCategory })}
                                            className="w-full mt-1.5 p-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500"
                                        >
                                            <option value="mammal">Mammal</option>
                                            <option value="bird">Bird (Egg-laying)</option>
                                            <option value="reptile">Reptile (Egg-laying)</option>
                                            <option value="amphibian">Amphibian</option>
                                            <option value="fantasy">Fantasy</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-slate-300 font-medium">Description</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Short species summary..."
                                        className="w-full mt-1.5 p-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-pink-500"
                                        rows={2}
                                    />
                                </div>

                                <div className="border-t border-white/10 pt-3 space-y-2.5">
                                    <h4 className="font-bold text-pink-400">Lottie JSON Asset URLs</h4>

                                    {['bird', 'reptile', 'amphibian'].includes(formData.category) && (
                                        <div>
                                            <label className="text-slate-400">Egg Stage Lottie URL</label>
                                            <input
                                                type="url"
                                                value={formData.eggUrl}
                                                onChange={(e) => setFormData({ ...formData, eggUrl: e.target.value })}
                                                className="w-full mt-1 p-1.5 bg-black/40 border border-white/10 rounded-lg text-white"
                                            />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-slate-400">Idle State URL *</label>
                                            <input
                                                type="url"
                                                required
                                                value={formData.idleUrl}
                                                onChange={(e) => setFormData({ ...formData, idleUrl: e.target.value })}
                                                className="w-full mt-1 p-1.5 bg-black/40 border border-white/10 rounded-lg text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-slate-400">Eating State URL *</label>
                                            <input
                                                type="url"
                                                required
                                                value={formData.eatingUrl}
                                                onChange={(e) => setFormData({ ...formData, eatingUrl: e.target.value })}
                                                className="w-full mt-1 p-1.5 bg-black/40 border border-white/10 rounded-lg text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-slate-400">Bathing State URL *</label>
                                            <input
                                                type="url"
                                                required
                                                value={formData.bathingUrl}
                                                onChange={(e) => setFormData({ ...formData, bathingUrl: e.target.value })}
                                                className="w-full mt-1 p-1.5 bg-black/40 border border-white/10 rounded-lg text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-slate-400">Playing State URL *</label>
                                            <input
                                                type="url"
                                                required
                                                value={formData.playingUrl}
                                                onChange={(e) => setFormData({ ...formData, playingUrl: e.target.value })}
                                                className="w-full mt-1 p-1.5 bg-black/40 border border-white/10 rounded-lg text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-slate-400">Sleeping State URL *</label>
                                            <input
                                                type="url"
                                                required
                                                value={formData.sleepingUrl}
                                                onChange={(e) => setFormData({ ...formData, sleepingUrl: e.target.value })}
                                                className="w-full mt-1 p-1.5 bg-black/40 border border-white/10 rounded-lg text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-slate-400">Sick State URL *</label>
                                            <input
                                                type="url"
                                                required
                                                value={formData.sickUrl}
                                                onChange={(e) => setFormData({ ...formData, sickUrl: e.target.value })}
                                                className="w-full mt-1 p-1.5 bg-black/40 border border-white/10 rounded-lg text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-slate-400">Dead State URL *</label>
                                            <input
                                                type="url"
                                                required
                                                value={formData.deadUrl}
                                                onChange={(e) => setFormData({ ...formData, deadUrl: e.target.value })}
                                                className="w-full mt-1 p-1.5 bg-black/40 border border-white/10 rounded-lg text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-slate-400">Walk-In Animation URL</label>
                                            <input
                                                type="url"
                                                value={formData.walkInUrl}
                                                onChange={(e) => setFormData({ ...formData, walkInUrl: e.target.value })}
                                                className="w-full mt-1 p-1.5 bg-black/40 border border-white/10 rounded-lg text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* macOS Button Bar */}
                                <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-1.5 bg-white/10 hover:bg-white/15 text-slate-200 rounded-xl transition-colors font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-pink-600/30 transition-all"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
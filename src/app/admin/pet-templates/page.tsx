'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    Edit,
    PawPrint,
    X,
    Minus,
    Maximize2,
    ChevronLeft,
    ChevronRight,
    LayoutGrid,
    List,
    Search,
    Folder,
    Send,
} from 'lucide-react';
import { IPetTemplate, PetCategory } from '@/types/db';

export default function PetTemplatesAdminPage() {
    const [templates, setTemplates] = useState<IPetTemplate[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
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

    const filteredTemplates = templates.filter((t) => {
        const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
        const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCat && matchesSearch;
    });

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex-1 bg-[#1a1b26] border border-white/10 rounded-2xl shadow-2xl flex overflow-hidden text-xs text-slate-200"
        >
            {/* Finder Left Sidebar */}
            <div className="w-52 bg-[#14151f] border-r border-white/10 p-3 flex flex-col justify-between flex-shrink-0">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1 py-1">
                        <div className="w-3 h-3 rounded-full bg-rose-500 border border-rose-600/50" />
                        <div className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600/50" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600/50" />
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase text-slate-500 px-2 tracking-wider">Favorites</p>
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium transition-colors ${selectedCategory === 'all' ? 'bg-rose-500/20 text-rose-400 font-bold' : 'text-slate-400 hover:bg-white/5'
                                }`}
                        >
                            <PawPrint className="w-3.5 h-3.5" /> All Species
                        </button>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase text-slate-500 px-2 tracking-wider">Categories</p>
                        {['mammal', 'bird', 'reptile', 'amphibian', 'fantasy'].map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg capitalize font-medium transition-colors ${selectedCategory === cat ? 'bg-rose-500/20 text-rose-400 font-bold' : 'text-slate-400 hover:bg-white/5'
                                    }`}
                            >
                                <Folder className="w-3.5 h-3.5 text-slate-500" /> {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Window */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#1f202e]">
                <div className="h-11 bg-[#181924] border-b border-white/10 px-4 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center text-slate-400">
                            <ChevronLeft className="w-4 h-4 cursor-pointer hover:text-white" />
                            <ChevronRight className="w-4 h-4 cursor-pointer hover:text-white" />
                        </div>
                        <span className="font-bold text-white text-sm">Pet Species Library</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center bg-black/40 border border-white/10 rounded-lg p-0.5 text-slate-400">
                            <LayoutGrid className="w-4 h-4 p-1 bg-white/10 text-white rounded cursor-pointer" />
                            <List className="w-4 h-4 p-1 cursor-pointer hover:text-white" />
                        </div>

                        <div className="relative">
                            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 pr-3 py-1 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                            />
                        </div>

                        <button
                            onClick={handleOpenCreate}
                            className="flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <p className="text-slate-500">Loading files...</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {filteredTemplates.map((t) => (
                                <div
                                    key={t._id.toString()}
                                    className="group flex flex-col items-center cursor-pointer space-y-2 text-center"
                                >
                                    <div className="relative w-28 h-28 rounded-2xl bg-slate-900 border border-white/10 group-hover:border-rose-500/80 group-hover:bg-rose-500/10 transition-all flex flex-col items-center justify-center p-3 shadow-lg">
                                        <PawPrint className="w-10 h-10 text-rose-400 mb-1" />
                                        <span className="text-[9px] uppercase font-bold text-slate-400 px-1.5 py-0.5 bg-black/50 rounded">
                                            {t.category}
                                        </span>

                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                            <button
                                                onClick={() => handleOpenEdit(t)}
                                                className="p-1 bg-slate-800 text-white rounded hover:bg-slate-700"
                                            >
                                                <Edit className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(t._id.toString())}
                                                className="p-1 bg-rose-500/20 text-rose-400 rounded hover:bg-rose-500/40"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>

                                    <span className="font-semibold text-slate-200 group-hover:text-rose-400 transition-colors text-xs line-clamp-1">
                                        {t.name}.lottie
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* macOS Mail Compose Style Sheet Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
                        <motion.div
                            initial={{ scale: 0.94, y: -20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.94, y: 20, opacity: 0 }}
                            className="bg-[#1c1c22] border border-white/15 rounded-2xl w-full max-w-xl max-h-[88vh] overflow-hidden flex flex-col shadow-2xl backdrop-blur-3xl text-xs text-slate-200"
                        >
                            {/* Mail Toolbar Header */}
                            <div className="h-11 bg-[#16161b] border-b border-white/10 px-4 flex items-center justify-between flex-shrink-0">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-3 h-3 rounded-full bg-rose-500 border border-rose-600/50 flex items-center justify-center group"
                                    >
                                        <X className="w-2 h-2 text-rose-950 opacity-0 group-hover:opacity-100" />
                                    </button>
                                    <div className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600/50" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600/50" />
                                </div>

                                <span className="font-semibold text-slate-400 text-xs">
                                    {editingId ? 'Edit Species Settings' : 'New Species Asset'}
                                </span>

                                <button
                                    type="submit"
                                    form="speciesForm"
                                    className="w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Form Content - Divided Field Rows */}
                            <form id="speciesForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                                <div className="divide-y divide-white/10">
                                    <div className="flex items-center px-4 py-2.5">
                                        <span className="w-28 text-slate-400 font-semibold">Species Name:</span>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Shiba Inu, Dragon"
                                            className="flex-1 bg-transparent text-white focus:outline-none font-medium placeholder-slate-600"
                                        />
                                    </div>

                                    <div className="flex items-center px-4 py-2.5">
                                        <span className="w-28 text-slate-400 font-semibold">Category:</span>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value as PetCategory })}
                                            className="flex-1 bg-transparent text-white focus:outline-none font-medium cursor-pointer"
                                        >
                                            <option value="mammal" className="bg-slate-900">Mammal</option>
                                            <option value="bird" className="bg-slate-900">Bird (Egg-laying)</option>
                                            <option value="reptile" className="bg-slate-900">Reptile (Egg-laying)</option>
                                            <option value="amphibian" className="bg-slate-900">Amphibian</option>
                                            <option value="fantasy" className="bg-slate-900">Fantasy</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center px-4 py-2.5">
                                        <span className="w-28 text-slate-400 font-semibold">Description:</span>
                                        <input
                                            type="text"
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Short species summary..."
                                            className="flex-1 bg-transparent text-white focus:outline-none font-medium placeholder-slate-600"
                                        />
                                    </div>
                                </div>

                                {/* Lottie Assets Grid Area */}
                                <div className="p-4 space-y-3 bg-black/20">
                                    <p className="font-bold text-rose-400 uppercase tracking-wider text-[10px]">
                                        Lottie JSON Animation URLs
                                    </p>

                                    {['bird', 'reptile', 'amphibian'].includes(formData.category) && (
                                        <div className="p-2 bg-black/40 border border-white/10 rounded-xl">
                                            <label className="text-[10px] text-slate-400 font-semibold">Egg Lottie URL</label>
                                            <input
                                                type="url"
                                                value={formData.eggUrl}
                                                onChange={(e) => setFormData({ ...formData, eggUrl: e.target.value })}
                                                className="w-full bg-transparent text-white focus:outline-none text-xs"
                                            />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="p-2 bg-black/40 border border-white/10 rounded-xl">
                                            <label className="text-[10px] text-slate-400 font-semibold">Idle URL *</label>
                                            <input
                                                type="url"
                                                required
                                                value={formData.idleUrl}
                                                onChange={(e) => setFormData({ ...formData, idleUrl: e.target.value })}
                                                className="w-full bg-transparent text-white focus:outline-none text-xs"
                                            />
                                        </div>
                                        <div className="p-2 bg-black/40 border border-white/10 rounded-xl">
                                            <label className="text-[10px] text-slate-400 font-semibold">Eating URL *</label>
                                            <input
                                                type="url"
                                                required
                                                value={formData.eatingUrl}
                                                onChange={(e) => setFormData({ ...formData, eatingUrl: e.target.value })}
                                                className="w-full bg-transparent text-white focus:outline-none text-xs"
                                            />
                                        </div>
                                        <div className="p-2 bg-black/40 border border-white/10 rounded-xl">
                                            <label className="text-[10px] text-slate-400 font-semibold">Bathing URL *</label>
                                            <input
                                                type="url"
                                                required
                                                value={formData.bathingUrl}
                                                onChange={(e) => setFormData({ ...formData, bathingUrl: e.target.value })}
                                                className="w-full bg-transparent text-white focus:outline-none text-xs"
                                            />
                                        </div>
                                        <div className="p-2 bg-black/40 border border-white/10 rounded-xl">
                                            <label className="text-[10px] text-slate-400 font-semibold">Playing URL *</label>
                                            <input
                                                type="url"
                                                required
                                                value={formData.playingUrl}
                                                onChange={(e) => setFormData({ ...formData, playingUrl: e.target.value })}
                                                className="w-full bg-transparent text-white focus:outline-none text-xs"
                                            />
                                        </div>
                                        <div className="p-2 bg-black/40 border border-white/10 rounded-xl">
                                            <label className="text-[10px] text-slate-400 font-semibold">Sleeping URL *</label>
                                            <input
                                                type="url"
                                                required
                                                value={formData.sleepingUrl}
                                                onChange={(e) => setFormData({ ...formData, sleepingUrl: e.target.value })}
                                                className="w-full bg-transparent text-white focus:outline-none text-xs"
                                            />
                                        </div>
                                        <div className="p-2 bg-black/40 border border-white/10 rounded-xl">
                                            <label className="text-[10px] text-slate-400 font-semibold">Sick URL *</label>
                                            <input
                                                type="url"
                                                required
                                                value={formData.sickUrl}
                                                onChange={(e) => setFormData({ ...formData, sickUrl: e.target.value })}
                                                className="w-full bg-transparent text-white focus:outline-none text-xs"
                                            />
                                        </div>
                                        <div className="p-2 bg-black/40 border border-white/10 rounded-xl">
                                            <label className="text-[10px] text-slate-400 font-semibold">Dead URL *</label>
                                            <input
                                                type="url"
                                                required
                                                value={formData.deadUrl}
                                                onChange={(e) => setFormData({ ...formData, deadUrl: e.target.value })}
                                                className="w-full bg-transparent text-white focus:outline-none text-xs"
                                            />
                                        </div>
                                        <div className="p-2 bg-black/40 border border-white/10 rounded-xl">
                                            <label className="text-[10px] text-slate-400 font-semibold">Walk-In URL</label>
                                            <input
                                                type="url"
                                                value={formData.walkInUrl}
                                                onChange={(e) => setFormData({ ...formData, walkInUrl: e.target.value })}
                                                className="w-full bg-transparent text-white focus:outline-none text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PawPrint, Search, Share, Trash2, Heart, Activity } from 'lucide-react';

export default function UserPetsAdminPage() {
    const [pets, setPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPets = () => {
        fetch('/api/admin/pets')
            .then((res) => res.json())
            .then((data) => {
                setPets(data.pets || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchPets();
    }, []);

    const handleDeletePet = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete pet "${name}"?`)) {
            await fetch(`/api/admin/pets?id=${id}`, { method: 'DELETE' });
            fetchPets();
        }
    };

    const filteredPets = pets.filter(
        (p) =>
            p.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.templateId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex-1 bg-[#1a1a1e] border border-white/10 rounded-2xl shadow-2xl flex overflow-hidden text-xs text-slate-200"
        >
            {/* Reminders Left Sidebar */}
            <div className="w-64 bg-[#141417] border-r border-white/10 p-3 flex flex-col justify-between flex-shrink-0">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1 py-1">
                        <div className="w-3 h-3 rounded-full bg-rose-500 border border-rose-600/50" />
                        <div className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600/50" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600/50" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex flex-col justify-between h-16">
                            <div className="flex justify-between items-center text-emerald-400">
                                <PawPrint className="w-4 h-4" />
                                <span className="font-extrabold text-lg text-white">{pets.length}</span>
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-300">Total Pets</span>
                        </div>

                        <div className="p-2.5 bg-pink-500/20 border border-pink-500/30 rounded-xl flex flex-col justify-between h-16">
                            <div className="flex justify-between items-center text-pink-400">
                                <Heart className="w-4 h-4 fill-pink-500" />
                                <span className="font-extrabold text-lg text-white">
                                    {pets.filter((p) => !p.isDead).length}
                                </span>
                            </div>
                            <span className="text-[10px] font-semibold text-pink-300">Alive</span>
                        </div>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-white/10">
                        <p className="text-[10px] font-bold uppercase text-slate-500 px-2 tracking-wider">Lists</p>
                        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                <span>Active Pets</span>
                            </div>
                            <span>{pets.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Panel */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e24] p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Share className="w-4 h-4 hover:text-white cursor-pointer" />
                    </div>

                    <div className="relative w-64">
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-3 py-1 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                        />
                    </div>
                </div>

                <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-emerald-400 tracking-tight">Active User Pets</h1>
                        <p className="text-xs text-slate-400 mt-1">Pets co-parented by couples</p>
                    </div>
                    <span className="text-4xl font-extrabold text-emerald-400">{filteredPets.length}</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2">
                    {loading ? (
                        <p className="text-slate-500">Loading pets...</p>
                    ) : (
                        filteredPets.map((p) => (
                            <div
                                key={p._id.toString()}
                                className="flex items-center justify-between p-3.5 bg-black/30 border border-white/5 rounded-xl hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                                        <PawPrint className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-white text-xs">{p.nickname}</p>
                                            <span className="text-[10px] uppercase font-bold text-pink-400 bg-pink-500/10 px-1.5 py-0.5 rounded">
                                                {p.stage}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-400">
                                            Species: {p.templateId?.name || 'Unknown'} • Owners:{' '}
                                            {p.coupleId?.partner1Id?.name || 'Partner 1'}{' '}
                                            {p.coupleId?.partner2Id ? `& ${p.coupleId.partner2Id.name}` : ''}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                                        <Activity className="w-3.5 h-3.5" /> {p.stats?.health || 100}% HP
                                    </div>

                                    <button
                                        onClick={() => handleDeletePet(p._id.toString(), p.nickname)}
                                        className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </motion.div>
    );
}
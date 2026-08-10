'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Search, Share, Copy, Check, X, HeartHandshake, Send } from 'lucide-react';
import { ICouple, IUser } from '@/types/db';

export default function CouplesAdminPage() {
    const [couples, setCouples] = useState<ICouple[]>([]);
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [partner1Id, setPartner1Id] = useState('');
    const [partner2Id, setPartner2Id] = useState('');

    const fetchData = () => {
        Promise.all([
            fetch('/api/admin/couples').then((res) => res.json()),
            fetch('/api/admin/users').then((res) => res.json()),
        ]).then(([couplesData, usersData]) => {
            setCouples(couplesData.couples || []);
            setUsers(usersData.users || []);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const handlePairCouples = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!partner1Id || !partner2Id) {
            alert('Please select two different partners');
            return;
        }

        const res = await fetch('/api/admin/couples', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ partner1Id, partner2Id }),
        });

        if (res.ok) {
            setIsModalOpen(false);
            setPartner1Id('');
            setPartner2Id('');
            fetchData();
        } else {
            const data = await res.json();
            alert(data.error || 'Failed to pair couple');
        }
    };

    const activePetsCount = couples.filter((c: any) => c.petId).length;

    const filteredCouples = couples.filter(
        (c: any) =>
            c.inviteCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.partner1Id?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.partner2Id?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex-1 bg-[#1a1a1e] border border-white/10 rounded-2xl shadow-2xl flex overflow-hidden text-xs text-slate-200"
        >
            {/* Sidebar */}
            <div className="w-64 bg-[#141417] border-r border-white/10 p-3 flex flex-col justify-between flex-shrink-0">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1 py-1">
                        <div className="w-3 h-3 rounded-full bg-rose-500 border border-rose-600/50" />
                        <div className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600/50" />
                        <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600/50" />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 bg-pink-500/20 border border-pink-500/30 rounded-xl flex flex-col justify-between h-16">
                            <div className="flex justify-between items-center text-pink-400">
                                <Heart className="w-4 h-4 fill-pink-500" />
                                <span className="font-extrabold text-lg text-white">{couples.length}</span>
                            </div>
                            <span className="text-[10px] font-semibold text-pink-300">Couples</span>
                        </div>

                        <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex flex-col justify-between h-16">
                            <div className="flex justify-between items-center text-emerald-400">
                                <Heart className="w-4 h-4" />
                                <span className="font-extrabold text-lg text-white">{activePetsCount}</span>
                            </div>
                            <span className="text-[10px] font-semibold text-emerald-300">With Pets</span>
                        </div>

                        <div className="p-2.5 bg-amber-500/20 border border-amber-500/30 rounded-xl flex flex-col justify-between h-16">
                            <div className="flex justify-between items-center text-amber-400">
                                <Heart className="w-4 h-4" />
                                <span className="font-extrabold text-lg text-white">{couples.length - activePetsCount}</span>
                            </div>
                            <span className="text-[10px] font-semibold text-amber-300">Waiting Pet</span>
                        </div>

                        <div className="p-2.5 bg-purple-500/20 border border-purple-500/30 rounded-xl flex flex-col justify-between h-16">
                            <div className="flex justify-between items-center text-purple-400">
                                <Heart className="w-4 h-4" />
                                <span className="font-extrabold text-lg text-white">Active</span>
                            </div>
                            <span className="text-[10px] font-semibold text-purple-300">Streaks</span>
                        </div>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-white/10">
                        <p className="text-[10px] font-bold uppercase text-slate-500 px-2 tracking-wider">Lists</p>
                        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-pink-500/20 text-pink-300 font-bold">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-pink-400" />
                                <span>Couples Hub</span>
                            </div>
                            <span>{couples.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Panel */}
            <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e24] p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400">
                        <Share className="w-4 h-4 hover:text-white cursor-pointer" />
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-1 bg-pink-600 hover:bg-pink-500 text-white font-semibold px-2.5 py-1 rounded-lg transition-colors text-[11px]"
                        >
                            <HeartHandshake className="w-3.5 h-3.5" /> Pair Users
                        </button>
                    </div>

                    <div className="relative w-64">
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-3 py-1 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                        />
                    </div>
                </div>

                <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-pink-400 tracking-tight">Couples Hub</h1>
                        <p className="text-xs text-slate-400 mt-1">Linked couple relationships</p>
                    </div>
                    <span className="text-4xl font-extrabold text-pink-400">{filteredCouples.length}</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2">
                    {loading ? (
                        <p className="text-slate-500">Loading relationships...</p>
                    ) : (
                        filteredCouples.map((c: any) => (
                            <div
                                key={c._id}
                                className="flex items-center justify-between p-3 bg-black/30 border border-white/5 rounded-xl hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleCopyCode(c.inviteCode)}
                                        className="flex items-center gap-1 font-mono font-bold text-pink-400 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded text-[11px]"
                                    >
                                        {c.inviteCode}
                                        {copiedCode === c.inviteCode ? (
                                            <Check className="w-3 h-3 text-emerald-400" />
                                        ) : (
                                            <Copy className="w-3 h-3 opacity-60" />
                                        )}
                                    </button>
                                    <div>
                                        <p className="font-bold text-white text-xs">
                                            {c.partner1Id?.name || 'Unknown'}{' '}
                                            <span className="text-pink-400 font-normal">&amp;</span>{' '}
                                            {c.partner2Id ? c.partner2Id.name : 'Waiting...'}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {c.petId && (
                                        <span className="text-emerald-400 text-[10px] font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                            #{c.petId.nickname}
                                        </span>
                                    )}
                                    <span className="text-pink-400 font-bold text-xs flex items-center gap-1">
                                        <Heart className="w-3 h-3 fill-pink-500" /> {c.streakDays || 0}d
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* macOS Mail Compose Style Sheet Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.94, y: -20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.94, y: 20, opacity: 0 }}
                            className="bg-[#1c1c22] border border-white/15 rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl backdrop-blur-3xl text-xs text-slate-200"
                        >
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

                                <span className="font-semibold text-slate-400 text-xs">Pair Two Users</span>

                                <button
                                    type="submit"
                                    form="pairCouplesForm"
                                    className="w-8 h-8 rounded-full bg-pink-600 hover:bg-pink-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>

                            <form id="pairCouplesForm" onSubmit={handlePairCouples} className="flex-1 overflow-y-auto">
                                <div className="divide-y divide-white/10">
                                    <div className="flex items-center px-4 py-2.5">
                                        <span className="w-28 text-slate-400 font-semibold">Partner 1:</span>
                                        <select
                                            required
                                            value={partner1Id}
                                            onChange={(e) => setPartner1Id(e.target.value)}
                                            className="flex-1 bg-transparent text-white focus:outline-none font-medium cursor-pointer"
                                        >
                                            <option value="" className="bg-slate-900">-- Choose User 1 --</option>
                                            {users.map((u) => (
                                                <option key={u._id.toString()} value={u._id.toString()} className="bg-slate-900">
                                                    {u.name} ({u.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex items-center px-4 py-2.5">
                                        <span className="w-28 text-slate-400 font-semibold">Partner 2:</span>
                                        <select
                                            required
                                            value={partner2Id}
                                            onChange={(e) => setPartner2Id(e.target.value)}
                                            className="flex-1 bg-transparent text-white focus:outline-none font-medium cursor-pointer"
                                        >
                                            <option value="" className="bg-slate-900">-- Choose User 2 --</option>
                                            {users
                                                .filter((u) => u._id.toString() !== partner1Id)
                                                .map((u) => (
                                                    <option key={u._id.toString()} value={u._id.toString()} className="bg-slate-900">
                                                        {u.name} ({u.email})
                                                    </option>
                                                ))}
                                        </select>
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
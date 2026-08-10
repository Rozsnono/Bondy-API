'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, Minus, Maximize2, X } from 'lucide-react';
import { IUser, ICouple } from '@/types/db';

export default function UsersAdminPage() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [couples, setCouples] = useState<ICouple[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/users')
            .then((res) => res.json())
            .then((data) => {
                setUsers(data.users || []);
                setCouples(data.couples || []);
                setLoading(false);
            });
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex-1 bg-slate-900/70 border border-white/10 rounded-2xl backdrop-blur-3xl shadow-2xl flex flex-col overflow-hidden"
        >
            {/* Window Header */}
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

                <span className="text-xs font-semibold text-slate-300">Users & Couples App — Relationship Directory</span>

                <span className="text-[10px] text-slate-400 font-mono">{users.length} Registered Accounts</span>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {loading ? (
                    <p className="text-xs text-slate-500">Loading accounts...</p>
                ) : (
                    <div className="space-y-6">
                        {/* Couples View */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-white flex items-center gap-2">
                                <Heart className="w-3.5 h-3.5 text-pink-500" /> Active Couples ({couples.length})
                            </h3>
                            <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden shadow-lg">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-white/5 text-slate-400 uppercase text-[10px]">
                                        <tr>
                                            <th className="p-2.5">Code</th>
                                            <th className="p-2.5">Partner 1</th>
                                            <th className="p-2.5">Partner 2</th>
                                            <th className="p-2.5">Pet Assigned</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-slate-300">
                                        {couples.map((c: any) => (
                                            <tr key={c._id} className="hover:bg-white/5">
                                                <td className="p-2.5 font-mono text-pink-400 font-bold">{c.inviteCode}</td>
                                                <td className="p-2.5">{c.partner1Id?.name || 'Unknown'}</td>
                                                <td className="p-2.5">{c.partner2Id ? c.partner2Id.name : 'Waiting...'}</td>
                                                <td className="p-2.5">{c.petId ? c.petId.nickname : 'No Pet Yet'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* All Users View */}
                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-white flex items-center gap-2">
                                <Users className="w-3.5 h-3.5 text-blue-400" /> All Accounts ({users.length})
                            </h3>
                            <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden shadow-lg">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-white/5 text-slate-400 uppercase text-[10px]">
                                        <tr>
                                            <th className="p-2.5">User</th>
                                            <th className="p-2.5">Email</th>
                                            <th className="p-2.5">Gold</th>
                                            <th className="p-2.5">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-slate-300">
                                        {users.map((u) => (
                                            <tr key={u._id.toString()} className="hover:bg-white/5">
                                                <td className="p-2.5 font-medium text-white">{u.name}</td>
                                                <td className="p-2.5 text-slate-400">{u.email}</td>
                                                <td className="p-2.5 font-bold text-amber-400">{u.goldCoins} Coins</td>
                                                <td className="p-2.5">
                                                    <span className={`px-2 py-0.5 text-[10px] rounded ${u.coupleId ? 'bg-pink-500/10 text-pink-400' : 'bg-slate-800 text-slate-400'}`}>
                                                        {u.coupleId ? 'Paired' : 'Single'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
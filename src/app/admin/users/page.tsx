'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Coins, Share, UserPlus, X, Send } from 'lucide-react';
import { IUser } from '@/types/db';

export default function UsersAdminPage() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        goldCoins: 100,
    });

    const fetchUsers = () => {
        fetch('/api/admin/users')
            .then((res) => res.json())
            .then((data) => {
                setUsers(data.users || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/admin/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            setIsModalOpen(false);
            setFormData({ name: '', email: '', password: '', goldCoins: 100 });
            fetchUsers();
        } else {
            const data = await res.json();
            alert(data.error || 'Failed to create user');
        }
    };

    const pairedCount = users.filter((u) => u.coupleId).length;
    const singleCount = users.filter((u) => !u.coupleId).length;

    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
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
                        <div className="p-2.5 bg-blue-500/20 border border-blue-500/30 rounded-xl flex flex-col justify-between h-16">
                            <div className="flex justify-between items-center text-blue-400">
                                <Users className="w-4 h-4" />
                                <span className="font-extrabold text-lg text-white">{users.length}</span>
                            </div>
                            <span className="text-[10px] font-semibold text-blue-300">Total Users</span>
                        </div>

                        <div className="p-2.5 bg-rose-500/20 border border-rose-500/30 rounded-xl flex flex-col justify-between h-16">
                            <div className="flex justify-between items-center text-rose-400">
                                <Users className="w-4 h-4" />
                                <span className="font-extrabold text-lg text-white">{pairedCount}</span>
                            </div>
                            <span className="text-[10px] font-semibold text-rose-300">Paired</span>
                        </div>

                        <div className="p-2.5 bg-slate-800 border border-white/10 rounded-xl flex flex-col justify-between h-16">
                            <div className="flex justify-between items-center text-slate-400">
                                <Users className="w-4 h-4" />
                                <span className="font-extrabold text-lg text-white">{singleCount}</span>
                            </div>
                            <span className="text-[10px] font-semibold text-slate-300">Single</span>
                        </div>

                        <div className="p-2.5 bg-amber-500/20 border border-amber-500/30 rounded-xl flex flex-col justify-between h-16">
                            <div className="flex justify-between items-center text-amber-400">
                                <Coins className="w-4 h-4" />
                                <span className="font-extrabold text-lg text-white">Active</span>
                            </div>
                            <span className="text-[10px] font-semibold text-amber-300">Gold Wallets</span>
                        </div>
                    </div>

                    <div className="space-y-1 pt-2 border-t border-white/10">
                        <p className="text-[10px] font-bold uppercase text-slate-500 px-2 tracking-wider">Lists</p>
                        <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-cyan-400" />
                                <span>Users Directory</span>
                            </div>
                            <span>{users.length}</span>
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
                            className="flex items-center gap-1 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-2.5 py-1 rounded-lg transition-colors text-[11px]"
                        >
                            <UserPlus className="w-3.5 h-3.5" /> Add User
                        </button>
                    </div>

                    <div className="relative w-64">
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-3 py-1 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                    </div>
                </div>

                <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-cyan-400 tracking-tight">Users Directory</h1>
                        <p className="text-xs text-slate-400 mt-1">Registered accounts list</p>
                    </div>
                    <span className="text-4xl font-extrabold text-cyan-400">{filteredUsers.length}</span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2">
                    {loading ? (
                        <p className="text-slate-500">Loading directory...</p>
                    ) : (
                        filteredUsers.map((u) => (
                            <div
                                key={u._id.toString()}
                                className="flex items-center justify-between p-3 bg-black/30 border border-white/5 rounded-xl hover:bg-white/5 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full border-2 border-slate-500 flex items-center justify-center cursor-pointer hover:border-cyan-400" />
                                    <div>
                                        <p className="font-bold text-white text-xs">{u.name}</p>
                                        <p className="text-[11px] text-slate-400">{u.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className="text-amber-400 font-bold text-xs flex items-center gap-1">
                                        <Coins className="w-3.5 h-3.5" /> {u.goldCoins} Gold
                                    </span>
                                    <span
                                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${u.coupleId ? 'bg-pink-500/20 text-pink-400' : 'bg-slate-800 text-slate-400'
                                            }`}
                                    >
                                        {u.coupleId ? '#Paired' : '#Single'}
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

                                <span className="font-semibold text-slate-400 text-xs">Create User Account</span>

                                <button
                                    type="submit"
                                    form="createUserForm"
                                    className="w-8 h-8 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>

                            <form id="createUserForm" onSubmit={handleCreateUser} className="flex-1 overflow-y-auto">
                                <div className="divide-y divide-white/10">
                                    <div className="flex items-center px-4 py-2.5">
                                        <span className="w-28 text-slate-400 font-semibold">Full Name:</span>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Jane Doe"
                                            className="flex-1 bg-transparent text-white focus:outline-none font-medium placeholder-slate-600"
                                        />
                                    </div>

                                    <div className="flex items-center px-4 py-2.5">
                                        <span className="w-28 text-slate-400 font-semibold">Email:</span>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="jane@example.com"
                                            className="flex-1 bg-transparent text-white focus:outline-none font-medium placeholder-slate-600"
                                        />
                                    </div>

                                    <div className="flex items-center px-4 py-2.5">
                                        <span className="w-28 text-slate-400 font-semibold">Password:</span>
                                        <input
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder="••••••••"
                                            className="flex-1 bg-transparent text-white focus:outline-none font-medium placeholder-slate-600"
                                        />
                                    </div>

                                    <div className="flex items-center px-4 py-2.5">
                                        <span className="w-28 text-slate-400 font-semibold">Initial Gold:</span>
                                        <input
                                            type="number"
                                            value={formData.goldCoins}
                                            onChange={(e) => setFormData({ ...formData, goldCoins: Number(e.target.value) })}
                                            className="flex-1 bg-transparent text-white focus:outline-none font-medium"
                                        />
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
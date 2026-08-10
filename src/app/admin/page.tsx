'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Heart, PawPrint, Sparkles, Activity, Minus, Maximize2, X } from 'lucide-react';

interface StatsData {
    totalUsers: number;
    totalCouples: number;
    activePets: number;
    totalSpecies: number;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then((res) => res.json())
            .then((data) => {
                setStats(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const cards = [
        { title: 'Registered Users', value: stats?.totalUsers ?? 0, icon: Users, color: 'from-blue-500 to-indigo-600' },
        { title: 'Active Couples', value: stats?.totalCouples ?? 0, icon: Heart, color: 'from-pink-500 to-rose-600' },
        { title: 'Alive Pets', value: stats?.activePets ?? 0, icon: PawPrint, color: 'from-emerald-500 to-teal-600' },
        { title: 'Configured Species', value: stats?.totalSpecies ?? 0, icon: Sparkles, color: 'from-purple-500 to-indigo-600' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full flex-1 bg-slate-900/70 border border-white/10 rounded-2xl backdrop-blur-3xl shadow-2xl flex flex-col overflow-hidden"
        >
            {/* Full-Screen macOS Window Title Bar */}
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

                <span className="text-xs font-semibold text-slate-300">Dashboard App — Analytics & System Health</span>

                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    <Activity className="w-3 h-3 animate-pulse" /> Live System
                </div>
            </div>

            {/* Window Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {loading ? (
                    <p className="text-xs text-slate-500">Loading metrics...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {cards.map((c) => {
                            const Icon = c.icon;
                            return (
                                <div
                                    key={c.title}
                                    className="p-5 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between shadow-xl"
                                >
                                    <div>
                                        <p className="text-xs font-medium text-slate-400">{c.title}</p>
                                        <p className="text-3xl font-extrabold text-white mt-1">{c.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-2xl bg-gradient-to-tr ${c.color} text-white shadow-md`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-pink-400" /> Bondy Full-Stack Architecture
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        System running on Next.js App Router API, MongoDB database connection, and dynamic Lottie JSON animation rendering engine.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
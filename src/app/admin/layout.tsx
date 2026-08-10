'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    PawPrint,
    ShoppingBag,
    Users,
    Heart,
    LogOut,
    KeyRound,
    Wifi,
    Battery,
    Sparkles,
    Loader2,
} from 'lucide-react';

const ADMIN_VERSION = 'v2.6.2';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [passwordInput, setPasswordInput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [time, setTime] = useState<string>('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', weekday: 'short' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetch('/api/admin/auth')
            .then((res) => {
                if (res.ok) setIsAuthenticated(true);
                else setIsAuthenticated(false);
            })
            .catch(() => setIsAuthenticated(false));
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');
        setSubmitting(true);

        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: passwordInput }),
            });

            const data = await res.json();

            if (res.ok) {
                setIsAuthenticated(true);
                setPasswordInput('');
            } else {
                setErrorMessage(data.error || 'Invalid Master Password');
            }
        } catch {
            setErrorMessage('Failed to authenticate');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/admin/auth', { method: 'DELETE' });
        setIsAuthenticated(false);
    };

    const dockApps = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, color: 'from-blue-500 to-indigo-600' },
        { name: 'Pet Species', href: '/admin/pet-templates', icon: PawPrint, color: 'from-pink-500 to-rose-600' },
        { name: 'Shop Catalog', href: '/admin/shop', icon: ShoppingBag, color: 'from-amber-500 to-orange-600' },
        { name: 'Users Directory', href: '/admin/users', icon: Users, color: 'from-cyan-500 to-blue-600' },
        { name: 'Couples Hub', href: '/admin/couples', icon: Heart, color: 'from-emerald-500 to-teal-600' },
    ];

    const getActiveAppName = () => {
        if (pathname === '/admin/pet-templates') return 'Pet Species App';
        if (pathname === '/admin/shop') return 'Shop Catalog App';
        if (pathname === '/admin/users') return 'Users Directory App';
        if (pathname === '/admin/couples') return 'Couples Hub App';
        return 'Dashboard App';
    };

    // macOS Boot Loader
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-[#07080c] flex flex-col items-center justify-center text-slate-400 font-sans space-y-4 select-none">
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-pink-500/30 text-white"
                >
                    <Heart className="w-8 h-8 fill-white" />
                </motion.div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <Loader2 className="w-4 h-4 animate-spin text-pink-400" />
                    <span>Booting Bondy OS {ADMIN_VERSION}...</span>
                </div>
            </div>
        );
    }

    // macOS Lock Screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0a0b10] bg-[radial-gradient(ellipse_100%_100%_at_50%_20%,rgba(219,39,119,0.25),rgba(0,0,0,1))] flex items-center justify-center p-4 font-sans select-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-sm bg-slate-900/50 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl text-center"
                >
                    <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 p-1 shadow-2xl shadow-pink-500/30">
                        <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-pink-400">
                            <Heart className="w-8 h-8 fill-pink-500/20" />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-white tracking-tight">Bondy OS</h2>
                        <p className="text-xs text-slate-400 mt-1">macOS Security Lock Screen • <span className="font-mono text-pink-400">{ADMIN_VERSION}</span></p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <input
                                type="password"
                                required
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="Enter Master Password"
                                className="w-full py-2.5 px-4 pr-10 bg-black/50 border border-white/10 rounded-full text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20 transition-all text-center"
                            />
                            <button
                                type="submit"
                                disabled={submitting}
                                className="absolute right-1.5 top-1.5 p-1.5 bg-pink-600 hover:bg-pink-500 text-white rounded-full transition-colors shadow-lg shadow-pink-600/30"
                            >
                                <KeyRound className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {errorMessage && (
                            <p className="text-xs text-rose-400 bg-rose-500/10 py-1.5 px-3 rounded-full border border-rose-500/20">
                                {errorMessage}
                            </p>
                        )}
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-[#090a0f] text-slate-100 flex flex-col font-sans select-none overflow-hidden relative bg-[radial-gradient(ellipse_120%_120%_at_50%_0%,rgba(219,39,119,0.18),rgba(10,12,20,1))]">
            {/* 1. macOS Top Menu Bar */}
            <header className="h-7 bg-slate-950/70 backdrop-blur-2xl border-b border-white/10 px-4 flex items-center justify-between text-xs font-medium text-slate-300 z-50 fixed top-0 left-0 right-0">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                        <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500" />
                        <span className="font-bold text-white">Bondy OS</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-pink-500/20 border border-pink-500/30 text-pink-300 rounded-md">
                            {ADMIN_VERSION}
                        </span>
                    </div>
                    <span className="font-semibold text-slate-200">{getActiveAppName()}</span>
                    <span className="text-slate-500 text-[11px] hover:text-slate-300 cursor-pointer hidden md:inline">File</span>
                    <span className="text-slate-500 text-[11px] hover:text-slate-300 cursor-pointer hidden md:inline">Edit</span>
                    <span className="text-slate-500 text-[11px] hover:text-slate-300 cursor-pointer hidden md:inline">View</span>
                    <span className="text-slate-500 text-[11px] hover:text-slate-300 cursor-pointer hidden md:inline">Window</span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1">
                        <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                        <Battery className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                    <span className="text-slate-200 font-mono">{time || '10:00 AM'}</span>
                </div>
            </header>

            {/* 2. Full-Screen Desktop Canvas with macOS App Window Open/Shrink Animation */}
            <main className="flex-1 pt-9 pb-[88px] px-2 sm:px-4 w-full h-full overflow-hidden flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ scale: 0.88, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.88, opacity: 0, y: 30 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                        className="w-full h-full flex-1 flex flex-col"
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* 3. macOS Floating Bottom Dock */}
            <footer className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex items-center gap-3 px-4 py-2 bg-slate-900/60 backdrop-blur-3xl border border-white/15 rounded-3xl shadow-2xl shadow-black/80"
                >
                    {dockApps.map((app) => {
                        const Icon = app.icon;
                        const isActive = pathname === app.href;
                        return (
                            <Link key={app.href} href={app.href}>
                                <motion.div
                                    whileHover={{ scale: 1.25, y: -10 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative group flex flex-col items-center"
                                >
                                    <span className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/90 text-slate-200 text-[10px] font-semibold px-2.5 py-1 rounded-md border border-white/10 pointer-events-none whitespace-nowrap shadow-md">
                                        {app.name}
                                    </span>

                                    <div
                                        className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${app.color} p-2.5 text-white flex items-center justify-center shadow-lg transition-all ${isActive ? 'ring-2 ring-pink-500 shadow-pink-500/40 scale-105' : 'opacity-85 hover:opacity-100'
                                            }`}
                                    >
                                        <Icon className="w-full h-full" />
                                    </div>

                                    {isActive && (
                                        <motion.div
                                            layoutId="macOSDockDot"
                                            className="w-1.5 h-1.5 bg-white rounded-full mt-1 shadow-sm shadow-white"
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}

                    <div className="w-px h-8 bg-white/15 mx-1" />

                    <motion.button
                        whileHover={{ scale: 1.25, y: -10 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="relative group flex flex-col items-center"
                    >
                        <span className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/90 text-rose-300 text-[10px] font-semibold px-2.5 py-1 rounded-md border border-rose-500/20 pointer-events-none whitespace-nowrap shadow-md">
                            Lock System
                        </span>
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-700 p-2.5 text-white flex items-center justify-center shadow-lg">
                            <LogOut className="w-full h-full" />
                        </div>
                    </motion.button>
                </motion.div>
            </footer>
        </div>
    );
}
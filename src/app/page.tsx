'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Sparkles, PawPrint, ArrowRight, Smartphone } from 'lucide-react';

export default function RootHomePage() {
  const features = [
    {
      icon: Heart,
      title: 'Couple Bonding',
      description: 'Shared responsibility mechanic requiring both partners to interact daily.',
    },
    {
      icon: PawPrint,
      title: 'Dynamic Lottie Pets',
      description: 'Dynamic JSON Lottie animations driven by database templates and stat changes.',
    },
    {
      icon: Sparkles,
      title: 'Virtual Economy',
      description: 'Earn gold through daily interactions and spend in the shop for food & care.',
    },
    {
      icon: ShieldCheck,
      title: 'Admin Control Center',
      description: 'Real-time CRUD management for pet species, Lottie assets, and shop items.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-pink-500 selection:text-white">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-pink-600/10 via-purple-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-500/10 border border-pink-500/20 rounded-xl text-pink-500">
            <Heart className="w-6 h-6 fill-pink-500" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Bondy
          </span>
        </div>

        <Link
          href="/admin"
          className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-pink-600/20"
        >
          Open Admin Panel <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold uppercase tracking-wider rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> Full-Stack Companion Platform
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Raise Virtual Pets Together. <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Strengthen Your Bond.
            </span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Bondy is a couple companion application where partners co-parent digital pets animated through dynamic Lottie JSON rendering.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <Link
            href="/admin"
            className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-pink-600/25"
          >
            Launch Admin Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 border border-slate-800 text-slate-300 font-medium rounded-2xl text-sm">
            <Smartphone className="w-4 h-4 text-pink-400" />
            React Native App Connected
          </div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-16 text-left"
        >
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl hover:border-slate-700 transition-colors space-y-3"
              >
                <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl w-fit">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-200">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
              </div>
            );
          })}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        Bondy Platform &copy; 2026. Next.js App Router Backend & Admin Control Center.
      </footer>
    </div>
  );
}
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit, ShoppingBag, X, Minus, Maximize2 } from 'lucide-react';
import { IShopItem, ShopItemType } from '@/types/db';

export default function ShopAdminPage() {
    const [items, setItems] = useState<IShopItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        type: 'food' as ShopItemType,
        description: '',
        price: 20,
        iconName: 'ShoppingBag',
        iconSvg: '',
        hunger: 25,
        mood: 0,
        cleanliness: 0,
        health: 0,
        energy: 0,
        isActive: true,
    });

    const fetchItems = () => {
        fetch('/api/admin/shop')
            .then((res) => res.json())
            .then((data) => {
                setItems(data.items || []);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleOpenCreate = () => {
        setEditingId(null);
        setFormData({
            name: '',
            type: 'food',
            description: '',
            price: 20,
            iconName: 'ShoppingBag',
            iconSvg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>',
            hunger: 25,
            mood: 0,
            cleanliness: 0,
            health: 0,
            energy: 0,
            isActive: true,
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (item: IShopItem) => {
        setEditingId(item._id.toString());
        setFormData({
            name: item.name,
            type: item.type,
            description: item.description,
            price: item.price,
            iconName: item.iconName,
            iconSvg: item.iconSvg || '',
            hunger: item.statEffects.hunger || 0,
            mood: item.statEffects.mood || 0,
            cleanliness: item.statEffects.cleanliness || 0,
            health: item.statEffects.health || 0,
            energy: item.statEffects.energy || 0,
            isActive: item.isActive,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            id: editingId,
            name: formData.name,
            type: formData.type,
            description: formData.description,
            price: formData.price,
            iconName: formData.iconName,
            iconSvg: formData.iconSvg || null,
            statEffects: {
                hunger: formData.hunger,
                mood: formData.mood,
                cleanliness: formData.cleanliness,
                health: formData.health,
                energy: formData.energy,
            },
            isActive: formData.isActive,
        };

        const method = editingId ? 'PUT' : 'POST';
        await fetch('/api/admin/shop', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        setIsModalOpen(false);
        fetchItems();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete shop item?')) {
            await fetch(`/api/admin/shop?id=${id}`, { method: 'DELETE' });
            fetchItems();
        }
    };

    const renderSvgPreview = (svgContent?: string) => {
        if (!svgContent) return <ShoppingBag className="w-5 h-5 text-amber-400" />;
        if (svgContent.startsWith('http://') || svgContent.startsWith('https://')) {
            return <img src={svgContent} alt="Item icon" className="w-5 h-5 object-contain" />;
        }
        return (
            <div
                className="w-5 h-5 flex items-center justify-center text-amber-400 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current"
                dangerouslySetInnerHTML={{ __html: svgContent }}
            />
        );
    };

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

                <span className="text-xs font-semibold text-slate-300">Shop Catalog App — Item Management</span>

                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" /> Add Item
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                    <p className="text-xs text-slate-500">Loading catalog...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((item) => (
                            <div
                                key={item._id.toString()}
                                className="p-4 bg-black/40 border border-white/5 rounded-xl flex flex-col justify-between space-y-3 shadow-lg"
                            >
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                                                {renderSvgPreview(item.iconSvg)}
                                            </div>
                                            <div>
                                                <span className="text-[10px] uppercase font-bold text-amber-400">{item.type}</span>
                                                <h3 className="text-sm font-bold text-white mt-0.5">{item.name}</h3>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold text-amber-400">{item.price} Gold</span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">{item.description}</p>
                                </div>

                                <div className="flex gap-2 border-t border-white/5 pt-2.5">
                                    <button
                                        onClick={() => handleOpenEdit(item)}
                                        className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-xs text-white font-medium rounded-lg transition-colors"
                                    >
                                        <Edit className="w-3.5 h-3.5 mx-auto" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item._id.toString())}
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
                            className="bg-slate-900/95 border border-white/15 rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl backdrop-blur-3xl"
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
                                    {editingId ? 'Edit Shop Item' : 'New Shop Item'}
                                </span>

                                <div className="w-12" />
                            </div>

                            {/* Form Content */}
                            <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
                                <div>
                                    <label className="text-slate-300 font-medium">Item Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full mt-1.5 p-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-slate-300 font-medium">Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value as ShopItemType })}
                                            className="w-full mt-1.5 p-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                                        >
                                            <option value="food">Food</option>
                                            <option value="clean">Cleaning</option>
                                            <option value="medicine">Medicine</option>
                                            <option value="toy">Toy</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-slate-300 font-medium">Price (Gold)</label>
                                        <input
                                            type="number"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                            className="w-full mt-1.5 p-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-slate-300 font-medium">Description</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full mt-1.5 p-2 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:border-amber-500"
                                        rows={2}
                                    />
                                </div>

                                <div className="border-t border-white/10 pt-2 space-y-1.5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-amber-400 font-bold">Custom SVG Icon Markup</label>
                                        <div className="p-1 bg-black/40 border border-white/10 rounded-md">
                                            {renderSvgPreview(formData.iconSvg)}
                                        </div>
                                    </div>
                                    <textarea
                                        placeholder='<svg ...>...</svg>'
                                        value={formData.iconSvg}
                                        onChange={(e) => setFormData({ ...formData, iconSvg: e.target.value })}
                                        className="w-full p-2 bg-black/40 border border-white/10 rounded-xl font-mono text-[10px] text-slate-300"
                                        rows={3}
                                    />
                                </div>

                                {/* macOS Action Buttons */}
                                <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-1.5 bg-white/10 hover:bg-white/15 text-slate-200 rounded-xl font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl font-bold shadow-lg shadow-amber-600/30 transition-all"
                                    >
                                        Save Item
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
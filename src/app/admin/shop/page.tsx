'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Trash2,
    Edit,
    ShoppingBag,
    X,
    ChevronLeft,
    ChevronRight,
    LayoutGrid,
    List,
    Search,
    Tag,
    Send,
} from 'lucide-react';
import { IShopItem, ShopItemType } from '@/types/db';

export default function ShopAdminPage() {
    const [items, setItems] = useState<IShopItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState('');
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
        if (!svgContent) return <ShoppingBag className="w-8 h-8 text-amber-400" />;
        if (svgContent.startsWith('http://') || svgContent.startsWith('https://')) {
            return <img src={svgContent} alt="Item icon" className="w-8 h-8 object-contain" />;
        }
        return (
            <div
                className="w-8 h-8 flex items-center justify-center text-amber-400 [&>svg]:w-full [&>svg]:h-full [&>svg]:fill-current"
                dangerouslySetInnerHTML={{ __html: svgContent }}
            />
        );
    };

    const filteredItems = items.filter((item) => {
        const matchesType = selectedType === 'all' || item.type === selectedType;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
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
                            onClick={() => setSelectedType('all')}
                            className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg font-medium transition-colors ${selectedType === 'all' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-400 hover:bg-white/5'
                                }`}
                        >
                            <ShoppingBag className="w-3.5 h-3.5" /> All Items
                        </button>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase text-slate-500 px-2 tracking-wider">Item Types</p>
                        {['food', 'clean', 'medicine', 'toy'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setSelectedType(t)}
                                className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg capitalize font-medium transition-colors ${selectedType === t ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-400 hover:bg-white/5'
                                    }`}
                            >
                                <Tag className="w-3.5 h-3.5 text-slate-500" /> {t}
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
                        <span className="font-bold text-white text-sm">Shop Catalog</span>
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
                                className="pl-8 pr-3 py-1 bg-black/40 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                            />
                        </div>

                        <button
                            onClick={handleOpenCreate}
                            className="flex items-center gap-1 px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <p className="text-slate-500">Loading catalog...</p>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {filteredItems.map((item) => (
                                <div
                                    key={item._id.toString()}
                                    className="group flex flex-col items-center cursor-pointer space-y-2 text-center"
                                >
                                    <div className="relative w-28 h-28 rounded-2xl bg-slate-900 border border-white/10 group-hover:border-amber-500/80 group-hover:bg-amber-500/10 transition-all flex flex-col items-center justify-center p-3 shadow-lg">
                                        {renderSvgPreview(item.iconSvg)}
                                        <span className="text-[9px] uppercase font-bold text-amber-400 px-1.5 py-0.5 bg-black/50 rounded mt-1">
                                            {item.price} Gold
                                        </span>

                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                            <button
                                                onClick={() => handleOpenEdit(item)}
                                                className="p-1 bg-slate-800 text-white rounded hover:bg-slate-700"
                                            >
                                                <Edit className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id.toString())}
                                                className="p-1 bg-rose-500/20 text-rose-400 rounded hover:bg-rose-500/40"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>

                                    <span className="font-semibold text-slate-200 group-hover:text-amber-400 transition-colors text-xs line-clamp-1">
                                        {item.name}
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.94, y: -20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.94, y: 20, opacity: 0 }}
                            className="bg-[#1c1c22] border border-white/15 rounded-2xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl backdrop-blur-3xl text-xs text-slate-200"
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
                                    {editingId ? 'Edit Shop Item' : 'New Shop Item'}
                                </span>

                                <button
                                    type="submit"
                                    form="shopItemForm"
                                    className="w-8 h-8 rounded-full bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Form Content - Divided Field Rows */}
                            <form id="shopItemForm" onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                                <div className="divide-y divide-white/10">
                                    <div className="flex items-center px-4 py-2.5">
                                        <span className="w-28 text-slate-400 font-semibold">Item Name:</span>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Premium Food"
                                            className="flex-1 bg-transparent text-white focus:outline-none font-medium placeholder-slate-600"
                                        />
                                    </div>

                                    <div className="flex items-center px-4 py-2.5">
                                        <span className="w-28 text-slate-400 font-semibold">Category Type:</span>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value as ShopItemType })}
                                            className="flex-1 bg-transparent text-white focus:outline-none font-medium cursor-pointer"
                                        >
                                            <option value="food" className="bg-slate-900">Food</option>
                                            <option value="clean" className="bg-slate-900">Cleaning</option>
                                            <option value="medicine" className="bg-slate-900">Medicine</option>
                                            <option value="toy" className="bg-slate-900">Toy</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center px-4 py-2.5">
                                        <span className="w-28 text-slate-400 font-semibold">Price (Gold):</span>
                                        <input
                                            type="number"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                            className="flex-1 bg-transparent text-white focus:outline-none font-medium"
                                        />
                                    </div>

                                    <div className="flex items-center px-4 py-2.5">
                                        <span className="w-28 text-slate-400 font-semibold">Description:</span>
                                        <input
                                            type="text"
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Item buff details..."
                                            className="flex-1 bg-transparent text-white focus:outline-none font-medium placeholder-slate-600"
                                        />
                                    </div>
                                </div>

                                <div className="p-4 space-y-2 bg-black/20 border-t border-white/10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Custom SVG Icon Markup</span>
                                        <div className="p-1 bg-black/50 border border-white/10 rounded-md">
                                            {renderSvgPreview(formData.iconSvg)}
                                        </div>
                                    </div>
                                    <textarea
                                        placeholder='<svg ...>...</svg>'
                                        value={formData.iconSvg}
                                        onChange={(e) => setFormData({ ...formData, iconSvg: e.target.value })}
                                        className="w-full p-2.5 bg-black/50 border border-white/10 rounded-xl font-mono text-[10px] text-slate-300 focus:outline-none"
                                        rows={3}
                                    />
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
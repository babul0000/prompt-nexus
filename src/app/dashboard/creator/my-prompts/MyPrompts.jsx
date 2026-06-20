"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getMyPrompts } from "@/lib/api/prompt";
import { Eye, Pencil, BarChart3, Trash2, FileText, Star } from "lucide-react";

export default function MyPrompts() {
    const { data: session, isPending } = authClient.useSession();
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isPending) {
            if (session?.user?.id) {
                const fetchMyData = async () => {
                    try {
                        const data = await getMyPrompts(session.user.id);
                        setPrompts(data || []);
                    } catch (err) {
                        console.error("Fetch Error:", err);
                    } finally {
                        setLoading(false);
                    }
                };
                fetchMyData();
            } else {
                setLoading(false);
            }
        }
    }, [session, isPending]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Loading your prompts...</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 text-zinc-950 dark:bg-[#030014] dark:text-white transition-colors duration-200 min-h-screen p-4 sm:p-6 md:p-8">
            {/* Glowing background circles (visible in dark mode) */}
            <div className="absolute top-[5%] left-1/4 -translate-x-1/2 w-[400px] h-[250px] bg-purple-600/0 dark:bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10 space-y-8">
                {/* Header block */}
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                        My Prompt Templates
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                        Review approval status, manage details, and track template analytics.
                    </p>
                </div>

                {/* Table container matching the global glassmorphism theme */}
                <div className="w-full border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-[#090a16]/80 backdrop-blur-md shadow-sm dark:shadow-none">
                    {/* Responsive Grid Table Wrapper */}
                    <div className="overflow-x-auto w-full">
                        <table className="w-full border-collapse text-left text-sm text-zinc-600 dark:text-zinc-300">
                            {/* Table Header */}
                            <thead>
                                <tr className="border-b border-zinc-200 dark:border-white/5 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider bg-zinc-50 dark:bg-zinc-950/50">
                                    <th className="py-4 px-6 min-w-[200px]">Title & Category</th>
                                    <th className="py-4 px-4">AI Engine</th>
                                    <th className="py-4 px-4">Visibility</th>
                                    <th className="py-4 px-4">Status</th>
                                    <th className="py-4 px-4">Rating</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            
                            {/* Table Body */}
                            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                                {prompts.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-12 px-6 text-center text-zinc-500">
                                            No prompts found! Let's submit your first template.
                                        </td>
                                    </tr>
                                ) : (
                                    prompts.map((p) => {
                                        const isApproved = p.status?.toLowerCase() === 'approved';
                                        const displayRating = p.rating !== undefined && p.rating !== null ? p.rating : (p.bookmarkCount > 0 ? p.bookmarkCount : "0.0");
                                        
                                        return (
                                            <tr key={p._id} className="hover:bg-zinc-50/50 dark:hover:bg-white/[0.01] transition-colors duration-200">
                                                {/* Title & Category */}
                                                <td className="py-4 px-6">
                                                    <div className="font-bold text-sm text-zinc-800 dark:text-white truncate max-w-[250px]" title={p.title}>
                                                        {p.title}
                                                    </div>
                                                    <div className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 uppercase tracking-wide font-bold">
                                                        #{p.category}
                                                    </div>
                                                </td>

                                                {/* AI Engine */}
                                                <td className="py-4 px-4">
                                                    <span className="bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/5 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                                                        {p.aiTool || "CLAUDE"}
                                                    </span>
                                                </td>

                                                {/* Visibility */}
                                                <td className="py-4 px-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400 capitalize">
                                                    {p.visibility || "Public"}
                                                </td>

                                                {/* Status badge */}
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                                                        isApproved 
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                                                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${isApproved ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                        {p.status || "PENDING"}
                                                    </span>
                                                </td>

                                                {/* Rating */}
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-1 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                        <span>{displayRating}</span>
                                                    </div>
                                                </td>

                                                {/* Action buttons */}
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex gap-1 justify-end text-zinc-400 dark:text-zinc-500">
                                                        <button 
                                                            className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white rounded-lg transition cursor-pointer"
                                                            title="View Details"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button 
                                                            className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white rounded-lg transition cursor-pointer"
                                                            title="Edit Details"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button 
                                                            className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white rounded-lg transition cursor-pointer"
                                                            title="View Analytics"
                                                        >
                                                            <BarChart3 size={16} />
                                                        </button>
                                                        <button 
                                                            className="p-2 hover:bg-rose-500/10 hover:text-rose-500 rounded-lg transition cursor-pointer"
                                                            title="Delete Template"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
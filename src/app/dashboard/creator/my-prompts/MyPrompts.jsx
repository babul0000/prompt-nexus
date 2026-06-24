"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getMyPrompts } from "@/lib/api/prompt";
import { updatePrompt, deletePrompt } from "@/lib/actions/prompt";
import { Eye, Pencil, BarChart3, Trash2, FileText, Star, X, UploadCloud, Save } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

const categories = [
    "Coding",
    "Writing",
    "Marketing",
    "Business",
    "Education",
    "Design",
    "Productivity",
];

const aiTools = [
    "ChatGPT",
    "Claude",
    "Gemini",
    "Copilot",
    "Midjourney",
    "Perplexity",
];

export default function MyPrompts() {
    const { data: session, isPending } = authClient.useSession();
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Edit Modal State
    const [editingPrompt, setEditingPrompt] = useState(null);
    const [saving, setSaving] = useState(false);
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        content: "",
        category: "",
        aiTool: "",
        difficulty: "Beginner",
        visibility: "Public",
        tags: "",
        thumbnail: ""
    });

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

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditClick = (prompt) => {
        setEditingPrompt(prompt);
        setEditForm({
            title: prompt.title || "",
            description: prompt.description || "",
            content: prompt.content || "",
            category: prompt.category || "",
            aiTool: prompt.aiTool || "",
            difficulty: prompt.difficulty || "Beginner",
            visibility: prompt.visibility || "Public",
            tags: Array.isArray(prompt.tags) ? prompt.tags.join(", ") : "",
            thumbnail: prompt.thumbnail || ""
        });
        setThumbnailPreview(prompt.thumbnail || null);
        setThumbnail(null);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            let base64Image = editForm.thumbnail;
            if (thumbnail) {
                base64Image = await fileToBase64(thumbnail);
            }

            const updatedData = {
                title: editForm.title,
                description: editForm.description,
                content: editForm.content,
                category: editForm.category,
                aiTool: editForm.aiTool,
                difficulty: editForm.difficulty,
                visibility: editForm.visibility,
                tags: editForm.tags.split(",").map(t => t.trim()).filter(Boolean),
                thumbnail: base64Image
            };

            await updatePrompt(editingPrompt._id, updatedData);
            toast.success("Prompt updated successfully! Sent for review.");

            // Update local state list
            setPrompts(prev => prev.map(p => p._id === editingPrompt._id ? { ...p, ...updatedData, status: "pending" } : p));
            setEditingPrompt(null);
        } catch (err) {
            console.error("Update error:", err);
            toast.error(err.message || "Failed to update prompt");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteClick = async (id) => {
        if (confirm("Are you sure you want to delete this prompt template? This action cannot be undone.")) {
            try {
                await deletePrompt(id);
                toast.success("Prompt deleted successfully!");
                setPrompts(prev => prev.filter(p => p._id !== id));
            } catch (err) {
                console.error("Delete error:", err);
                toast.error(err.message || "Failed to delete prompt");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                <p className="text-sm text-zinc-400 font-medium">Loading your prompts...</p>
            </div>
        );
    }

    return (
        <div className="bg-transparent text-zinc-900 dark:text-white transition-colors duration-200 min-h-screen p-4 sm:p-6 md:p-8 relative">
            {/* Glowing background highlights */}
            <div className="absolute top-[5%] left-1/4 -translate-x-1/2 w-[400px] h-[250px] bg-purple-650/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10 space-y-8">
                {/* Header block */}
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                        My Prompt Templates
                    </h1>
                    <p className="text-sm text-zinc-550 dark:text-zinc-400 font-medium">
                        Review approval status, manage details, and track template analytics.
                    </p>
                </div>

                {/* Table container */}
                <div className="w-full border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-[#090a16]/80 backdrop-blur-md shadow-sm dark:shadow-none">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full border-collapse text-left text-sm text-zinc-705 dark:text-zinc-300">
                            <thead>
                                <tr className="border-b border-zinc-200 dark:border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-50 dark:bg-zinc-950/50">
                                    <th className="py-4 px-6 min-w-[200px]">Title & Category</th>
                                    <th className="py-4 px-4">AI Engine</th>
                                    <th className="py-4 px-4">Visibility</th>
                                    <th className="py-4 px-4">Status</th>
                                    <th className="py-4 px-4">Copies</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            
                            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                                {prompts.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-12 px-6 text-center text-zinc-500 dark:text-zinc-550">
                                            No prompts found! Let's submit your first template.
                                        </td>
                                    </tr>
                                ) : (
                                    prompts.map((p) => {
                                        const isApproved = p.status?.toLowerCase() === 'approved';
                                        
                                        return (
                                            <tr key={p._id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition-colors duration-200">
                                                {/* Title & Category */}
                                                <td className="py-4 px-6">
                                                    <div className="font-bold text-sm text-zinc-900 dark:text-white truncate max-w-[250px]" title={p.title}>
                                                        {p.title}
                                                    </div>
                                                    <div className="text-[10px] text-purple-600 dark:text-zinc-400 mt-1 uppercase tracking-wide font-bold">
                                                        #{p.category}
                                                    </div>
                                                </td>

                                                {/* AI Engine */}
                                                <td className="py-4 px-4">
                                                    <span className="bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-250 dark:border-white/5 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                                                        {p.aiTool || "ChatGPT"}
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
                                                            ? 'bg-emerald-500/10 text-emerald-605 dark:text-emerald-400 border-emerald-500/20' 
                                                            : 'bg-amber-500/10 text-amber-605 dark:text-amber-400 border-amber-500/20'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${isApproved ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                                        {p.status || "PENDING"}
                                                    </span>
                                                </td>

                                                {/* Copies */}
                                                <td className="py-4 px-4 text-xs font-semibold text-zinc-800 dark:text-white">
                                                    {p.copyCount || 0}
                                                </td>

                                                {/* Action buttons */}
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex gap-1 justify-end text-zinc-400 dark:text-zinc-550">
                                                        <Link 
                                                            href={`/all-prompts/${p._id}`}
                                                            className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white rounded-lg transition"
                                                            title="View Details"
                                                        >
                                                            <Eye size={16} />
                                                        </Link>
                                                        <button 
                                                            onClick={() => handleEditClick(p)}
                                                            className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white rounded-lg transition cursor-pointer"
                                                            title="Edit Details"
                                                        >
                                                            <Pencil size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteClick(p._id)}
                                                            className="p-2 hover:bg-rose-500/10 hover:text-rose-550 rounded-lg transition cursor-pointer"
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

            {/* Edit Modal (Glassmorphism Overlay) */}
            {editingPrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative p-6 sm:p-8 space-y-6 shadow-2xl text-zinc-900 dark:text-white">
                        
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/5 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Edit Prompt Template</h3>
                                <p className="text-xs text-zinc-550 dark:text-zinc-400">Modify information below and re-submit for admin verification.</p>
                            </div>
                            <button 
                                onClick={() => setEditingPrompt(null)}
                                className="p-1.5 bg-zinc-150 dark:bg-white/5 hover:bg-zinc-250 dark:hover:bg-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg transition cursor-pointer"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Content / Form */}
                        <form onSubmit={handleEditSubmit} className="space-y-5 text-left">
                            
                            {/* Title */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-zinc-550 dark:text-slate-400 tracking-widest uppercase">
                                    Prompt Title *
                                </label>
                                <input
                                    type="text"
                                    value={editForm.title}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-[#151b3d] bg-zinc-50 dark:bg-[#040614] text-zinc-900 dark:text-white text-sm outline-none focus:border-purple-500/50 transition-all placeholder-zinc-450 dark:placeholder-slate-650"
                                    required
                                />
                            </div>

                            {/* Short Description */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-zinc-550 dark:text-slate-400 tracking-widest uppercase">
                                    Short Description *
                                </label>
                                <input
                                    type="text"
                                    value={editForm.description}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-[#151b3d] bg-zinc-50 dark:bg-[#040614] text-zinc-900 dark:text-white text-sm outline-none focus:border-purple-500/50 transition-all placeholder-zinc-450 dark:placeholder-slate-650"
                                    required
                                />
                            </div>

                            {/* Content Textarea */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-zinc-550 dark:text-slate-400 tracking-widest uppercase">
                                    Prompt Content Template *
                                </label>
                                <textarea
                                    value={editForm.content}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, content: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-[#151b3d] bg-zinc-50 dark:bg-[#040614] text-zinc-900 dark:text-white text-sm outline-none focus:border-purple-500/50 transition-all h-36 resize-y leading-relaxed"
                                    required
                                />
                            </div>

                            {/* Category & AI Tool */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-zinc-550 dark:text-slate-400 tracking-widest uppercase">
                                        Category *
                                    </label>
                                    <select
                                        value={editForm.category}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-[#151b3d] bg-zinc-50 dark:bg-[#040614] text-zinc-900 dark:text-white text-sm outline-none focus:border-purple-500/50 transition-all cursor-pointer"
                                        required
                                    >
                                        <option value="" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">Select Category</option>
                                        {categories.map((item) => (
                                            <option key={item} value={item} className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-zinc-550 dark:text-slate-400 tracking-widest uppercase">
                                        AI Engine *
                                    </label>
                                    <select
                                        value={editForm.aiTool}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, aiTool: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-[#151b3d] bg-zinc-50 dark:bg-[#040614] text-zinc-900 dark:text-white text-sm outline-none focus:border-purple-500/50 transition-all cursor-pointer"
                                        required
                                    >
                                        <option value="" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">Select AI Tool</option>
                                        {aiTools.map((item) => (
                                            <option key={item} value={item} className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Difficulty & Visibility */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-zinc-550 dark:text-slate-400 tracking-widest uppercase">
                                        Difficulty Level *
                                    </label>
                                    <select
                                        value={editForm.difficulty}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, difficulty: e.target.value }))}
                                        className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-[#151b3d] bg-zinc-50 dark:bg-[#040614] text-zinc-900 dark:text-white text-sm outline-none focus:border-purple-500/50 transition-all cursor-pointer"
                                        required
                                    >
                                        <option value="Beginner" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">Beginner</option>
                                        <option value="Intermediate" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">Intermediate</option>
                                        <option value="Pro" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">Pro</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[10px] font-bold text-zinc-550 dark:text-slate-400 tracking-widest uppercase">
                                        Visibility Status *
                                    </label>
                                    <div className="flex items-center gap-5 mt-2.5">
                                        <label className="flex items-center gap-2 text-xs text-zinc-750 dark:text-slate-200 cursor-pointer select-none">
                                            <input
                                                type="radio"
                                                name="visibility"
                                                value="Public"
                                                checked={editForm.visibility === "Public"}
                                                onChange={() => setEditForm(prev => ({ ...prev, visibility: "Public" }))}
                                                className="w-4 h-4 text-purple-650 bg-zinc-50 dark:bg-[#040614] border-zinc-200 dark:border-[#151b3d] focus:ring-purple-500/30 cursor-pointer"
                                            />
                                            <span>Public</span>
                                        </label>
                                        <label className="flex items-center gap-2 text-xs text-zinc-750 dark:text-slate-200 cursor-pointer select-none">
                                            <input
                                                type="radio"
                                                name="visibility"
                                                value="Private"
                                                checked={editForm.visibility === "Private"}
                                                onChange={() => setEditForm(prev => ({ ...prev, visibility: "Private" }))}
                                                className="w-4 h-4 text-purple-650 bg-zinc-50 dark:bg-[#040614] border-zinc-200 dark:border-[#151b3d] focus:ring-purple-500/30 cursor-pointer"
                                            />
                                            <span>Private</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-zinc-550 dark:text-slate-400 tracking-widest uppercase">
                                    Tags (Comma-Separated)
                                </label>
                                <input
                                    type="text"
                                    value={editForm.tags}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                                    placeholder="e.g. tailwind, card, component"
                                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-[#151b3d] bg-zinc-50 dark:bg-[#040614] text-zinc-900 dark:text-white text-sm outline-none focus:border-purple-500/50 transition-all"
                                />
                            </div>

                            {/* Thumbnail image upload */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-zinc-550 dark:text-slate-400 tracking-widest uppercase">
                                    Thumbnail Image
                                </label>
                                <div className="relative border border-dashed border-zinc-300 dark:border-[#1d2456] rounded-lg bg-zinc-50 dark:bg-[#040614] hover:bg-zinc-100 dark:hover:bg-[#040614]/70 transition-all min-h-[120px] flex items-center justify-center cursor-pointer">
                                    {thumbnailPreview ? (
                                        <div className="relative w-full h-[160px] group/preview">
                                            <img
                                                src={thumbnailPreview}
                                                alt="Thumbnail Preview"
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                                                <label htmlFor="edit-thumbnail-input" className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold cursor-pointer transition-all">
                                                    Change Image
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setThumbnail(null);
                                                        setThumbnailPreview(null);
                                                        setEditForm(prev => ({ ...prev, thumbnail: "" }));
                                                        const fileInput = document.getElementById("edit-thumbnail-input");
                                                        if (fileInput) fileInput.value = "";
                                                    }}
                                                    className="px-4 py-2 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 dark:bg-[#131735] dark:text-zinc-300 dark:hover:bg-[#1a204d] text-xs font-semibold transition-all border border-zinc-300 dark:border-[#1e2554]"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <label htmlFor="edit-thumbnail-input" className="flex flex-col items-center justify-center p-6 w-full cursor-pointer h-full gap-2">
                                            <UploadCloud className="w-5 h-5 text-zinc-400 dark:text-slate-400" />
                                            <p className="text-xs font-semibold text-zinc-700 dark:text-slate-200">
                                                Click to upload a new thumbnail image
                                            </p>
                                        </label>
                                    )}
                                    <input
                                        id="edit-thumbnail-input"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleThumbnailChange}
                                    />
                                </div>
                            </div>

                            {/* Modal Footer / Submit */}
                            <div className="pt-4 flex gap-3 justify-end border-t border-zinc-200 dark:border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setEditingPrompt(null)}
                                    className="px-5 py-2.5 rounded-lg text-xs font-bold bg-zinc-150 hover:bg-zinc-200 text-zinc-700 dark:bg-[#131735] dark:hover:bg-[#1a204d] dark:text-zinc-300 border border-zinc-250 dark:border-[#1e2554] transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2.5 rounded-lg text-xs font-bold bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-[0_4px_12px_rgba(124,58,237,0.25)]"
                                >
                                    <Save size={14} />
                                    <span>{saving ? "Saving Changes..." : "Save & Resubmit"}</span>
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
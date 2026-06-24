"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { updatePromptStatus, togglePromptFeatured, deletePrompt } from "@/lib/actions/prompt";
import { Shield, Eye, Check, X, Trash2, Star, Sparkles, FileText } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

export default function AdminPromptsPage() {
    const { data: session, isPending: sessionPending } = useSession();
    const user = session?.user;

    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Reason feedback modal states
    const [actionModalOpen, setActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState(""); // "reject" or "delete"
    const [selectedPromptId, setSelectedPromptId] = useState(null);
    const [reasonInput, setReasonInput] = useState("");
    const [submittingAction, setSubmittingAction] = useState(false);

    const fetchAllPrompts = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
            const res = await fetch(`${baseUrl}/api/admin/prompts`, { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setPrompts(data || []);
            }
        } catch (err) {
            console.error("Failed to load prompts:", err);
            toast.error("Failed to load prompt templates.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role?.toLowerCase() === "admin") {
            fetchAllPrompts();
        } else if (!sessionPending) {
            setLoading(false);
        }
    }, [user, sessionPending]);

    // Handle approving prompt
    const handleApprove = async (id) => {
        try {
            await updatePromptStatus(id, "approved");
            toast.success("Prompt template approved and made public.");
            setPrompts(prev => prev.map(p => p._id === id ? { ...p, status: "approved" } : p));
        } catch (err) {
            console.error("Failed to approve prompt:", err);
            toast.error("Failed to approve prompt.");
        }
    };

    // Handle confirming reject / delete with reasons in Modal
    const handleConfirmAction = async (e) => {
        e.preventDefault();
        if (!reasonInput.trim()) {
            toast.error("Please enter a valid reason.");
            return;
        }

        setSubmittingAction(true);
        try {
            if (actionType === "reject") {
                await updatePromptStatus(selectedPromptId, "rejected", reasonInput);
                toast.success("Prompt template rejected and feedback saved.");
                setPrompts(prev => prev.map(p => p._id === selectedPromptId ? { ...p, status: "rejected", feedback: reasonInput } : p));
            } else if (actionType === "delete") {
                await deletePrompt(selectedPromptId);
                console.log(`[Admin] Deleted prompt template ${selectedPromptId} for reason: ${reasonInput}`);
                toast.success("Prompt template deleted permanently.");
                setPrompts(prev => prev.filter(p => p._id !== selectedPromptId));
            }
            setActionModalOpen(false);
        } catch (err) {
            console.error(`Failed to ${actionType} prompt:`, err);
            toast.error(`Failed to execute ${actionType} action.`);
        } finally {
            setSubmittingAction(false);
        }
    };

    // Handle toggling featured status
    const handleToggleFeatured = async (id, currentFeatured) => {
        const nextFeatured = !currentFeatured;
        try {
            await togglePromptFeatured(id, nextFeatured);
            toast.success(nextFeatured ? "Prompt tagged as featured highlight." : "Removed from featured highlights.");
            setPrompts(prev => prev.map(p => p._id === id ? { ...p, featured: nextFeatured } : p));
        } catch (err) {
            console.error("Failed to toggle featured status:", err);
            toast.error("Failed to update featured status.");
        }
    };

    // Determine colors for AI Engine badge
    const getEngineStyles = (engine) => {
        const eng = (engine || "").toLowerCase();
        if (eng.includes('chatgpt')) {
            return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
        }
        if (eng.includes('gemini')) {
            return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
        }
        if (eng.includes('claude')) {
            return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
        }
        if (eng.includes('midjourney')) {
            return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        }
        return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
    };

    if (sessionPending || loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 text-zinc-900 dark:text-white bg-transparent">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Loading templates...</p>
            </div>
        );
    }

    if (!user || user.role?.toLowerCase() !== "admin") {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 text-zinc-900 dark:text-white bg-transparent">
                <Shield className="w-10 h-10 text-rose-500" />
                <h3 className="text-lg font-bold">Access Denied</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">This page is restricted to administrators only.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent text-zinc-900 dark:text-white p-4 sm:p-6 md:p-8 relative">
            {/* Background decorative glows */}
            <div className="absolute top-[5%] left-1/4 -translate-x-1/2 w-[400px] h-[250px] bg-purple-650/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10 space-y-8">
                {/* Header section */}
                <div className="space-y-1 text-left">
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                        Prompt Template Submissions Moderation
                    </h1>
                    <p className="text-sm text-zinc-550 dark:text-zinc-400 font-medium">
                        Approve templates, reject with feedback, or tag featured highlights.
                    </p>
                </div>

                {/* Table Container */}
                <div className="w-full border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden bg-white dark:bg-[#090a16]/80 backdrop-blur-md shadow-sm dark:shadow-none">
                    <div className="overflow-x-auto w-full">
                        <table className="w-full border-collapse text-left text-sm text-zinc-700 dark:text-zinc-300">
                            <thead>
                                <tr className="border-b border-zinc-200 dark:border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-50 dark:bg-zinc-950/50">
                                    <th className="py-4 px-6 min-w-[220px]">Template Title</th>
                                    <th className="py-4 px-6 min-w-[180px]">Creator</th>
                                    <th className="py-4 px-4">AI Engine</th>
                                    <th className="py-4 px-4">Visibility</th>
                                    <th className="py-4 px-4">Featured</th>
                                    <th className="py-4 px-4">Status</th>
                                    <th className="py-4 px-6 text-right">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                                {prompts.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="py-12 px-6 text-center text-zinc-500 font-medium">
                                            No templates found in database!
                                        </td>
                                    </tr>
                                ) : (
                                    prompts.map((p) => {
                                        const creatorName = p.creatorName || "Mr.Creator";
                                        const creatorEmail = p.creatorEmail || "creator@gmail.com";
                                        const isFeatured = !!p.featured;
                                        const currentStatus = (p.status || "pending").toLowerCase();

                                        return (
                                            <tr key={p._id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition-colors duration-200">
                                                {/* Title & Category */}
                                                <td className="py-4 px-6 text-left">
                                                    <div className="font-bold text-sm text-zinc-900 dark:text-white max-w-[200px] truncate" title={p.title}>
                                                        {p.title}
                                                    </div>
                                                    <div className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-wide font-medium">
                                                        Category: {p.category || "General"}
                                                    </div>
                                                </td>

                                                {/* Creator Info */}
                                                <td className="py-4 px-6 text-left">
                                                    <div className="font-bold text-sm text-purple-600 dark:text-purple-400 truncate max-w-[160px]">
                                                        {creatorName}
                                                    </div>
                                                    <div className="text-[10px] text-zinc-500 mt-0.5 font-medium">
                                                        {creatorEmail}
                                                    </div>
                                                </td>

                                                {/* AI Engine badge */}
                                                <td className="py-4 px-4">
                                                    <span className={`text-[9px] font-black tracking-wider px-2.5 py-1 rounded-full uppercase ${getEngineStyles(p.aiTool)}`}>
                                                        {p.aiTool || "Other"}
                                                    </span>
                                                </td>

                                                {/* Visibility */}
                                                <td className="py-4 px-4 text-xs font-semibold capitalize text-zinc-650 dark:text-zinc-300">
                                                    {p.visibility || "Public"}
                                                </td>

                                                {/* Featured Toggle Button */}
                                                <td className="py-4 px-4">
                                                    <button
                                                        onClick={() => handleToggleFeatured(p._id, isFeatured)}
                                                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer select-none ${
                                                            isFeatured
                                                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/25"
                                                                : "bg-transparent text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 hover:text-zinc-900 dark:hover:text-white"
                                                        }`}
                                                    >
                                                        <Star className={`w-3.5 h-3.5 ${isFeatured ? "fill-amber-500" : ""}`} />
                                                        <span>{isFeatured ? "Featured" : "Feature"}</span>
                                                    </button>
                                                </td>

                                                {/* Status Badge */}
                                                <td className="py-4 px-4">
                                                    <span className={`text-[10px] font-black tracking-wider px-2.5 py-1 rounded-full uppercase border ${
                                                        currentStatus === "approved"
                                                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                                                            : currentStatus === "rejected"
                                                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-450 border-rose-500/25"
                                                            : "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/25"
                                                    }`}>
                                                        {currentStatus}
                                                    </span>
                                                </td>

                                                {/* Action Buttons */}
                                                <td className="py-4 px-6 text-right">
                                                    <div className="flex gap-2 justify-end items-center text-zinc-500 dark:text-zinc-400">
                                                        {/* Eye: View Detail Page */}
                                                        <Link 
                                                            href={`/all-prompts/${p._id}`}
                                                            target="_blank"
                                                            className="p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded-lg transition"
                                                            title="View Details"
                                                        >
                                                            <Eye size={14} />
                                                        </Link>

                                                        {/* Check: Approve (only shown for pending status) */}
                                                        {currentStatus === "pending" && (
                                                            <button
                                                                onClick={() => handleApprove(p._id)}
                                                                className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition cursor-pointer"
                                                                title="Approve"
                                                            >
                                                                <Check size={14} />
                                                            </button>
                                                        )}

                                                        {/* Cross: Reject/Suspend (only shown if not already rejected) */}
                                                        {currentStatus !== "rejected" && (
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedPromptId(p._id);
                                                                    setActionType("reject");
                                                                    setReasonInput("");
                                                                    setActionModalOpen(true);
                                                                }}
                                                                className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg transition cursor-pointer"
                                                                title="Reject/Suspend"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        )}

                                                        {/* Trash: Permanent Delete */}
                                                        <button
                                                            onClick={() => {
                                                                setSelectedPromptId(p._id);
                                                                setActionType("delete");
                                                                setReasonInput("");
                                                                setActionModalOpen(true);
                                                            }}
                                                            className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg transition cursor-pointer"
                                                            title="Delete Permanently"
                                                        >
                                                            <Trash2 size={14} />
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

            {/* Action Confirmation Modal with Reason Input */}
            {actionModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] rounded-2xl w-full max-w-md relative p-6 sm:p-8 space-y-6 text-left shadow-2xl text-zinc-900 dark:text-white">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/5 pb-4">
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                    {actionType === "reject" ? (
                                        <>
                                            <X className="w-5 h-5 text-rose-500" />
                                            <span>Reject Prompt Template</span>
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-5 h-5 text-rose-600" />
                                            <span>Delete Prompt Template</span>
                                        </>
                                    )}
                                </h3>
                                <p className="text-xs text-zinc-550 dark:text-zinc-400 font-medium mt-1">
                                    {actionType === "reject"
                                        ? "Provide feedback explaining why this prompt is rejected."
                                        : "This action cannot be undone. Enter the deletion reason."}
                                </p>
                            </div>
                            <button
                                onClick={() => setActionModalOpen(false)}
                                className="p-1.5 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg transition cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleConfirmAction} className="space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 dark:text-slate-400 tracking-widest uppercase">
                                    Reason / Feedback *
                                </label>
                                <textarea
                                    rows="4"
                                    value={reasonInput}
                                    onChange={(e) => setReasonInput(e.target.value)}
                                    placeholder={
                                        actionType === "reject"
                                            ? "Explain why the prompt template violates community guidelines or has errors..."
                                            : "Reason for deleting this prompt template permanently..."
                                    }
                                    className="w-full p-3.5 rounded-lg border border-zinc-200 dark:border-[#151b3d] bg-zinc-50 dark:bg-[#040614] text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500/40 placeholder-zinc-400 dark:placeholder-zinc-650 leading-relaxed"
                                    required
                                />
                            </div>

                            {/* Modal Footer buttons */}
                            <div className="pt-4 flex gap-3 justify-end border-t border-zinc-200 dark:border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setActionModalOpen(false)}
                                    className="px-4 py-2 bg-transparent hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white rounded-lg text-xs font-bold transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingAction}
                                    className="px-4 py-2 rounded-lg text-xs font-bold bg-[#EF4444] hover:bg-[#DC2626] text-white flex items-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-[0_4px_12px_rgba(239,68,68,0.25)]"
                                >
                                    <span>
                                        {submittingAction
                                            ? "Processing..."
                                            : actionType === "reject"
                                            ? "Confirm Reject"
                                            : "Confirm Delete"}
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

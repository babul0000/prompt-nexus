"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, Copy, Check, Bookmark, Flag, Send, Star, User, MessageSquare, Lock, Sparkles, Gem, X } from 'lucide-react';
import { toast } from 'react-toastify';

const PromptDetailsClient = ({ promptId }) => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;

    // Guard: Redirect guests (unauthenticated users) to the signin page
    useEffect(() => {
        if (!isPending && !session?.user) {
            toast.info("Please sign in to view prompt details", { theme: "dark" });
            router.replace("/auth/signin");
        }
    }, [session, isPending, router]);

    const [prompt, setPrompt] = useState(null);
    const [promptLoading, setPromptLoading] = useState(true);
    const [promptError, setPromptError] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    // Bookmarking state
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [checkingBookmark, setCheckingBookmark] = useState(true);

    // Report modal states
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportReason, setReportReason] = useState("Spam");
    const [reportDescription, setReportDescription] = useState("");
    const [submittingReport, setSubmittingReport] = useState(false);

    // Copy template state
    const [copied, setCopied] = useState(false);

    // Form inputs for review
    const [ratingInput, setRatingInput] = useState(5);
    const [commentInput, setCommentInput] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    // Fetch prompt details from backend
    useEffect(() => {
        const fetchPromptDetails = async () => {
            if (!promptId) return;
            setPromptLoading(true);
            setPromptError(false);
            try {
                const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
                const res = await fetch(`${baseUrl}/api/prompts/${promptId}`, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setPrompt(data);
                } else {
                    setPromptError(true);
                }
            } catch (err) {
                console.error("Failed to load prompt details:", err);
                setPromptError(true);
            } finally {
                setPromptLoading(false);
            }
        };
        fetchPromptDetails();
    }, [promptId]);

    // Check if the current prompt is bookmarked
    useEffect(() => {
        const checkBookmarkStatus = async () => {
            if (!prompt || !user?.id) return;
            try {
                const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
                const res = await fetch(`${baseUrl}/api/bookmarks/check?userId=${user.id}&promptId=${prompt._id || prompt.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setIsBookmarked(data.bookmarked);
                }
            } catch (err) {
                console.error("Error checking bookmark status:", err);
            } finally {
                setCheckingBookmark(false);
            }
        };
        checkBookmarkStatus();
    }, [prompt, user]);

    // Fetch reviews for the prompt on mount
    useEffect(() => {
        const fetchReviews = async () => {
            if (!prompt) return;
            try {
                const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
                const res = await fetch(`${baseUrl}/api/prompts/${prompt._id || prompt.id}/reviews`);
                if (res.ok) {
                    const data = await res.json();
                    setReviews(data || []);
                }
            } catch (err) {
                console.error("Failed to fetch reviews:", err);
            } finally {
                setReviewsLoading(false);
            }
        };
        fetchReviews();
    }, [prompt]);

    // Handle bookmark click toggling
    const handleBookmarkToggle = async () => {
        if (!user?.id) {
            toast.error("Please login to bookmark prompts!");
            return;
        }
        try {
            const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
            const res = await fetch(`${baseUrl}/api/bookmarks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    promptId: prompt._id || prompt.id
                })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.status === 'added') {
                    setIsBookmarked(true);
                    setPrompt(prev => ({ ...prev, bookmarkCount: (prev.bookmarkCount || 0) + 1 }));
                    toast.success("Added to saved bookmarks!", { theme: "dark" });
                } else if (data.status === 'removed') {
                    setIsBookmarked(false);
                    setPrompt(prev => ({ ...prev, bookmarkCount: Math.max((prev.bookmarkCount || 0) - 1, 0) }));
                    toast.success("Removed from saved bookmarks.", { theme: "dark" });
                }
            }
        } catch (err) {
            console.error("Error toggling bookmark:", err);
            toast.error("Failed to update bookmark status.");
        }
    };

    // Handle submitting a report
    const handleReportSubmit = async (e) => {
        e.preventDefault();
        if (!reportReason) {
            toast.error("Please select a reason for reporting.");
            return;
        }
        setSubmittingReport(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
            const res = await fetch(`${baseUrl}/api/reports`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user?.id || "Anonymous",
                    promptId: prompt._id || prompt.id,
                    reason: reportReason,
                    description: reportDescription
                })
            });
            if (res.ok) {
                toast.success("Report submitted successfully. Community moderators will review this prompt.", { theme: "dark" });
                setReportModalOpen(false);
                setReportReason("Spam");
                setReportDescription("");
            } else {
                toast.error("Failed to submit report.");
            }
        } catch (err) {
            console.error("Error submitting report:", err);
            toast.error("An error occurred. Please try again.");
        } finally {
            setSubmittingReport(false);
        }
    };

    // Handle copying prompt template to clipboard
    const handleCopyTemplate = async () => {
        if (!prompt || !prompt.content) return;
        
        // Premium lock guard
        if (isLocked) {
            toast.error("Upgrade to Premium plan to copy this prompt!");
            return;
        }

        try {
            await navigator.clipboard.writeText(prompt.content);
            setCopied(true);
            toast.success("Prompt template copied to clipboard!", {
                position: "bottom-right",
                autoClose: 2000,
                theme: "dark"
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy template", err);
            toast.error("Failed to copy template.");
        }
    };

    // Handle submitting a review
    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!commentInput.trim()) {
            toast.error("Please write a comment first!");
            return;
        }

        setSubmittingReview(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
            const reviewPayload = {
                rating: ratingInput,
                comment: commentInput,
                userName: user?.name || "Anonymous User",
                userEmail: user?.email || "",
                userImage: user?.image || ""
            };

            const res = await fetch(`${baseUrl}/api/prompts/${prompt._id || prompt.id}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reviewPayload)
            });

            if (res.ok) {
                const newReview = await res.json();
                
                // Prepend new review to local list
                setReviews(prev => [newReview, ...prev]);
                setCommentInput("");
                setRatingInput(5);
                toast.success("Review submitted successfully!", {
                    position: "bottom-right",
                    autoClose: 2000,
                    theme: "dark"
                });

                // Fetch updated prompt details to reflect new ratings/statistics
                const promptRes = await fetch(`${baseUrl}/api/prompts/${prompt._id || prompt.id}`, { cache: 'no-store' });
                if (promptRes.ok) {
                    const updatedPrompt = await promptRes.json();
                    setPrompt(updatedPrompt);
                }
            } else {
                toast.error("Failed to submit review.");
            }
        } catch (err) {
            console.error("Error submitting review:", err);
            toast.error("An error occurred during submission.");
        } finally {
            setSubmittingReview(false);
        }
    };

    // AI Engine style helper
    const getEngineStyles = (engine = "") => {
        const eng = engine.toLowerCase();
        if (eng.includes('chatgpt')) return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20';
        if (eng.includes('gemini')) return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
        if (eng.includes('claude')) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
        if (eng.includes('midjourney')) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20';
    };

    // Format date string helper
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    };

    if (promptLoading || isPending) {
        return (
            <div className="min-h-screen bg-[#030014] text-zinc-550 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                <p className="mt-4 text-sm font-medium">Loading details...</p>
            </div>
        );
    }

    if (!session?.user) {
        return null;
    }

    if (promptError || !prompt) {
        return (
            <div className="min-h-screen bg-[#030014] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
                <h2 className="text-2xl font-black">Prompt Not Found</h2>
                <p className="text-sm text-zinc-400 max-w-sm">
                    The requested prompt could not be found or has been deleted.
                </p>
                <Link href="/all-prompts" className="px-5 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-xs font-bold rounded-xl shadow-lg cursor-pointer">
                    Back to Catalog
                </Link>
            </div>
        );
    }

    // Plan checks: Admins and Pro tier users have full premium access
    const isPro = session?.user?.plan?.toLowerCase() === "pro" || session?.user?.role?.toLowerCase() === "admin";

    // Logic: Determine if prompt is Premium/Private
    const isPrivate = 
        (prompt.visibility && prompt.visibility.toLowerCase() === 'private') || 
        prompt.title?.toLowerCase().includes('premium');

    // Premium tools include Claude and Midjourney
    const isPremiumTool = 
        prompt.aiTool?.toLowerCase().includes('claude') || 
        prompt.aiTool?.toLowerCase().includes('midjourney');
        
    // Logic: Check if locked for the current logged-in user
    const isLocked = !isPro && (isPrivate || isPremiumTool);

    const displayCategory = prompt.category ? prompt.category.toUpperCase() : "GENERAL";
    const displayDifficulty = prompt.difficulty ? prompt.difficulty.toUpperCase() : "BEGINNER";
    const displayVisibility = prompt.visibility ? prompt.visibility : "Public";
    const displayRating = prompt.rating !== undefined && prompt.rating !== null ? prompt.rating : (prompt.bookmarkCount > 0 ? prompt.bookmarkCount : "0.0");

    const getDisplayName = () => {
        if (prompt.creatorName) {
            if (prompt.creatorName.toLowerCase() === 'creator') return 'Mr.Creator';
            return prompt.creatorName;
        }
        if (prompt.creatorEmail) {
            return prompt.creatorEmail.split('@')[0];
        }
        return 'Anonymous';
    };

    return (
        <div className="relative min-h-screen bg-slate-50 text-zinc-955 dark:bg-[#030014] dark:text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-200">
            {/* Glowing background circles */}
            <div className="absolute top-[5%] left-1/4 -translate-x-1/2 w-[500px] h-[300px] bg-purple-600/0 dark:bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-[35%] right-1/4 translate-x-1/2 w-[600px] h-[350px] bg-blue-600/0 dark:bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 space-y-6">
                
                {/* Back button */}
                <div className="flex items-center justify-between">
                    <Link 
                        href="/all-prompts"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to catalog</span>
                    </Link>
                </div>

                {/* 1. Header Section */}
                <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] p-6 sm:p-8 rounded-2xl space-y-4 shadow-sm dark:shadow-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[300px] h-[150px] bg-purple-600/5 blur-[80px] rounded-full pointer-events-none" />
                    
                    <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[10px] font-black tracking-wider px-3 py-1 rounded-full uppercase ${getEngineStyles(prompt.aiTool)}`}>
                                {prompt.aiTool || "Other"}
                            </span>
                            <span className="text-[10px] font-black tracking-wider px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20 uppercase">
                                {displayCategory}
                            </span>
                            <span className="text-[10px] font-black tracking-wider px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 uppercase">
                                {displayDifficulty}
                            </span>
                            <span className={`text-[10px] font-black tracking-wider px-3 py-1 rounded-full uppercase ${
                                prompt.visibility?.toLowerCase() === 'private'
                                    ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                    : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            }`}>
                                {displayVisibility}
                            </span>
                        </div>

                        {/* Top corner bookmark and report buttons */}
                        <div className="flex gap-2 flex-shrink-0">
                            <button 
                                onClick={handleBookmarkToggle}
                                className={`p-2.5 rounded-lg border cursor-pointer transition-colors ${
                                    isBookmarked 
                                        ? 'bg-purple-600/20 border-purple-500 text-purple-400' 
                                        : 'bg-zinc-100 dark:bg-[#131735]/40 border-zinc-200 dark:border-[#1e2554] text-zinc-500 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white'
                                }`} 
                                title="Bookmark Prompt"
                            >
                                <Bookmark className={`w-4.5 h-4.5 ${isBookmarked ? 'fill-purple-500/20' : ''}`} />
                            </button>
                            <button 
                                onClick={() => setReportModalOpen(true)}
                                className="p-2.5 rounded-lg bg-zinc-100 dark:bg-[#131735]/40 border border-zinc-200 dark:border-[#1e2554] text-zinc-500 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-450 cursor-pointer transition-colors" 
                                title="Report / Flag Prompt"
                            >
                                <Flag className="w-4.5 h-4.5" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2 relative z-10 text-left">
                        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
                            {prompt.title}
                        </h1>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium max-w-4xl leading-relaxed">
                            {prompt.description}
                        </p>
                    </div>
                </div>

                {/* Two Column details layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column (Main content) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] p-6 sm:p-8 rounded-2xl flex flex-col gap-6 shadow-sm dark:shadow-none text-left">
                            
                            {/* Cover Thumbnail Image Showcase */}
                            {prompt.thumbnail && (
                                <div className="w-full max-h-[380px] overflow-hidden rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-[#0c0d21] dark:to-[#16193b] border border-zinc-200 dark:border-white/5 flex items-center justify-center mb-2">
                                    <img 
                                        src={prompt.thumbnail} 
                                        alt={prompt.title} 
                                        className="w-full h-full object-cover" 
                                    />
                                </div>
                            )}

                            {/* Prompt Content Section */}
                            <div className="space-y-3.5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white tracking-wide">
                                        Prompt Content
                                    </h3>
                                    <button 
                                        onClick={handleCopyTemplate}
                                        disabled={isLocked}
                                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-[#131735]/60 hover:bg-zinc-200 dark:hover:bg-[#131735] text-zinc-600 dark:text-slate-300 border border-zinc-200 dark:border-[#1e2554] text-xs font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                        <span>{copied ? "Copied" : "Copy"}</span>
                                    </button>
                                </div>

                                {/* Premium Blur Lock Logic */}
                                {isLocked ? (
                                    <div className="relative bg-zinc-50 dark:bg-[#040614] border border-zinc-200 dark:border-[#13183d] rounded-xl p-5 overflow-hidden select-none pointer-events-none min-h-[180px] flex flex-col justify-center items-center">
                                        <div className="absolute inset-0 bg-white/95 dark:bg-[#040614]/90 backdrop-blur-md z-15 flex flex-col items-center justify-center p-6 text-center space-y-4 pointer-events-auto">
                                            <Lock className="w-8 h-8 text-rose-500 animate-bounce" />
                                            <div className="space-y-1">
                                                <p className="text-sm font-bold text-zinc-900 dark:text-white">
                                                    {isPremiumTool ? "Premium AI Engine Access Required" : "Premium Prompt Access Required"}
                                                </p>
                                                <p className="text-xs text-zinc-550 dark:text-zinc-400 max-w-sm leading-relaxed">
                                                    {isPremiumTool 
                                                        ? `Prompts utilizing premium tools like ${prompt.aiTool || 'Claude/Midjourney'} require a Pro tier account to copy and use.`
                                                        : "This prompt template has been set as Private/Premium by the author and is only available to Pro tier members."
                                                    }
                                                </p>
                                            </div>
                                            <Link href={session?.user ? `/dashboard/${session.user.role?.toLowerCase() || 'user'}/profile` : "/profile"}>
                                                <button className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-black text-xs font-extrabold rounded-xl shadow-lg cursor-pointer">
                                                    Subscribe to access
                                                </button>
                                            </Link>
                                        </div>
                                        {/* Blurred visual text mock */}
                                        <div className="blur-[5px] select-none pointer-events-none opacity-20 text-xs sm:text-sm text-purple-400 font-mono leading-relaxed">
                                            Act as an advanced system assistant. Implement optimized Tailwind card containers and clean CSS structures. Use standard responsive breakpoints for dynamic resizing. Configure options utilizing low temperature parameters (0.3) to maximize performance.
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-zinc-50 dark:bg-[#040614] border border-zinc-200 dark:border-[#13183d] p-5 rounded-lg font-mono text-xs sm:text-sm text-purple-800 dark:text-[#a78bfa] select-all leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                                        {prompt.content}
                                    </div>
                                )}
                            </div>

                            {/* Description Details */}
                            <div className="space-y-2 border-t border-zinc-100 dark:border-[#13193e]/50 pt-6">
                                <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white tracking-wide">
                                    Description
                                </h3>
                                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                                    {prompt.description}
                                </p>
                            </div>

                            {/* Usage Guidelines Instructions */}
                            <div className="space-y-2 border-t border-zinc-100 dark:border-[#13193e]/50 pt-6">
                                <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white tracking-wide">
                                    Usage Guidelines
                                </h3>
                                <p className="text-xs sm:text-sm text-zinc-500 dark:text-slate-400 leading-relaxed">
                                    For best results, configure your parameters on {prompt.aiTool || 'AI'} with low temperature (0.3 - 0.5) to avoid hallucinations. Replace bracketed tags in the template with your target topic details. Make sure to define proper contextual roles when initializing the engine.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Sidebar details / Actions) */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* Sidebar Block 1: Actions Hub */}
                        <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] p-6 rounded-2xl flex flex-col gap-4 shadow-sm dark:shadow-none text-left">
                            <h4 className="text-[10px] font-bold text-zinc-400 dark:text-slate-500 uppercase tracking-widest">
                                Actions & Statistics
                            </h4>

                            <div className="flex flex-col gap-3">
                                {/* Copy Prompt button */}
                                <button
                                    onClick={handleCopyTemplate}
                                    disabled={isLocked}
                                    className="w-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#820AD1] disabled:from-zinc-700 disabled:to-zinc-800 disabled:cursor-not-allowed text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-all duration-300 shadow-[0_4px_12px_rgba(124,58,237,0.2)] hover:shadow-[0_4px_20px_rgba(124,58,237,0.4)] cursor-pointer"
                                >
                                    {copied ? <Check className="w-4 h-4 text-emerald-400 animate-bounce" /> : <Copy className="w-4 h-4" />}
                                    <span>{copied ? "Prompt Copied!" : "Copy Prompt"}</span>
                                </button>

                                {/* Save / Bookmark button */}
                                <button 
                                    onClick={handleBookmarkToggle}
                                    className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-all cursor-pointer border ${
                                        isBookmarked
                                            ? 'bg-purple-650/20 border-purple-500 text-purple-400 font-bold'
                                            : 'bg-zinc-150 dark:bg-[#131735]/40 border-zinc-200 dark:border-[#1e2554] text-zinc-700 dark:text-slate-350 hover:text-purple-600 dark:hover:text-white'
                                    }`}
                                >
                                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-purple-500/20' : ''}`} />
                                    <span>{isBookmarked ? "Bookmarked (Saved)" : "Save to Bookmarks"}</span>
                                </button>
                            </div>

                            {/* Engagement Stats Grid */}
                            <div className="grid grid-cols-3 gap-2 border-t border-zinc-100 dark:border-[#13193e]/50 pt-4 mt-1 text-center">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wide">Copies</span>
                                    <span className="text-base font-black text-zinc-800 dark:text-white">{prompt.copyCount || 0}</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wide">Bookmarks</span>
                                    <span className="text-base font-black text-zinc-800 dark:text-white">{prompt.bookmarkCount || 0}</span>
                                </div>
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-wide">Rating</span>
                                    <div className="flex items-center justify-center gap-0.5 text-base font-black text-amber-500">
                                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                                        <span>{displayRating}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Block 2: Author Details */}
                        <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] p-6 rounded-2xl space-y-4 shadow-sm dark:shadow-none text-left">
                            <h4 className="text-[10px] font-bold text-zinc-400 dark:text-slate-500 uppercase tracking-widest">
                                Author Details
                            </h4>
                            
                            <div className="flex items-center gap-3">
                                <div className="relative shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#38BDF8] p-[2px]">
                                    <div className="w-full h-full bg-zinc-200 dark:bg-[#040614] rounded-full flex items-center justify-center overflow-hidden">
                                        {prompt.creatorImage ? (
                                            <img 
                                                src={prompt.creatorImage} 
                                                alt={getDisplayName()} 
                                                className="w-full h-full object-cover" 
                                            />
                                        ) : (
                                            <span className="text-sm font-black text-zinc-800 dark:text-white">
                                                {getDisplayName().charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <p className="text-sm font-bold text-zinc-800 dark:text-white truncate" title={getDisplayName()}>
                                        {getDisplayName()}
                                    </p>
                                    <p className="text-[11px] text-zinc-500 dark:text-slate-400 truncate" title={prompt.creatorEmail}>
                                        {prompt.creatorEmail || "No email listed"}
                                    </p>
                                </div>
                            </div>

                            <p className="text-[11px] text-zinc-600 dark:text-slate-400 leading-relaxed">
                                {getDisplayName()} is a verified prompt creator on PromptForge, specialized in designing templates for {prompt.aiTool || 'AI engines'}.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- Community Reviews Block --- */}
                <div className="border-t border-zinc-200 dark:border-[#13193e]/50 pt-10 mt-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
                        Community Reviews ({reviews.length})
                    </h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
                        
                        {/* Left Side: Submit review form */}
                        <div className="lg:col-span-1 bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] p-6 rounded-xl flex flex-col gap-5 shadow-sm dark:shadow-none h-fit text-left">
                            <h3 className="text-base font-bold text-zinc-800 dark:text-white tracking-wide">
                                Submit a Review
                            </h3>
                            
                            <form onSubmit={handleSubmitReview} className="space-y-4">
                                {/* Rating Star select */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-zinc-400 dark:text-slate-500 uppercase tracking-wider block">
                                        Rating
                                    </label>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const isActive = star <= ratingInput;
                                            return (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRatingInput(star)}
                                                    className="focus:outline-none cursor-pointer"
                                                >
                                                    <Star 
                                                        className={`w-5 h-5 ${
                                                            isActive 
                                                                ? 'text-amber-500 fill-amber-500' 
                                                                : 'text-zinc-300 dark:text-zinc-700'
                                                        } transition-colors`} 
                                                    />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Comment text area */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-zinc-400 dark:text-slate-500 uppercase tracking-wider block">
                                        Comment
                                    </label>
                                    <textarea
                                        rows="4"
                                        placeholder="Write your review here. What worked? How did you test it?"
                                        value={commentInput}
                                        onChange={(e) => setCommentInput(e.target.value)}
                                        className="w-full p-3.5 rounded-lg border border-zinc-200 dark:border-[#13183d] bg-transparent text-sm text-zinc-855 dark:text-white focus:outline-none focus:border-purple-500/40 placeholder-zinc-400 dark:placeholder-zinc-650 leading-relaxed bg-[#040614]/50"
                                    />
                                </div>

                                {/* Submit trigger button */}
                                <button
                                    type="submit"
                                    disabled={submittingReview}
                                    className="w-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#820AD1] text-white py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-xs transition-all duration-300 shadow-[0_4px_12px_rgba(124,58,237,0.2)] hover:shadow-[0_4px_20px_rgba(124,58,237,0.4)] disabled:opacity-50 cursor-pointer"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>{submittingReview ? "Submitting..." : "Submit Review"}</span>
                                </button>
                            </form>
                        </div>

                        {/* Right Side: Reviews lists */}
                        <div className="lg:col-span-2 space-y-4">
                            {reviewsLoading ? (
                                <div className="flex flex-col items-center justify-center p-12 text-center bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] rounded-xl min-h-[250px]">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
                                    <p className="mt-2 text-xs text-zinc-400 font-medium">Loading reviews...</p>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] rounded-xl flex flex-col items-center justify-center p-8 sm:p-12 text-center shadow-sm dark:shadow-none min-h-[250px]">
                                    <MessageSquare className="w-10 h-10 text-zinc-400 dark:text-slate-600 mb-4" />
                                    <p className="text-sm text-zinc-500 dark:text-slate-400 max-w-sm leading-relaxed">
                                        No reviews submitted yet. Be the first to share your thoughts!
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4 text-left">
                                    {reviews.map((review) => (
                                        <div 
                                            key={review._id}
                                            className="bg-white dark:bg-[#0a0d26]/40 border border-zinc-200 dark:border-[#13193e]/50 p-5 rounded-lg flex flex-col gap-3 shadow-sm dark:shadow-none"
                                        >
                                            {/* Review Header card */}
                                            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-[#13193e]/50 pb-2.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-[#131735]/60 border border-zinc-200 dark:border-[#1e2554] flex items-center justify-center overflow-hidden text-zinc-400 dark:text-slate-400 shrink-0">
                                                        {review.userImage ? (
                                                            <img 
                                                                src={review.userImage} 
                                                                alt={review.userName} 
                                                                className="w-full h-full object-cover" 
                                                            />
                                                        ) : (
                                                            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                                                {review.userName?.charAt(0).toUpperCase() || "U"}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-zinc-800 dark:text-white truncate max-w-[150px]">
                                                            {review.userName}
                                                        </div>
                                                        <div className="text-[9px] text-zinc-550 dark:text-slate-500 font-medium mt-0.5">
                                                            {formatDate(review.createdAt)}
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                {/* Star rating icons */}
                                                <div className="flex items-center gap-0.5">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star 
                                                            key={star}
                                                            className={`w-3.5 h-3.5 ${
                                                                star <= review.rating 
                                                                    ? 'text-amber-500 fill-amber-500' 
                                                                    : 'text-zinc-200 dark:text-zinc-700'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Review text */}
                                            <p className="text-sm text-zinc-700 dark:text-slate-300 leading-relaxed font-medium">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Dialog Modal */}
            {reportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] rounded-2xl w-full max-w-md relative p-6 sm:p-8 space-y-6 text-left shadow-2xl transition-colors duration-300">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-white/5 pb-4">
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                                    <Flag className="w-4 h-4 text-rose-500" />
                                    <span>Report Prompt Template</span>
                                </h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Report this template if it violates community guidelines.</p>
                            </div>
                            <button 
                                onClick={() => setReportModalOpen(false)}
                                className="p-1.5 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg transition cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Modal Form */}
                        <form onSubmit={handleReportSubmit} className="space-y-4">
                            {/* Reason selection */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 dark:text-slate-400 tracking-widest uppercase">
                                    Select Reason *
                                </label>
                                <select
                                    value={reportReason}
                                    onChange={(e) => setReportReason(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-[#151b3d] bg-zinc-50 dark:bg-[#040614] text-zinc-900 dark:text-white text-sm outline-none focus:border-purple-500 transition-all cursor-pointer"
                                    required
                                >
                                    <option value="Spam" className="bg-white dark:bg-[#040614] text-zinc-900 dark:text-white">Spam (unrelated keywords/ads)</option>
                                    <option value="Inappropriate" className="bg-white dark:bg-[#040614] text-zinc-900 dark:text-white">Inappropriate content (hate, adult, violence)</option>
                                    <option value="Copyright" className="bg-white dark:bg-[#040614] text-zinc-900 dark:text-white">Copyright Violation (plagiarized prompt)</option>
                                    <option value="Inaccurate Content" className="bg-white dark:bg-[#040614] text-zinc-900 dark:text-white">Inaccurate / Broken prompt (does not run)</option>
                                    <option value="Other" className="bg-white dark:bg-[#040614] text-zinc-900 dark:text-white">Other reason (please detail below)</option>
                                </select>
                            </div>

                            {/* Additional description */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 dark:text-slate-400 tracking-widest uppercase">
                                    Additional details (optional)
                                </label>
                                <textarea
                                    rows="4"
                                    value={reportDescription}
                                    onChange={(e) => setReportDescription(e.target.value)}
                                    placeholder="Explain why you are reporting this template..."
                                    className="w-full p-3.5 rounded-lg border border-zinc-200 dark:border-[#151b3d] bg-zinc-50 dark:bg-[#040614] text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 placeholder-zinc-400 dark:placeholder-zinc-600 leading-relaxed"
                                />
                            </div>

                            {/* Modal Footer buttons */}
                            <div className="pt-4 flex gap-3 justify-end border-t border-zinc-100 dark:border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setReportModalOpen(false)}
                                    className="px-4 py-2 bg-transparent hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-550 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg text-xs font-bold transition cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submittingReport}
                                    className="px-4 py-2 rounded-lg text-xs font-bold bg-[#EF4444] hover:bg-[#DC2626] text-white flex items-center gap-2 transition disabled:opacity-50 cursor-pointer shadow-[0_4px_12px_rgba(239,68,68,0.25)]"
                                >
                                    <span>{submittingReport ? "Submitting..." : "Submit Report"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromptDetailsClient;

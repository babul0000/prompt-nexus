"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, Copy, Check, Bookmark, Flag, Send, Star, User, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';

const PromptDetailsClient = ({ promptId }) => {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [prompt, setPrompt] = useState(null);
    const [promptLoading, setPromptLoading] = useState(true);
    const [promptError, setPromptError] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);

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

    // Handle copying prompt template to clipboard
    const handleCopyTemplate = async () => {
        if (!prompt.content) return;
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
        if (eng.includes('chatgpt')) return 'bg-[#1b143c] text-[#a855f7] border border-[#581c87]/50';
        if (eng.includes('gemini')) return 'bg-[#0f2d59]/40 text-[#60a5fa] border border-[#1d4ed8]/50';
        if (eng.includes('claude')) return 'bg-[#1b143c] text-[#a855f7] border border-[#581c87]/50';
        if (eng.includes('midjourney')) return 'bg-[#064e3b]/30 text-[#34d399] border border-[#065f46]/50';
        return 'bg-[#18181b] text-[#a1a1aa] border border-[#27272a]';
    };

    // Format date string helper
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    };

    if (promptLoading) {
        return (
            <div className="min-h-screen bg-[#030014] text-zinc-500 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                <p className="mt-4 text-sm font-medium">Loading details...</p>
            </div>
        );
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

    const isPremium = prompt.title?.toLowerCase().includes('premium');
    const displayCategory = prompt.category ? prompt.category.toUpperCase() : "GENERAL";
    const displayDifficulty = prompt.difficulty ? prompt.difficulty.toUpperCase() : "INTERMEDIATE";
    const displayVisibility = prompt.visibility ? prompt.visibility.toUpperCase() : "PUBLIC";
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
        <div className="relative min-h-screen bg-slate-50 text-zinc-950 dark:bg-[#030014] dark:text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-200">
            {/* Glowing background circles */}
            <div className="absolute top-[5%] left-1/4 -translate-x-1/2 w-[500px] h-[300px] bg-purple-600/0 dark:bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-[35%] right-1/4 translate-x-1/2 w-[600px] h-[350px] bg-blue-600/0 dark:bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 space-y-6">
                
                {/* Back button */}
                <div>
                    <Link 
                        href="/all-prompts"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to previous page</span>
                    </Link>
                </div>

                {/* Two Column details layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Left Column (Main prompt view) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] p-6 sm:p-8 rounded-xl flex flex-col gap-6 shadow-sm dark:shadow-none">
                            
                            {/* Title block */}
                            <div className="flex items-start justify-between gap-6 border-b border-zinc-100 dark:border-[#13193e]/50 pb-5">
                                <div className="space-y-1">
                                    <h1 className="text-xl sm:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">
                                        {prompt.title}
                                    </h1>
                                    <p className="text-sm text-zinc-500 dark:text-slate-400 leading-relaxed font-medium">
                                        {prompt.description}
                                    </p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button className="p-2.5 rounded-lg bg-zinc-100 dark:bg-[#131735]/40 border border-zinc-200 dark:border-[#1e2554] text-zinc-500 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white cursor-pointer transition-colors" title="Save Bookmark">
                                        <Bookmark className="w-4.5 h-4.5" />
                                    </button>
                                    <button className="p-2.5 rounded-lg bg-zinc-100 dark:bg-[#131735]/40 border border-zinc-200 dark:border-[#1e2554] text-zinc-500 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white cursor-pointer transition-colors" title="Report / Flag">
                                        <Flag className="w-4.5 h-4.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Template text area */}
                            <div className="space-y-3.5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white tracking-wide">
                                        Prompt Template
                                    </h3>
                                    <button 
                                        onClick={handleCopyTemplate}
                                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-100 dark:bg-[#131735]/60 hover:bg-zinc-200 dark:hover:bg-[#131735] text-zinc-600 dark:text-slate-300 border border-zinc-200 dark:border-[#1e2554] text-xs font-semibold transition-all cursor-pointer"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                        <span>{copied ? "Copied" : "Copy"}</span>
                                    </button>
                                </div>
                                <div className="bg-zinc-950 dark:bg-[#040614] border border-zinc-200 dark:border-[#13183d] p-5 rounded-lg font-mono text-xs sm:text-sm text-purple-600 dark:text-[#a78bfa] select-all leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                                    {prompt.content}
                                </div>
                            </div>

                            {/* Usage Instructions */}
                            <div className="space-y-2 border-t border-zinc-100 dark:border-[#13193e]/50 pt-6">
                                <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white tracking-wide">
                                    Usage Instructions
                                </h3>
                                <p className="text-xs sm:text-sm text-zinc-500 dark:text-slate-400 leading-relaxed">
                                    For best results, configure your parameters on {prompt.aiTool || 'AI'} with low temperature (0.3 - 0.5) to avoid hallucinations. Replace bracketed tags in the template with your target topic details.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Sidebar details) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] p-6 rounded-xl flex flex-col gap-5 shadow-sm dark:shadow-none">
                            <h3 className="text-sm sm:text-base font-bold text-zinc-800 dark:text-white tracking-wide">
                                Prompt Details
                            </h3>

                            {/* Metadata list */}
                            <div className="flex flex-col gap-1.5 text-xs sm:text-sm font-medium text-zinc-600 dark:text-slate-400">
                                <div className="flex justify-between items-center py-2.5 border-b border-zinc-100 dark:border-[#13193e]/50">
                                    <span>AI Engine</span>
                                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase font-semibold ${getEngineStyles(prompt.aiTool)}`}>
                                        {prompt.aiTool || "Other"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2.5 border-b border-zinc-100 dark:border-[#13193e]/50">
                                    <span>Category</span>
                                    <span className="bg-cyan-500/10 text-cyan-600 dark:text-[#14b8a6] border border-cyan-500/20 dark:border-[#0d9488]/40 px-2.5 py-0.5 rounded-md text-[10px] uppercase font-semibold">
                                        {displayCategory}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2.5 border-b border-zinc-100 dark:border-[#13193e]/50">
                                    <span>Difficulty</span>
                                    <span className="bg-zinc-100 dark:bg-[#171923] text-zinc-600 dark:text-[#a0aec0] border border-zinc-200 dark:border-[#2d3748] px-2.5 py-0.5 rounded-md text-[10px] uppercase font-semibold">
                                        {displayDifficulty}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2.5 border-b border-zinc-100 dark:border-[#13193e]/50">
                                    <span>Visibility</span>
                                    <span className="text-zinc-800 dark:text-slate-200 font-semibold">
                                        {displayVisibility}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2.5 border-b border-zinc-100 dark:border-[#13193e]/50">
                                    <span>Copies Made</span>
                                    <span className="text-zinc-800 dark:text-slate-200 font-semibold">
                                        {prompt.copyCount || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2.5 border-b border-zinc-100 dark:border-[#13193e]/50">
                                    <span>Bookmarks</span>
                                    <span className="text-zinc-800 dark:text-slate-200 font-semibold">
                                        {prompt.bookmarkCount || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-2.5">
                                    <span>Community Rating</span>
                                    <div className="flex items-center gap-1 text-zinc-800 dark:text-slate-200 font-semibold">
                                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                        <span>{displayRating} ({reviews.length})</span>
                                    </div>
                                </div>
                            </div>

                            {/* Creator information info card */}
                            <div className="border-t border-zinc-100 dark:border-[#13193e]/50 pt-4 mt-2 space-y-3">
                                <h4 className="text-[10px] font-bold text-zinc-400 dark:text-slate-500 uppercase tracking-widest">
                                    Creator Information
                                </h4>
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-[#131735]/60 border border-zinc-200 dark:border-[#1e2554] flex items-center justify-center text-zinc-500 dark:text-slate-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <p className="text-sm font-bold text-zinc-800 dark:text-white truncate" title={getDisplayName()}>
                                            {getDisplayName()}
                                        </p>
                                        <p className="text-[11px] text-zinc-400 dark:text-slate-500 truncate" title={prompt.creatorEmail}>
                                            {prompt.creatorEmail || "No email listed"}
                                        </p>
                                    </div>
                                </div>
                            </div>
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
                        <div className="lg:col-span-1 bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] p-6 rounded-xl flex flex-col gap-5 shadow-sm dark:shadow-none h-fit">
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
                                        className="w-full p-3.5 rounded-lg border border-zinc-200 dark:border-[#13183d] bg-transparent text-sm text-zinc-800 dark:text-white focus:outline-none focus:border-purple-500/40 placeholder-zinc-400 dark:placeholder-zinc-600 leading-relaxed bg-[#040614]/50"
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
                                    <p className="text-sm text-zinc-500 dark:text-slate-400 max-w-sm">
                                        No reviews submitted yet. Be the first to share your thoughts!
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {reviews.map((review) => (
                                        <div 
                                            key={review._id}
                                            className="bg-white dark:bg-[#0a0d26]/40 border border-zinc-200 dark:border-[#13193e]/50 p-5 rounded-lg flex flex-col gap-3 shadow-sm dark:shadow-none"
                                        >
                                            {/* Review Header card */}
                                            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-[#13193e]/50 pb-2.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-[#131735]/60 border border-zinc-200 dark:border-[#1e2554] flex items-center justify-center text-zinc-400 dark:text-slate-400">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-zinc-800 dark:text-white truncate max-w-[150px]">
                                                            {review.userName}
                                                        </div>
                                                        <div className="text-[9px] text-zinc-400 dark:text-slate-500 font-medium mt-0.5">
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
                                            <p className="text-sm text-zinc-600 dark:text-slate-300 leading-relaxed">
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
        </div>
    );
};

export default PromptDetailsClient;

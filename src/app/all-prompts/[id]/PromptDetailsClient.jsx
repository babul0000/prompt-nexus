"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, Copy, Check, Bookmark, Share2, Star, User, Lock, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';

const PromptDetailsClient = ({ initialPrompt }) => {
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const [prompt, setPrompt] = useState(initialPrompt);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    // Copy template state
    const [copied, setCopied] = useState(false);

    // Form inputs for review
    const [ratingInput, setRatingInput] = useState(5);
    const [commentInput, setCommentInput] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    // Fetch reviews for the prompt on mount
    useEffect(() => {
        const fetchReviews = async () => {
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
        if (eng.includes('chatgpt')) return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20';
        if (eng.includes('gemini')) return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
        if (eng.includes('claude')) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
        if (eng.includes('midjourney')) return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
        if (eng.includes('stable diffusion')) return 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20';
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20';
    };

    // Format date string helper
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    };

    const isPremium = prompt.title?.toLowerCase().includes('premium');
    const displayDifficulty = prompt.difficulty?.toLowerCase() === 'advanced' ? 'PRO' : (prompt.difficulty || 'Beginner');
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
                        <div className="bg-white dark:bg-[#090a16]/60 border border-zinc-200 dark:border-white/[0.06] p-6 sm:p-8 rounded-2xl flex flex-col gap-6 shadow-sm dark:shadow-none backdrop-blur-md">
                            
                            {/* Title block */}
                            <div className="flex items-start justify-between gap-6 border-b border-zinc-100 dark:border-white/5 pb-4">
                                <div className="space-y-2">
                                    <h1 className="text-xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
                                        {prompt.title}
                                    </h1>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                                        {prompt.description}
                                    </p>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button className="p-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white cursor-pointer" title="Save Bookmark">
                                        <Bookmark className="w-4.5 h-4.5" />
                                    </button>
                                    <button className="p-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white cursor-pointer" title="Share Prompt">
                                        <Share2 className="w-4.5 h-4.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Template text area */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                                        Prompt Template
                                    </h3>
                                    <button 
                                        onClick={handleCopyTemplate}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-xs font-bold hover:bg-purple-500/20 transition-all cursor-pointer"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                        <span>{copied ? "Copied" : "Copy"}</span>
                                    </button>
                                </div>
                                <div className="bg-zinc-950 border border-white/5 p-5 rounded-xl font-mono text-xs sm:text-sm text-zinc-200 select-all leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                                    {prompt.content}
                                </div>
                            </div>

                            {/* Usage Instructions */}
                            <div className="space-y-2 border-t border-zinc-100 dark:border-white/5 pt-6">
                                <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                                    Usage Instructions
                                </h3>
                                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                    For best results, configure your parameters on {prompt.aiTool || 'AI'} with low temperature (0.3 - 0.5) to avoid hallucinations. Replace bracketed tags in the template with your target topic details.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Sidebar details) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white dark:bg-[#090a16]/60 border border-zinc-200 dark:border-white/[0.06] p-6 rounded-2xl flex flex-col gap-5 shadow-sm dark:shadow-none backdrop-blur-md">
                            <h3 className="text-sm font-bold text-zinc-800 dark:text-white uppercase tracking-wider border-b border-zinc-100 dark:border-white/5 pb-3">
                                Prompt Details
                            </h3>

                            {/* Metadata list */}
                            <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                                <div className="flex justify-between items-center">
                                    <span>AI Engine</span>
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] ${getEngineStyles(prompt.aiTool)}`}>
                                        {prompt.aiTool || "Other"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Category</span>
                                    <span className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-md text-[10px]">
                                        {prompt.category}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Difficulty</span>
                                    <span className="bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 px-2.5 py-1 rounded-md text-[10px]">
                                        {displayDifficulty}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Visibility</span>
                                    <span className="text-zinc-800 dark:text-zinc-200">
                                        {prompt.visibility || "Public"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Copies Made</span>
                                    <span className="text-zinc-800 dark:text-zinc-200 font-extrabold">
                                        {prompt.copyCount || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Bookmarks</span>
                                    <span className="text-zinc-800 dark:text-zinc-200 font-extrabold">
                                        {prompt.bookmarkCount || 0}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Community Rating</span>
                                    <div className="flex items-center gap-1 text-zinc-800 dark:text-zinc-200">
                                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                        <span>{displayRating} ({reviews.length})</span>
                                    </div>
                                </div>
                            </div>

                            {/* Creator information info card */}
                            <div className="border-t border-zinc-100 dark:border-white/5 pt-4 space-y-3">
                                <h4 className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
                                    Creator Information
                                </h4>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div className="flex flex-col gap-0.5 overflow-hidden">
                                        <p className="text-sm font-extrabold text-zinc-800 dark:text-white truncate" title={getDisplayName()}>
                                            {getDisplayName()}
                                        </p>
                                        <p className="text-[10px] text-zinc-400 dark:text-zinc-500 truncate" title={prompt.creatorEmail}>
                                            {prompt.creatorEmail || "No email listed"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Community Reviews Block --- */}
                <div className="border-t border-zinc-200 dark:border-white/5 pt-10">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white">
                        Community Reviews ({reviews.length})
                    </h2>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
                        
                        {/* Left Side: Submit review form */}
                        <div className="lg:col-span-1 bg-white dark:bg-[#090a16]/60 border border-zinc-200 dark:border-white/[0.06] p-6 rounded-2xl flex flex-col gap-5 shadow-sm dark:shadow-none backdrop-blur-md h-fit">
                            <h3 className="text-sm font-bold text-zinc-800 dark:text-white uppercase tracking-wider">
                                Submit a Review
                            </h3>
                            
                            <form onSubmit={handleSubmitReview} className="space-y-4">
                                {/* Rating Star select */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
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
                                                                : 'text-zinc-300 dark:text-zinc-600'
                                                        } transition-colors`} 
                                                    />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Comment text area */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">
                                        Comment
                                    </label>
                                    <textarea
                                        rows="4"
                                        placeholder="Write your review here. What worked? How did you test it?"
                                        value={commentInput}
                                        onChange={(e) => setCommentInput(e.target.value)}
                                        className="w-full p-3.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-transparent text-sm text-zinc-800 dark:text-white focus:outline-none focus:border-purple-500/40 placeholder-zinc-400 dark:placeholder-zinc-500 leading-relaxed"
                                    />
                                </div>

                                {/* Submit trigger button */}
                                <button
                                    type="submit"
                                    disabled={submittingReview}
                                    className="w-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#820AD1] text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-all duration-300 shadow-[0_4px_12px_rgba(124,58,237,0.2)] hover:shadow-[0_4px_20px_rgba(124,58,237,0.4)] disabled:opacity-50 cursor-pointer"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    <span>{submittingReview ? "Submitting..." : "Submit Review"}</span>
                                </button>
                            </form>
                        </div>

                        {/* Right Side: Reviews lists */}
                        <div className="lg:col-span-2 space-y-4">
                            {reviewsLoading ? (
                                <div className="flex flex-col items-center justify-center p-12 text-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
                                    <p className="mt-2 text-xs text-zinc-400 font-medium">Loading reviews...</p>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="p-12 border border-dashed border-zinc-200 dark:border-white/5 rounded-2xl text-center text-zinc-500">
                                    No reviews yet. Be the first to share your experience!
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    {reviews.map((review) => (
                                        <div 
                                            key={review._id}
                                            className="bg-white dark:bg-[#090a16]/40 border border-zinc-200 dark:border-white/[0.06] p-5 rounded-2xl flex flex-col gap-3 shadow-sm dark:shadow-none"
                                        >
                                            {/* Review Header card */}
                                            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-white/5 pb-2.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-1.5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-400 dark:text-zinc-500">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-zinc-800 dark:text-white truncate max-w-[150px]">
                                                            {review.userName}
                                                        </div>
                                                        <div className="text-[9px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">
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
                                            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
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

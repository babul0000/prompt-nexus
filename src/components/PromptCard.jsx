"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Copy, Check, Sparkles, Star, Eye, Lock, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { incrementCopyCount } from "@/lib/actions/prompt";
import { authClient } from "@/lib/auth-client";

const PromptCard = ({ prompt, onViewDetails }) => {
    const [copied, setCopied] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    if (!prompt) return null;

    const {
        title = "Untitled Prompt",
        description = "No description provided.",
        content = "",
        category = "General",
        aiTool = "Other",
        difficulty = "Beginner",
        visibility = "Public",
        thumbnail = "",
        copyCount = 0,
        bookmarkCount = 0,
        creatorName = "",
        creatorEmail = "",
        rating = null
    } = prompt;

    // Determine colors for AI Engine badge (aligned with actual brand colors)
    const getEngineStyles = (engine) => {
        const eng = engine.toLowerCase();
        if (eng.includes('chatgpt')) {
            return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
        }
        if (eng.includes('gemini')) {
            return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
        }
        if (eng.includes('claude')) {
            return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
        }
        if (eng.includes('midjourney')) {
            return 'bg-purple-500/10 text-purple-650 dark:text-purple-400 border border-purple-500/20';
        }
        if (eng.includes('stable diffusion')) {
            return 'bg-pink-500/10 text-pink-650 dark:text-pink-400 border border-pink-500/20';
        }
        return 'bg-zinc-500/10 text-zinc-650 dark:text-zinc-400 border border-zinc-500/20';
    };

    // Map difficulty: "Advanced" to "PRO"
    const displayDifficulty = difficulty.toLowerCase() === 'advanced' ? 'PRO' : difficulty;

    // Fetch session client side
    const { data: session } = authClient.useSession();
    const user = session?.user;
    const isPro = user?.plan?.toLowerCase() === "pro" || user?.role?.toLowerCase() === "pro" || user?.role?.toLowerCase() === "admin";

    // Check if the prompt is premium based on title OR visibility
    const isPrivate = 
        (prompt.visibility && prompt.visibility.toLowerCase() === 'private') || 
        title?.toLowerCase().includes('premium');

    const isPremiumTool = 
        aiTool?.toLowerCase().includes('claude') || 
        aiTool?.toLowerCase().includes('midjourney');

    const isLocked = (!mounted || !isPro) && (isPrivate || isPremiumTool);
    const isPremium = isPrivate || isPremiumTool;

    // Make creator name look like Mr.Creator if it is "creator" or default to creatorEmail prefix
    const getDisplayName = () => {
        if (creatorName) {
            if (creatorName.toLowerCase() === 'creator') return 'Mr.Creator';
            return creatorName;
        }
        if (creatorEmail) {
            return creatorEmail.split('@')[0];
        }
        return 'Anonymous';
    };

    // Calculate rating stars: if there is bookmarkCount or default rating, use it. Otherwise, default to "0.0"
    const displayRating = rating !== null ? rating : (bookmarkCount > 0 ? bookmarkCount : "0.0");

    const handleCopy = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!content) {
            toast.error("No content to copy!");
            return;
        }

        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            toast.success("Prompt copied to clipboard!", {
                position: "bottom-right",
                autoClose: 2000,
                theme: "dark"
            });
            setTimeout(() => setCopied(false), 2000);

            // Increment copy count in database
            try {
                await incrementCopyCount(prompt._id || prompt.id);
            } catch (err) {
                console.error("Failed to increment copy count:", err);
            }
        } catch (err) {
            console.error("Failed to copy text: ", err);
            toast.error("Failed to copy to clipboard.");
        }
    };

    return (
        <div className="group relative flex flex-col gap-4 bg-white/70 dark:bg-[#070817]/70 border border-zinc-200/60 dark:border-white/[0.05] hover:border-purple-500/35 p-5 rounded-2.5xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl dark:hover:shadow-[0_15px_45px_rgba(124,58,237,0.08)] backdrop-blur-xl overflow-hidden">
            
            {/* Locked / Premium Upgrade Overlay */}
            {isLocked && (
                <Link 
                    href="/payment"
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/40 dark:bg-[#030014]/40 backdrop-blur-[1px] rounded-2.5xl p-5 text-center transition-all duration-300 cursor-pointer pointer-events-auto"
                >
                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-650 dark:text-purple-400 rounded-2xl mb-2.5 shadow-[0_0_20px_rgba(168,85,247,0.15)] animate-pulse">
                        <Lock className="w-5.5 h-5.5" />
                    </div>
                    <h4 className="text-xs font-black text-zinc-900 dark:text-white tracking-wider uppercase flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>Premium Lock</span>
                    </h4>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold max-w-[170px] mt-1 mb-4 leading-relaxed">
                        Upgrade to Pro to view and copy this premium template.
                    </p>
                    <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-650 text-white text-[10px] font-black uppercase tracking-wider rounded-xl shadow-lg active:scale-[0.98] transition-all">
                        Upgrade to Unlock
                    </span>
                </Link>
            )}

            {/* Soft backdrop radial glow on card hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-purple-500/[0.01] dark:to-purple-500/[0.02] rounded-2.5xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className={`flex flex-col gap-4 flex-grow transition-all duration-300 ${isLocked ? 'blur-[1.2px] opacity-90 select-none pointer-events-none' : ''}`}>

            {/* Image / Thumbnail Container */}
            <div className="relative w-full h-44 overflow-hidden rounded-xl bg-gradient-to-br from-zinc-50 to-zinc-150 dark:from-[#0a071c] dark:to-[#170a2b] border border-zinc-200/50 dark:border-white/5 flex items-center justify-center">
                {thumbnail ? (
                    <img 
                        src={thumbnail} 
                        alt={title} 
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-purple-500/20 dark:text-purple-500/25 group-hover:text-purple-500/40 dark:group-hover:text-purple-500/35 transition-colors">
                        <Sparkles className="w-9 h-9 animate-pulse" />
                    </div>
                )}
            </div>

            {/* Badges / Tags */}
            <div className="flex flex-wrap gap-1.5 items-center">
                <span className={`text-[9px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full uppercase ${getEngineStyles(aiTool)}`}>
                    {aiTool}
                </span>
                <span className="text-[9px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full uppercase bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-350 border border-zinc-200/50 dark:border-white/10">
                    {displayDifficulty}
                </span>
                <span className={`text-[9px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full uppercase ${
                    visibility.toLowerCase() === 'private'
                        ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-555 border border-emerald-500/20'
                }`}>
                    {visibility}
                </span>
                {isPremium && (
                    <span className="text-[9px] font-extrabold tracking-wider px-2.5 py-0.5 rounded-full uppercase bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>PREMIUM</span>
                    </span>
                )}
            </div>

            {/* Text details */}
            <div className="flex flex-col gap-1.5 flex-grow">
                <h3 className="text-sm font-extrabold text-zinc-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-[#7C3AED] dark:group-hover:text-purple-400 transition-colors">
                    {title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 min-h-[36px]">
                    {description}
                </p>
            </div>

            {/* Category tag */}
            <div className="flex items-center gap-1 text-[10px] font-extrabold text-[#38bdf8] uppercase select-none">
                <Sparkles className="w-3.5 h-3.5 text-[#38bdf8] animate-pulse" />
                <span>{category}</span>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-100 dark:border-white/5 my-0.5"></div>

            {/* Creator name & Stats Row */}
            <div className="flex items-center justify-between text-xs text-zinc-550 dark:text-zinc-400 pb-1">
                <div className="flex items-center gap-1 truncate max-w-[140px]">
                    <User className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
                    <span className="truncate hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors font-semibold" title={getDisplayName()}>
                        {getDisplayName()}
                    </span>
                </div>
                <div className="flex items-center gap-2.5 flex-shrink-0 select-none text-[11px]">
                    <span className="flex items-center gap-1" title="Copy count">
                        <Copy className="w-3 h-3 text-zinc-400 dark:text-zinc-550" />
                        <span className="font-bold">{copyCount}</span>
                    </span>
                    <span className="flex items-center gap-1" title="Rating">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="font-extrabold text-zinc-700 dark:text-zinc-300">{displayRating}</span>
                    </span>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 w-full pt-1">
                <Link 
                    href={`/all-prompts/${prompt._id || prompt.id}`}
                    className="flex-grow bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#820AD1] text-white py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs transition-all duration-300 shadow-[0_4px_12px_rgba(124,58,237,0.15)] hover:shadow-[0_4px_20px_rgba(124,58,237,0.35)] cursor-pointer"
                >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                </Link>
                <button 
                    onClick={handleCopy}
                    className="p-2.5 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-450 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-150 dark:hover:bg-purple-600/20 hover:border-purple-500/30 transition-all cursor-pointer flex-shrink-0"
                    title="Copy Prompt Content"
                >
                    {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                    ) : (
                        <Copy className="w-3.5 h-3.5" />
                    )}
                </button>
            </div>
            </div>
        </div>
    );
};

export default PromptCard;
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, Sparkles, Star, Eye, Lock, User } from 'lucide-react';
import { toast } from 'react-toastify';

const PromptCard = ({ prompt, onViewDetails }) => {
    const [copied, setCopied] = useState(false);

    if (!prompt) return null;

    const {
        title = "Untitled Prompt",
        description = "No description provided.",
        content = "",
        category = "General",
        aiTool = "Other",
        difficulty = "Beginner",
        thumbnail = "",
        copyCount = 0,
        bookmarkCount = 0,
        creatorName = "",
        creatorEmail = "",
        rating = null
    } = prompt;

    // Determine colors for AI Engine badge
    const getEngineStyles = (engine) => {
        const eng = engine.toLowerCase();
        if (eng.includes('chatgpt')) {
            return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20';
        }
        if (eng.includes('gemini')) {
            return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
        }
        if (eng.includes('claude')) {
            return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
        }
        if (eng.includes('midjourney')) {
            return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
        }
        if (eng.includes('stable diffusion')) {
            return 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20';
        }
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border border-zinc-500/20';
    };

    // Map difficulty: "Advanced" to "PRO"
    const displayDifficulty = difficulty.toLowerCase() === 'advanced' ? 'PRO' : difficulty;

    // Check if the prompt is premium based on title
    const isPremium = title.toLowerCase().includes('premium');

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
        } catch (err) {
            console.error("Failed to copy text: ", err);
            toast.error("Failed to copy to clipboard.");
        }
    };

    return (
        <div className="group relative flex flex-col gap-4 bg-white dark:bg-[#090a16]/80 border border-zinc-200 dark:border-white/[0.06] hover:border-purple-500/30 p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(124,58,237,0.12)] backdrop-blur-md">
            {/* Image / Thumbnail Container */}
            <div className="relative w-full h-44 overflow-hidden rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-[#0c0d21] dark:to-[#16193b] border border-zinc-200/50 dark:border-white/5 flex items-center justify-center">
                {thumbnail ? (
                    <img 
                        src={thumbnail} 
                        alt={title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-purple-500/20 dark:text-purple-500/30 group-hover:text-purple-500/40 dark:group-hover:text-purple-500/50 transition-colors">
                        <Sparkles className="w-10 h-10 animate-pulse" />
                    </div>
                )}
            </div>

            {/* Badges / Tags */}
            <div className="flex flex-wrap gap-2 items-center">
                <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase ${getEngineStyles(aiTool)}`}>
                    {aiTool}
                </span>
                <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/10">
                    {displayDifficulty}
                </span>
                {isPremium && (
                    <span className="text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-md uppercase bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>PREMIUM</span>
                    </span>
                )}
            </div>

            {/* Text details */}
            <div className="flex flex-col gap-2 flex-grow">
                <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-tight line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2 min-h-[40px]">
                    {description}
                </p>
            </div>

            {/* Category tag */}
            <div className="flex items-center gap-1 text-xs font-bold text-[#38bdf8] uppercase select-none">
                <span className="text-cyan-500/60 font-medium">#</span>
                <span>{category}</span>
            </div>

            {/* Divider */}
            <div className="border-t border-zinc-100 dark:border-white/5 my-0.5"></div>

            {/* Creator name & Stats Row */}
            <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pb-1">
                <div className="flex items-center gap-1.5 truncate max-w-[150px]">
                    <User className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
                    <span className="truncate hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors" title={getDisplayName()}>
                        {getDisplayName()}
                    </span>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 select-none">
                    <span className="flex items-center gap-1" title="Copy count">
                        <Copy className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                        <span>{copyCount}</span>
                    </span>
                    <span className="flex items-center gap-1" title="Rating">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="font-semibold text-zinc-700 dark:text-zinc-300">{displayRating}</span>
                    </span>
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 w-full pt-1">
                <Link 
                    href={`/all-prompts/${prompt._id || prompt.id}`}
                    className="flex-grow bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#820AD1] text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-xs transition-all duration-300 shadow-[0_4px_12px_rgba(124,58,237,0.2)] hover:shadow-[0_4px_20px_rgba(124,58,237,0.4)] cursor-pointer"
                >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                </Link>
                <button 
                    onClick={handleCopy}
                    className="p-2.5 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-purple-600/20 hover:border-purple-500/30 transition-all cursor-pointer flex-shrink-0"
                    title="Copy Prompt Content"
                >
                    {copied ? (
                        <Check className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                    ) : (
                        <Copy className="w-4 h-4" />
                    )}
                </button>
            </div>
        </div>
    );
};

export default PromptCard;
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Flame, Users, FileText, Loader2, Compass, Tag } from "lucide-react";

const Banner = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [stats, setStats] = useState({ users: 6, prompts: 21 });
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);
    
    const trendingTags = ["ChatGPT", "Midjourney", "Claude", "Gemini", "Stable Diffusion"];
    const popularSearches = [
        { label: "Midjourney Logo", query: "Midjourney" },
        { label: "SEO Blog Optimizer", query: "SEO" },
        { label: "Email Marketing AI", query: "Marketing" },
        { label: "AI Story Generator", query: "Story" }
    ];

    // Click outside to dismiss suggestions dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch live stats dynamically on mount
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/public-stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error("Failed to fetch public stats:", err);
            }
        };
        fetchStats();
    }, []);

    // Live autocomplete suggestion fetcher (debounced by 200ms)
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSuggestions([]);
            return;
        }

        const fetchSuggestions = async () => {
            setLoadingSuggestions(true);
            try {
                const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
                const res = await fetch(`${baseUrl}/api/prompts?search=${encodeURIComponent(searchQuery.trim())}`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data.slice(0, 5));
                }
            } catch (err) {
                console.error("Failed to fetch search suggestions:", err);
            } finally {
                setLoadingSuggestions(false);
            }
        };

        const timer = setTimeout(() => {
            fetchSuggestions();
        }, 200);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowSuggestions(false);
            router.push(`/all-prompts?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const handleTagClick = (tag) => {
        setSearchQuery(tag);
        setShowSuggestions(false);
        router.push(`/all-prompts?search=${encodeURIComponent(tag)}`);
    };

    return (
        <section className="relative w-full bg-[#030014] pt-36 pb-24 px-6 md:px-12 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
            {/* Glowing background mesh gradients */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-purple-650/10 blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[5%] left-[20%] w-[350px] h-[350px] bg-blue-650/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl w-full mx-auto text-center space-y-10 relative z-10">
                {/* Heading Animation */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.6 }} 
                    className="space-y-5"
                >
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4.5 py-1.5 rounded-full text-xs text-purple-400 font-bold tracking-wide backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:bg-white/10 transition-all cursor-default">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                        <span>Elevate Your AI Productivity</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                        Discover & Share Premium <br />
                        <span className="bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#38BDF8] bg-clip-text text-transparent">AI Prompts</span> Ecosystem
                    </h1>
                    <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto font-medium">
                        Accelerate your workflow with tested, high-quality prompt templates curated for creators, developers, and writers.
                    </p>
                </motion.div>

                {/* Search Bar Form with suggestions */}
                <div ref={searchRef} className="relative w-full max-w-2xl mx-auto z-50">
                    <motion.form 
                        onSubmit={handleSearch} 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 0.6, delay: 0.2 }} 
                        className="w-full bg-[#09090b]/80 border border-white/10 p-2.5 rounded-2xl flex items-center gap-3 backdrop-blur-md focus-within:border-purple-500/40 focus-within:shadow-[0_0_20px_rgba(124,58,237,0.15)] transition-all"
                    >
                        <div className="flex items-center gap-2 flex-grow pl-3">
                            <Search className="w-5 h-5 text-zinc-500 shrink-0" />
                            <input
                                type="text"
                                placeholder="Search prompts by title, tags, or AI tool..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setShowSuggestions(true);
                                }}
                                onFocus={() => setShowSuggestions(true)}
                                className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-zinc-500"
                            />
                            {loadingSuggestions && (
                                <Loader2 className="w-4 h-4 text-purple-400 animate-spin shrink-0 mr-2" />
                            )}
                        </div>
                        <Button 
                            type="submit" 
                            size="md" 
                            className="bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white font-bold px-7 rounded-xl text-xs hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all cursor-pointer hover:scale-[1.01]"
                        >
                            Search
                        </Button>
                    </motion.form>

                    {/* Suggestions Dropdown Popup */}
                    <AnimatePresence>
                        {showSuggestions && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-[#09090b]/95 border border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-md overflow-hidden text-left"
                            >
                                {/* Empty query -> Show Quick Searches */}
                                {!searchQuery.trim() && (
                                    <div className="p-5 space-y-4">
                                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                            <Compass className="w-3.5 h-3.5 text-purple-400" />
                                            <span>Quick Searches</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {popularSearches.map((item) => (
                                                <button
                                                    key={item.label}
                                                    type="button"
                                                    onClick={() => {
                                                        setSearchQuery(item.query);
                                                        setShowSuggestions(false);
                                                        router.push(`/all-prompts?search=${encodeURIComponent(item.query)}`);
                                                    }}
                                                    className="flex items-center gap-2 p-3 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold text-left transition-all cursor-pointer"
                                                >
                                                    <Tag className="w-3 h-3 text-purple-400" />
                                                    <span>{item.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Suggestions available */}
                                {searchQuery.trim() && suggestions.length > 0 && (
                                    <div className="py-2.5">
                                        <div className="px-4 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 mb-1.5 flex justify-between">
                                            <span>Suggestions</span>
                                            <span>{suggestions.length} found</span>
                                        </div>
                                        <div className="flex flex-col">
                                            {suggestions.map((prompt) => (
                                                <button
                                                    key={prompt._id || prompt.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setShowSuggestions(false);
                                                        router.push(`/all-prompts?id=${prompt._id || prompt.id}`);
                                                    }}
                                                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-all text-left group border-b border-white/[0.02] last:border-b-0 cursor-pointer"
                                                >
                                                    <div className="flex flex-col gap-0.5 truncate max-w-[70%]">
                                                        <span className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors truncate">
                                                            {prompt.title}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-500 truncate">
                                                            {prompt.description}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[9px] font-bold text-[#38bdf8] uppercase bg-[#38bdf8]/10 border border-[#38bdf8]/20 px-2 py-0.5 rounded-full shrink-0">
                                                            {prompt.category}
                                                        </span>
                                                        <span className="text-[9px] font-black text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full shrink-0">
                                                            {prompt.aiTool}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowSuggestions(false);
                                                router.push(`/all-prompts?search=${encodeURIComponent(searchQuery.trim())}`);
                                            }}
                                            className="w-full py-2.5 text-center text-xs font-semibold text-purple-400 hover:text-purple-300 hover:bg-white/5 border-t border-white/5 transition-all cursor-pointer"
                                        >
                                            Press Enter to view all results
                                        </button>
                                    </div>
                                )}

                                {/* Suggestions empty */}
                                {searchQuery.trim() && suggestions.length === 0 && !loadingSuggestions && (
                                    <div className="p-6 text-center space-y-2">
                                        <Sparkles className="w-8 h-8 text-zinc-600 mx-auto animate-pulse" />
                                        <p className="text-xs text-zinc-450 font-semibold">No matches found for "{searchQuery}"</p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowSuggestions(false);
                                                router.push(`/all-prompts?search=${encodeURIComponent(searchQuery.trim())}`);
                                            }}
                                            className="text-xs text-purple-400 hover:underline font-bold"
                                        >
                                            Try full search in catalog
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Trending Tags */}
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    transition={{ duration: 0.6, delay: 0.4 }} 
                    className="flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm pt-1"
                >
                    <span className="text-zinc-500 font-bold flex items-center gap-1 uppercase tracking-wider text-[10px]">
                        <Flame className="w-3.5 h-3.5 text-amber-500 animate-bounce" /> Trending:
                    </span>
                    {trendingTags.map((tag) => (
                        <button 
                            key={tag} 
                            type="button" 
                            onClick={() => handleTagClick(tag)} 
                            className="bg-white/5 border border-white/5 hover:border-purple-500/30 text-zinc-400 hover:text-white px-3 py-1 rounded-lg transition-all text-xs font-semibold cursor-pointer active:scale-95"
                        >
                            #{tag}
                        </button>
                    ))}
                </motion.div>

                {/* Live Stats Counter Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex items-center justify-center gap-10 md:gap-16 pt-8 border-t border-white/5 w-full max-w-xl mx-auto"
                >
                    <div className="flex items-center gap-3 text-left">
                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
                            <Users className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-white">{stats.users}+</h4>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Creators</p>
                        </div>
                    </div>
                    
                    <div className="w-px h-8 bg-white/10" />

                    <div className="flex items-center gap-3 text-left">
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                            <FileText className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-xl font-black text-white">{stats.prompts}+</h4>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">AI Templates</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Banner;
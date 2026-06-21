"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, RotateCcw, Compass, Sparkles, X, Copy, Check, Star, User, Lock } from 'lucide-react';
import PromptCard from '@/components/PromptCard';
import { toast } from 'react-toastify';

const AI_ENGINES = [
    'All',
    'ChatGPT',
    'Gemini',
    'Claude',
    'Midjourney',
    'Stable Diffusion',
    'Other'
];

const CATEGORIES = [
    'All',
    'Coding',
    'Writing',
    'Marketing',
    'Graphics & Image',
    'Idea Generation',
    'System Assistant',
    'Other'
];

const DIFFICULTIES = [
    'All',
    'Beginner',
    'Intermediate',
    'Pro'
];

const ExplorePromptsClient = ({ initialPrompts = [], initialSearch = "" }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Filtering, search, and sorting states
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [selectedEngine, setSelectedEngine] = useState('All');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState('All');
    const [sortBy, setSortBy] = useState('Latest');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);

    // Dynamic prompts state fetched from Express Backend
    const [prompts, setPrompts] = useState(() => 
        initialPrompts.filter(p => p.status?.toLowerCase() === 'approved')
    );
    const [loading, setLoading] = useState(false);

    // Reset pagination to page 1 when any filter or sorting change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedEngine, selectedCategory, selectedDifficulty, sortBy]);

    // Selected prompt state for Details Modal
    const [selectedPrompt, setSelectedPrompt] = useState(null);
    const [modalCopied, setModalCopied] = useState(false);

    // Sync search input state with URL parameter (e.g. from Home banner search redirects)
    useEffect(() => {
        const currentSearch = searchParams.get('search') || "";
        if (currentSearch !== searchQuery) {
            setSearchQuery(currentSearch);
        }
    }, [searchParams]);

    // Handle Search query change and sync to URL search parameter
    const handleSearchChange = (value) => {
        setSearchQuery(value);
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set('search', value);
        } else {
            params.delete('search');
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // Fetch filtered prompts from Express Backend API dynamically on filter/sort changes
    useEffect(() => {
        const fetchFilteredPrompts = async () => {
            setLoading(true);
            try {
                const queryParams = new URLSearchParams();
                if (searchQuery.trim()) {
                    queryParams.set('search', searchQuery.trim());
                }
                if (selectedEngine !== 'All') {
                    queryParams.set('aiTool', selectedEngine);
                }
                if (selectedCategory !== 'All') {
                    queryParams.set('category', selectedCategory);
                }
                if (selectedDifficulty !== 'All') {
                    queryParams.set('difficulty', selectedDifficulty);
                }
                queryParams.set('sortBy', sortBy);

                // Fetch from Express Server (resolving local URL if NEXT_PUBLIC_SERVER_URL is missing)
                const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
                const res = await fetch(`${baseUrl}/api/prompts?${queryParams.toString()}`);
                
                if (res.ok) {
                    const data = await res.json();
                    setPrompts(data || []);
                } else {
                    console.error("Backend fetch error status:", res.status);
                }
            } catch (err) {
                console.error("Failed to fetch filtered prompts from backend:", err);
            } finally {
                setLoading(false);
            }
        };

        // Debounce fetch trigger by 300ms to avoid spamming the backend during typing
        const timer = setTimeout(() => {
            fetchFilteredPrompts();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedEngine, selectedCategory, selectedDifficulty, sortBy]);

    // Reset filters handler
    const handleReset = () => {
        setSearchQuery("");
        setSelectedEngine("All");
        setSelectedCategory("All");
        setSelectedDifficulty("All");
        setSortBy("Latest");
        router.replace(pathname, { scroll: false });
    };

    // Modal Copy to Clipboard helper
    const handleModalCopy = async (text) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setModalCopied(true);
            toast.success("Prompt content copied!", {
                position: "bottom-right",
                autoClose: 2000,
                theme: "dark"
            });
            setTimeout(() => setModalCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy modal text", err);
            toast.error("Failed to copy.");
        }
    };

    // Close details modal on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setSelectedPrompt(null);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Pagination calculations
    const itemsPerPage = 12;
    const totalPages = Math.ceil(prompts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedPrompts = prompts.slice(startIndex, endIndex);

    return (
        <section className="relative min-h-screen bg-slate-50 text-zinc-950 dark:bg-[#030014] dark:text-white pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-200">
            {/* Glowing background circles (visible in dark mode) */}
            <div className="absolute top-[5%] left-1/4 -translate-x-1/2 w-[500px] h-[300px] bg-purple-600/0 dark:bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-[35%] right-1/4 translate-x-1/2 w-[600px] h-[350px] bg-blue-600/0 dark:bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10 space-y-10">
                
                {/* Heading & Search Header block */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200 dark:border-white/5 pb-8">
                    <div className="space-y-2">
                        <p className="text-[10px] font-bold tracking-widest text-[#7C3AED] uppercase">
                            Catalog
                        </p>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
                            Explore Prompts
                        </h1>
                        <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                            Showing {prompts.length} verified AI prompts
                        </p>
                    </div>

                    {/* Search Bar matching mockup style */}
                    <div className="relative w-full md:max-w-md bg-white dark:bg-[#090a16]/80 border border-zinc-200 dark:border-white/[0.08] focus-within:border-purple-500/40 focus-within:shadow-[0_0_15px_rgba(124,58,237,0.1)] px-4 py-3 text-sm flex items-center gap-3 rounded-xl transition-all">
                        <Search className="w-4 h-4 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search prompt, tag, tool..."
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="w-full bg-transparent text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none text-sm"
                        />
                    </div>
                </div>

                {/* Two-column catalog section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1 flex flex-col gap-6 bg-white dark:bg-[#090a16]/50 border border-zinc-200 dark:border-white/[0.06] p-6 rounded-2xl h-fit shadow-sm dark:shadow-none backdrop-blur-md">
                        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-white/5 pb-4">
                            <div className="flex items-center gap-2 text-sm font-bold text-zinc-800 dark:text-white uppercase tracking-wider">
                                <SlidersHorizontal className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                                <span>Filters</span>
                            </div>
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:underline transition-colors cursor-pointer"
                            >
                                <RotateCcw className="w-3 h-3" />
                                <span>Reset</span>
                            </button>
                        </div>

                        {/* AI Engine section */}
                        <div className="flex flex-col gap-2">
                            <h3 className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase mb-2">
                                AI Engine
                            </h3>
                            <div className="flex flex-col gap-1">
                                {AI_ENGINES.map((engine) => {
                                    const isActive = selectedEngine === engine;
                                    return (
                                        <button
                                            key={engine}
                                            onClick={() => setSelectedEngine(engine)}
                                            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                                isActive
                                                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                                                    : 'text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.02]'
                                            }`}
                                        >
                                            {engine}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Category section */}
                        <div className="flex flex-col gap-2">
                            <h3 className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase mb-2">
                                Category
                            </h3>
                            <div className="flex flex-col gap-1 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                                {CATEGORIES.map((category) => {
                                    const isActive = selectedCategory === category;
                                    return (
                                        <button
                                            key={category}
                                            onClick={() => setSelectedCategory(category)}
                                            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                                isActive
                                                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                                                    : 'text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.02]'
                                            }`}
                                        >
                                            {category}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Difficulty section */}
                        <div className="flex flex-col gap-2 border-t border-zinc-100 dark:border-white/5 pt-4">
                            <h3 className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase mb-2">
                                Difficulty
                            </h3>
                            <div className="flex flex-col gap-1">
                                {DIFFICULTIES.map((diff) => {
                                    const isActive = selectedDifficulty === diff;
                                    return (
                                        <button
                                            key={diff}
                                            onClick={() => setSelectedDifficulty(diff)}
                                            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                                isActive
                                                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                                                    : 'text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/[0.02]'
                                            }`}
                                        >
                                            {diff}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Sorting & Prompts List */}
                    <div className="lg:col-span-3 space-y-6">
                        
                        {/* Sort By section */}
                        <div className="flex flex-wrap items-center gap-3 bg-zinc-100 dark:bg-[#090a16]/30 border border-zinc-200 dark:border-white/[0.06] p-3 rounded-2xl backdrop-blur-sm">
                            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 tracking-wider uppercase px-2">
                                Sort By:
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {['Latest', 'Most Popular', 'Most Copied'].map((sortOption) => {
                                    const isActive = sortBy === sortOption;
                                    return (
                                        <button
                                            key={sortOption}
                                            onClick={() => setSortBy(sortOption)}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                                isActive
                                                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                                                    : 'text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-white/[0.02]'
                                            }`}
                                        >
                                            {sortOption}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Cards Grid & Loading Indicator */}
                        {loading ? (
                            <div className="col-span-1 sm:col-span-2 xl:col-span-3 flex flex-col items-center justify-center p-32 text-center space-y-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                                <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 font-medium">Fetching prompts from database...</p>
                            </div>
                        ) : prompts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-20 bg-zinc-100 dark:bg-[#090a16]/20 border border-zinc-200 dark:border-white/[0.04] rounded-2xl text-center space-y-4">
                                <Sparkles className="w-12 h-12 text-zinc-400 dark:text-zinc-600 animate-bounce" />
                                <div className="space-y-1">
                                    <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">No Prompts Found</h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
                                        We couldn't find any prompts matching your active filters. Try searching for something else or resetting the filters.
                                    </p>
                                </div>
                                <button
                                    onClick={handleReset}
                                    className="px-5 py-2 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white text-xs font-semibold rounded-xl hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all cursor-pointer"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {paginatedPrompts.map((prompt) => (
                                        <PromptCard 
                                            key={prompt.id || prompt._id} 
                                            prompt={prompt} 
                                            onViewDetails={(p) => setSelectedPrompt(p)}
                                        />
                                    ))}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 pt-4 select-none">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] text-zinc-600 dark:text-slate-300 hover:bg-zinc-100 dark:hover:bg-[#131735]/40 hover:text-purple-650 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all cursor-pointer"
                                        >
                                            Previous
                                        </button>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                                            const isActive = currentPage === pageNum;
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                    className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center border transition-all cursor-pointer ${
                                                        isActive
                                                            ? 'bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white border-transparent shadow-[0_4px_12px_rgba(124,58,237,0.2)]'
                                                            : 'bg-white dark:bg-[#0a0d26] border-zinc-200 dark:border-[#13193e] text-zinc-650 dark:text-slate-350 hover:bg-zinc-100 dark:hover:bg-[#131735]/40 hover:text-purple-650 dark:hover:text-white'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}

                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] text-zinc-650 dark:text-slate-300 hover:bg-zinc-100 dark:hover:bg-[#131735]/40 hover:text-purple-650 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all cursor-pointer"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- Premium Details Modal --- */}
            {selectedPrompt && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/75 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
                    onClick={() => setSelectedPrompt(null)}
                >
                    <div 
                        className="bg-white dark:bg-[#090a16]/95 border border-zinc-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col gap-6 relative shadow-[0_10px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(124,58,237,0.25)] scrollbar-hide animate-scaleIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button 
                            onClick={() => setSelectedPrompt(null)}
                            className="absolute top-4 right-4 p-2 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white transition-all cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {/* Title and Badges */}
                        <div className="space-y-3">
                            <div className="flex flex-wrap gap-2 items-center">
                                <span className="text-[10px] font-bold tracking-widest text-[#7C3AED] uppercase">
                                    {selectedPrompt.aiTool || 'Other'}
                                </span>
                                <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded uppercase bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-white/10">
                                    {selectedPrompt.difficulty?.toLowerCase() === 'advanced' ? 'PRO' : (selectedPrompt.difficulty || 'Beginner')}
                                </span>
                                {selectedPrompt.title?.toLowerCase().includes('premium') && (
                                    <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded uppercase bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
                                        <Lock className="w-2.5 h-2.5" />
                                        <span>PREMIUM</span>
                                    </span>
                                )}
                            </div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
                                {selectedPrompt.title}
                            </h2>
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                            <h4 className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                                Description
                            </h4>
                            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                {selectedPrompt.description}
                            </p>
                        </div>

                        {/* Code prompt block */}
                        <div className="space-y-2 relative">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                                    Prompt Content
                                </h4>
                                <button
                                    onClick={() => handleModalCopy(selectedPrompt.content)}
                                    className="flex items-center gap-1.5 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors font-semibold cursor-pointer"
                                >
                                    {modalCopied ? (
                                        <>
                                            <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                                            <span className="text-emerald-500 dark:text-emerald-400">Copied!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            <span>Copy Prompt</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            
                            <div className="relative group bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/5 rounded-xl p-4 sm:p-5 font-mono text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 select-all whitespace-pre-wrap leading-relaxed max-h-[300px] overflow-y-auto">
                                {selectedPrompt.content}
                            </div>
                        </div>

                        {/* Meta information row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-zinc-100 dark:border-white/5 pt-6 text-xs text-zinc-500 dark:text-zinc-400">
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Creator</span>
                                <div className="flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                                    <span className="font-semibold text-zinc-700 dark:text-zinc-300 truncate">
                                        {selectedPrompt.creatorName === 'creator' ? 'Mr.Creator' : (selectedPrompt.creatorName || selectedPrompt.creatorEmail?.split('@')[0] || 'Anonymous')}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Category</span>
                                <span className="font-semibold text-[#38bdf8] uppercase">
                                    #{selectedPrompt.category}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Copies</span>
                                <div className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 font-semibold">
                                    <Copy className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                                    <span>{selectedPrompt.copyCount || 0}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider block">Rating</span>
                                <div className="flex items-center gap-1.5 text-zinc-750 dark:text-zinc-300 font-semibold">
                                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                    <span>{selectedPrompt.rating !== null ? selectedPrompt.rating : (selectedPrompt.bookmarkCount > 0 ? selectedPrompt.bookmarkCount : "0.0")}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer button */}
                        <div className="border-t border-zinc-100 dark:border-white/5 pt-4 flex justify-end">
                            <button
                                onClick={() => setSelectedPrompt(null)}
                                className="px-5 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-800 dark:text-white font-semibold text-xs transition-all cursor-pointer"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ExplorePromptsClient;

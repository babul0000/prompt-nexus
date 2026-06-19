"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";

const Banner = () => {
    // ----------------------------------------------------
    // 🔍 SEARCH STATE & TRIGGER (COMMENTED)
    // ----------------------------------------------------
    const [searchQuery, setSearchQuery] = useState("");
    const trendingTags = ["ChatGPT", "Midjourney", "Claude", "Gemini", "Stable Diffusion"];

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery);
        /* if(searchQuery) {
            router.push(`/all-prompts?search=${searchQuery}`);
        }
        */
    };

    return (
        <section className="relative w-full bg-[#030014] pt-32 pb-20 px-6 md:px-12 overflow-hidden flex flex-col items-center justify-center min-h-[85vh]">
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
                {/* Heading Animation */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-4">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs text-purple-400 font-medium backdrop-blur-sm">
                        ✨ Elevate Your AI Productivity
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                        Discover & Share Premium <br />
                        <span className="bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#38BDF8] bg-clip-text text-transparent">AI Prompts</span> Ecosystem
                    </h1>
                </motion.div>

                {/* Search Bar Form */}
                <motion.form onSubmit={handleSearch} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="w-full max-w-2xl mx-auto bg-[#09090b]/80 border border-white/10 p-2 rounded-xl flex items-center gap-2 backdrop-blur-md">
                    <div className="flex items-center gap-2 flex-grow pl-3">
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search prompts by title, tags, or AI tool..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-gray-500"
                        />
                    </div>
                    <Button type="submit" size="md" className="bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white font-medium px-6 rounded-lg text-sm">
                        Search
                    </Button>
                </motion.form>

                {/* Trending Tags */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} className="flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm pt-2">
                    <span className="text-gray-500 font-medium">Trending:</span>
                    {trendingTags.map((tag) => (
                        <button key={tag} type="button" onClick={() => setSearchQuery(tag)} className="bg-white/5 border border-white/5 hover:border-purple-500/40 text-gray-300 hover:text-white px-3 py-1 rounded-md transition-all text-xs">
                            #{tag}
                        </button>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Banner;
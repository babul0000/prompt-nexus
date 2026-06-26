"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import PromptCard from '@/components/PromptCard';
import { baseUrl } from '@/lib/core/baseUrl';

const FeaturedPrompts = () => {
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeaturedPrompts = async () => {
            try {
                const res = await fetch(`${baseUrl}/api/prompts?featured=true`);
                if (res.ok) {
                    const data = await res.json();
                    // Filter approved prompts just in case
                    const approvedFeatured = data.filter(p => p.status?.toLowerCase() === 'approved');
                    setPrompts(approvedFeatured.slice(0, 6));
                } else {
                    setError("Failed to fetch featured prompts");
                }
            } catch (err) {
                console.error("Error fetching featured prompts:", err);
                setError("Error connecting to server");
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedPrompts();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <section className="relative w-full bg-slate-50 dark:bg-[#030014] pb-28 px-6 md:px-12 overflow-hidden flex flex-col items-center transition-colors duration-300">
            {/* Glowing background mesh gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-purple-600/5 dark:bg-purple-650/10 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse-slow" />
            <div className="absolute bottom-0 right-[10%] w-[350px] h-[350px] bg-blue-600/5 dark:bg-blue-650/10 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-7xl w-full mx-auto relative z-10 flex flex-col items-center">
                {/* Header */}
                <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4.5 py-1.5 rounded-full text-xs text-purple-655 dark:text-purple-400 font-bold tracking-wide backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.06)] hover:bg-white/10 transition-all cursor-default"
                    >
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                        <span>Featured Highlights</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight"
                    >
                        Top-Performing <span className="bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#38BDF8] bg-clip-text text-transparent">AI Prompts</span>
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base font-medium max-w-xl mx-auto"
                    >
                        Explore our handpicked collection of highly-rated, premium templates designed to optimize your creative and technical workflows.
                    </motion.p>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20 w-full">
                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin mb-4" />
                        <p className="text-sm text-zinc-500 font-medium">Curating featured templates...</p>
                    </div>
                )}

                {/* Error / Empty state */}
                {!loading && (error || prompts.length === 0) && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center p-12 bg-white/5 border border-white/10 rounded-2xl text-center max-w-md mx-auto"
                    >
                        <Sparkles className="w-10 h-10 text-zinc-500 mb-4 animate-pulse" />
                        <h3 className="text-lg font-bold text-white mb-2">No Featured Highlights Yet</h3>
                        <p className="text-xs text-zinc-400 mb-6">
                            Check back later to see handpicked premium prompts selected by our editors.
                        </p>
                        <Link 
                            href="/all-prompts"
                            className="px-5 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white text-xs font-bold rounded-xl hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all flex items-center gap-1.5"
                        >
                            <span>Browse All Prompts</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </motion.div>
                )}

                {/* Grid */}
                {!loading && prompts.length > 0 && (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-16"
                    >
                        {prompts.map((prompt) => (
                            <motion.div key={prompt._id || prompt.id} variants={itemVariants}>
                                <PromptCard prompt={prompt} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* CTA Button */}
                {!loading && prompts.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <Link 
                            href="/all-prompts"
                            className="group bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#820AD1] text-white font-bold py-3.5 px-8 rounded-xl flex items-center gap-2.5 text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_4px_12px_rgba(124,58,237,0.2)] hover:shadow-[0_4px_20px_rgba(124,58,237,0.4)] cursor-pointer hover:scale-[1.02]"
                        >
                            <span>Explore Catalog</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" />
                        </Link>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default FeaturedPrompts;

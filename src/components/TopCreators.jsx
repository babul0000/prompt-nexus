"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, User, FileText, Copy, Award } from 'lucide-react';

const TopCreators = () => {
    const [creators, setCreators] = useState([]);
    const [loading, setLoading] = useState(true);

    const fallbacks = [
        {
            name: "PromptMaster",
            role: "Senior Engineer",
            promptCount: 42,
            copyCount: 1240,
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
        },
        {
            name: "CreativeAI",
            role: "Art Director",
            promptCount: 28,
            copyCount: 980,
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256"
        },
        {
            name: "GeminiWiz",
            role: "Writer & Marketer",
            promptCount: 35,
            copyCount: 850,
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256"
        }
    ];

    const creatorRoles = [
        "Senior AI Engineer",
        "Art Director",
        "Writer & Marketer",
        "ChatGPT Specialist",
        "Creative Writer",
        "Fullstack Developer"
    ];

    useEffect(() => {
        const fetchCreatorsData = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
                const res = await fetch(`${baseUrl}/api/prompts`);
                if (res.ok) {
                    const prompts = await res.json();
                    
                    const creatorsMap = {};
                    prompts.forEach((p) => {
                        if (p.status?.toLowerCase() !== 'approved') return;
                        
                        const email = p.creatorEmail || 'anonymous@promptnexus.com';
                        const name = p.creatorName === 'creator' ? 'Mr.Creator' : (p.creatorName || email.split('@')[0]);
                        
                        if (!creatorsMap[email]) {
                            creatorsMap[email] = {
                                name: name,
                                email: email,
                                promptCount: 0,
                                copyCount: 0,
                                role: "",
                                image: p.creatorImage || ""
                            };
                        }
                        creatorsMap[email].promptCount += 1;
                        creatorsMap[email].copyCount += parseInt(p.copyCount || 0);
                    });

                    let creatorsList = Object.values(creatorsMap);
                    
                    // Sort creators by copyCount descending
                    creatorsList.sort((a, b) => b.copyCount - a.copyCount);
                    
                    // Assign cool roles and avatars if missing
                    creatorsList = creatorsList.map((creator, index) => {
                        // Map index to a specific fallback image if not present
                        const fallbackImg = fallbacks[index % fallbacks.length].image;
                        const fallbackRole = creatorRoles[index % creatorRoles.length];
                        
                        return {
                            ...creator,
                            role: creator.name === 'Mr.Creator' ? 'Lead Prompt Architect' : fallbackRole,
                            image: creator.image || fallbackImg
                        };
                    });

                    // Pad with fallbacks if fewer than 3 dynamic creators are found
                    if (creatorsList.length < 3) {
                        const existingEmails = new Set(creatorsList.map(c => c.email));
                        const extraFallbacks = fallbacks.filter(f => !existingEmails.has(f.name.toLowerCase()));
                        creatorsList = [...creatorsList, ...extraFallbacks].slice(0, 3);
                    }

                    setCreators(creatorsList.slice(0, 3));
                } else {
                    setCreators(fallbacks);
                }
            } catch (err) {
                console.error("Error aggregating top creators:", err);
                setCreators(fallbacks);
            } finally {
                setLoading(false);
            }
        };

        fetchCreatorsData();
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

    const cardVariants = {
        hidden: { opacity: 0, y: 25 },
        show: { 
            opacity: 1, 
            y: 0, 
            transition: { 
                type: "spring", 
                stiffness: 100,
                damping: 15
            } 
        }
    };

    return (
        <section className="relative w-full bg-slate-50 dark:bg-[#030014] pb-24 px-6 md:px-12 overflow-hidden flex flex-col items-center transition-colors duration-300">
            {/* Background mesh glowing */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-650/5 blur-[130px] rounded-full pointer-events-none" />

            <div className="max-w-7xl w-full mx-auto relative z-10 flex flex-col items-center">
                {/* Header */}
                <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-white/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-4.5 py-1.5 rounded-full text-xs text-purple-650 dark:text-purple-400 font-bold tracking-wide backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:bg-white/10 transition-all cursor-default"
                    >
                        <Award className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-pulse" />
                        <span>Showcase</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight"
                    >
                        Top Prompt <span className="bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#38BDF8] bg-clip-text text-transparent">Creators</span>
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-zinc-650 dark:text-zinc-400 text-sm md:text-base font-medium max-w-xl mx-auto"
                    >
                        Engage with community leaders pioneering advanced prompt structures.
                    </motion.p>
                </div>

                {/* Creators List Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
                    >
                        {creators.map((creator, idx) => (
                            <motion.div 
                                key={idx}
                                variants={cardVariants}
                                className="group relative flex flex-col items-center text-center bg-white dark:bg-[#090a16]/40 border border-zinc-200 dark:border-white/[0.05] hover:border-purple-500/30 p-8 rounded-2.5xl transition-all duration-300 backdrop-blur-md hover:-translate-y-1.5 hover:shadow-lg dark:hover:shadow-[0_15px_40px_rgba(124,58,237,0.06)]"
                            >
                                {/* Creator Avatar with purple glow ring */}
                                <div className="relative mb-6">
                                    <div className="p-1 bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#38BDF8] rounded-full group-hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(124,58,237,0.25)]">
                                        <div className="w-20 h-20 bg-zinc-950 rounded-full overflow-hidden flex items-center justify-center">
                                            {creator.image ? (
                                                <img 
                                                    src={creator.image} 
                                                    alt={creator.name} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            ) : (
                                                <span className="text-xl font-black text-white">
                                                    {creator.name.charAt(0).toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {/* Small verified badge style decoration */}
                                    <div className="absolute -bottom-1 -right-1 bg-[#7C3AED] border-2 border-white dark:border-[#090a16] p-1.5 rounded-full flex items-center justify-center">
                                        <Award className="w-3 h-3 text-white" />
                                    </div>
                                </div>

                                {/* Creator details */}
                                <div className="space-y-1.5 mb-8">
                                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-purple-600 group-hover:dark:text-purple-400 transition-colors">
                                        {creator.name}
                                    </h3>
                                    <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                                        {creator.role}
                                    </p>
                                </div>

                                {/* Divider */}
                                <div className="w-full border-t border-zinc-200 dark:border-white/5 mb-6" />

                                {/* Stats row */}
                                <div className="flex justify-around items-center w-full">
                                    <div className="flex flex-col gap-1 items-center">
                                        <span className="text-xs font-bold text-zinc-500 tracking-wider uppercase">Prompts</span>
                                        <span className="text-base font-black text-zinc-900 dark:text-white flex items-center gap-1.5">
                                            <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                                            {creator.promptCount}
                                        </span>
                                    </div>
                                    
                                    <div className="w-px h-8 bg-zinc-200 dark:bg-white/10" />

                                    <div className="flex flex-col gap-1 items-center">
                                        <span className="text-xs font-bold text-zinc-500 tracking-wider uppercase">Copies</span>
                                        <span className="text-base font-black text-zinc-900 dark:text-white flex items-center gap-1.5">
                                            <Copy className="w-4 h-4 text-blue-650 dark:text-blue-400 shrink-0" />
                                            {creator.copyCount}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default TopCreators;

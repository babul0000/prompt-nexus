"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, User, FileText, Copy, Award } from 'lucide-react';
import { baseUrl } from '@/lib/core/baseUrl';

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
                stiffness: 90,
                damping: 14
            } 
        }
    };

    return (
        <section className="relative w-full bg-slate-50 dark:bg-[#030014] pb-24 px-6 md:px-12 overflow-hidden flex flex-col items-center transition-colors duration-300">
            
            {/* Background mesh glowing */}
            <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-650/5 dark:bg-purple-650/10 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse-slow" />

            <div className="max-w-7xl w-full mx-auto relative z-10 flex flex-col items-center">
                {/* Header */}
                <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4.5 py-1.5 rounded-full text-xs text-purple-650 dark:text-purple-400 font-bold tracking-wide backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.06)] hover:bg-white/10 transition-all cursor-default"
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
                        className="text-zinc-655 dark:text-zinc-400 text-sm md:text-base font-semibold max-w-xl mx-auto"
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
                                className="group relative flex flex-col items-center text-center bg-white/70 dark:bg-[#070817]/60 border border-zinc-200/60 dark:border-white/[0.05] hover:border-purple-500/35 rounded-2.5xl transition-all duration-300 backdrop-blur-xl hover:-translate-y-1.5 hover:shadow-2xl dark:hover:shadow-[0_15px_40px_rgba(124,58,237,0.08)] overflow-hidden"
                            >
                                {/* Decorative Cover Banner */}
                                <div className="w-full h-24 bg-gradient-to-r from-[#7C3AED]/20 to-[#38BDF8]/20 dark:from-[#7C3AED]/10 dark:to-[#38BDF8]/10 relative overflow-hidden shrink-0">
                                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:10px_10px]" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-purple-500/30 blur-[30px] rounded-full pointer-events-none" />
                                </div>

                                <div className="px-8 pb-8 pt-0 flex flex-col items-center -mt-10">
                                    {/* Creator Avatar with purple glow ring */}
                                    <div className="relative mb-4 z-10 shrink-0">
                                        <div className="p-1 bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#38BDF8] rounded-full group-hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(124,58,237,0.25)]">
                                            <div className="w-20 h-20 bg-zinc-950 rounded-full overflow-hidden flex items-center justify-center border-2 border-white dark:border-[#070817]">
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
                                        {/* Verified badge style decoration */}
                                        <div className="absolute -bottom-1 -right-1 bg-[#7C3AED] border-2 border-white dark:border-[#070817] p-1.5 rounded-full flex items-center justify-center shadow-lg">
                                            <Award className="w-3.5 h-3.5 text-white" />
                                        </div>
                                    </div>

                                    {/* Creator details */}
                                    <div className="space-y-1 mb-6">
                                        <h3 className="text-base font-extrabold text-zinc-900 dark:text-white group-hover:text-[#7C3AED] group-hover:dark:text-purple-400 transition-colors">
                                            {creator.name}
                                        </h3>
                                        <p className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest">
                                            {creator.role}
                                        </p>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-full border-t border-zinc-200 dark:border-white/5 mb-6" />

                                    {/* Stats row */}
                                    <div className="flex justify-around items-center w-full gap-4">
                                        <div className="flex flex-col gap-1 items-center px-4 py-2 rounded-xl bg-zinc-100/50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/[0.05]">
                                            <span className="text-[9px] font-extrabold text-zinc-500 tracking-wider uppercase">Prompts</span>
                                            <span className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-1">
                                                <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0" />
                                                {creator.promptCount}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-1 items-center px-4 py-2 rounded-xl bg-zinc-100/50 dark:bg-white/[0.03] border border-zinc-200/50 dark:border-white/[0.05]">
                                            <span className="text-[9px] font-extrabold text-zinc-500 tracking-wider uppercase">Copies</span>
                                            <span className="text-sm font-black text-zinc-900 dark:text-white flex items-center gap-1">
                                                <Copy className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                                                {creator.copyCount}
                                            </span>
                                        </div>
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

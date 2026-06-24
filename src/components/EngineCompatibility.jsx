"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Terminal } from 'lucide-react';

const EngineCompatibility = () => {
    const engines = [
        {
            name: "ChatGPT",
            version: "GPT-4o / GPT-4",
            description: "Complex reasoning, detailed programming and structures, logic refinement.",
            badgeColor: "bg-purple-500/10 text-purple-400 border border-purple-500/20",
            hoverBorder: "hover:border-purple-500/30"
        },
        {
            name: "Gemini",
            version: "Gemini 1.5 Pro",
            description: "Ultra-large context windows, deep code analysis, Google Workspace syncing.",
            badgeColor: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
            hoverBorder: "hover:border-blue-500/30"
        },
        {
            name: "Claude",
            version: "Claude 3.5 Sonnet",
            description: "Premium programmatic output, highly natural copywriting, markdown structuring.",
            badgeColor: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
            hoverBorder: "hover:border-amber-500/30"
        },
        {
            name: "Midjourney",
            version: "Midjourney v6",
            description: "Highly artistic rendering, aspect ratio configuration, photo-realism parameters.",
            badgeColor: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
            hoverBorder: "hover:border-emerald-500/30"
        }
    ];

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
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <section className="relative w-full bg-slate-50 dark:bg-[#030014] pb-24 px-6 md:px-12 overflow-hidden flex flex-col items-center transition-colors duration-300">
            {/* Background Mesh Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-blue-650/5 blur-[130px] rounded-full pointer-events-none" />

            <div className="max-w-7xl w-full mx-auto relative z-10 flex flex-col items-center">
                {/* Header */}
                <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-white/5 dark:bg-white/5 border border-zinc-200 dark:border-white/10 px-4.5 py-1.5 rounded-full text-xs text-purple-650 dark:text-purple-400 font-bold tracking-wide backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                    >
                        <Terminal className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        <span>Multi-Platform</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight"
                    >
                        Engine <span className="bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#38BDF8] bg-clip-text text-transparent">Compatibility</span>
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-zinc-650 dark:text-zinc-400 text-sm md:text-base font-medium max-w-xl mx-auto"
                    >
                        Prompts on PromptForge are tailored for individual models to exploit distinct strengths.
                    </motion.p>
                </div>

                {/* Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
                >
                    {engines.map((item, idx) => (
                        <motion.div 
                            key={idx}
                            variants={cardVariants}
                            className={`group flex flex-col gap-4 bg-white dark:bg-[#090a16]/40 border border-zinc-200 dark:border-white/[0.05] p-6 rounded-2xl transition-all duration-300 backdrop-blur-md hover:-translate-y-1 text-left ${item.hoverBorder} hover:shadow-lg dark:hover:shadow-[0_10px_25px_rgba(0,0,0,0.3)]`}
                        >
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-black text-zinc-900 dark:text-white group-hover:text-purple-650 dark:group-hover:text-purple-400 transition-colors">
                                    {item.name}
                                </h3>
                                <span className={`w-fit text-[10px] font-extrabold tracking-wider px-2 py-0.5 rounded uppercase ${item.badgeColor}`}>
                                    {item.version}
                                </span>
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 text-xs md:text-sm leading-relaxed mt-2">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default EngineCompatibility;

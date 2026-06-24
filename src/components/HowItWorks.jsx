"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Copy, Share2, ArrowRight, Sparkles } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            number: "01",
            icon: <Search className="w-6 h-6 text-purple-400" />,
            title: "Explore Prompts",
            description: "Browse our extensive catalog of tested, high-quality AI prompt templates optimized for diverse categories and AI tools."
        },
        {
            number: "02",
            icon: <Copy className="w-6 h-6 text-blue-400" />,
            title: "Copy & Use",
            description: "Easily copy prompt contents with a single click, customize placeholders, and inject them directly into your favorite AI tool."
        },
        {
            number: "03",
            icon: <Share2 className="w-6 h-6 text-[#38bdf8]" />,
            title: "Share Your Prompts",
            description: "Publish your own customized prompts, build your creator portfolio, gain copy metrics, and monetise premium templates."
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
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
        <section className="relative w-full bg-[#030014] pb-28 px-6 md:px-12 overflow-hidden flex flex-col items-center">
            {/* Glowing background mesh gradients */}
            <div className="absolute top-[30%] right-[10%] w-[350px] h-[350px] bg-purple-650/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[10%] left-[10%] w-[350px] h-[350px] bg-blue-650/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl w-full mx-auto relative z-10 flex flex-col items-center">
                {/* Section Header */}
                <div className="text-center space-y-4 max-w-2xl mx-auto mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4.5 py-1.5 rounded-full text-xs text-purple-400 font-bold tracking-wide backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:bg-white/10 transition-all cursor-default"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                        <span>Workflow Guide</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight"
                    >
                        How It <span className="bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#38BDF8] bg-clip-text text-transparent">Works</span>
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-zinc-405 text-sm md:text-base font-medium max-w-xl mx-auto"
                    >
                        Master PromptForge in three effortless steps and jumpstart your AI engineering workflow today.
                    </motion.p>
                </div>

                {/* Steps Cards Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full relative"
                >
                    {/* Connecting dashed line for large screens */}
                    <div className="hidden md:block absolute top-[44%] left-[12%] right-[12%] h-[1.5px] border-t border-dashed border-zinc-700/40 -z-10 pointer-events-none" />

                    {steps.map((step, idx) => (
                        <motion.div 
                            key={idx}
                            variants={cardVariants}
                            className="group relative flex flex-col gap-6 bg-[#090a16]/40 border border-white/[0.05] hover:border-purple-500/30 p-8 rounded-2.5xl transition-all duration-300 backdrop-blur-md hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(124,58,237,0.06)]"
                        >
                            {/* Step Badge / Icon Row */}
                            <div className="flex items-center justify-between">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-purple-500/10 group-hover:border-purple-500/20 text-zinc-450 group-hover:text-purple-400 transition-all duration-300">
                                    {step.icon}
                                </div>
                                <span className="text-4xl font-black bg-gradient-to-r from-zinc-800 to-zinc-750 dark:from-white/10 dark:to-white/[0.02] bg-clip-text text-transparent group-hover:text-purple-500/20 transition-all duration-500 select-none">
                                    {step.number}
                                </span>
                            </div>

                            {/* Card Content */}
                            <div className="space-y-3.5 text-left">
                                <h3 className="text-lg font-bold text-white group-hover:text-purple-450 transition-colors tracking-tight">
                                    {step.title}
                                </h3>
                                <p className="text-zinc-400 text-sm leading-relaxed min-h-[80px]">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;

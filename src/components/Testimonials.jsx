"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Quote } from 'lucide-react';

const Testimonials = () => {
    const list = [
        {
            name: "Sarah Connor",
            role: "Content Strategist",
            quote: "PromptForge completely changed how I interact with Claude. The prompts are highly refined and save me hours every day.",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=128"
        },
        {
            name: "Alex Rivera",
            role: "Software Engineer",
            quote: "I found an incredible prompt that debugs React code and writes unit tests in seconds. Simply amazing!",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128"
        },
        {
            name: "Elena Rostova",
            role: "Digital Artist",
            quote: "The Midjourney prompts here are pure gold. The parameters and keywords are so detailed. Highly recommend!",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128"
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
        <section className="relative w-full bg-slate-50 dark:bg-[#030014] pb-28 px-6 md:px-12 overflow-hidden flex flex-col items-center transition-colors duration-300">
            
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-650/5 dark:bg-purple-650/10 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse-slow" />

            <div className="max-w-7xl w-full mx-auto relative z-10 flex flex-col items-center">
                {/* Header */}
                <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4.5 py-1.5 rounded-full text-xs text-purple-655 dark:text-purple-400 font-bold tracking-wide backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.06)]"
                    >
                        <MessageSquare className="w-3.5 h-3.5 text-purple-650 dark:text-purple-400 animate-pulse" />
                        <span>Testimonials</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight"
                    >
                        What Users <span className="bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#38BDF8] bg-clip-text text-transparent">Say</span>
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-zinc-655 dark:text-zinc-400 text-sm md:text-base font-semibold max-w-xl mx-auto"
                    >
                        Real feedback from designers, engineers, and creators who scale their output with us.
                    </motion.p>
                </div>

                {/* Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
                >
                    {list.map((item, idx) => (
                        <motion.div 
                            key={idx}
                            variants={cardVariants}
                            className="group relative flex flex-col justify-between bg-white/70 dark:bg-[#070817]/60 border border-zinc-200/60 dark:border-white/[0.05] hover:border-purple-500/35 p-8 rounded-2.5xl transition-all duration-300 backdrop-blur-xl hover:-translate-y-1.5 hover:shadow-2xl dark:hover:shadow-[0_15px_40px_rgba(124,58,237,0.08)] text-left overflow-hidden"
                        >
                            {/* Decorative Quotation Mark in top-right */}
                            <Quote className="absolute top-4 right-4 w-20 h-20 text-purple-500/[0.04] dark:text-purple-500/[0.03] pointer-events-none select-none" />

                            {/* Stars rating & Quote */}
                            <div className="space-y-4 relative z-10">
                                <div className="flex gap-1 text-amber-500">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className="w-3.5 h-3.5 fill-amber-500" />
                                    ))}
                                </div>
                                <p className="text-zinc-655 dark:text-zinc-350 text-xs sm:text-sm leading-relaxed italic font-medium">
                                    "{item.quote}"
                                </p>
                            </div>

                            {/* Author row */}
                            <div className="flex items-center gap-3.5 pt-5 mt-5 border-t border-zinc-200/80 dark:border-white/5 relative z-10">
                                <div className="p-[1.5px] bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#38BDF8] rounded-full">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-[#070817]" 
                                    />
                                </div>
                                <div>
                                    <h4 className="text-sm font-extrabold text-zinc-900 dark:text-white leading-tight">
                                        {item.name}
                                    </h4>
                                    <p className="text-[10px] text-zinc-500 font-extrabold tracking-widest uppercase mt-0.5">
                                        {item.role}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Testimonials;

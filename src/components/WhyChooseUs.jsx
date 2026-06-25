"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Heart, Sparkles } from 'lucide-react';

const WhyChooseUs = () => {
    const items = [
        {
            icon: <Zap className="w-5 h-5 text-purple-400" />,
            title: "Production Ready",
            description: "Every prompt is thoroughly checked, curated, and optimized to run flawlessly on target engines without tweaking."
        },
        {
            icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
            title: "Admin Moderation",
            description: "No spam or garbage templates. Our administrators approve prompts manually to guarantee highest community quality."
        },
        {
            icon: <Heart className="w-5 h-5 text-rose-400" />,
            title: "Premium Marketplace",
            description: "Support prompt engineers directly. Access private expert prompts with a single-click subscription upgrade."
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
            
            {/* Glowing background neon mesh gradients */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-purple-600/5 dark:bg-purple-650/10 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse-slow" />

            <div className="max-w-7xl w-full mx-auto relative z-10 flex flex-col items-center">
                {/* Header */}
                <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4.5 py-1.5 rounded-full text-xs text-purple-650 dark:text-purple-400 font-bold tracking-wide backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.06)] hover:bg-white/10 transition-all cursor-default"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-pulse" />
                        <span>Our Benefits</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight"
                    >
                        Why Choose <span className="bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#38BDF8] bg-clip-text text-transparent">PromptForge?</span>
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-zinc-655 dark:text-zinc-400 text-sm md:text-base font-semibold max-w-xl mx-auto"
                    >
                        We build the bridge between simple AI queries and high-yield prompt engineering templates.
                    </motion.p>
                </div>

                {/* Cards Grid */}
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
                >
                    {items.map((item, idx) => (
                        <motion.div 
                            key={idx}
                            variants={cardVariants}
                            className="group flex flex-col gap-5 bg-white/70 dark:bg-[#070817]/60 border border-zinc-200/60 dark:border-white/[0.05] hover:border-purple-500/35 p-8 rounded-2.5xl transition-all duration-300 backdrop-blur-xl hover:-translate-y-1.5 hover:shadow-2xl dark:hover:shadow-[0_15px_40px_rgba(124,58,237,0.08)] text-left"
                        >
                            <div className="p-3 w-fit rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200/50 dark:border-white/5 group-hover:bg-[#7C3AED]/10 group-hover:border-purple-500/25 transition-all duration-300">
                                {item.icon}
                            </div>
                            <h3 className="text-base font-extrabold text-zinc-900 dark:text-white tracking-tight group-hover:text-[#7C3AED] dark:group-hover:text-purple-400 transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default WhyChooseUs;

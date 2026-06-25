"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Compass, Sparkles } from 'lucide-react';

const PromptEssentials = () => {
    const checkmarks = [
        {
            title: "Define the Persona:",
            desc: "Start by assigning a specific role e.g., 'Act as a Senior UX Engineer'."
        },
        {
            title: "Provide Clear Context:",
            desc: "Supply background constraints, input schemas, and targeted output formats."
        },
        {
            title: "Iterative Refining:",
            desc: "Toggle instructions for formatting (e.g. Markdown, JSON) to guide responses."
        }
    ];

    const renderJSONShowcase = () => {
        return (
            <pre className="font-mono text-xs sm:text-sm leading-relaxed selection:bg-purple-500/30 whitespace-pre text-zinc-300 select-none">
                <span className="text-purple-400 font-semibold">{"{"}</span>{"\n"}
                {"  "}<span className="text-[#C084FC] font-semibold">"role"</span><span className="text-zinc-400">:</span> <span className="text-emerald-450">"Senior React Architect"</span><span className="text-zinc-400">,</span>{"\n"}
                {"  "}<span className="text-[#C084FC] font-semibold">"context"</span><span className="text-zinc-400">:</span> <span className="text-emerald-450">"Optimising a landing page"</span><span className="text-zinc-400">,</span>{"\n"}
                {"  "}<span className="text-[#C084FC] font-semibold">"instructions"</span><span className="text-zinc-400">:</span> <span className="text-purple-450">{"["}</span>{"\n"}
                {"    "}<span className="text-emerald-450">"Use HSL variable colors"</span><span className="text-zinc-400">,</span>{"\n"}
                {"    "}<span className="text-emerald-450">"Apply Glassmorphism cards"</span><span className="text-zinc-400">,</span>{"\n"}
                {"    "}<span className="text-emerald-450">"Verify mobile responsiveness"</span>{"\n"}
                {"  "}<span className="text-purple-450">{"]"}</span><span className="text-zinc-400">,</span>{"\n"}
                {"  "}<span className="text-[#C084FC] font-semibold">"format"</span><span className="text-zinc-400">:</span> <span className="text-emerald-450">"Vanilla CSS + HTML"</span><span className="text-zinc-400">,</span>{"\n"}
                {"  "}<span className="text-[#C084FC] font-semibold">"temperature"</span><span className="text-zinc-400">:</span> <span className="text-amber-500 font-bold">0.2</span>{"\n"}
                <span className="text-purple-400 font-semibold">{"}"}</span>
            </pre>
        );
    };

    return (
        <section className="relative w-full bg-slate-50 dark:bg-[#030014] pb-24 px-6 md:px-12 overflow-hidden flex flex-col items-center transition-colors duration-300">
            
            {/* Background Glow */}
            <div className="absolute top-[40%] right-[-10%] w-[500px] h-[300px] bg-blue-650/5 dark:bg-blue-650/10 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse-slow" />
            <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[300px] bg-purple-650/5 dark:bg-purple-650/10 blur-[130px] rounded-full pointer-events-none -z-10" />

            <div className="max-w-7xl w-full mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Column - Details */}
                    <div className="lg:col-span-6 space-y-8 text-left">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4.5 py-1.5 rounded-full text-xs text-purple-650 dark:text-purple-400 font-bold tracking-wide backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.06)]">
                                <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-pulse" />
                                <span>Learn & Grow</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
                                Prompt Engineering <br />
                                <span className="bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#38BDF8] bg-clip-text text-transparent">Essentials</span>
                            </h2>
                            <p className="text-zinc-650 dark:text-zinc-400 text-sm md:text-base font-semibold leading-relaxed">
                                Writing high-performing prompts is a science. All tools require structures that define context, role constraints, output formats, and temperature.
                            </p>
                        </div>

                        {/* Checkmarks list */}
                        <div className="space-y-4">
                            {checkmarks.map((item, idx) => (
                                <div key={idx} className="flex gap-3.5 items-start">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm md:text-base font-extrabold text-zinc-900 dark:text-white leading-snug">
                                            {item.title}
                                        </h4>
                                        <p className="text-zinc-600 dark:text-zinc-455 text-xs md:text-sm leading-relaxed mt-0.5">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA button */}
                        <div className="pt-2">
                            <Link href="/all-prompts">
                                <button className="bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#820AD1] text-white py-3 px-6 rounded-xl flex items-center gap-2.5 font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_4px_12px_rgba(124,58,237,0.15)] hover:shadow-[0_4px_20px_rgba(124,58,237,0.35)] cursor-pointer hover:scale-[1.02]">
                                    <Compass className="w-4 h-4" />
                                    <span>Explore Guide Prompts</span>
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Code Showcase mockup */}
                    <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="w-full max-w-lg rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/[0.08] bg-zinc-950 dark:bg-[#050614]/90 shadow-[0_15px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_15px_40px_rgba(3,0,20,0.45)] backdrop-blur-xl"
                        >
                            {/* Window header */}
                            <div className="flex items-center justify-between px-5 py-3.5 bg-white/[0.02] border-b border-zinc-200/60 dark:border-white/[0.05]">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                                </div>
                                <span className="text-[10px] text-zinc-500 dark:text-zinc-550 font-mono tracking-wider font-semibold">assessment_prompt.json</span>
                            </div>

                            {/* Code snippet text area */}
                            <div className="p-6 text-left flex gap-4 overflow-x-auto font-mono text-xs sm:text-sm">
                                {/* Line Numbers */}
                                <div className="flex flex-col text-right text-zinc-650 dark:text-zinc-600 select-none border-r border-zinc-800/40 pr-3.5 min-w-[28px] leading-relaxed">
                                    <span>1</span>
                                    <span>2</span>
                                    <span>3</span>
                                    <span>4</span>
                                    <span>5</span>
                                    <span>6</span>
                                    <span>7</span>
                                    <span>8</span>
                                    <span>9</span>
                                    <span>10</span>
                                    <span>11</span>
                                </div>
                                
                                {/* Highlighted code */}
                                <div className="flex-grow">
                                    {renderJSONShowcase()}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default PromptEssentials;

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

    const jsonCode = `{
  "role": "Senior React Architect",
  "context": "Optimising a landing page",
  "instructions": [
    "Use HSL variable colors",
    "Apply Glassmorphism cards",
    "Verify mobile responsiveness"
  ],
  "format": "Vanilla CSS + HTML",
  "temperature": 0.2
}`;

    return (
        <section className="relative w-full bg-[#030014] pb-24 px-6 md:px-12 overflow-hidden flex flex-col items-center">
            {/* Background Glow */}
            <div className="absolute top-[40%] right-[-10%] w-[500px] h-[300px] bg-blue-650/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[300px] bg-purple-650/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl w-full mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left Column - Details */}
                    <div className="lg:col-span-6 space-y-8 text-left">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4.5 py-1.5 rounded-full text-xs text-purple-400 font-bold tracking-wide backdrop-blur-sm shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                                <span>Learn & Grow</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                                Prompt Engineering <br />
                                <span className="bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#38BDF8] bg-clip-text text-transparent">Essentials</span>
                            </h2>
                            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
                                Writing high-performing prompts is a science. All tools require structures that define context, role constraints, output formats, and temperature.
                            </p>
                        </div>

                        {/* Checkmarks list */}
                        <div className="space-y-4">
                            {checkmarks.map((item, idx) => (
                                <div key={idx} className="flex gap-3.5 items-start">
                                    <CheckCircle2 className="w-5.5 h-5.5 text-emerald-500 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm md:text-base font-bold text-white leading-snug">
                                            {item.title}
                                        </h4>
                                        <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mt-0.5">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA button */}
                        <div className="pt-2">
                            <Link href="/all-prompts">
                                <button className="bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#820AD1] text-white py-3 px-6 rounded-xl flex items-center gap-2.5 font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_4px_12px_rgba(124,58,237,0.2)] hover:shadow-[0_4px_20px_rgba(124,58,237,0.4)] cursor-pointer hover:scale-[1.02]">
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
                            className="w-full max-w-lg rounded-2xl overflow-hidden border border-white/[0.08] bg-[#050614]/90 shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                        >
                            {/* Window header */}
                            <div className="flex items-center justify-between px-5 py-3.5 bg-white/[0.03] border-b border-white/[0.05]">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                                </div>
                                <span className="text-[10px] text-zinc-550 font-mono tracking-wider font-semibold">assessment_prompt.json</span>
                            </div>

                            {/* Code snippet text area */}
                            <div className="p-6 text-left overflow-x-auto">
                                <pre className="font-mono text-xs sm:text-sm leading-relaxed text-[#c084fc] selection:bg-purple-500/30 whitespace-pre">
                                    <code>
                                        {jsonCode}
                                    </code>
                                </pre>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default PromptEssentials;

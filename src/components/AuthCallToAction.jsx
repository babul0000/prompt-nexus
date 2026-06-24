"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, UserPlus, ShieldAlert, Zap, Globe, Lock } from 'lucide-react';
import { useSession } from '@/lib/auth-client';

const AuthCallToAction = () => {
    const { data: session, isPending } = useSession();

    // If session is loading or user is already logged in, do not render the CTA banner
    if (isPending || session?.user) {
        return null;
    }

    return (
        <section className="relative w-full bg-[#030014] pb-24 px-6 md:px-12 overflow-hidden flex flex-col items-center">
            {/* Glowing background circles */}
            <div className="absolute top-[20%] left-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[20%] right-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

            <div className="max-w-5xl w-full mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0c0d21]/90 to-[#070817]/95 border border-white/[0.08] hover:border-purple-500/20 p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] dark:shadow-[0_0_50px_rgba(124,58,237,0.06)] backdrop-blur-xl"
                >
                    {/* Background grid pattern */}
                    <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                        {/* Text Content */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full text-xs text-purple-400 font-bold tracking-wide">
                                <Sparkles className="w-3.5 h-3.5 animate-pulse text-purple-400" />
                                <span>Unlock Premium AI Toolkit</span>
                            </div>

                            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                                Ready to Elevate Your <br />
                                <span className="bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#38BDF8] bg-clip-text text-transparent">AI Prompt Engineering?</span>
                            </h2>

                            <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl">
                                Join PromptForge today and connect with thousands of creators. Access advanced, tested prompts for ChatGPT, Midjourney, Claude, and more.
                            </p>

                            {/* Features list */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="flex items-center gap-3 text-zinc-300">
                                    <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                                        <Zap className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs md:text-sm font-semibold">100+ Pro Templates</span>
                                </div>
                                <div className="flex items-center gap-3 text-zinc-300">
                                    <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                                        <Lock className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs md:text-sm font-semibold">Unlock Premium Prompts</span>
                                </div>
                                <div className="flex items-center gap-3 text-zinc-300">
                                    <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs md:text-sm font-semibold">Creator Community</span>
                                </div>
                                <div className="flex items-center gap-3 text-zinc-300">
                                    <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                                        <Sparkles className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs md:text-sm font-semibold">Create & Share Prompts</span>
                                </div>
                            </div>
                        </div>

                        {/* CTA Actions */}
                        <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-4 justify-center items-stretch sm:items-center lg:items-stretch w-full">
                            <Link href="/auth/signup" className="w-full sm:w-auto lg:w-full">
                                <button className="w-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#820AD1] text-white py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:shadow-[0_4px_30px_rgba(124,58,237,0.5)] cursor-pointer hover:scale-[1.01]">
                                    <UserPlus className="w-4 h-4" />
                                    <span>Join PromptForge Free</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>

                            <Link href="/auth/signin" className="w-full sm:w-auto lg:w-full">
                                <button className="w-full bg-white/5 border border-white/10 hover:border-purple-550 text-zinc-300 hover:text-white py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:bg-white/10 cursor-pointer">
                                    <span>Already have an account? Sign In</span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AuthCallToAction;

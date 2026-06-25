"use client";

import Link from "next/link";
import { ArrowLeft, Home, Compass, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 overflow-hidden py-12">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-purple-600/10 dark:bg-purple-600/10 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-1/3 left-1/4 w-[250px] h-[250px] bg-blue-600/5 dark:bg-blue-600/5 blur-[80px] rounded-full pointer-events-none" />

            <div className="max-w-md w-full text-center relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {/* 404 Number Graphic */}
                <div className="relative">
                    <h1 className="text-8xl sm:text-9xl font-extrabold tracking-widest bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent drop-shadow-sm select-none">
                        404
                    </h1>
                    <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 opacity-20 blur-xl -z-10 animate-pulse" />
                </div>

                {/* Message */}
                <div className="space-y-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                        Page Not Found
                    </h2>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
                        Oops! The page you are looking for doesn't exist, has been removed, or has moved to another universe.
                    </p>
                </div>

                {/* Illustrated visual */}
                <div className="flex justify-center py-2">
                    <div className="relative p-6 bg-white/40 dark:bg-zinc-900/30 border border-zinc-200/50 dark:border-white/5 backdrop-blur-md rounded-2xl shadow-xl max-w-xs w-full flex flex-col items-center gap-3">
                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 rounded-xl">
                            <Search className="w-6 h-6 animate-bounce" />
                        </div>
                        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                            Lost in prompt space?
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold bg-white hover:bg-zinc-50 text-zinc-800 border border-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 dark:text-zinc-300 dark:border-white/5 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Go Back</span>
                    </button>
                    <Link
                        href="/"
                        className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_14px_rgba(124,58,237,0.3)] hover:shadow-[0_4px_20px_rgba(124,58,237,0.5)] active:scale-98"
                    >
                        <Home className="w-4 h-4" />
                        <span>Return Home</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

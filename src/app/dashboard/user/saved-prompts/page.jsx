"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import PromptCard from "@/components/PromptCard";
import { Bookmark, Sparkles } from "lucide-react";
import { baseUrl } from "@/lib/core/baseUrl";

export default function SavedPromptsPage() {
    const { data: session, isPending: sessionPending } = useSession();
    const user = session?.user;

    const [savedPrompts, setSavedPrompts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.id) {
            const fetchSavedPrompts = async () => {
                try {
                    const res = await fetch(`${baseUrl}/api/my-bookmarks?userId=${user.id}`, {
                        cache: "no-store"
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setSavedPrompts(data || []);
                    }
                } catch (err) {
                    console.error("Failed to load saved prompts:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchSavedPrompts();
        } else if (!sessionPending) {
            setLoading(false);
        }
    }, [user, sessionPending]);

    if (sessionPending || loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                <p className="text-sm text-zinc-400 font-medium">Loading saved prompts...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-4 text-zinc-900 dark:text-white">
                <p className="text-sm text-zinc-400 font-medium">Please sign in to view saved prompts.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent text-zinc-900 dark:text-white p-4 sm:p-6 md:p-8 relative">
            {/* Background decorative glows */}
            <div className="absolute top-[5%] left-1/4 -translate-x-1/2 w-[400px] h-[250px] bg-purple-650/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10 space-y-8">
                {/* Header section */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-purple-400">
                        <Bookmark className="w-5 h-5 fill-purple-500/10" />
                        <span className="text-[10px] font-bold tracking-wider uppercase">Saved Collections</span>
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                        Saved Prompts
                    </h1>
                    <p className="text-sm text-zinc-550 dark:text-zinc-400 font-medium">
                        Your private library of saved and bookmarked prompt templates.
                    </p>
                </div>

                {/* Cards Grid */}
                {savedPrompts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-[#090a16]/40 border border-zinc-200 dark:border-white/5 rounded-2xl text-center space-y-4 max-w-xl mx-auto shadow-sm dark:shadow-none">
                        <Sparkles className="w-10 h-10 text-zinc-400 dark:text-zinc-650 animate-bounce" />
                        <div className="space-y-1">
                            <h3 className="text-base font-semibold text-zinc-900 dark:text-white">No Saved Prompts</h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm">
                                You haven't bookmarked any prompts yet. Visit the catalog page, select templates you like, and save them for instant access.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {savedPrompts.map((prompt) => (
                            <PromptCard 
                                key={prompt._id || prompt.id}
                                prompt={prompt}
                                onViewDetails={() => {}}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

import React from 'react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Bookmark, Star, ShieldAlert, Compass, User, CreditCard, Sparkles, LayoutGrid } from 'lucide-react';
import db from '@/lib/db';
import { ObjectId } from 'mongodb';

const UserPage = async () => {
    const { user } = await auth.api.getSession({ headers: await headers() });

    let savedCount = 0;
    let reviewsCount = 0;

    if (user) {
        try {
            let userIdQuery = { userId: user.id };
            try {
                userIdQuery = {
                    $or: [
                        { userId: user.id },
                        { userId: new ObjectId(user.id) }
                    ]
                };
            } catch (e) {}
            savedCount = await db.collection("bookmarks").countDocuments(userIdQuery);
        } catch (e) {
            console.error("Failed to count user bookmarks:", e);
        }

        try {
            if (user.email) {
                reviewsCount = await db.collection("reviews").countDocuments({ userEmail: user.email });
            }
        } catch (e) {
            console.error("Failed to count user reviews:", e);
        }
    }

    const isPro = user?.plan?.toLowerCase() === "pro" || user?.role?.toLowerCase() === "pro" || user?.role?.toLowerCase() === "admin";
    const currentPlan = isPro 
        ? (user?.role?.toLowerCase() === "admin" ? "Admin Privileges" : "Pro Tier") 
        : "Free Tier";

    return (
        <div className="relative min-h-screen bg-transparent text-zinc-900 dark:text-white pt-10 pb-20 px-4 sm:px-6 transition-colors duration-300">
            {/* Glowing background highlights */}
            <div className="absolute top-[5%] left-1/4 -translate-x-1/2 w-[400px] h-[250px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute top-[20%] right-1/4 translate-x-1/2 w-[400px] h-[250px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 space-y-10">
                {/* Header Block */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-zinc-200 dark:border-white/5 pb-8">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
                            Welcome Back, <span className="bg-gradient-to-r from-[#7C3AED] to-[#9333EA] dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">{user?.name || 'Member'}</span>! ✨
                        </h1>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                            Manage your saved AI templates, reviews, and plan subscription.
                        </p>
                    </div>

                    <Link href="/all-prompts">
                        <button className="flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#820AD1] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-[0_4px_12px_rgba(124,58,237,0.25)] cursor-pointer">
                            <Compass className="w-4 h-4" />
                            <span>Browse Marketplace</span>
                        </button>
                    </Link>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {/* Card 1: Saved Prompts */}
                    <div className="bg-white dark:bg-[#090a16]/60 border border-zinc-200 dark:border-white/[0.06] hover:border-purple-500/30 p-6 rounded-2xl transition-all flex items-center justify-between shadow-sm dark:shadow-none text-zinc-900 dark:text-white">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Saved Prompts</p>
                            <h3 className="text-2xl font-black text-zinc-900 dark:text-white">{savedCount}</h3>
                        </div>
                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-650 dark:text-purple-400 rounded-xl">
                            <Bookmark className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Card 2: Reviews Left */}
                    <div className="bg-white dark:bg-[#090a16]/60 border border-zinc-200 dark:border-white/[0.06] hover:border-blue-500/30 p-6 rounded-2xl transition-all flex items-center justify-between shadow-sm dark:shadow-none text-zinc-900 dark:text-white">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">My Reviews</p>
                            <h3 className="text-2xl font-black text-zinc-900 dark:text-white">{reviewsCount}</h3>
                        </div>
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-650 dark:text-blue-400 rounded-xl">
                            <Star className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Card 3: Membership Plan */}
                    <div className="bg-white dark:bg-[#090a16]/60 border border-zinc-200 dark:border-white/[0.06] hover:border-amber-500/30 p-6 rounded-2xl transition-all flex items-center justify-between shadow-sm dark:shadow-none text-zinc-900 dark:text-white">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Subscription Plan</p>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white capitalize">{currentPlan}</h3>
                        </div>
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl">
                            <CreditCard className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Subsections: Quick Actions and Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Panel 1: Profile information card */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#090a16]/50 border border-zinc-200 dark:border-white/[0.06] p-6 rounded-2xl flex flex-col gap-6 backdrop-blur-md shadow-sm dark:shadow-none text-zinc-900 dark:text-white">
                        <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-white/5 pb-4">
                            <User className="w-4 h-4 text-purple-650 dark:text-purple-400" />
                            <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                                Account Information
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-zinc-700 dark:text-zinc-300">
                            <div className="p-4 bg-zinc-50 dark:bg-white/[0.01] border border-zinc-250/50 dark:border-white/5 rounded-xl space-y-1">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Display Name</span>
                                <p className="font-semibold text-zinc-800 dark:text-white">{user?.name || 'Not configured'}</p>
                            </div>
                            <div className="p-4 bg-zinc-50 dark:bg-white/[0.01] border border-zinc-250/50 dark:border-white/5 rounded-xl space-y-1">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Email Address</span>
                                <p className="font-semibold text-zinc-800 dark:text-white">{user?.email}</p>
                            </div>
                            <div className="p-4 bg-zinc-50 dark:bg-white/[0.01] border border-zinc-250/50 dark:border-white/5 rounded-xl space-y-1">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">User Role</span>
                                <p className="font-semibold text-purple-600 dark:text-purple-400 capitalize">{user?.role || 'Regular Member'}</p>
                            </div>
                            <div className="p-4 bg-zinc-50 dark:bg-white/[0.01] border border-zinc-250/50 dark:border-white/5 rounded-xl space-y-1">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Account Status</span>
                                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                    <span className="w-1 h-1 rounded-full bg-emerald-550 dark:bg-emerald-500" />
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Panel 2: Quick Links / Sub info */}
                    <div className="lg:col-span-1 bg-white dark:bg-[#090a16]/50 border border-zinc-200 dark:border-white/[0.06] p-6 rounded-2xl flex flex-col gap-6 backdrop-blur-md justify-between shadow-sm dark:shadow-none text-zinc-900 dark:text-white">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-white/5 pb-4">
                                <Sparkles className="w-4 h-4 text-purple-650 dark:text-purple-400" />
                                <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                                    Premium Upgrade
                                </h3>
                            </div>
                            
                            <div className="space-y-2">
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                    Get unlimited copy operations, access to Pro and Elite AI templates, and direct prompt execution inside our playground workspace.
                                </p>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Link href="/payment" className="w-full">
                                <button className="w-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#820AD1] text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-[0_4px_12px_rgba(124,58,237,0.25)] cursor-pointer">
                                    Upgrade to Pro
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserPage;
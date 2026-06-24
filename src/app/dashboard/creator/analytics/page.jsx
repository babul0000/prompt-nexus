import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getMyPrompts } from "@/lib/api/prompt";
import Link from "next/link";
import { BarChart3, Eye, Copy, FileText, TrendingUp, Sparkles, Percent, ArrowLeft, Lock } from "lucide-react";
import { CreatorAnalytics } from "@/components/dashboard/CreatorAnalytics";

export default async function CreatorAnalyticsPage() {
    const { user } = await auth.api.getSession({ headers: await headers() });
    const isPro = user?.plan?.toLowerCase() === "pro" || user?.role?.toLowerCase() === "admin";

    let prompts = [];
    try {
        if (user?.id) {
            prompts = await getMyPrompts(user.id) || [];
        }
    } catch (err) {
        console.error("Failed to load dashboard statistics:", err);
    }

    const totalPrompts = prompts.length;
    const totalCopies = prompts.reduce((sum, p) => sum + (parseInt(p.copyCount) || 0), 0);
    const totalViews = prompts.reduce((sum, p) => sum + (parseInt(p.viewCount) || 0), 0);

    // Copy-through Rate (Conversion rate)
    const copyRate = totalViews > 0 ? ((totalCopies / totalViews) * 100).toFixed(1) : "0.0";

    return (
        <div className="relative min-h-screen bg-transparent text-zinc-900 dark:text-white pt-10 pb-20 px-4 sm:px-6">
            {/* Background glowing gradients */}
            <div className="absolute top-[5%] left-1/4 -translate-x-1/2 w-[400px] h-[250px] bg-purple-650/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute top-[20%] right-1/4 translate-x-1/2 w-[400px] h-[250px] bg-blue-650/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 space-y-10">
                {/* Header Section */}
                <div className="flex flex-col gap-4 border-b border-zinc-200 dark:border-white/5 pb-8">
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard/creator" className="p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl transition text-zinc-550 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white cursor-pointer">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div className="flex items-center gap-2 text-purple-400">
                            <BarChart3 className="w-5 h-5" />
                            <span className="text-[10px] font-bold tracking-wider uppercase">Analytics Center</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
                            Analytics & Performance Stats
                        </h1>
                        <p className="text-sm text-zinc-550 dark:text-zinc-400 font-medium">
                            Tracking and overall performance analysis of how many times your prompts have been copied or viewed.                        </p>
                    </div>
                </div>

                {/* Summary Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Stat Card 1: Total Prompts */}
                    <div className="bg-white dark:bg-[#090a16]/60 border border-zinc-200 dark:border-white/[0.06] hover:border-purple-500/30 p-6 rounded-2xl transition-all flex items-center justify-between shadow-sm dark:shadow-none">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Total Prompts</p>
                            <h3 className="text-2xl font-black text-zinc-900 dark:text-white">{totalPrompts}</h3>
                        </div>
                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
                            <FileText className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Stat Card 2: Total Views */}
                    <div className="bg-white dark:bg-[#090a16]/60 border border-zinc-200 dark:border-white/[0.06] hover:border-cyan-500/30 p-6 rounded-2xl transition-all flex items-center justify-between shadow-sm dark:shadow-none">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Total Views</p>
                            <h3 className="text-2xl font-black text-zinc-900 dark:text-white">{totalViews}</h3>
                        </div>
                        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
                            <Eye className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Stat Card 3: Total Copies */}
                    <div className="bg-white dark:bg-[#090a16]/60 border border-zinc-200 dark:border-white/[0.06] hover:border-blue-500/30 p-6 rounded-2xl transition-all flex items-center justify-between shadow-sm dark:shadow-none">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Total Copies</p>
                            <h3 className="text-2xl font-black text-zinc-900 dark:text-white">{totalCopies}</h3>
                        </div>
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                            <Copy className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Stat Card 4: Copy Rate */}
                    <div className="bg-white dark:bg-[#090a16]/60 border border-zinc-200 dark:border-white/[0.06] hover:border-emerald-500/30 p-6 rounded-2xl transition-all flex items-center justify-between shadow-sm dark:shadow-none">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Copy Rate</p>
                            <h3 className="text-2xl font-black text-zinc-900 dark:text-white">{copyRate}%</h3>
                        </div>
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                            <Percent className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Interactive Charts */}
                <div className="space-y-2 relative text-left">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                        <span>Interactive Charts</span>
                    </h2>
                    
                    {!isPro ? (
                        <div className="relative rounded-2xl overflow-hidden min-h-[280px] flex items-center justify-center border border-zinc-200 dark:border-white/[0.06] bg-white dark:bg-[#090a16]/40 p-6">
                            <div className="absolute inset-0 bg-white/90 dark:bg-[#030014]/90 backdrop-blur-md z-25 flex flex-col items-center justify-center p-6 text-center space-y-4">
                                <Lock className="w-8 h-8 text-purple-500 animate-bounce" />
                                <div className="space-y-1">
                                    <h3 className="text-base font-bold text-zinc-900 dark:text-white">Detailed Charts require Pro Access</h3>
                                    <p className="text-xs text-zinc-550 dark:text-zinc-400 max-w-sm">
                                        Upgrade to the Pro tier to visualize creator growth trends and view/copy conversion speed tracking.
                                    </p>
                                </div>
                                <Link href="/dashboard/creator/profile">
                                    <button className="px-5 py-2.5 bg-gradient-to-r from-purple-650 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg cursor-pointer">
                                        Upgrade to Pro ($5)
                                    </button>
                                </Link>
                            </div>
                            <div className="w-full opacity-10 select-none pointer-events-none filter blur-sm">
                                <CreatorAnalytics prompts={prompts} />
                            </div>
                        </div>
                    ) : (
                        <CreatorAnalytics prompts={prompts} />
                    )}
                </div>

                {/* Breakdown List Table */}
                <div className="bg-white dark:bg-[#090a16]/50 border border-zinc-200 dark:border-white/[0.06] p-6 rounded-2xl flex flex-col gap-6 backdrop-blur-md shadow-sm dark:shadow-none relative text-left">
                    <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-white/5 pb-4">
                        <BarChart3 className="w-4 h-4 text-purple-400" />
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                            Prompt template stats breakdown
                        </h3>
                    </div>

                    {!isPro ? (
                        <div className="relative rounded-xl overflow-hidden min-h-[220px] flex items-center justify-center">
                            <div className="absolute inset-0 bg-white/90 dark:bg-[#030014]/90 backdrop-blur-md z-25 flex flex-col items-center justify-center p-6 text-center space-y-4">
                                <Lock className="w-8 h-8 text-purple-500" />
                                <div className="space-y-1">
                                    <h3 className="text-base font-bold text-zinc-900 dark:text-white">Detailed Table Breakdown requires Pro Access</h3>
                                    <p className="text-xs text-zinc-550 dark:text-zinc-400 max-w-sm">
                                        Unlock deep conversion rates, view details, and visibility analysis for all your published prompts.
                                    </p>
                                </div>
                            </div>
                            <div className="w-full opacity-10 select-none pointer-events-none filter blur-sm">
                                <div className="p-8 text-zinc-400 text-center text-xs">Table data is locked for free tier accounts.</div>
                            </div>
                        </div>
                    ) : prompts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                            <Sparkles className="w-10 h-10 text-zinc-400 dark:text-zinc-650 animate-bounce" />
                            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white">No Statistics Data Available</h4>
                            <p className="text-xs text-zinc-550 dark:text-zinc-400 max-w-xs leading-relaxed">
                                You haven't uploaded any templates. Add prompts to see detailed view and copy tracking reports.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto w-full">
                            <table className="w-full border-collapse text-left text-sm text-zinc-700 dark:text-zinc-300">
                                <thead>
                                    <tr className="border-b border-zinc-200 dark:border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-50 dark:bg-zinc-950/40">
                                        <th className="py-3 px-4">Template Title</th>
                                        <th className="py-3 px-4">AI Engine</th>
                                        <th className="py-3 px-4">Views</th>
                                        <th className="py-3 px-4">Copies</th>
                                        <th className="py-3 px-4">Visibility</th>
                                        <th className="py-3 px-4 text-right">Copy-Through Rate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                                    {prompts.map((p) => {
                                        const views = parseInt(p.viewCount) || 0;
                                        const copies = parseInt(p.copyCount) || 0;
                                        const rate = views > 0 ? ((copies / views) * 100).toFixed(1) : "0.0";
                                        return (
                                            <tr key={p._id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition-colors duration-200">
                                                <td className="py-4 px-4">
                                                    <div className="font-semibold text-zinc-900 dark:text-white truncate max-w-[200px]" title={p.title}>{p.title}</div>
                                                    <div className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-wide">#{p.category}</div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                                                        {p.aiTool || "Other"}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 font-semibold text-zinc-800 dark:text-white">{views}</td>
                                                <td className="py-4 px-4 font-semibold text-zinc-800 dark:text-white">{copies}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${p.visibility?.toLowerCase() === 'private' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'}`}>
                                                        {p.visibility || "Public"}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-right text-purple-600 dark:text-purple-400 font-bold">{rate}%</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

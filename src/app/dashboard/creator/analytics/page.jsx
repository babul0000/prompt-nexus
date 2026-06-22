import React from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getMyPrompts } from "@/lib/api/prompt";
import Link from "next/link";
import { BarChart3, Eye, Copy, FileText, TrendingUp, Sparkles, Percent, ArrowLeft } from "lucide-react";
import { CreatorAnalytics } from "@/components/dashboard/CreatorAnalytics";

export default async function CreatorAnalyticsPage() {
    const { user } = await auth.api.getSession({ headers: await headers() });

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
        <div className="relative min-h-screen bg-[#030014] text-white pt-10 pb-20 px-4 sm:px-6">
            {/* Background glowing gradients */}
            <div className="absolute top-[5%] left-1/4 -translate-x-1/2 w-[400px] h-[250px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute top-[20%] right-1/4 translate-x-1/2 w-[400px] h-[250px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 space-y-10">
                {/* Header Section */}
                <div className="flex flex-col gap-4 border-b border-white/5 pb-8">
                    <div className="flex items-center gap-2">
                        <Link href="/dashboard/creator" className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition text-zinc-400 hover:text-white cursor-pointer">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div className="flex items-center gap-2 text-purple-400">
                            <BarChart3 className="w-5 h-5" />
                            <span className="text-[10px] font-bold tracking-wider uppercase">Analytics Center</span>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                            Analytics & Performance Stats
                        </h1>
                        <p className="text-sm text-zinc-400 font-medium">
                            Tracking and overall performance analysis of how many times your prompts have been copied or viewed.                        </p>
                    </div>
                </div>

                {/* Summary Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Stat Card 1: Total Prompts */}
                    <div className="bg-[#090a16]/60 border border-white/[0.06] hover:border-purple-500/30 p-6 rounded-2xl transition-all flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Total Prompts</p>
                            <h3 className="text-2xl font-black text-white">{totalPrompts}</h3>
                        </div>
                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
                            <FileText className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Stat Card 2: Total Views */}
                    <div className="bg-[#090a16]/60 border border-white/[0.06] hover:border-cyan-500/30 p-6 rounded-2xl transition-all flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Total Views</p>
                            <h3 className="text-2xl font-black text-white">{totalViews}</h3>
                        </div>
                        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
                            <Eye className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Stat Card 3: Total Copies */}
                    <div className="bg-[#090a16]/60 border border-white/[0.06] hover:border-blue-500/30 p-6 rounded-2xl transition-all flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Total Copies</p>
                            <h3 className="text-2xl font-black text-white">{totalCopies}</h3>
                        </div>
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                            <Copy className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Stat Card 4: Copy Rate */}
                    <div className="bg-[#090a16]/60 border border-white/[0.06] hover:border-emerald-500/30 p-6 rounded-2xl transition-all flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Copy Rate</p>
                            <h3 className="text-2xl font-black text-white">{copyRate}%</h3>
                        </div>
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                            <Percent className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Interactive Charts */}
                <div className="space-y-2">
                    <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                        <span>Interactive Charts</span>
                    </h2>
                    <CreatorAnalytics prompts={prompts} />
                </div>

                {/* Breakdown List Table */}
                <div className="bg-[#090a16]/50 border border-white/[0.06] p-6 rounded-2xl flex flex-col gap-6 backdrop-blur-md">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                        <BarChart3 className="w-4 h-4 text-purple-400" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Prompt template stats breakdown
                        </h3>
                    </div>

                    {prompts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                            <Sparkles className="w-10 h-10 text-zinc-650 animate-bounce" />
                            <h4 className="text-sm font-semibold text-white">No Statistics Data Available</h4>
                            <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                                You haven't uploaded any templates. Add prompts to see detailed view and copy tracking reports.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto w-full">
                            <table className="w-full border-collapse text-left text-sm text-zinc-300">
                                <thead>
                                    <tr className="border-b border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-950/40">
                                        <th className="py-3 px-4">Template Title</th>
                                        <th className="py-3 px-4">AI Engine</th>
                                        <th className="py-3 px-4">Views</th>
                                        <th className="py-3 px-4">Copies</th>
                                        <th className="py-3 px-4">Visibility</th>
                                        <th className="py-3 px-4 text-right">Copy-Through Rate</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {prompts.map((p) => {
                                        const views = parseInt(p.viewCount) || 0;
                                        const copies = parseInt(p.copyCount) || 0;
                                        const rate = views > 0 ? ((copies / views) * 100).toFixed(1) : "0.0";
                                        return (
                                            <tr key={p._id} className="hover:bg-white/[0.01] transition-colors duration-200">
                                                <td className="py-4 px-4">
                                                    <div className="font-semibold text-white truncate max-w-[200px]" title={p.title}>{p.title}</div>
                                                    <div className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-wide">#{p.category}</div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="bg-zinc-900 border border-white/5 text-[10px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider text-zinc-300">
                                                        {p.aiTool || "Other"}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 font-semibold text-white">{views}</td>
                                                <td className="py-4 px-4 font-semibold text-white">{copies}</td>
                                                <td className="py-4 px-4">
                                                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${p.visibility?.toLowerCase() === 'private' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                                        {p.visibility || "Public"}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-4 text-right text-purple-400 font-bold">{rate}%</td>
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

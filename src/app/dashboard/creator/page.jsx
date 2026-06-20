import React from 'react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { getMyPrompts } from '@/lib/api/prompt';
import Link from 'next/link';
import { FileText, Copy, Bookmark, CircleCheck, Plus, Sparkles, LayoutGrid } from 'lucide-react';

const CreatorPage = async () => {
    const { user } = await auth.api.getSession({ headers: await headers() });
    
    // Fetch creator prompts to calculate actual statistics dynamically
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
    const totalBookmarks = prompts.reduce((sum, p) => sum + (parseInt(p.bookmarkCount) || 0), 0);
    const approvedPromptsCount = prompts.filter(p => p.status?.toLowerCase() === 'approved').length;

    return (
        <div className="relative min-h-screen bg-[#030014] text-white pt-10 pb-20 px-4 sm:px-6">
            {/* Glowing background highlights */}
            <div className="absolute top-[5%] left-1/4 -translate-x-1/2 w-[400px] h-[250px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute top-[20%] right-1/4 translate-x-1/2 w-[400px] h-[250px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-6xl mx-auto relative z-10 space-y-10">
                {/* Header Block */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-white/5 pb-8">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
                            Welcome Back, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{user?.name || 'Creator'}</span>! ✨
                        </h1>
                        <p className="text-sm text-zinc-400 font-medium">
                            Here is an overview of your prompt creation stats and performance.
                        </p>
                    </div>

                    <Link href="/dashboard/creator/add-prompt">
                        <button className="flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#820AD1] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-[0_4px_12px_rgba(124,58,237,0.25)] cursor-pointer">
                            <Plus className="w-4 h-4" />
                            <span>Add New Prompt</span>
                        </button>
                    </Link>
                </div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Card 1: Total Prompts */}
                    <div className="bg-[#090a16]/60 border border-white/[0.06] hover:border-purple-500/30 p-6 rounded-2xl transition-all flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Prompts Created</p>
                            <h3 className="text-2xl font-black text-white">{totalPrompts}</h3>
                        </div>
                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
                            <FileText className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Card 2: Total Copies */}
                    <div className="bg-[#090a16]/60 border border-white/[0.06] hover:border-blue-500/30 p-6 rounded-2xl transition-all flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Total Copies</p>
                            <h3 className="text-2xl font-black text-white">{totalCopies}</h3>
                        </div>
                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl">
                            <Copy className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Card 3: Saved Bookmarks */}
                    <div className="bg-[#090a16]/60 border border-white/[0.06] hover:border-amber-500/30 p-6 rounded-2xl transition-all flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Saved Count</p>
                            <h3 className="text-2xl font-black text-white">{totalBookmarks}</h3>
                        </div>
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
                            <Bookmark className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Card 4: Approved prompts */}
                    <div className="bg-[#090a16]/60 border border-white/[0.06] hover:border-emerald-500/30 p-6 rounded-2xl transition-all flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Approved Ratio</p>
                            <h3 className="text-2xl font-black text-white">
                                {totalPrompts > 0 ? `${Math.round((approvedPromptsCount / totalPrompts) * 100)}%` : '0%'}
                            </h3>
                        </div>
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                            <CircleCheck className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Table block for Activity */}
                <div className="bg-[#090a16]/50 border border-white/[0.06] p-6 rounded-2xl flex flex-col gap-6 backdrop-blur-md">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="flex items-center gap-2">
                            <LayoutGrid className="w-4 h-4 text-purple-400" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                                Recent Prompt Templates
                            </h3>
                        </div>
                        <Link href="/dashboard/creator/my-prompts" className="text-xs text-[#7C3AED] hover:underline font-bold">
                            View All Prompts
                        </Link>
                    </div>

                    {prompts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
                            <Sparkles className="w-10 h-10 text-zinc-600 animate-bounce" />
                            <div className="space-y-1">
                                <h4 className="text-sm font-semibold text-white">No Prompts Added</h4>
                                <p className="text-xs text-zinc-400 max-w-xs">
                                    You haven't listed any prompt templates on PromptForge yet. Let's create one now!
                                </p>
                            </div>
                            <Link href="/dashboard/creator/add-prompt">
                                <button className="px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white text-xs font-semibold rounded-xl hover:shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all cursor-pointer">
                                    Create Template
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="overflow-x-auto w-full">
                            <table className="w-full border-collapse text-left text-sm text-zinc-300">
                                <thead>
                                    <tr className="border-b border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                                        <th className="pb-3 pr-4">Title</th>
                                        <th className="pb-3 px-4">AI Engine</th>
                                        <th className="pb-3 px-4">Status</th>
                                        <th className="pb-3 px-4">Copies</th>
                                        <th className="pb-3 pl-4 text-right">Visibility</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {prompts.slice(0, 5).map((p) => (
                                        <tr key={p._id} className="hover:bg-white/[0.01] transition-colors">
                                            <td className="py-4 pr-4">
                                                <div className="font-semibold text-white truncate max-w-[200px]" title={p.title}>{p.title}</div>
                                                <div className="text-[10px] text-zinc-500 mt-0.5 uppercase tracking-wide">#{p.category}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="bg-zinc-900 border border-white/5 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider text-zinc-300">
                                                    {p.aiTool || 'Other'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${p.status?.toLowerCase() === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                                                    <span className={`w-1 h-1 rounded-full ${p.status?.toLowerCase() === 'approved' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                                    {p.status || 'PENDING'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 font-semibold text-white">{p.copyCount || 0}</td>
                                            <td className="py-4 pl-4 text-right text-zinc-400 font-medium capitalize">{p.visibility || 'Public'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreatorPage;
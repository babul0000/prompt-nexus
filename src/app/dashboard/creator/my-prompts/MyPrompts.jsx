"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getMyPrompts } from "@/lib/api/prompt";
import { Eye, Pencil, BarChart3, Trash2 } from "lucide-react";

export default function MyPrompts() {
    const { data: session, isPending } = authClient.useSession();
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isPending) {
            if (session?.user?.id) {
                const fetchMyData = async () => {
                    try {
                        const data = await getMyPrompts(session.user.id);
                        setPrompts(data || []);
                    } catch (err) {
                        console.error("Fetch Error:", err);
                    } finally {
                        setLoading(false);
                    }
                };
                fetchMyData();
            } else {
                setLoading(false);
            }
        }
    }, [session, isPending]);

    if (loading) return <div className="text-center p-10 text-white">Loading your prompts...</div>;

    return (
        <div className="p-4 md:p-8 bg-background min-h-screen text-white">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">My Prompt Templates</h1>
                <p className="text-zinc-400 mb-8">Review status, manage details, and track analytics.</p>

                <div className="w-full border border-zinc-800 rounded-xl overflow-hidden bg-[#09090b]">
                    {/* Table Header */}
                    <div className="grid grid-cols-7 gap-4 p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-b border-zinc-800 bg-zinc-950/50">
                        <div className="col-span-2">Title</div>
                        <div>AI Engine</div>
                        <div>Visibility</div>
                        <div>Status</div>
                        <div>Stats</div>
                        <div className="text-right">Actions</div>
                    </div>

                    {/* Table Body */}
                    {prompts.length === 0 ? (
                        <div className="p-12 text-center text-zinc-500">No prompts found!</div>
                    ) : (
                        prompts.map((p) => (
                            <div key={p._id} className="grid grid-cols-7 gap-4 p-4 items-center border-b border-zinc-800 hover:bg-zinc-900/20 transition-colors">
                                <div className="col-span-2">
                                    <div className="font-semibold text-sm">{p.title}</div>
                                    <div className="text-xs text-zinc-500 mt-0.5">Category: {p.category}</div>
                                </div>
                                <div>
                                    <span className="bg-zinc-900 text-zinc-300 border border-zinc-800 text-xs px-2.5 py-1 rounded-md font-medium">
                                        {p.aiTool || "CLAUDE"}
                                    </span>
                                </div>
                                <div className="text-sm text-zinc-400 capitalize">{p.visibility || "Public"}</div>
                                <div>
                                    <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full w-fit border ${p.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'Approved' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                        {p.status || "PENDING"}
                                    </span>
                                </div>
                                <div className="text-sm text-zinc-400">★ {p.rating || "0.0"}</div>
                                <div className="flex gap-1 justify-end text-zinc-500">
                                    <button className="p-2 hover:bg-zinc-800 hover:text-white rounded-lg transition"><Eye size={16} /></button>
                                    <button className="p-2 hover:bg-zinc-800 hover:text-white rounded-lg transition"><Pencil size={16} /></button>
                                    <button className="p-2 hover:bg-zinc-800 hover:text-white rounded-lg transition"><BarChart3 size={16} /></button>
                                    <button className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
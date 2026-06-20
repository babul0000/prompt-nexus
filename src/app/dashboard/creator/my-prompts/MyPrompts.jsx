"use client";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { getMyPrompts } from "@/lib/api/prompt"; // তোমার এপিআই ফাংশন

export default function MyPrompts() {
    const { data: session, isPending } = authClient.useSession();
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // সেশন লোড না হওয়া পর্যন্ত অপেক্ষা করো
        if (isPending) return;

        if (session?.user?.id) {
            const fetchMyData = async () => {
                try {
                    // ইউজার আইডি পাঠাচ্ছি
                    const data = await getMyPrompts(session.user.id);
                    setPrompts(data || []); // যদি null হয় তবে খালি অ্যারে
                } catch (err) {
                    console.error("Fetch Error:", err);
                } finally {
                    setLoading(false);
                }
            };
            fetchMyData();
        } else {
            setLoading(false); // ইউজার লগইন না থাকলে লোডিং বন্ধ করো
        }
    }, [session?.user?.id, isPending]);

    if (loading) return <div className="text-center p-10">Loading your prompts...</div>;
    
    if (prompts.length === 0) return <div className="text-center p-10">No prompts found!</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
            {prompts.map((p) => (
                <div key={p._id} className="p-4 border border-zinc-800 rounded-xl bg-[#121214] hover:border-zinc-600 transition-all">
                    {p.thumbnail && (
                        <img 
                            src={p.thumbnail} 
                            alt={p.title} 
                            className="w-full h-40 object-cover rounded-lg mb-4" 
                        />
                    )}
                    <h2 className="text-xl font-bold text-white">{p.title}</h2>
                    <p className="text-zinc-400 text-sm mt-2">{p.description}</p>
                    <div className="mt-4 flex gap-2">
                        <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-300">{p.aiTool}</span>
                        <span className="text-xs bg-zinc-800 px-2 py-1 rounded text-zinc-300 capitalize">{p.status}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
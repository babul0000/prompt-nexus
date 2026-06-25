"use client";

import { useState, useEffect } from "react";
import { UploadCloud, Send, Lock } from "lucide-react";
import { createPrompt } from "@/lib/actions/prompt";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { getMyPrompts } from "@/lib/api/prompt";
import { useRouter } from "next/navigation";

const categories = [
    "Coding",
    "Writing",
    "Marketing",
    "Business",
    "Education",
    "Design",
    "Productivity",
];

const aiTools = [
    "ChatGPT",
    "Claude",
    "Gemini",
    "Copilot",
    "Midjourney",
    "Perplexity",
];

export default function CreatePromptPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [difficulty, setDifficulty] = useState("Beginner");
    const [visibility, setVisibility] = useState("Public");
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [promptsCount, setPromptsCount] = useState(0);
    const [loadingCount, setLoadingCount] = useState(true);

    useEffect(() => {
        if (session?.user?.id) {
            const fetchPromptsCount = async () => {
                try {
                    const data = await getMyPrompts(session.user.id);
                    setPromptsCount(data ? data.length : 0);
                } catch (err) {
                    console.error("Failed to load user prompts count:", err);
                } finally {
                    setLoadingCount(false);
                }
            };
            fetchPromptsCount();
        } else {
            setLoadingCount(false);
        }
    }, [session]);

    const isPro = session?.user?.plan?.toLowerCase() === "pro" || session?.user?.role?.toLowerCase() === "admin";
    const limitReached = !isPro && promptsCount >= 10;

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setThumbnail(null);
            setThumbnailPreview(null);
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const title = formData.get("title");
        const description = formData.get("description");
        const content = formData.get("content");
        const category = formData.get("category");
        const aiTool = formData.get("aiTool");

        if (!title || !description || !content || !category || !aiTool || !difficulty || !visibility) {
            toast.error("Please fill in all required fields.");
            return;
        }

        let thumbnailUrl = "";
        const thumbnailFile = e.target.thumbnail?.files[0];
        if (thumbnailFile && thumbnailFile.size > 0) {
            try {
                thumbnailUrl = await fileToBase64(thumbnailFile);
            } catch (err) {
                console.error("Error converting image:", err);
            }
        }

        const promptData = {
            title,
            description,
            content,
            category,
            aiTool,
            tags: formData
                .get("tags")
                ?.split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),

            difficulty,
            visibility,

            thumbnail: thumbnailUrl,

            userId: session?.user?.id,
            creatorId: session?.user?.id,
            creatorEmail: session?.user?.email,
            creatorName: session?.user?.name,

            copyCount: 0,
            status: "pending",
            createdAt: new Date(),
        };

        console.log("Submitting prompt data:", promptData);

        try {
            const res = await createPrompt(promptData);
            if (res && (res.insertedId || res.acknowledged)) {
                toast.success("Prompt template added successfully!", {
                    position: "top-center",
                    autoClose: 2000,
                    theme: "dark"
                });
                e.target.reset();
                setThumbnail(null);
                setThumbnailPreview(null);
                setDifficulty("Beginner");
                setVisibility("Public");

                const targetDashboard = session?.user?.role?.toLowerCase() === "creator" ? "creator" : "user";
                setTimeout(() => {
                    router.push(`/dashboard/${targetDashboard}/my-prompts`);
                }, 1500);
            } else {
                toast.error("Failed to create prompt template.", { theme: "dark" });
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(error.message || "Failed to create prompt");
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-zinc-900 dark:text-white py-12 px-4 relative overflow-hidden">
            {/* Top decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-b from-violet-900/10 via-transparent to-transparent blur-3xl pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10 space-y-6">
                
                {/* Heading section */}
                <div className="space-y-1 pb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Create New Prompt Template
                    </h1>
                    <p className="text-zinc-500 dark:text-slate-400 text-xs sm:text-sm">
                        Fill in details to submit a prompt to the community catalog.
                    </p>
                </div>

                <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] rounded-xl p-6 sm:p-8 relative shadow-sm dark:shadow-none">
                    {/* Accent glows */}
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

                        {limitReached && (
                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                    <span>You have reached the upload limit for Free tier accounts (10 templates). Upgrade to Pro for unlimited uploads!</span>
                                </div>
                                <Link href="/dashboard/creator/profile" className="flex-shrink-0">
                                    <button type="button" className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-lg text-xs transition cursor-pointer">
                                        Upgrade
                                    </button>
                                </Link>
                            </div>
                        )}

                        {/* Prompt Title */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-zinc-500 dark:text-slate-400 tracking-widest uppercase">
                                Prompt Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                placeholder="e.g. Optimized React Tailwind Card Builder"
                                className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-[#151b3d] bg-zinc-50 dark:bg-[#040614] text-zinc-900 dark:text-white text-sm outline-none focus:border-purple-500/50 transition-all placeholder-zinc-400 dark:placeholder-slate-650"
                                required
                            />
                        </div>

                        {/* Short Description */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-zinc-500 dark:text-slate-400 tracking-widest uppercase">
                                Short Description *
                            </label>
                            <input
                                type="text"
                                name="description"
                                placeholder="Explain what this prompt accomplishes in 1-2 sentences"
                                className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-[#151b3d] bg-zinc-50 dark:bg-[#040614] text-zinc-900 dark:text-white text-sm outline-none focus:border-purple-500/50 transition-all placeholder-zinc-400 dark:placeholder-slate-650"
                                required
                            />
                        </div>

                        {/* Prompt Content Template */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-zinc-500 dark:text-slate-400 tracking-widest uppercase">
                                Prompt Content Template *
                            </label>
                            <textarea
                                name="content"
                                placeholder="Write the full, detailed prompt instructions. Use brackets to indicate variables e.g., 'Act as a [role]...'"
                                className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-[#151b3d] bg-zinc-50 dark:bg-[#040614] text-zinc-900 dark:text-white text-sm outline-none focus:border-purple-500/50 transition-all placeholder-zinc-400 dark:placeholder-slate-650 h-44 resize-y leading-relaxed"
                                required
                            />
                        </div>

                        {/* Category & AI Engine Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 dark:text-slate-400 tracking-widest uppercase">
                                    Category *
                                </label>
                                <div className="relative">
                                    <select
                                        name="category"
                                        className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-[#151b3d] bg-zinc-50 dark:bg-[#040614] text-zinc-900 dark:text-white text-sm outline-none focus:border-purple-500/50 transition-all cursor-pointer appearance-none"
                                        required
                                    >
                                        <option value="" className="bg-white dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400">Select Category</option>
                                        {categories.map((item) => (
                                            <option key={item} value={item} className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 dark:text-slate-400 tracking-widest uppercase">
                                    AI Engine *
                                </label>
                                <div className="relative">
                                    <select
                                        name="aiTool"
                                        className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-[#151b3d] bg-zinc-50 dark:bg-[#040614] text-zinc-900 dark:text-white text-sm outline-none focus:border-purple-500/50 transition-all cursor-pointer appearance-none"
                                        required
                                    >
                                        <option value="" className="bg-white dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400">Select AI Tool</option>
                                        {aiTools.map((item) => (
                                            <option key={item} value={item} className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
                                                {item}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Difficulty Level & Visibility Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 dark:text-slate-400 tracking-widest uppercase">
                                    Difficulty Level *
                                </label>
                                <div className="relative">
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-[#151b3d] bg-zinc-50 dark:bg-[#040614] text-zinc-900 dark:text-white text-sm outline-none focus:border-purple-500/50 transition-all cursor-pointer appearance-none"
                                        required
                                    >
                                        <option value="Beginner" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">Beginner</option>
                                        <option value="Intermediate" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">Intermediate</option>
                                        <option value="Pro" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">Pro</option>
                                    </select>
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-zinc-500 dark:text-slate-400 tracking-widest uppercase">
                                    Visibility Status *
                                </label>
                                <div className="flex items-center gap-6 mt-3.5">
                                    <label className="flex items-center gap-2 text-xs text-zinc-750 dark:text-slate-200 cursor-pointer select-none">
                                        <input
                                            type="radio"
                                            name="visibility"
                                            value="Public"
                                            checked={visibility === "Public"}
                                            onChange={() => setVisibility("Public")}
                                            className="w-4 h-4 text-purple-650 bg-zinc-50 dark:bg-[#040614] border-zinc-200 dark:border-[#151b3d] focus:ring-purple-500/30 cursor-pointer"
                                        />
                                        <span className="ml-1.5">Public (Free access)</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs text-zinc-750 dark:text-slate-200 cursor-pointer select-none">
                                        <input
                                            type="radio"
                                            name="visibility"
                                            value="Private"
                                            checked={visibility === "Private"}
                                            onChange={() => setVisibility("Private")}
                                            className="w-4 h-4 text-purple-650 bg-zinc-50 dark:bg-[#040614] border-zinc-200 dark:border-[#151b3d] focus:ring-purple-500/30 cursor-pointer"
                                        />
                                        <span className="ml-1.5">Private (Premium lock)</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-zinc-500 dark:text-slate-400 tracking-widest uppercase">
                                Tags (Comma-Separated)
                            </label>
                            <input
                                type="text"
                                name="tags"
                                placeholder="e.g. tailwind, card, component, responsive"
                                className="w-full px-4 py-3 rounded-lg border border-zinc-200 dark:border-[#151b3d] bg-zinc-50 dark:bg-[#040614] text-zinc-900 dark:text-white text-sm outline-none focus:border-purple-500/50 transition-all placeholder-zinc-400 dark:placeholder-slate-650"
                            />
                        </div>

                        {/* Thumbnail Image Upload */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-zinc-500 dark:text-slate-400 tracking-widest uppercase">
                                Thumbnail Image Upload
                            </label>
                            <div className="relative border border-dashed border-zinc-300 dark:border-[#1d2456] rounded-lg bg-zinc-50 dark:bg-[#040614] hover:bg-zinc-100 dark:hover:bg-[#040614]/70 transition-all min-h-[140px] flex items-center justify-center cursor-pointer">
                                {thumbnailPreview ? (
                                    <div className="relative w-full h-[180px] group/preview">
                                        <img
                                            src={thumbnailPreview}
                                            alt="Thumbnail Preview"
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                                            <label htmlFor="thumbnail-input" className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold cursor-pointer transition-all">
                                                Change Image
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setThumbnail(null);
                                                    setThumbnailPreview(null);
                                                    const fileInput = document.getElementById("thumbnail-input");
                                                    if (fileInput) fileInput.value = "";
                                                }}
                                                className="px-4 py-2 rounded-lg bg-zinc-200 hover:bg-zinc-300 text-zinc-800 dark:bg-[#131735] dark:text-zinc-300 dark:hover:bg-[#1a204d] text-xs font-semibold transition-all border border-zinc-300 dark:border-[#1e2554]"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <label htmlFor="thumbnail-input" className="flex flex-col items-center justify-center p-6 w-full cursor-pointer h-full gap-2">
                                        <UploadCloud className="w-6 h-6 text-zinc-400 dark:text-slate-400" />
                                        <p className="text-sm font-semibold text-zinc-700 dark:text-slate-200">
                                            Click to choose a thumbnail image file
                                        </p>
                                        <p className="text-xs text-zinc-500 dark:text-slate-500">
                                            Supports PNG, JPG, or WEBP (Max 2MB)
                                        </p>
                                    </label>
                                )}
                                <input
                                    id="thumbnail-input"
                                    type="file"
                                    name="thumbnail"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleThumbnailChange}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4 space-y-3">
                            <div className="text-xs text-zinc-500 dark:text-slate-400 font-medium">
                                {isPro ? (
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                        🚀 Pro Fast-Track Review active (Approval prioritized, usually within 1 hour)
                                    </span>
                                ) : (
                                    <span className="text-zinc-500 flex items-center gap-1">
                                        ⏳ Standard Review Queue (Approval may take up to 48 hours for Free tier templates)
                                    </span>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={limitReached}
                                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-650 disabled:cursor-not-allowed text-white py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300 shadow-[0_4px_12px_rgba(124,58,237,0.25)] cursor-pointer"
                            >
                                <Send className="w-4 h-4" />
                                <span>{limitReached ? "Upload Limit Reached (Upgrade to Pro)" : "Submit Prompt for Review"}</span>
                            </button>
                        </div>

                    </form>
                </div>
            </div>
            
            {/* Toast Notifications */}
            <ToastContainer position="top-center" hideProgressBar newestOnTop />
        </div>
    );
}
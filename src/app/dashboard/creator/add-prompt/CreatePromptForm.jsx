"use client";

import { useState } from "react";
import { UploadCloud, Send } from "lucide-react";
import { createPrompt } from "@/lib/actions/prompt";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";

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
    const [difficulty, setDifficulty] = useState("Beginner");
    const [visibility, setVisibility] = useState("Public");
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(null);

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
            if (res.insertedId) {
                toast.success("Prompt created successfully");
                e.target.reset();
                setThumbnail(null);
                setThumbnailPreview(null);
                setDifficulty("Beginner");
                setVisibility("Public");
            } else {
                toast.error("Failed to create prompt");
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(error.message || "Failed to create prompt");
        }
    };

    return (
        <div className="min-h-screen bg-[#030014] text-white py-12 px-4 relative overflow-hidden">
            {/* Top decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-b from-violet-900/10 via-transparent to-transparent blur-3xl pointer-events-none" />

            <div className="max-w-3xl mx-auto relative z-10 space-y-6">
                
                {/* Heading section */}
                <div className="space-y-1 pb-2">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                        Create New Prompt Template
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm">
                        Fill in details to submit a prompt to the community catalog.
                    </p>
                </div>

                <div className="bg-[#0a0d26] border border-[#13193e] rounded-xl p-6 sm:p-8 relative">
                    {/* Accent glows */}
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

                        {/* Prompt Title */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                                Prompt Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                placeholder="e.g. Optimized React Tailwind Card Builder"
                                className="w-full px-4 py-3 rounded-lg border border-[#151b3d] bg-[#040614] text-white text-sm outline-none focus:border-purple-500/50 transition-all placeholder-slate-600"
                                required
                            />
                        </div>

                        {/* Short Description */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                                Short Description *
                            </label>
                            <input
                                type="text"
                                name="description"
                                placeholder="Explain what this prompt accomplishes in 1-2 sentences"
                                className="w-full px-4 py-3 rounded-lg border border-[#151b3d] bg-[#040614] text-white text-sm outline-none focus:border-purple-500/50 transition-all placeholder-slate-600"
                                required
                            />
                        </div>

                        {/* Prompt Content Template */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                                Prompt Content Template *
                            </label>
                            <textarea
                                name="content"
                                placeholder="Write the full, detailed prompt instructions. Use brackets to indicate variables e.g., 'Act as a [role]...'"
                                className="w-full px-4 py-3 rounded-lg border border-[#151b3d] bg-[#040614] text-white text-sm outline-none focus:border-purple-500/50 transition-all placeholder-slate-600 h-44 resize-y leading-relaxed"
                                required
                            />
                        </div>

                        {/* Category & AI Engine Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                                    Category *
                                </label>
                                <div className="relative">
                                    <select
                                        name="category"
                                        className="w-full px-4 py-3 rounded-lg border border-[#151b3d] bg-[#040614] text-white text-sm outline-none focus:border-purple-500/50 transition-all cursor-pointer appearance-none"
                                        required
                                    >
                                        <option value="" className="bg-zinc-950 text-zinc-550">Select Category</option>
                                        {categories.map((item) => (
                                            <option key={item} value={item} className="bg-zinc-950 text-zinc-100">
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
                                <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                                    AI Engine *
                                </label>
                                <div className="relative">
                                    <select
                                        name="aiTool"
                                        className="w-full px-4 py-3 rounded-lg border border-[#151b3d] bg-[#040614] text-white text-sm outline-none focus:border-purple-500/50 transition-all cursor-pointer appearance-none"
                                        required
                                    >
                                        <option value="" className="bg-zinc-950 text-zinc-550">Select AI Tool</option>
                                        {aiTools.map((item) => (
                                            <option key={item} value={item} className="bg-zinc-950 text-zinc-100">
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
                                <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                                    Difficulty Level *
                                </label>
                                <div className="relative">
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-[#151b3d] bg-[#040614] text-white text-sm outline-none focus:border-purple-500/50 transition-all cursor-pointer appearance-none"
                                        required
                                    >
                                        <option value="Beginner" className="bg-zinc-950 text-white">Beginner</option>
                                        <option value="Intermediate" className="bg-zinc-950 text-white">Intermediate</option>
                                        <option value="Pro" className="bg-zinc-950 text-white">Pro</option>
                                    </select>
                                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500">
                                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                                    Visibility Status *
                                </label>
                                <div className="flex items-center gap-6 mt-3.5">
                                    <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer select-none">
                                        <input
                                            type="radio"
                                            name="visibility"
                                            value="Public"
                                            checked={visibility === "Public"}
                                            onChange={() => setVisibility("Public")}
                                            className="w-4 h-4 text-purple-600 bg-[#040614] border-[#151b3d] focus:ring-purple-500/30 cursor-pointer"
                                        />
                                        <span className="ml-1.5">Public (Free access)</span>
                                    </label>
                                    <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer select-none">
                                        <input
                                            type="radio"
                                            name="visibility"
                                            value="Private"
                                            checked={visibility === "Private"}
                                            onChange={() => setVisibility("Private")}
                                            className="w-4 h-4 text-purple-600 bg-[#040614] border-[#151b3d] focus:ring-purple-500/30 cursor-pointer"
                                        />
                                        <span className="ml-1.5">Private (Premium lock)</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                                Tags (Comma-Separated)
                            </label>
                            <input
                                type="text"
                                name="tags"
                                placeholder="e.g. tailwind, card, component, responsive"
                                className="w-full px-4 py-3 rounded-lg border border-[#151b3d] bg-[#040614] text-white text-sm outline-none focus:border-purple-500/50 transition-all placeholder-slate-600"
                            />
                        </div>

                        {/* Thumbnail Image Upload */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                                Thumbnail Image Upload
                            </label>
                            <div className="relative border border-dashed border-[#1d2456] rounded-lg bg-[#040614] hover:bg-[#040614]/70 transition-all min-h-[140px] flex items-center justify-center cursor-pointer">
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
                                                className="px-4 py-2 rounded-lg bg-[#131735] text-zinc-300 hover:bg-[#1a204d] text-xs font-semibold transition-all border border-[#1e2554]"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <label htmlFor="thumbnail-input" className="flex flex-col items-center justify-center p-6 w-full cursor-pointer h-full gap-2">
                                        <UploadCloud className="w-6 h-6 text-slate-400" />
                                        <p className="text-sm font-semibold text-slate-200">
                                            Click to choose a thumbnail image file
                                        </p>
                                        <p className="text-xs text-slate-500">
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
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300 shadow-[0_4px_12px_rgba(124,58,237,0.25)] cursor-pointer"
                            >
                                <Send className="w-4 h-4" />
                                <span>Submit Prompt for Review</span>
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
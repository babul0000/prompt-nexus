"use client";

import { useState } from "react";
import {
    Button,
    Input,
    TextArea,
    Label,
    Description,
    RadioGroup,
    Radio,
    TextField,
    InputGroup,
} from "@heroui/react";
import {
    Heading,
    FileText,
    Code,
    Tag,
    FolderOpen,
    Sparkles,
    UploadCloud,
    Globe,
    Lock,
    Send,
    Gauge,
    Trophy,
    Flame
} from "lucide-react";
import { createPrompt } from "@/lib/actions/prompt";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";

const categories = [
    "Writing",
    "Coding",
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

const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

export default function CreatePromptPage() {
    const { data: session } = useSession();
    const [difficulty, setDifficulty] = useState("");
    const [visibility, setVisibility] = useState("");
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
        const thumbnailFile = formData.get("thumbnail");
        if (thumbnailFile && thumbnailFile.size > 0) {
            const MAX_BYTES = 200 * 1024; // 200KB
            if (thumbnailFile.size > MAX_BYTES) {
                toast.error("Thumbnail too large. Please upload an image under 200KB.");
                return;
            }
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

            creatorId: session?.user?.id,
            creatorEmail: session?.user?.email,
            creatorName: session?.user?.name,

            copyCount: 0,
            status: "pending",
            createdAt: new Date(),
        };

        console.log("Submitting prompt data:", promptData);
        if (session) {
            console.log('User session:', session);
        }

        try {
            const res = await createPrompt(promptData);
            if (res?.insertedId || res?._id) {
                toast.success("Prompt created successfully");
                e.target.reset();
                setThumbnail(null);
                setThumbnailPreview(null);
                setDifficulty("");
                setVisibility("");
            } else {
                toast.error("Failed to create prompt");
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(error.message || "Failed to create prompt");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white py-12 px-4 relative overflow-hidden">
            {/* Top decorative glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[300px] bg-gradient-to-b from-violet-900/10 via-transparent to-transparent blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto border border-zinc-800/80 rounded-2xl p-8 bg-zinc-950/80 backdrop-blur-xl shadow-2xl relative">
                {/* Accent glows */}
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-600/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

                <div className="mb-8 border-b border-zinc-900 pb-6 relative z-10">
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                        Create AI Prompt
                    </h1>
                    <p className="text-zinc-400 mt-2 text-sm">
                        Submit your optimized prompt to the marketplace and earn recognition.
                    </p>

                    <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-amber-300 text-xs flex items-start gap-3">
                        <Sparkles className="flex-shrink-0 mt-0.5 text-amber-400" size={16} />
                        <div>
                            <strong>Pending Review:</strong> All newly submitted prompts are automatically marked as <strong>pending</strong> and remain hidden until reviewed by our admin team.
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

                    {/* Prompt Title */}
                    <TextField name="title" className="flex flex-col gap-2">
                        <Label className="text-sm font-semibold text-zinc-300">Prompt Title</Label>
                        <InputGroup className="flex items-center gap-2.5 border border-zinc-800 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/10 rounded-xl px-3.5 py-1 bg-zinc-900/30 transition-all duration-200">
                            <Heading className="text-zinc-500 flex-shrink-0" size={18} />
                            <Input
                                type="text"
                                placeholder="e.g. SEO Blog Post Writer or React Expert"
                                className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-zinc-100 placeholder-zinc-600"
                            />
                        </InputGroup>
                    </TextField>

                    {/* Prompt Description */}
                    <TextField name="description" className="flex flex-col gap-2">
                        <Label className="text-sm font-semibold text-zinc-300">Prompt Description</Label>
                        <InputGroup className="flex items-start gap-2.5 border border-zinc-800 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/10 rounded-xl px-3.5 py-3 bg-zinc-900/30 transition-all duration-200">
                            <FileText className="text-zinc-500 mt-0.5 flex-shrink-0" size={18} />
                            <TextArea
                                placeholder="Provide a summary of what this prompt does and its target audience..."
                                className="w-full bg-transparent text-sm outline-none border-none text-zinc-100 placeholder-zinc-600 min-h-[70px] resize-y"
                                rows={3}
                            />
                        </InputGroup>
                    </TextField>
                    {/* Prompt Content */}
                    <TextField name="content" className="flex flex-col gap-2">
                        <div className="flex justify-between items-end">
                            <Label className="text-sm font-semibold text-zinc-300">Prompt Content</Label>
                            <span className="text-[10px] font-mono text-zinc-500">Insert variables like [topic] in brackets</span>
                        </div>
                        <div className="border border-zinc-800 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/10 rounded-xl bg-zinc-900/10 transition-all duration-200">
                            {/* Editor style header */}
                            <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-2 bg-zinc-950/40 rounded-t-xl text-zinc-500 text-xs">
                                <div className="flex items-center gap-1.5 font-mono">
                                    <span className="w-2 h-2 rounded-full bg-rose-500/60" />
                                    <span className="w-2 h-2 rounded-full bg-amber-500/60" />
                                    <span className="w-2 h-2 rounded-full bg-emerald-500/60" />
                                    <span className="ml-2 text-zinc-400 font-semibold">prompt.txt</span>
                                </div>
                                <span className="text-[9px] uppercase font-bold tracking-wider text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">Instruction</span>
                            </div>
                            <div className="flex items-start gap-2.5 p-3.5 font-mono">
                                <Code className="text-zinc-600 mt-1 flex-shrink-0" size={16} />
                                <TextArea
                                    placeholder="Act as a professional software engineer... [insert instructions]"
                                    className="w-full bg-transparent text-sm outline-none border-none text-zinc-200 placeholder-zinc-700 min-h-[160px] font-mono leading-relaxed resize-y"
                                    rows={8}
                                />
                            </div>
                        </div>
                    </TextField>

                    {/* Category & AI Tool */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-semibold text-zinc-300">Category</Label>
                            <div className="relative flex items-center border border-zinc-800 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/10 rounded-xl px-3.5 bg-zinc-900/30 transition-all duration-200">
                                <FolderOpen className="text-zinc-500 flex-shrink-0" size={18} />
                                <select
                                    name="category"
                                    className="w-full bg-transparent py-3 pl-2.5 pr-8 text-sm outline-none border-none text-zinc-100 placeholder-zinc-600 cursor-pointer appearance-none"
                                >
                                    <option value="" className="bg-zinc-950 text-zinc-500">Select Category</option>
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

                        <div className="flex flex-col gap-2">
                            <Label className="text-sm font-semibold text-zinc-300">AI Tool</Label>
                            <div className="relative flex items-center border border-zinc-800 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/10 rounded-xl px-3.5 bg-zinc-900/30 transition-all duration-200">
                                <Sparkles className="text-zinc-500 flex-shrink-0" size={18} />
                                <select
                                    name="aiTool"
                                    className="w-full bg-transparent py-3 pl-2.5 pr-8 text-sm outline-none border-none text-zinc-100 placeholder-zinc-600 cursor-pointer appearance-none"
                                >
                                    <option value="" className="bg-zinc-950 text-zinc-500">Select AI Tool</option>
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

                    {/* Tags */}
                    <TextField name="tags" className="flex flex-col gap-2">
                        <Label className="text-sm font-semibold text-zinc-300">Tags</Label>
                        <InputGroup className="flex items-center gap-2.5 border border-zinc-800 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/10 rounded-xl px-3.5 py-1 bg-zinc-900/30 transition-all duration-200">
                            <Tag className="text-zinc-500 flex-shrink-0" size={18} />
                            <Input
                                type="text"
                                placeholder="react, nextjs, seo, marketing (comma separated)"
                                className="w-full bg-transparent py-2.5 text-sm outline-none border-none text-zinc-100 placeholder-zinc-600"
                            />
                        </InputGroup>
                    </TextField>

                    {/* Difficulty Selection Cards */}
                    <RadioGroup
                        name="difficulty"
                        value={difficulty}
                        onChange={setDifficulty}
                        className="flex flex-col gap-3"
                    >
                        <div className="flex flex-col">
                            <Label className="text-sm font-semibold text-zinc-300">Difficulty Level</Label>
                            <Description className="text-xs text-zinc-500">Choose the complexity level of the prompt instructions</Description>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 mt-1">
                            {/* Beginner card */}
                            <Radio
                                value="Beginner"
                                className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all duration-200 ${difficulty === "Beginner"
                                    ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500/50"
                                    : "border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40"
                                    }`}
                            >
                                <Radio.Control className="hidden" />
                                <Radio.Content className="flex items-center gap-3 w-full">
                                    <div className={`p-2 rounded-lg transition-colors ${difficulty === "Beginner" ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-900 text-zinc-400"}`}>
                                        <Gauge size={18} />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-sm font-semibold text-zinc-200">Beginner</span>
                                        <span className="text-[11px] text-zinc-500">Simple layout & options</span>
                                    </div>
                                </Radio.Content>
                            </Radio>

                            {/* Intermediate card */}
                            <Radio
                                value="Intermediate"
                                className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all duration-200 ${difficulty === "Intermediate"
                                    ? "border-amber-500 bg-amber-500/5 ring-1 ring-amber-500/50"
                                    : "border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40"
                                    }`}
                            >
                                <Radio.Control className="hidden" />
                                <Radio.Content className="flex items-center gap-3 w-full">
                                    <div className={`p-2 rounded-lg transition-colors ${difficulty === "Intermediate" ? "bg-amber-500/20 text-amber-400" : "bg-zinc-900 text-zinc-400"}`}>
                                        <Trophy size={18} />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-sm font-semibold text-zinc-200">Intermediate</span>
                                        <span className="text-[11px] text-zinc-500">Supports variable logic</span>
                                    </div>
                                </Radio.Content>
                            </Radio>

                            {/* Pro card */}
                            <Radio
                                value="Pro"
                                className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all duration-200 ${difficulty === "Pro"
                                    ? "border-rose-500 bg-rose-500/5 ring-1 ring-rose-500/50"
                                    : "border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40"
                                    }`}
                            >
                                <Radio.Control className="hidden" />
                                <Radio.Content className="flex items-center gap-3 w-full">
                                    <div className={`p-2 rounded-lg transition-colors ${difficulty === "Pro" ? "bg-rose-500/20 text-rose-400" : "bg-zinc-900 text-zinc-400"}`}>
                                        <Flame size={18} />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-sm font-semibold text-zinc-200">Pro</span>
                                        <span className="text-[11px] text-zinc-500">Complex rules & variables</span>
                                    </div>
                                </Radio.Content>
                            </Radio>
                        </div>
                    </RadioGroup>

                    {/* Thumbnail Image */}
                    <div className="flex flex-col gap-2">
                        <Label className="text-sm font-semibold text-zinc-300">Thumbnail Image</Label>
                        <div className="relative border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10 transition-all duration-200 overflow-hidden min-h-[160px] flex items-center justify-center">
                            {thumbnailPreview ? (
                                <div className="relative w-full h-[220px] group/preview">
                                    <img
                                        src={thumbnailPreview}
                                        alt="Thumbnail Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3">
                                        <label htmlFor="thumbnail-input" className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold cursor-pointer transition-all">
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
                                            className="px-4 py-2 rounded-xl bg-zinc-850 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-200 text-xs font-semibold transition-all border border-zinc-750"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label htmlFor="thumbnail-input" className="group flex flex-col items-center justify-center p-6 w-full cursor-pointer hover:bg-zinc-900/20">
                                    <div className="flex flex-col items-center justify-center text-center">
                                        <div className="p-3 rounded-full bg-zinc-950 border border-zinc-900 text-zinc-500 group-hover:text-violet-400 group-hover:border-violet-500/30 transition-all duration-200 mb-3">
                                            <UploadCloud size={22} />
                                        </div>
                                        <p className="text-sm font-medium text-zinc-200">
                                            Click to upload cover image
                                        </p>
                                        <p className="text-xs text-zinc-500 mt-1">
                                            PNG, JPG, WEBP formats up to 5MB
                                        </p>
                                    </div>
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

                    {/* Visibility Cards */}
                    <RadioGroup
                        name="visibility"
                        value={visibility}
                        onChange={setVisibility}
                        className="flex flex-col gap-3"
                    >
                        <div className="flex flex-col">
                            <Label className="text-sm font-semibold text-zinc-300">Visibility</Label>
                            <Description className="text-xs text-zinc-500">Determine who will have access to see and copy this prompt</Description>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mt-1">
                            {/* Public visibility card */}
                            <Radio
                                value="Public"
                                className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all duration-200 ${visibility === "Public"
                                    ? "border-violet-500 bg-violet-500/5 ring-1 ring-violet-500/50"
                                    : "border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40"
                                    }`}
                            >
                                <Radio.Control className="hidden" />
                                <Radio.Content className="flex items-center gap-3 w-full">
                                    <div className={`p-2 rounded-lg transition-colors ${visibility === "Public" ? "bg-violet-500/20 text-violet-400" : "bg-zinc-900 text-zinc-400"}`}>
                                        <Globe size={18} />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-sm font-semibold text-zinc-200">Public</span>
                                        <span className="text-[11px] text-zinc-500">Available to all users on the marketplace</span>
                                    </div>
                                </Radio.Content>
                            </Radio>

                            {/* Private visibility card */}
                            <Radio
                                value="Private"
                                className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-all duration-200 ${visibility === "Private"
                                    ? "border-violet-500 bg-violet-500/5 ring-1 ring-violet-500/50"
                                    : "border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40"
                                    }`}
                            >
                                <Radio.Control className="hidden" />
                                <Radio.Content className="flex items-center gap-3 w-full">
                                    <div className={`p-2 rounded-lg transition-colors ${visibility === "Private" ? "bg-violet-500/20 text-violet-400" : "bg-zinc-900 text-zinc-400"}`}>
                                        <Lock size={18} />
                                    </div>
                                    <div className="flex flex-col text-left">
                                        <span className="text-sm font-semibold text-zinc-200">Private</span>
                                        <span className="text-[11px] text-zinc-500">Only visible and accessible on your account</span>
                                    </div>
                                </Radio.Content>
                            </Radio>
                        </div>
                    </RadioGroup>

                    {/* Reset & Submit Buttons */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-zinc-900">
                        <Button
                            variant="bordered"
                            type="reset"
                            className="border-zinc-850 text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-200 font-medium px-6 py-2.5 rounded-xl transition-all duration-200"
                        >
                            Reset Form
                        </Button>

                        <Button
                            color="primary"
                            type="submit"
                            className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20 transition-all duration-200 flex items-center gap-2"
                        >
                            Submit Prompt
                            <Send size={14} />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
"use client";

import React, { useState } from "react";
import { Form, Button, Select, ListBox, Switch } from "@heroui/react";
import { Briefcase, Globe } from "@gravity-ui/icons";
import { useRouter } from "next/navigation";

import { createPrompt } from "@/lib/actions/prompt";

// তোমার তৈরি করা সার্ভার অ্যাকশনটি এখানে ইমপোর্ট করা হলো


// ক্যাটাগরি, এআইツールস এবং ট্যাগ লিস্ট রিকোয়ারমেন্ট অনুযায়ী
const categories = [
    { id: "Writing", name: "Writing" },
    { id: "Coding", name: "Coding" },
    { id: "Marketing", name: "Marketing" },
    { id: "Business", name: "Business" },
    { id: "Education", name: "Education" },
    { id: "Design", name: "Design" },
    { id: "Productivity", name: "Productivity" }
];

const aiTools = [
    { id: "ChatGPT", name: "ChatGPT" },
    { id: "Claude", name: "Claude" },
    { id: "Gemini", name: "Gemini" },
    { id: "Midjourney", name: "Midjourney" },
    { id: "Copilot", name: "Copilot" }
];

const availableTags = ["SEO", "Blogging", "React", "Next.js", "JavaScript", "Marketing", "AI"];

export default function CreatePromptForm() {
    const router = useRouter();
    const [isRemote, setIsRemote] = useState(false); // Visibility (Public/Private toggle)
    const [errors, setErrors] = useState({});
    const [selectedTags, setSelectedTags] = useState([]);
    
    // ImgBB Upload States
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); // সাবমিশন লোডিং স্টেট

    // 📸 IMGBB IMAGE UPLOAD LOGIC
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const imageFormData = new FormData();
        imageFormData.append("image", file);

        const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: "POST",
                body: imageFormData,
            });
            const result = await response.json();

            if (result.success) {
                setThumbnailUrl(result.data.url);
                alert("Thumbnail image uploaded to ImgBB successfully!");
            } else {
                alert("ImgBB Upload Failed. Please verify your API key in .env.local");
            }
        } catch (error) {
            console.error("Image upload error:", error);
            alert("Something went wrong during image upload.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleTagToggle = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        // ক্লায়েন্ট-সাইড ভ্যালিডেশন
        const newErrors = {};
        if (!data.title) newErrors.title = "Prompt title is required";
        if (!data.category) newErrors.category = "Category is required";
        if (!data.aiTool) newErrors.aiTool = "AI Tool is required";
        if (!data.description) newErrors.description = "Description is required";
        if (!data.content) newErrors.content = "Prompt content is required";
        if (!thumbnailUrl) newErrors.thumbnail = "Prompt thumbnail image is required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        // প্রজেক্ট রিকোয়ারমেন্টস (PDF) অনুযায়ী অবজেক্ট স্ট্রাকচার
        const payload = {
            title: data.title,
            description: data.description,
            content: data.content,
            category: data.category,
            aiTool: data.aiTool,
            tags: selectedTags,
            visibility: isRemote ? "private" : "public",
            thumbnail: thumbnailUrl, // ImgBB hosted live লিঙ্কটি এখানে চলে যাবে
            copyCount: 0,
            bookmarkCount: 0,
            status: "approved", // 👈 অ্যাডমিন মডারেশন অফ করে সরাসরি 'approved' করা হলো
            createdAt: new Date(),
        };

        // সাবমিট করার আগে কনসোলে ফুল পে-লোড অবজেক্ট লক করবে
        console.log("Submitting prompt data to database:", payload);

        try {
            // সার্ভার অ্যাকশন কল করে ব্যাকএন্ডে ডেটা পাঠানো হচ্ছে
            const res = await createPrompt(payload);

            if (res) {
                alert("Prompt created and published directly to the marketplace!");
                e.target.reset();
                setSelectedTags([]);
                setThumbnailUrl("");
                router.push("/all-prompts"); // সাবমিট শেষে অল-প্রম্পটস পেজে রিডিরেক্ট করবে
            }
        } catch (err) {
            console.error("Failed to post prompt:", err);
            alert("Something went wrong while connecting to backend.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // ক্লাসের কালার স্কিম ও থিম ঠিক রাখা হয়েছে
    const textInputClass = "w-full text-white bg-[#1c1c1e] border border-zinc-800 hover:bg-[#242426] focus:border-zinc-600 rounded-lg h-12 px-3 text-sm placeholder:text-zinc-600 outline-none transition-all";
    const textAreaClass = "w-full text-white bg-[#1c1c1e] border border-zinc-800 hover:bg-[#242426] focus:border-zinc-600 rounded-lg p-3 text-sm placeholder:text-zinc-600 outline-none transition-all";
    const triggerClasses = "w-full flex items-center justify-between bg-[#1c1c1e] border border-zinc-800 hover:bg-[#242426] h-12 rounded-lg px-3 text-white transition-all text-sm outline-none focus:border-zinc-600";
    const popoverClasses = "bg-[#1c1c1e] border border-zinc-800 text-white rounded-lg shadow-xl p-1 min-w-[200px]";
    const listItemClasses = "flex items-center justify-between p-2 rounded-md hover:bg-zinc-800 cursor-pointer text-sm text-zinc-200 outline-none";

    return (
        <div className="min-h-screen bg-[#0d0d0e] text-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-[#121214] border border-zinc-900 rounded-xl p-8 shadow-2xl">
                
                {/* Header Block */}
                <div className="border-b border-zinc-800 pb-6 mb-8">
                    <h1 className="text-2xl font-semibold tracking-tight">Add New AI Prompt</h1>
                    <p className="text-zinc-400 text-sm mt-1">
                        Fill out the details below to share your prompt to the marketplace.
                    </p>

                    <div className="mt-4 inline-flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-400">
                        <Briefcase size={14} className="text-zinc-500" />
                        Status: <span className="font-semibold text-zinc-300">Creator Active</span>
                        <span className="text-emerald-500 font-medium bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-900/50">Verified</span>
                    </div>
                </div>

                {/* HeroUI Custom Validated Form Framework */}
                <Form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* SECTION 1: Prompt Basics */}
                    <div className="space-y-6 w-full">
                        <h2 className="text-lg font-medium text-zinc-300 border-b border-zinc-900 w-full pb-2 mb-2">
                            Prompt Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-1 w-full">
                                <label className="text-zinc-400 font-medium text-sm">Prompt Title</label>
                                <input name="title" placeholder="e.g. Advanced Tailwind Layout Generator" className={textInputClass} required />
                                {errors.title && <span className="text-xs text-danger mt-1">{errors.title}</span>}
                            </div>

                            <Select className="w-full" name="category" placeholder="Select Category">
                                <label className="text-zinc-400 font-medium text-sm mb-1 block">Category</label>
                                <Select.Trigger className={triggerClasses}>
                                    <Select.Value className="text-white" />
                                    <Select.Indicator />
                                </Select.Trigger>
                                {errors.category && <span className="text-xs text-danger mt-1">{errors.category}</span>}
                                <Select.Popover className={popoverClasses}>
                                    <ListBox className="outline-none">
                                        {categories.map((cat) => (
                                            <ListBox.Item id={cat.id} key={cat.id} className={listItemClasses} textValue={cat.name}>{cat.name}</ListBox.Item>
                                        ))}
                                    </ListBox>
                                </Select.Popover>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select className="w-full" name="aiTool" placeholder="Select Target AI Tool">
                                <label className="text-zinc-400 font-medium text-sm mb-1 block">Target AI Tool</label>
                                <Select.Trigger className={triggerClasses}>
                                    <Select.Value className="text-white" />
                                    <Select.Indicator />
                                </Select.Trigger>
                                {errors.aiTool && <span className="text-xs text-danger mt-1">{errors.aiTool}</span>}
                                <Select.Popover className={popoverClasses}>
                                    <ListBox className="outline-none">
                                        {aiTools.map((tool) => (
                                            <ListBox.Item id={tool.id} key={tool.id} className={listItemClasses} textValue={tool.name}>{tool.name}</ListBox.Item>
                                        ))}
                                    </ListBox>
                                </Select.Popover>
                            </Select>

                            {/* Visibility (Public/Private Switch Component) */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-zinc-400 font-medium text-sm">Private Visibility</span>
                                    <Switch isSelected={isRemote} onChange={setIsRemote} size="sm">
                                        <Switch.Control className="bg-zinc-800 data-[selected=true]:bg-white">
                                            <Switch.Thumb className="bg-zinc-400 data-[selected=true]:bg-black" />
                                        </Switch.Control>
                                    </Switch>
                                </div>
                                <div className="relative flex items-center">
                                    <Globe size={16} className="absolute left-3 text-zinc-600 pointer-events-none z-10" />
                                    <input
                                        type="text"
                                        readOnly
                                        value={isRemote ? "Private (Only You)" : "Public Marketplace"}
                                        className={`${textInputClass} pl-10 cursor-not-allowed`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Image File to ImgBB Uploader Block */}
                        <div className="flex flex-col gap-1 w-full">
                            <label className="text-zinc-400 font-medium text-sm">Prompt Thumbnail Image</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                                className="w-full text-zinc-500 bg-[#1c1c1e] border border-zinc-800 rounded-lg p-2 text-sm file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 transition-all cursor-pointer"
                            />
                            {isUploading && <p className="text-xs text-primary animate-pulse mt-1">Uploading image to ImgBB server...</p>}
                            {thumbnailUrl && <p className="text-xs text-emerald-500 mt-1 truncate">✓ Live URL generated: {thumbnailUrl}</p>}
                            {errors.thumbnail && <span className="text-xs text-danger mt-1">{errors.thumbnail}</span>}
                        </div>
                    </div>

                    {/* SECTION 2: Details & Content */}
                    <div className="space-y-6 w-full">
                        <h2 className="text-lg font-medium text-zinc-300 border-b border-zinc-900 w-full pb-2 mb-2">
                            Prompt Content Details
                        </h2>

                        <div className="flex flex-col gap-1 w-full">
                            <label className="text-zinc-400 font-medium text-sm">Short Description</label>
                            <textarea
                                name="description"
                                placeholder="Write a short description summarizing what this AI prompt achieves..."
                                rows={3}
                                className={textAreaClass}
                                required
                            />
                            {errors.description && <span className="text-xs text-danger mt-1">{errors.description}</span>}
                        </div>

                        <div className="flex flex-col gap-1 w-full">
                            <label className="text-zinc-400 font-medium text-sm">Prompt Text / Content</label>
                            <textarea
                                name="content"
                                placeholder="Paste the exact prompt content context instructions here..."
                                rows={6}
                                className={textAreaClass}
                                required
                            />
                            {errors.content && <span className="text-xs text-danger mt-1">{errors.content}</span>}
                        </div>

                        {/* Tags Selection Array Grid */}
                        <div className="space-y-2">
                            <label className="text-zinc-400 font-medium text-sm">Tags Selection</label>
                            <div className="flex flex-wrap gap-2">
                                {availableTags.map((tag) => {
                                    const isSelected = selectedTags.includes(tag);
                                    return (
                                        <button
                                            type="button"
                                            key={tag}
                                            onClick={() => handleTagToggle(tag)}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all border ${
                                                isSelected 
                                                ? "bg-white text-black border-white" 
                                                : "bg-[#1c1c1e] text-zinc-400 border-zinc-800 hover:border-zinc-600"
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Form Submission Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800 w-full">
                        <Button
                            type="button"
                            variant="bordered"
                            onClick={() => router.push("/dashboard")}
                            className="border-zinc-800 text-zinc-300 hover:bg-zinc-900 rounded-lg px-6 font-medium h-11"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isUploading || isSubmitting}
                            className="bg-white text-black font-semibold hover:bg-zinc-200 rounded-lg px-6 transition-colors h-11"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Prompt"}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}
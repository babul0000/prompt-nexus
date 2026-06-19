"use client";
import { authClient } from "@/lib/auth-client";
import { Button, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
    const router = useRouter();

    // 🛠️ জাভাস্ক্রিপ্ট স্টেট দিয়ে ইনপুট ডাটা ট্র্যাক করা হচ্ছে
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");
    
    // ✅ ডিফল্ট রোল এখানে "user" সেট করা আছে। 
    // যদি কেউ রেডিও বাটন চেঞ্জ না করে, তবে সে ডিফল্ট "user" হিসেবেই ডাটাবেজে জমা হবে।
    const [role, setRole] = useState("user"); 

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        // Better-Auth এবং মঙ্গোডিবি ডাটাবেজের রিকোয়ারমেন্ট অনুযায়ী অবজেক্ট স্ট্রাকচার
        const userData = {
            name: name,
            email: email,
            password: password,
            image: image || "",
            role: role,    // 'user' অথবা 'creator'
            plan: "free",  // প্রজেক্ট রিকোয়ারমেন্ট অনুযায়ী ডিফল্ট সাবস্ক্রিপশন প্ল্যান
        };

        console.log("Submitting User Data to Better-Auth:", userData);

        try {
            const response = await authClient.signUp.email(userData);

            if (response?.error) {
                setErrorMessage(response.error.message || "Signup failed. Please try again.");
            } else {
                console.log("Signup Successful!", response);
                // সফলভাবে অ্যাকাউন্ট তৈরি হলে ইউজারকে হোমপেজে পাঠিয়ে দেওয়া হবে
                router.push("/");
            }
        } catch (error) {
            console.error("Signup Failed with Error:", error);
            setErrorMessage("Something went wrong. Please check your terminal or connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#030014] px-4 py-12">
            {/* ব্যাকগ্রাউন্ড নিয়ন ইফেক্ট */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-[#7C3AED]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md bg-[#09090b] border border-white/5 rounded-2xl p-8 shadow-2xl z-10">

                <div className="text-center mb-6">
                    <h2 className="text-white text-2xl font-bold tracking-tight">Create Account</h2>
                    <p className="text-gray-400 text-xs mt-1">Join PromptNexus Marketplace</p>
                </div>

                {/* এরর মেসেজ অ্যালার্ট শো করার জায়গা */}
                {errorMessage && (
                    <div className="mb-4 p-3 text-xs rounded-xl bg-red-500/15 border border-red-500/20 text-red-400">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSignupSubmit} className="space-y-4">

                    {/* Name Input */}
                    <div className="space-y-1">
                        <label className="text-gray-400 text-xs font-medium">Full Name</label>
                        <Input
                            required
                            type="text"
                            placeholder="John Doe"
                            variant="bordered"
                            // 🛠️ HeroUI-এর জাভাস্ক্রিপ্ট অবজেক্ট ক্লাস কনফিগারেশন (className এর জায়গায় className)
                            className={{
                                inputWrapper: "border-white/10 hover:border-white/20 focus-within:!border-[#7C3AED] bg-transparent",
                                input: "text-white"
                            }}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1">
                        <label className="text-gray-400 text-xs font-medium">Email Address</label>
                        <Input
                            required
                            type="email"
                            placeholder="john@example.com"
                            variant="bordered"
                            className={{
                                inputWrapper: "border-white/10 hover:border-white/20 focus-within:!border-[#7C3AED] bg-transparent",
                                input: "text-white"
                            }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1">
                        <label className="text-gray-400 text-xs font-medium">Password</label>
                        <Input
                            required
                            type="password"
                            placeholder="••••••••"
                            variant="bordered"
                            className={{
                                inputWrapper: "border-white/10 hover:border-white/20 focus-within:!border-[#7C3AED] bg-transparent",
                                input: "text-white"
                            }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Image URL Input (Optional) */}
                    <div className="space-y-1">
                        <label className="text-gray-400 text-xs font-medium">Image URL (Optional)</label>
                        <Input
                            type="url"
                            placeholder="https://example.com/photo.jpg"
                            variant="bordered"
                            className={{
                                inputWrapper: "border-white/10 hover:border-white/20 focus-within:!border-[#7C3AED] bg-transparent",
                                input: "text-white"
                            }}
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        />
                    </div>

                    {/* Role Radio Selector — পিউর জাভাস্ক্রিপ্ট নিয়ন্ত্রিত রেডিও বাটন */}
                    <div className="space-y-2 pt-1">
                        <label className="text-gray-400 text-xs font-medium block">Signup As</label>
                        <div className="flex gap-6 text-sm text-white">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="radio"
                                    name="role"
                                    value="user"
                                    checked={role === "user"}
                                    onChange={() => setRole("user")}
                                    className="accent-[#7C3AED] h-4 w-4"
                                />
                                Regular User
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="radio"
                                    name="role"
                                    value="creator"
                                    checked={role === "creator"}
                                    onChange={() => setRole("creator")}
                                    className="accent-[#7C3AED] h-4 w-4"
                                />
                                Prompt Creator
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="w-full bg-gradient-to-r from-[#7C3AED] to-[#38BDF8] text-white font-semibold rounded-xl py-6 mt-4 shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-transform active:scale-[0.99]"
                    >
                        Sign Up
                    </Button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-5">
                    Already have an account?{" "}
                    <Link href="/auth/signin" className="text-[#38BDF8] hover:underline font-medium">
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    );
}
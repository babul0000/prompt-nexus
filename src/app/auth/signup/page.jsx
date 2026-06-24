"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, User, Mail, Lock, Image as ImageIcon } from "lucide-react";

export default function SignUpPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");
    const [role, setRole] = useState("user"); 
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => setShowPassword(!showPassword);

    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setIsLoading(true);

        const userData = {
            name: name,
            email: email,
            password: password,
            image: image || "",
            role: role,
            plan: "free",
        };

        console.log("Submitting User Data to Better-Auth:", userData);

        try {
            const response = await authClient.signUp.email(userData);

            if (response?.error) {
                setErrorMessage(response.error.message || "Signup failed. Please try again.");
            } else {
                console.log("Signup Successful!", response);
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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#030014] text-zinc-900 dark:text-white px-4 py-28 relative transition-colors duration-300">
            {/* Background neon blur glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-[#7C3AED]/5 dark:bg-[#7C3AED]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/5 rounded-2xl p-8 shadow-sm dark:shadow-2xl z-10 transition-colors">
                <div className="text-center mb-6">
                    <h2 className="text-zinc-900 dark:text-white text-2xl font-bold tracking-tight">Create Account</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">Join PromptNexus Marketplace</p>
                </div>

                {errorMessage && (
                    <div className="mb-4 p-3 text-xs rounded-xl bg-red-500/15 border border-red-500/20 text-red-600 dark:text-red-400">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSignupSubmit} className="space-y-4">
                    {/* Name Input */}
                    <div className="space-y-1 text-left">
                        <label className="text-zinc-550 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider block">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                            <input
                                required
                                type="text"
                                placeholder="John Doe"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-transparent text-zinc-900 dark:text-white text-sm outline-none focus:border-[#7C3AED] dark:focus:border-[#7C3AED] transition-all placeholder-zinc-400 dark:placeholder-zinc-500"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1 text-left">
                        <label className="text-zinc-550 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider block">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                            <input
                                required
                                type="email"
                                placeholder="john@example.com"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-transparent text-zinc-900 dark:text-white text-sm outline-none focus:border-[#7C3AED] dark:focus:border-[#7C3AED] transition-all placeholder-zinc-400 dark:placeholder-zinc-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1 text-left">
                        <label className="text-zinc-550 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider block">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-transparent text-zinc-900 dark:text-white text-sm outline-none focus:border-[#7C3AED] dark:focus:border-[#7C3AED] transition-all placeholder-zinc-400 dark:placeholder-zinc-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button 
                                className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none cursor-pointer" 
                                type="button" 
                                onClick={toggleShowPassword}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                                ) : (
                                    <Eye className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Image URL Input (Optional) */}
                    <div className="space-y-1 text-left">
                        <label className="text-zinc-550 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider block">Image URL (Optional)</label>
                        <div className="relative">
                            <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                            <input
                                type="url"
                                placeholder="https://example.com/photo.jpg"
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-transparent text-zinc-900 dark:text-white text-sm outline-none focus:border-[#7C3AED] dark:focus:border-[#7C3AED] transition-all placeholder-zinc-400 dark:placeholder-zinc-500"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Role Radio Selector */}
                    <div className="space-y-2 pt-1 text-left">
                        <label className="text-zinc-550 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider block">Signup As</label>
                        <div className="flex gap-6 text-sm text-zinc-800 dark:text-white font-medium">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="radio"
                                    name="role"
                                    value="user"
                                    checked={role === "user"}
                                    onChange={() => setRole("user")}
                                    className="accent-[#7C3AED] h-4 w-4 cursor-pointer"
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
                                    className="accent-[#7C3AED] h-4 w-4 cursor-pointer"
                                />
                                Prompt Creator
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        isLoading={isLoading}
                        className="w-full bg-gradient-to-r from-[#7C3AED] to-[#38BDF8] text-white font-bold rounded-xl py-6 mt-4 shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-transform active:scale-[0.99] cursor-pointer"
                    >
                        Sign Up
                    </Button>
                </form>

                <p className="text-center text-xs text-zinc-550 dark:text-zinc-400 mt-5">
                    Already have an account?{" "}
                    <Link href="/auth/signin" className="text-[#38BDF8] hover:underline font-bold">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
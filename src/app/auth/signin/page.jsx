"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleSigninSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    const credentials = {
      email: email,
      password: password,
    };

    console.log("Attempting sign-in with credentials:", { email });

    try {
      const response = await authClient.signIn.email(credentials);

      if (response?.error) {
        setErrorMessage(response.error.message || "Invalid email or password.");
      } else {
        console.log("Signin Successful!", response);
        router.push("/");
      }
    } catch (error) {
      console.error("Signin unexpected error:", error);
      setErrorMessage("Something went wrong. Please check your backend server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#030014] text-zinc-900 dark:text-white px-4 py-28 relative transition-colors duration-300">
      {/* Background neon blur glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-[#38BDF8]/5 dark:bg-[#38BDF8]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-white/5 rounded-2xl p-8 shadow-sm dark:shadow-2xl z-10 transition-colors">
        
        <div className="text-center mb-6">
          <h2 className="text-zinc-900 dark:text-white text-2xl font-bold tracking-tight">Welcome Back</h2>
          <p className="text-zinc-550 dark:text-zinc-400 text-xs mt-1">Sign in to your PromptNexus account</p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 text-xs rounded-xl bg-red-500/15 border border-red-500/20 text-red-655 dark:text-red-400">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSigninSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div className="space-y-1 text-left">
            <label className="text-zinc-550 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
              <input
                required
                type="email"
                placeholder="john@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-transparent text-zinc-900 dark:text-white text-sm outline-none focus:border-[#38BDF8] dark:focus:border-[#38BDF8] transition-all placeholder-zinc-400 dark:placeholder-zinc-500"
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
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-transparent text-zinc-900 dark:text-white text-sm outline-none focus:border-[#38BDF8] dark:focus:border-[#38BDF8] transition-all placeholder-zinc-400 dark:placeholder-zinc-500"
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

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full bg-gradient-to-r from-[#38BDF8] to-[#7C3AED] text-white font-bold rounded-xl py-6 mt-6 shadow-[0_0_15px_rgba(56,189,248,0.15)] transition-transform active:scale-[0.99] cursor-pointer"
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-xs text-zinc-550 dark:text-zinc-400 mt-5">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="text-[#7C3AED] hover:underline font-bold">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}
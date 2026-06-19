"use client";
import { authClient } from "@/lib/auth-client";
import { Button, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  
  // সাধারণ স্টেট দিয়ে ইনপুট ডাটা ট্র্যাক করা হচ্ছে
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
      // Better-Auth ক্লায়েন্ট মেথড দিয়ে লগইন রিকোয়েস্ট পাঠানো
      const response = await authClient.signIn.email(credentials);

      if (response?.error) {
        setErrorMessage(response.error.message || "Invalid email or password.");
      } else {
        console.log("Signin Successful!", response);
        // সফলভাবে লগইন হলে ইউজারকে হোমপেজে পাঠিয়ে দেওয়া হবে
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
    <div className="min-h-screen flex items-center justify-center bg-[#030014] px-4 py-12">
      {/* ব্যাকগ্রাউন্ড নিয়ন ইফেক্ট */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-[#38BDF8]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#09090b] border border-white/5 rounded-2xl p-8 shadow-2xl z-10">
        
        <div className="text-center mb-6">
          <h2 className="text-white text-2xl font-bold tracking-tight">Welcome Back</h2>
          <p className="text-gray-400 text-xs mt-1">Sign in to your PromptNexus account</p>
        </div>

        {/* এরর মেসেজ অ্যালার্ট শো করার জায়গা */}
        {errorMessage && (
          <div className="mb-4 p-3 text-xs rounded-xl bg-red-500/15 border border-red-500/20 text-red-400">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSigninSubmit} className="space-y-4">
          
          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-gray-400 text-xs font-medium">Email Address</label>
            <Input
              required
              type="email"
              placeholder="john@example.com"
              variant="bordered"
              // 🛠️ এখানে className এর পরিবর্তে হিরোইউআই স্ট্যান্ডার্ড className (শেষে s সহ) করা হয়েছে
              className={{ 
                inputWrapper: "border-white/10 hover:border-white/20 focus-within:!border-[#38BDF8] bg-transparent", 
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
              // 🛠️ এখানে className এর পরিবর্তে হিরোইউআই স্ট্যান্ডার্ড className (শেষে s সহ) করা হয়েছে
              className={{ 
                inputWrapper: "border-white/10 hover:border-white/20 focus-within:!border-[#38BDF8] bg-transparent", 
                input: "text-white" 
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full bg-gradient-to-r from-[#38BDF8] to-[#7C3AED] text-white font-semibold rounded-xl py-6 mt-6 shadow-[0_0_15px_rgba(56,189,248,0.15)] transition-transform active:scale-[0.99]"
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-5">
          Don t have an account?{" "}
          <Link href="/auth/signup" className="text-[#7C3AED] hover:underline font-medium">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}
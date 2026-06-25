"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from "@/lib/auth-client";
import { upgradeToPro } from "@/lib/actions/payment";
import { toast } from 'react-toastify';
import { CreditCard, Check, ShieldCheck, Sparkles, Gem, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function PaymentPage() {
    const router = useRouter();
    const { data: session, isPending: sessionPending } = authClient.useSession();
    const user = session?.user;

    useEffect(() => {
        document.title = "Upgrade to Pro | PromptForge";
    }, []);

    const [cardNumber, setCardNumber] = useState("");
    const [isUpgrading, setIsUpgrading] = useState(false);

    // If the user is already on the pro plan, redirect or show message?
    // We can allow them to test it, but it's good to inform them.
    const isAlreadyPro = user?.plan === "pro";

    const handleAutofill = (e) => {
        e.preventDefault();
        setCardNumber("4242 4242 4242 4242");
        toast.info("Test card number autofilled!", {
            position: "bottom-right",
            autoClose: 1500,
            theme: "dark"
        });
    };

    const handleCheckout = async (type = "live") => {
        if (!user) {
            toast.error("Please login to proceed with upgrading your plan.", { theme: "dark" });
            router.push("/auth/signin");
            return;
        }

        setIsUpgrading(true);
        try {
            if (type === "live") {
                toast.loading("Redirecting to Stripe Checkout...", {
                    toastId: "payment-toast",
                    theme: "dark"
                });

                // Request checkout session from backend
                const response = await fetch('/api/checkout_sessions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const data = await response.json();
                toast.dismiss("payment-toast");

                if (data.error) {
                    toast.error(data.error, { theme: "dark" });
                    setIsUpgrading(false);
                    return;
                }

                if (data.url) {
                    // Redirect browser to Stripe Checkout Page
                    window.location.href = data.url;
                } else {
                    toast.error("Failed to generate payment session.", { theme: "dark" });
                    setIsUpgrading(false);
                }
            } else {
                // Sandbox simulation
                toast.loading("Initializing Sandbox upgrade...", {
                    toastId: "payment-toast",
                    theme: "dark"
                });

                // Simulate network delay
                await new Promise((resolve) => setTimeout(resolve, 1500));

                const result = await upgradeToPro();
                toast.dismiss("payment-toast");

                if (result?.error) {
                    toast.error(result.error, { theme: "dark" });
                } else {
                    toast.success("Sandbox upgrade successful! plan: 'pro' 🎉", {
                        position: "top-center",
                        autoClose: 3000,
                        theme: "dark"
                    });
                    
                    setTimeout(() => {
                        window.location.href = "/dashboard/user";
                    }, 1000);
                }
            }
        } catch (error) {
            toast.dismiss("payment-toast");
            console.error("Payment checkout error:", error);
            toast.error("Upgrade checkout failed. Please try again.", { theme: "dark" });
        } finally {
            setIsUpgrading(false);
        }
    };

    if (sessionPending) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-[#030014] text-zinc-900 dark:text-white flex flex-col items-center justify-center transition-colors duration-300">
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                <p className="mt-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">Checking authorization...</p>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-[#030014] text-zinc-900 dark:text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300">
            {/* Glowing ambient background grids/circles */}
            <div className="absolute top-[5%] left-1/4 -translate-x-1/2 w-[500px] h-[300px] bg-purple-600/[0.03] dark:bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute top-[30%] right-1/4 translate-x-1/2 w-[600px] h-[350px] bg-blue-600/[0.03] dark:bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
            
            <div className="max-w-5xl mx-auto relative z-10 space-y-12">
                
                {/* Back button */}
                <div className="flex items-center">
                    <Link 
                        href="/all-prompts"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Catalog</span>
                    </Link>
                </div>

                {/* Header Section */}
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
                    <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 rounded-2xl shadow-[0_0_30px_rgba(124,58,237,0.15)] flex items-center justify-center">
                        <Gem className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
                        Upgrade Your Account
                    </h1>
                    <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 font-medium">
                        Unlock premium prompt engineering templates and advanced assets
                    </p>
                </div>

                {!user && (
                    <div className="max-w-md mx-auto bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 text-center space-y-3">
                        <p className="text-sm text-amber-600 dark:text-amber-400 font-semibold">
                            You are not logged in. You need an active account to purchase and configure Pro access.
                        </p>
                        <Link href="/auth/signin" className="inline-block px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-[#030014] font-bold text-xs rounded-xl transition-all">
                            Sign In / Register
                        </Link>
                    </div>
                )}

                {/* Two-Column Payment Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    
                    {/* Left Card: Plan description & details */}
                    <div className="bg-white dark:bg-[#090a16]/60 border border-zinc-200 dark:border-white/[0.06] rounded-3xl p-8 sm:p-10 flex flex-col justify-between backdrop-blur-md relative overflow-hidden group hover:border-purple-500/20 shadow-sm dark:shadow-none transition-all">
                        <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-purple-600/5 blur-[50px] rounded-full pointer-events-none" />
                        
                        <div>
                            {/* Lifetime Plan Badge */}
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-6">
                                Lifetime Plan
                            </span>

                            {/* Plan Title */}
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-4">
                                PromptForge Pro Access
                            </h2>

                            {/* Pricing Section */}
                            <div className="flex items-baseline gap-1 text-zinc-900 dark:text-white mb-8 border-b border-zinc-200/50 dark:border-white/5 pb-6">
                                <span className="text-2xl font-bold text-zinc-550 dark:text-zinc-400">$</span>
                                <span className="text-5xl font-black tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-650 dark:from-white dark:to-zinc-350 bg-clip-text text-transparent">5.00</span>
                                <span className="text-zinc-500 text-sm ml-2 font-medium">/ one-time</span>
                            </div>

                            {/* Bullet Features */}
                            <ul className="space-y-4 text-left">
                                {[
                                    "Unlock all locked Private/Premium prompts",
                                    "Unlimited copy-to-clipboard actions",
                                    "Engage with rating and feedback reviews",
                                    "Priority access to future AI engine configurations",
                                    "One-time payment, lifetime ownership"
                                ].map((feature, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300 font-medium">
                                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mt-0.5">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Security Footer Info */}
                        <div className="border-t border-zinc-200/50 dark:border-white/5 pt-6 mt-8">
                            <div className="flex items-center gap-2.5 text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                                <ShieldCheck className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
                                <span>Payments secured and encrypted via Stripe Gateway.</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Card: Card Checkout Details & Simulator */}
                    <div className="bg-white dark:bg-[#090a16]/60 border border-zinc-200 dark:border-white/[0.06] rounded-3xl p-8 sm:p-10 flex flex-col justify-between backdrop-blur-md hover:border-blue-500/20 shadow-sm dark:shadow-none transition-all space-y-6">
                        
                        <div className="space-y-6">
                            {/* Section Header */}
                            <div className="flex items-center gap-2.5 border-b border-zinc-200/50 dark:border-white/5 pb-4">
                                <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                <h3 className="text-base font-bold text-zinc-900 dark:text-white tracking-wide">
                                    Card Information
                                </h3>
                            </div>

                            {/* Card number Input form */}
                            <div className="space-y-2">
                                <div className="relative flex items-center bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-white/10 focus-within:border-purple-500 rounded-xl overflow-hidden transition-all px-4 py-3">
                                    <CreditCard className="w-5 h-5 text-zinc-450 dark:text-zinc-500 shrink-0 mr-3" />
                                    <input 
                                        type="text" 
                                        placeholder="Card number" 
                                        disabled={isUpgrading}
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                        className="w-full bg-transparent text-sm text-zinc-900 dark:text-white focus:outline-none placeholder-zinc-400 dark:placeholder-zinc-500 pr-24 font-mono tracking-wider"
                                    />
                                    <button 
                                        onClick={handleAutofill}
                                        disabled={isUpgrading}
                                        className="absolute right-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-all active:scale-[0.97] cursor-pointer"
                                    >
                                        Autofill &gt;
                                    </button>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <button
                                onClick={() => handleCheckout("live")}
                                disabled={isUpgrading || !user}
                                className="w-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#820AD1] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-[0_0_20px_rgba(124,58,237,0.25)] hover:shadow-[0_0_30px_rgba(124,58,237,0.4)] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {isUpgrading ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                                ) : (
                                    <span>Pay One-time $5.00</span>
                                )}
                            </button>
                        </div>

                        {/* Stripe Testing Assist Simulation Block */}
                        <div className="border border-dashed border-purple-500/20 bg-purple-50/50 dark:bg-[#7C3AED]/5 rounded-2xl p-5 text-center flex flex-col items-center gap-4 relative overflow-hidden">
                            <span className="text-[10px] font-black tracking-widest text-purple-600 dark:text-purple-400 uppercase">
                                Stripe Testing Assist
                            </span>
                            
                            <p className="text-[11px] sm:text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed max-w-sm">
                                No credit card configured? Or running locally without keys? Use our Sandbox simulation to instantly test upgraded views and dashboards.
                            </p>

                            <button
                                onClick={() => handleCheckout("simulate")}
                                disabled={isUpgrading || !user}
                                className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-sm py-3.5 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.25)] hover:shadow-[0_0_30px_rgba(34,211,238,0.45)] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {isUpgrading ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                                ) : (
                                    <span>Simulate $5 Test Checkout</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {isAlreadyPro && (
                    <div className="max-w-md mx-auto text-center">
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            Note: Your account is already upgraded to Pro.
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

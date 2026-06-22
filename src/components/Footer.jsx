"use client";

import Link from "next/link";
import { Button } from "@heroui/react";

const Footer = () => {
    return (
        <footer className="w-full bg-[#030014] text-gray-400 py-12 px-6 md:px-12 border-t border-white/5 mt-auto">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                
                {/* 🌌 Column 1: Brand & About (AIverse) */}
                <div className="space-y-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        {/* স্পার্ক/স্টার লোগো */}
                        <svg 
                            className="w-6 h-6 text-[#9333EA]" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
                        </svg>
                        <span className="text-white text-2xl font-bold tracking-tight">
                            AI<span className="text-[#38BDF8]">verse</span>
                        </span>
                    </Link>
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Discover, create, and share premium AI prompts for ChatGPT, Midjourney, Claude, and more. Elevate your AI productivity.
                    </p>
                </div>

                {/* 🔗 Column 2: Explore Links */}
                <div className="space-y-3">
                    <h4 className="text-white font-semibold text-base">Explore</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="/" className="hover:text-white transition-colors">Home</Link>
                        </li>
                        <li>
                            <Link href="/all-prompts" className="hover:text-white transition-colors">All Prompts</Link>
                        </li>
                        <li>
                            <Link href="/payment" className="hover:text-white transition-colors">Pricing Plans</Link>
                        </li>
                    </ul>
                </div>

                {/* 💼 Column 3: Legal / Resources */}
                <div className="space-y-3">
                    <h4 className="text-white font-semibold text-base">Legal</h4>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                        </li>
                        <li>
                            <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
                        </li>
                    </ul>
                </div>

                {/* ✉️ Column 4: Newsletter or Socials */}
                <div className="space-y-4">
                    <h4 className="text-white font-semibold text-base">Stay Connected</h4>
                    <p className="text-sm text-gray-500">
                        Join our community and get updates on the latest prompts.
                    </p>
                    
                    {/* 📱 Modern Social Icons (রিকোয়ারমেন্ট অনুযায়ী New X Logo সহ) */}
                    <div className="flex items-center gap-3">
                        {/* New X (Twitter) Logo */}
                        <Button isIconOnly size="sm" variant="light" className="text-gray-400 hover:text-white min-w-8 h-8 rounded-lg border border-white/5 bg-white/5">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </Button>
                        
                        {/* GitHub Icon */}
                        <Button isIconOnly size="sm" variant="light" className="text-gray-400 hover:text-white min-w-8 h-8 rounded-lg border border-white/5 bg-white/5">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                            </svg>
                        </Button>
                    </div>
                </div>

            </div>

            {/* 📝 Bottom Bar (Copyright) */}
            <div className="max-w-7xl mx-auto border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-600 gap-4">
                <p>© {new Date().getFullYear()} AIverse. All rights reserved.</p>
                <p>Designed for AI Creators & Professionals</p>
            </div>
        </footer>
    );
};

export default Footer;
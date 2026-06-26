"use client";

import React, { useState, useEffect } from "react";
import { 
  House, 
  Person, 
  Bookmark, 
  FileText, 
  CreditCard, 
  Plus,          
  CircleCheck,   
} from "@gravity-ui/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileCheck, AlertTriangle, BarChart3, Menu, X } from "lucide-react";
import UserProfileCard from "./UserProfileCard";

export function DashboardSidebar({ user }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const pathname = usePathname();

    // Close drawer when navigating to a new path (stores prev pathname for comparison)
    const [prevPathname, setPrevPathname] = useState(pathname);
    if (pathname !== prevPathname) {
        setPrevPathname(pathname);
        setIsDrawerOpen(false);
    }

    // Lock body scroll when mobile drawer is open
    useEffect(() => {
        if (isDrawerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isDrawerOpen]);

    // 1. Creator Dashboard Links
    const creatorNavLinks = [
        { icon: House, href: "/dashboard/creator", label: "Dashboard Home" },
        { icon: Plus, href: "/dashboard/creator/add-prompt", label: "Add Prompt" },
        { icon: FileText, href: "/dashboard/creator/my-prompts", label: "My Prompts" },
        { icon: BarChart3, href: "/dashboard/creator/analytics", label: "Analytics/Stats" },
        { icon: Person, href: "/dashboard/creator/profile", label: "Profile" },
    ];

    // 2. Regular User Dashboard Links
    const userNavLinks = [
        { icon: Plus, href: "/dashboard/user/add-prompt", label: "Add Prompt" },
        { icon: FileText, href: "/dashboard/user/my-prompts", label: "My Prompts" },
        { icon: Bookmark, href: "/dashboard/user/saved-prompts", label: "Saved Prompts" },
        { icon: CircleCheck, href: "/dashboard/user/my-reviews", label: "My Reviews" },
        { icon: Person, href: "/dashboard/user/profile", label: "Profile" },
    ];

    // 3. Admin Dashboard Links
    const adminNavLinks = [
        { label: "Dashboard Overview", href: "/dashboard/admin/overview", icon: LayoutDashboard },
        { label: "User Management", href: "/dashboard/admin/users", icon: Users },
        { label: "Prompt Moderation", href: "/dashboard/admin/prompts", icon: FileCheck },
        { label: "Subscription & Payments", href: "/dashboard/admin/payments", icon: CreditCard },
        { label: "Reported Content", href: "/dashboard/admin/reported", icon: AlertTriangle },
        { label: "System Analytics", href: "/dashboard/admin/analytics", icon: BarChart3 },
    ];

    // Role Mapping
    const navLinksMap = {
        user: userNavLinks,
        creator: creatorNavLinks,
        admin: adminNavLinks
    };

    const role = (user?.role || 'user').toLowerCase();
    const navItems = navLinksMap[role] || userNavLinks;

    const navContent = (
        <div className="flex flex-col justify-between h-full py-4 text-zinc-900 dark:text-white">
            <div className="space-y-8">
                {/* Branding Block */}
                <div className="px-3">
                    <Link href="/" className="group flex items-center gap-2.5">
                        <div className="p-1 bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#38BDF8] rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.25)]">
                            <span className="text-sm font-black text-white px-1">PF</span>
                        </div>
                        <div className="flex flex-col gap-0">
                            <span className="font-extrabold text-lg tracking-wide bg-gradient-to-r from-zinc-900 via-zinc-800 to-purple-650 dark:from-white dark:via-white dark:to-purple-400 bg-clip-text text-transparent">
                                PromptForge
                            </span>
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none">
                                {role} panel
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Nav Menu Items */}
                <nav className="flex flex-col gap-1.5">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.label}
                                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition-all border border-transparent group ${
                                    isActive
                                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
                                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-white/5'
                                }`}
                                href={item.href}
                            >
                                <item.icon className={`size-4 transition-colors ${
                                    isActive
                                        ? 'text-purple-600 dark:text-purple-400'
                                        : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white'
                                }`} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Actions and User Profile card */}
            <div className="space-y-4">
                <div className="border-t border-zinc-200 dark:border-white/5 my-2"></div>
                
                <Link
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7C3AED] hover:text-purple-400 transition-all hover:bg-zinc-200/50 dark:hover:bg-white/5 border border-transparent"
                    href="/"
                >
                    <House className="size-4" />
                    <span>Back to Home</span>
                </Link>

                {/* User card profile */}
                <UserProfileCard user={user} />
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop layout Sidebar */}
            <aside className="hidden w-64 shrink-0 border-r border-zinc-200 dark:border-white/5 p-5 lg:block bg-white/80 dark:bg-[#090a16]/60 backdrop-blur-md sticky top-0 h-screen transition-colors duration-300">
                {navContent}
            </aside>

            {/* Mobile layout Sidebar Menu Trigger Header */}
            <div className="lg:hidden w-full flex items-center justify-between p-4 bg-white/90 dark:bg-[#090a16]/80 border-b border-zinc-200 dark:border-b-white/5 sticky top-0 z-30 transition-colors duration-300 backdrop-blur-md">
                <Link href="/" className="group flex items-center gap-2">
                    <div className="p-1 bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#38BDF8] rounded-lg">
                        <span className="text-[10px] font-black text-white px-1">PF</span>
                    </div>
                    <span className="font-extrabold text-base tracking-wide text-zinc-900 dark:text-white">PromptForge</span>
                </Link>
                
                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="flex items-center gap-2 py-1.5 px-3 rounded-xl text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 transition-all cursor-pointer"
                >
                    <Menu className="w-4 h-4 text-purple-500" />
                    <span>Menu</span>
                </button>
            </div>

            {/* Mobile Sidebar Drawer Overlay */}
            <div 
                className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
                    isDrawerOpen 
                        ? 'opacity-100 pointer-events-auto' 
                        : 'opacity-0 pointer-events-none'
                }`}
            >
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setIsDrawerOpen(false)}
                />
                
                {/* Drawer Contents */}
                <div 
                    className={`absolute top-0 left-0 bottom-0 w-full max-w-xs bg-white dark:bg-[#030014]/95 border-r border-zinc-200 dark:border-white/10 p-5 flex flex-col gap-6 shadow-2xl transition-transform duration-350 ease-out ${
                        isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/5 pb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#38BDF8] rounded-lg">
                                <span className="text-[10px] font-black text-white px-1">PF</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-sm tracking-wide text-zinc-900 dark:text-white leading-none">
                                    Navigation
                                </span>
                                <span className="text-[9px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest leading-none mt-1">
                                    {role} panel
                                </span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsDrawerOpen(false)}
                            className="p-1.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Drawer Body Container */}
                    <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
                        {navContent}
                    </div>
                </div>
            </div>
        </>
    );
}
import { getUserSession } from "@/lib/core/session";
import { 
  LayoutSideContentLeft, 
  House, 
  Person, 
  Bookmark, 
  FileText, 
  CreditCard, 
  Persons,
  Plus,          
  CircleCheck,   
  Shield,
  ArrowRightToSquare
} from "@gravity-ui/icons";
import { Button, Drawer, Avatar } from "@heroui/react";
import Link from "next/link";
import React from "react";
import { LayoutDashboard, Users, FileCheck, AlertTriangle, BarChart3 } from "lucide-react";
import UserProfileCard from "./UserProfileCard";

export async function DashboardSidebar() {
    const user = await getUserSession();

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
    { 
        label: "Dashboard Overview", 
        href: "/dashboard/admin/overview", 
        icon: LayoutDashboard 
    },
    { 
        label: "User Management", 
        href: "/dashboard/admin/users", 
        icon: Users 
    },
    { 
        label: "Prompt Moderation", 
        href: "/dashboard/admin/prompts", 
        icon: FileCheck 
    },
    { 
        label: "Subscription & Payments", 
        href: "/dashboard/admin/payments", 
        icon: CreditCard 
    },
    { 
        label: "Reported Content", 
        href: "/dashboard/admin/reported", 
        icon: AlertTriangle 
    },
    { 
        label: "System Analytics", 
        href: "/dashboard/admin/analytics", 
        icon: BarChart3 
    },
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
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-400 transition-all hover:text-zinc-905 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-white/5 border border-transparent group"
                            href={item.href}
                        >
                            <item.icon className="size-4 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-850 dark:group-hover:text-white" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Bottom Actions and User Profile card */}
            <div className="space-y-4">
                <div className="border-t border-white/5 my-2"></div>
                
                <Link
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#7C3AED] hover:text-purple-400 transition-all hover:bg-white/5 border border-transparent"
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

            {/* Mobile layout Sidebar Menu Trigger */}
            <div className="lg:hidden w-full flex items-center justify-between p-4 bg-white/90 dark:bg-[#090a16]/80 border-b border-zinc-200 dark:border-b-white/5 absolute top-0 left-0 z-30 transition-colors duration-300">
                <Link href="/" className="font-extrabold tracking-wide text-zinc-900 dark:text-white">PromptForge</Link>
                <Drawer>
                    <Button className="bg-white/5 border border-white/10 text-white flex items-center gap-2 py-1 px-3 rounded-lg text-xs font-bold cursor-pointer" variant="secondary">
                        <LayoutSideContentLeft className="w-4 h-4" />
                        <span>Menu</span>
                    </Button>
                    <Drawer.Backdrop>
                        <Drawer.Content placement="left" className="bg-white dark:bg-[#030014] border-r border-zinc-200 dark:border-white/10 p-5 w-64">
                            <Drawer.Dialog>
                                <Drawer.CloseTrigger className="absolute top-4 right-4 text-zinc-400 hover:text-white" />
                                <Drawer.Header className="pb-4">
                                    <Drawer.Heading className="text-white text-base font-extrabold">Navigation</Drawer.Heading>
                                </Drawer.Header>
                                <Drawer.Body className="h-full">
                                    {navContent}
                                </Drawer.Body>
                            </Drawer.Dialog>
                        </Drawer.Content>
                    </Drawer.Backdrop>
                </Drawer>
            </div>
        </>
    );
}
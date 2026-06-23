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
        <div className="flex flex-col justify-between h-full py-4 text-white">
            <div className="space-y-8">
                {/* Branding Block */}
                <div className="px-3">
                    <Link href="/" className="group flex items-center gap-2.5">
                        <div className="p-1 bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#38BDF8] rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.25)]">
                            <span className="text-sm font-black text-white px-1">PF</span>
                        </div>
                        <div className="flex flex-col gap-0">
                            <span className="font-extrabold text-lg tracking-wide bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent">
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
                            className="flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-zinc-400 transition-all hover:text-white hover:bg-white/5 border border-transparent"
                            href={item.href}
                        >
                            <item.icon className="size-4 text-zinc-500 group-hover:text-white" />
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
                {user && (
                    <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-3">
                        <div className="p-[1.5px] bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#38BDF8] rounded-full">
                            <Avatar size="sm" className="bg-transparent border-0">
                                <Avatar.Image src={user.image} alt={user.name} />
                                <Avatar.Fallback className="bg-zinc-950 text-white font-bold text-xs">
                                    {user.name?.charAt(0).toUpperCase() || 'U'}
                                </Avatar.Fallback>
                            </Avatar>
                        </div>
                        <div className="flex flex-col gap-0.5 overflow-hidden">
                            <p className="text-xs font-bold truncate leading-tight text-white">
                                {user.name}
                            </p>
                            <p className="text-[10px] text-zinc-500 truncate leading-none">
                                {user.email}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop layout Sidebar */}
            <aside className="hidden w-64 shrink-0 border-r border-white/5 p-5 lg:block bg-[#090a16]/60 backdrop-blur-md sticky top-0 h-screen">
                {navContent}
            </aside>

            {/* Mobile layout Sidebar Menu Trigger */}
            <div className="lg:hidden w-full flex items-center justify-between p-4 bg-[#090a16]/80 border-b border-white/5 absolute top-0 left-0 z-30">
                <Link href="/" className="font-extrabold tracking-wide text-white">PromptForge</Link>
                <Drawer>
                    <Button className="bg-white/5 border border-white/10 text-white flex items-center gap-2 py-1 px-3 rounded-lg text-xs font-bold cursor-pointer" variant="secondary">
                        <LayoutSideContentLeft className="w-4 h-4" />
                        <span>Menu</span>
                    </Button>
                    <Drawer.Backdrop>
                        <Drawer.Content placement="left" className="bg-[#030014] border-r border-white/10 p-5 w-64">
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
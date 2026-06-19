import { getUserSession } from "@/lib/core/session";
import { 
  LayoutSideContentLeft, 
  Bell, 
  Briefcase, 
  Envelope, 
  Gear, 
  House, 
  Magnifier, 
  Person, 
  Bookmark, 
  FileText, 
  CreditCard, 
  Persons,
  Plus,          // Add Prompt-এর জন্য
  CircleCheck,   // Reviews বা Approved-এর জন্য
  Shield         // ShieldDanger এর বদলে এটি ব্যবহার করো (Reported Prompts-এর জন্য)
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import Link from "next/link";

export async function DashboardSidebar() {

    const user = await getUserSession();

    // ১. Creator Dashboard Links (রিকোয়ারমেন্ট অনুযায়ী)
    const creatorNavLinks = [
        { icon: House, href: "/dashboard/creator", label: "Dashboard Home" },
        { icon: Plus, href: "/dashboard/creator/add-prompt", label: "Add Prompt" },
        { icon: FileText, href: "/dashboard/creator/my-prompts", label: "My Prompts" },
        { icon: Person, href: "/profile", label: "Profile" },
    ];

    // ২. Regular User Dashboard Links (রিকোয়ারমেন্ট অনুযায়ী)
    const userNavLinks = [
        { icon: Plus, href: "/dashboard/user/add-prompt", label: "Add Prompt" },
        { icon: FileText, href: "/dashboard/user/my-prompts", label: "My Prompts" },
        { icon: Bookmark, href: "/dashboard/user/saved-prompts", label: "Saved Prompts" },
        { icon: CircleCheck, href: "/dashboard/user/my-reviews", label: "My Reviews" },
        { icon: Person, href: "/profile", label: "Profile" },
    ];

    // ৩. Admin Dashboard Links (রিকোয়ারমেন্ট অনুযায়ী)
    // ৩. Admin Dashboard Links
const adminNavLinks = [
    { icon: House, href: "/dashboard/admin/analytics", label: "Analytics" },
    { icon: Persons, href: "/dashboard/admin/users", label: "All Users" },
    { icon: FileText, href: "/dashboard/admin/prompts", label: "All Prompts" },
    { icon: CreditCard, href: "/dashboard/admin/payments", label: "All Payments" },
    { icon: Shield, href: "/dashboard/admin/reported", label: "Reported Prompts" }, // এখানে Shield বসালাম
];

    // রোল ম্যাপিং (Default: user বা রিকোয়ারমেন্ট শিট অনুযায়ী 'user')
    const navLinksMap = {
        user: userNavLinks,
        creator: creatorNavLinks,
        admin: adminNavLinks
    };

    // ইউজারের রোলের ওপর ভিত্তি করে মেনু আইটেম সিলেক্ট করা হচ্ছে (ডিফল্ট: user)
    const navItems = navLinksMap[user?.role || 'user'];

    const navContent = (
        <nav className="flex flex-col gap-1">
            {/* সাইডবার হেডার / ব্র্যান্ডিং */}
            <div className="mb-4 px-3 py-2">
                <h2 className="text-xl font-bold text-primary">PromptForge</h2>
                <p className="text-xs text-muted capitalize">{user?.role || 'user'} Panel</p>
            </div>

            {navItems.map((item) => (
                <Link
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-default"
                    href={item.href}
                >
                    <item.icon className="size-5 text-muted" />
                    {item.label}
                </Link>
            ))}

            <div className="border-t border-default my-4"></div>
            <Link
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-primary transition-colors hover:bg-default font-semibold"
                href="/"
            >
                <House className="size-5" />
                Back to Home
            </Link>
        </nav>
    );

    return (
        <>
            <aside className="hidden w-64 shrink-0 border-r border-default p-4 lg:block bg-background">
                {navContent}
            </aside>
            <Drawer>
                <Button className="lg:hidden m-4" variant="secondary">
                    <LayoutSideContentLeft />
                    Menu
                </Button>
                <Drawer.Backdrop>
                    <Drawer.Content placement="left">
                        <Drawer.Dialog>
                            <Drawer.CloseTrigger />
                            <Drawer.Header>
                                <Drawer.Heading>Navigation</Drawer.Heading>
                            </Drawer.Header>
                            <Drawer.Body>
                                {navContent}
                            </Drawer.Body>
                        </Drawer.Dialog>
                    </Drawer.Content>
                </Drawer.Backdrop>
            </Drawer>
        </>
    );
}
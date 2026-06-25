import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export const metadata = {
  title: "Dashboard",
  description: "Manage your prompts, view stats, and configure your profile on the PromptForge dashboard.",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-[#030014] text-zinc-900 dark:text-white transition-colors duration-300">
      {/* বামপাশের রেসপনসিভ সাইডবার */}
      <DashboardSidebar />

      {/* ডানপাশের ডাইনামিক কনটেন্ট এরিয়া */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-base-200">
      {/* বামপাশের রেসপনসিভ সাইডবার */}
      <DashboardSidebar />

      {/* ডানপাশের ডাইনামিক কনটেন্ট এরিয়া */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
import "./globals.css";
import ThemeInitializer from "@/components/ThemeInitializer";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  metadataBase: new URL(process.env.BETTER_AUTH_URL || "http://localhost:3000"),
  title: {
    default: "PromptForge | Premium AI Prompt Marketplace",
    template: "%s | PromptForge",
  },
  description: "Discover, buy, and sell premium AI prompts for ChatGPT, Midjourney, Stable Diffusion, and other leading AI platforms. Forging ideas, crafting reality.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "PromptForge | Premium AI Prompt Marketplace",
    description: "Discover, buy, and sell premium AI prompts for ChatGPT, Midjourney, Stable Diffusion, and other leading AI platforms.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <ThemeInitializer />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-zinc-950 dark:bg-[#030014] dark:text-white" suppressHydrationWarning>
        <Navbar/>
        {children}
        <ToastContainer />
        <Footer/>
        </body>
    </html>
  );
}

"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, Button, Dropdown, Label } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

// Gravity UI Icons Import
import { LayoutTabs, Person, ArrowRightToSquare, Bars, Xmark } from "@gravity-ui/icons";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState("dark");

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const pathname = usePathname();

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Toggle dark/light theme
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  
  // Hide navbar on dashboard views
  if (pathname.includes("dashboard")) {
    return null;
  }

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <div className="sticky top-0 z-50 w-full">
      <nav className="w-full border-b border-zinc-200/50 dark:border-white/[0.06] bg-white/80 dark:bg-[#030014]/75 backdrop-blur-md transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* LEFT SIDE: LOGO & BRAND NAME */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white flex items-center justify-center p-1.5 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200/50 dark:border-white/5 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <Xmark size={20} /> : <Bars size={20} />}
            </button>
            
            <Link href={"/"} className="group flex items-center gap-3">
              <div className="relative p-[1.5px] bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#38BDF8] rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.25)] group-hover:scale-105 transition-transform duration-300">
                <Image
                  height={32}
                  width={32}
                  loading="eager"
                  src="/logo.webp"
                  alt="PromptForge Logo"
                  className="rounded-[10px]"
                />
              </div>
              <p className="font-extrabold text-xl tracking-wide bg-gradient-to-r from-zinc-900 via-zinc-800 to-purple-600 dark:from-white dark:via-white dark:to-purple-400 bg-clip-text text-transparent transition-all duration-300">
                PromptForge
              </p>
            </Link>
          </div>

          {/* MIDDLE: PUBLIC NAVIGATION LINKS */}
          <ul className="hidden items-center gap-3 md:flex">
            <li>
              <Link
                href="/"
                className={`relative px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-lg hover:text-purple-600 dark:hover:text-white ${
                  pathname === "/" 
                    ? "text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 shadow-[0_0_15px_rgba(124,58,237,0.15)]" 
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 border border-transparent"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/all-prompts"
                className={`relative px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-lg hover:text-purple-600 dark:hover:text-white ${
                  pathname === "/all-prompts" 
                    ? "text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 shadow-[0_0_15px_rgba(124,58,237,0.15)]" 
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-white/5 border border-transparent"
                }`}
              >
                All Prompts
              </Link>
            </li>
          </ul>

          {/* RIGHT SIDE: AUTHENTICATION & THEME TOGGLE */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Switch */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white hover:bg-zinc-200/50 dark:hover:bg-white/10 transition-all cursor-pointer flex items-center justify-center"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Desktop Auth section */}
            <div className="hidden md:flex items-center gap-3">
              {!user ? (
                <div className="flex items-center gap-4">
                  <Link href="/auth/signin" className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white transition-colors">
                    Login
                  </Link>
                  <Link href="/auth/signup">
                    <button className="bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#820AD1] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-[0_4px_12px_rgba(124,58,237,0.25)] hover:shadow-[0_4px_20px_rgba(124,58,237,0.45)] cursor-pointer border border-purple-500/20">
                      Register
                    </button>
                  </Link>
                </div>
              ) : (
                <Dropdown>
                  <Dropdown.Trigger className="rounded-full cursor-pointer">
                    <div className="p-[2.5px] bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#38BDF8] rounded-full transition-transform hover:scale-105 duration-300 shadow-[0_0_12px_rgba(124,58,237,0.3)]">
                      <Avatar size="sm" aria-label="User Menu" className="border-0 bg-transparent">
                        <Avatar.Image
                          referrerPolicy="no-referrer"
                          alt={user?.name || "User Profile"}
                          src={user?.image}
                        />
                        <Avatar.Fallback className="bg-zinc-200 dark:bg-zinc-900 text-zinc-800 dark:text-white font-bold">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </Avatar.Fallback>
                      </Avatar>
                    </div>
                  </Dropdown.Trigger>
                  
                  <Dropdown.Popover className="bg-white dark:bg-[#090a16]/95 border border-zinc-200 dark:border-white/10 rounded-2xl p-1.5 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
                    <div className="px-4 py-3.5 border-b border-zinc-100 dark:border-white/5 min-w-[220px]">
                      <div className="flex items-center gap-3">
                        <div className="p-[1.5px] bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#38BDF8] rounded-full">
                          <Avatar size="sm" className="bg-transparent border-0">
                            <Avatar.Image alt={user?.name} src={user?.image} />
                            <Avatar.Fallback className="bg-zinc-200 dark:bg-zinc-900 text-zinc-800 dark:text-white font-bold">
                              {user?.name?.charAt(0).toUpperCase() || "U"}
                            </Avatar.Fallback>
                          </Avatar>
                        </div>
                        <div className="flex flex-col gap-0.5 overflow-hidden">
                          <p className="text-sm font-extrabold truncate leading-tight text-zinc-900 dark:text-white">
                            {user?.name}
                          </p>
                          <p className="text-[11px] text-zinc-500 truncate leading-none">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Dropdown.Menu aria-label="User Actions" className="p-1.5 flex flex-col gap-1">
                      {/* Role Based Dynamic Dashboard Route */}
                      <Dropdown.Item id="dashboard" textValue="Dashboard" className="rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
                        <Link
                          className="flex items-center gap-2.5 w-full h-full text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-white px-2 py-1.5 text-xs font-semibold"
                          href={`/dashboard/${user?.role || "user"}`}
                        >
                          <LayoutTabs size={16} className="text-[#7C3AED]" />
                          <span>Dashboard</span>
                        </Link>
                      </Dropdown.Item>

                      <Dropdown.Item id="profile" textValue="Profile" className="rounded-xl hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors">
                        <Link className="flex items-center gap-2.5 w-full h-full text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-white px-2 py-1.5 text-xs font-semibold" href={user ? `/dashboard/${user.role?.toLowerCase() || 'user'}/profile` : "/profile"}>
                          <Person size={16} className="text-[#7C3AED]" />
                          <span>Profile</span>
                        </Link>
                      </Dropdown.Item>

                      <Dropdown.Item
                        id="logout"
                        textValue="Logout"
                        variant="danger"
                        className="text-danger rounded-xl hover:bg-rose-500/10 transition-colors"
                        onClick={handleSignOut}
                      >
                        <div className="flex items-center gap-2.5 w-full px-2 py-1.5 text-xs font-semibold text-rose-500 hover:text-rose-400">
                          <ArrowRightToSquare size={16} className="text-rose-500" />
                          <span>Logout</span>
                        </div>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              )}
            </div>
          </div>
        </header>

        {/* MOBILE RESPONSIVE MENU */}
        {isMenuOpen && (
          <div className="border-t border-zinc-200/50 dark:border-white/5 bg-white/95 dark:bg-[#030014]/90 backdrop-blur-xl md:hidden">
            <ul className="flex flex-col gap-2.5 p-5 text-zinc-800 dark:text-white">
              <li>
                <Link
                  href="/"
                  className={`block py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                    pathname === "/" 
                      ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20" 
                      : "text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/all-prompts"
                  className={`block py-2.5 px-4 rounded-xl text-sm font-semibold transition-all ${
                    pathname === "/all-prompts" 
                      ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20" 
                      : "text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Prompts
                </Link>
              </li>
              
              <li className="mt-2 flex flex-col gap-2.5 border-t border-zinc-200/50 dark:border-white/5 pt-4">
                {!user ? (
                  <>
                    <Link
                      href="/auth/signin"
                      className="block py-2.5 text-center text-sm font-semibold text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white py-2.5 rounded-xl text-sm font-bold shadow-[0_4px_12px_rgba(124,58,237,0.25)] border border-purple-500/10">
                        Register
                      </button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={`/dashboard/${user?.role || "user"}`}
                      className="flex items-center gap-3 py-2.5 px-4 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutTabs size={16} className="text-[#7C3AED]" /> 
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href={user ? `/dashboard/${user.role?.toLowerCase() || 'user'}/profile` : "/profile"}
                      className="flex items-center gap-3 py-2.5 px-4 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/5 rounded-xl"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Person size={16} className="text-[#7C3AED]" /> 
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-3 py-2.5 px-4 text-sm font-semibold text-rose-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl text-left w-full cursor-pointer"
                    >
                      <ArrowRightToSquare size={16} className="text-rose-500" /> 
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
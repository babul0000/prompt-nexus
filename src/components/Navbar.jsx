"use client";

import { authClient } from "@/lib/auth-client";
import { Avatar, Button, Dropdown, Label } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

// Gravity UI Icons Import (LayoutDashboard বদলে LayoutTabs করা হয়েছে)
import { LayoutTabs, Person, ArrowRightToSquare, Bars, Xmark } from "@gravity-ui/icons";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const pathname = usePathname();
  
  // ড্যাশবোর্ড পেজগুলোতে মেইন নেভবার হাইড রাখার জন্য লজিক
  if (pathname.includes("dashboard")) {
    return null;
  }

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  return (
    <div>
      <nav className="sticky top-0 z-40 w-full border-b border-separator bg-background/70 backdrop-blur-lg">
        <header className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          
          {/* LEFT SIDE: LOGO & BRAND NAME */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-white flex items-center justify-center"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <Xmark size={24} /> : <Bars size={24} />}
            </button>
            
            <Link href={"/"}>
              <div className="flex items-center gap-3">
                <Image
                  height={40}
                  width={40}
                  loading="eager"
                  src="/logo.webp"
                  alt="PromptForge Logo"
                />
                <p className="font-bold text-xl tracking-tight text-white">PromptForge</p>
              </div>
            </Link>
          </div>

          {/* MIDDLE: PUBLIC NAVIGATION LINKS */}
          <ul className="hidden items-center gap-6 md:flex">
            <li>
              <Link
                href="/"
                className={`font-medium transition-colors hover:text-accent ${
                  pathname === "/" ? "text-accent" : "text-muted-foreground"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/all-prompts"
                className={`font-medium transition-colors hover:text-accent ${
                  pathname === "/all-prompts" ? "text-accent" : "text-muted-foreground"
                }`}
              >
                All Prompts
              </Link>
            </li>
          </ul>

          {/* RIGHT SIDE: CONDITIONAL AUTHENTICATION */}
          {/* Case 1: User NOT Logged In */}
          {!user && (
            <div className="hidden items-center gap-4 md:flex">
              <Link href="/auth/signin" className="font-medium hover:text-accent text-white">
                Login
              </Link>
              <Link href="/auth/signup">
                <Button color="primary" variant="solid">
                  Register
                </Button>
              </Link>
            </div>
          )}

          {/* Case 2: User IS Logged In (Dropdown UI) */}
          {user && (
            <div className="hidden items-center gap-4 md:flex">
              <Dropdown>
                <Dropdown.Trigger className="rounded-full cursor-pointer">
                  <Avatar size="sm" aria-label="User Menu">
                    <Avatar.Image
                      referrerPolicy="no-referrer"
                      alt={user?.name || "User Profile"}
                      src={user?.image}
                    />
                    <Avatar.Fallback>
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </Avatar.Fallback>
                  </Avatar>
                </Dropdown.Trigger>
                
                <Dropdown.Popover>
                  <div className="px-3 pt-3 pb-2 border-b border-separator min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <Avatar.Image alt={user?.name} src={user?.image} />
                        <Avatar.Fallback>
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </Avatar.Fallback>
                      </Avatar>
                      <div className="flex flex-col gap-0 overflow-hidden">
                        <p className="text-sm font-semibold truncate leading-5 text-white">
                          {user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Dropdown.Menu aria-label="User Actions">
                    {/* Role Based Dynamic Dashboard Route */}
                    <Dropdown.Item id="dashboard" textValue="Dashboard">
                      <Link
                        className="flex items-center gap-2 w-full h-full text-white"
                        href={`/dashboard/${user?.role || "user"}`}
                      >
                        <LayoutTabs size={16} />
                        <Label className="cursor-pointer">Dashboard</Label>
                      </Link>
                    </Dropdown.Item>

                    <Dropdown.Item id="profile" textValue="Profile">
                      <Link className="flex items-center gap-2 w-full h-full text-white" href="/profile">
                        <Person size={16} />
                        <Label className="cursor-pointer">Profile</Label>
                      </Link>
                    </Dropdown.Item>

                    <Dropdown.Item
                      id="logout"
                      textValue="Logout"
                      variant="danger"
                      className="text-danger"
                      onClick={handleSignOut}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <ArrowRightToSquare size={16} className="text-danger" />
                        <Label className="cursor-pointer text-danger">Logout</Label>
                      </div>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            </div>
          )}
        </header>

        {/* MOBILE RESPONSIVE MENU */}
        {isMenuOpen && (
          <div className="border-t border-separator bg-background/70 backdrop-blur-lg md:hidden">
            <ul className="flex flex-col gap-2 p-4 text-white">
              <li>
                <Link
                  href="/"
                  className="block py-2 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/all-prompts"
                  className="block py-2 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  All Prompts
                </Link>
              </li>
              
              <li className="mt-2 flex flex-col gap-2 border-t border-separator pt-4">
                {!user ? (
                  <>
                    <Link
                      href="/auth/aignin"
                      className="block py-2 text-center font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)}>
                      <Button color="primary" className="w-full">
                        Register
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href={`/dashboard/${user?.role || "user"}`}
                      className="flex items-center gap-2 py-2 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutTabs size={16} /> Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 py-2 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Person size={16} /> Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 py-2 font-medium text-danger text-left"
                    >
                      <ArrowRightToSquare size={16} /> Logout
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
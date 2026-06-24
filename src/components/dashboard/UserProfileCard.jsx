"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from '@heroui/react';
import { X, User, Mail, Shield, ShieldCheck, UserCheck, Calendar, ArrowRight, LogOut } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

const UserProfileCard = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!user) return null;

    const getRoleBadge = (role = 'user') => {
        const r = role.toLowerCase();
        if (r === 'admin') {
            return {
                text: "Administrator",
                icon: <Shield className="w-3.5 h-3.5" />,
                style: "bg-red-500/10 text-red-400 border border-red-500/20"
            };
        }
        if (r === 'creator') {
            return {
                text: "Creator Architect",
                icon: <ShieldCheck className="w-3.5 h-3.5" />,
                style: "bg-purple-500/10 text-purple-400 border border-purple-500/20"
            };
        }
        return {
            text: "Standard Member",
            icon: <UserCheck className="w-3.5 h-3.5" />,
            style: "bg-blue-500/10 text-blue-400 border border-blue-500/20"
        };
    };

    const roleBadge = getRoleBadge(user.role);

    // Dynamic profile link based on user role
    const getProfileLink = () => {
        const r = (user.role || 'user').toLowerCase();
        return `/dashboard/${r}/profile`;
    };

    const handleSignOut = async () => {
        await authClient.signOut();
        window.location.href = '/';
    };

    return (
        <>
            {/* Clickable Profile Card */}
            <div 
                onClick={() => setIsOpen(true)}
                className="p-3.5 bg-white/[0.02] border border-white/5 hover:border-purple-500/30 rounded-2xl flex items-center gap-3 cursor-pointer transition-all duration-300 hover:bg-white/5 hover:shadow-[0_0_20px_rgba(124,58,237,0.05)] select-none group"
            >
                <div className="p-[1.5px] bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#38BDF8] rounded-full group-hover:scale-105 transition-transform duration-300">
                    <Avatar size="sm" className="bg-transparent border-0">
                        <Avatar.Image src={user.image} alt={user.name} />
                        <Avatar.Fallback className="bg-zinc-950 text-white font-bold text-xs">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                        </Avatar.Fallback>
                    </Avatar>
                </div>
                <div className="flex flex-col gap-0.5 overflow-hidden text-left flex-grow">
                    <p className="text-xs font-bold truncate leading-tight text-white group-hover:text-purple-400 transition-colors">
                        {user.name}
                    </p>
                    <p className="text-[10px] text-zinc-550 truncate leading-none">
                        {user.email}
                    </p>
                </div>
            </div>

            {/* Profile Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div 
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
                        onClick={() => setIsOpen(false)}
                    >
                        {/* Modal Dialog */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                            className="bg-white dark:bg-[#090a16]/95 border border-zinc-200 dark:border-white/10 rounded-2.5xl p-6 sm:p-8 w-full max-w-sm overflow-hidden relative shadow-[0_0_50px_rgba(124,58,237,0.15)] flex flex-col items-center text-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Glow Backdrops */}
                            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-48 h-48 bg-purple-600/10 blur-[60px] rounded-full pointer-events-none -z-10" />

                            {/* Close Button */}
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-850 dark:hover:text-white transition-all cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Large Glowing Avatar */}
                            <div className="relative mb-5 mt-2">
                                <div className="p-[2.5px] bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#38BDF8] rounded-full shadow-[0_0_25px_rgba(124,58,237,0.3)]">
                                    <div className="w-20 h-20 bg-zinc-950 rounded-full overflow-hidden flex items-center justify-center">
                                        {user.image ? (
                                            <img 
                                                src={user.image} 
                                                alt={user.name} 
                                                className="w-full h-full object-cover" 
                                            />
                                        ) : (
                                            <span className="text-2xl font-black text-white">
                                                {user.name.charAt(0).toUpperCase()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Profile Info text */}
                            <div className="space-y-1.5 mb-6">
                                <h3 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">
                                    {user.name}
                                </h3>
                                <div className="flex items-center justify-center gap-1.5 text-zinc-500 dark:text-zinc-400 text-xs">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span className="font-medium truncate max-w-[200px]">{user.email}</span>
                                </div>
                            </div>

                            {/* Details List */}
                            <div className="w-full space-y-3.5 mb-6">
                                {/* Role Card */}
                                <div className="flex items-center justify-between p-3 bg-zinc-100 dark:bg-white/5 border border-zinc-200/50 dark:border-white/5 rounded-xl text-left">
                                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Access Tier</span>
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${roleBadge.style}`}>
                                        {roleBadge.icon}
                                        <span>{roleBadge.text}</span>
                                    </div>
                                </div>

                                {/* Join Date */}
                                {user.createdAt && (
                                    <div className="flex items-center justify-between p-3 bg-zinc-100 dark:bg-white/5 border border-zinc-200/50 dark:border-white/5 rounded-xl text-left">
                                        <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider">Registered</span>
                                        <div className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 text-xs font-bold">
                                            <Calendar className="w-3.5 h-3.5 text-purple-400" />
                                            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions Group */}
                            <div className="w-full flex flex-col gap-3">
                                <Link href={getProfileLink()} className="w-full" onClick={() => setIsOpen(false)}>
                                    <button className="w-full bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#820AD1] text-white py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_4px_12px_rgba(124,58,237,0.2)] hover:shadow-[0_4px_20px_rgba(124,58,237,0.4)] cursor-pointer">
                                        <User className="w-4 h-4" />
                                        <span>Manage Profile</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>

                                <button 
                                    onClick={handleSignOut}
                                    className="w-full bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-500 dark:text-rose-400 py-3 px-4 rounded-xl flex items-center justify-center gap-2 font-bold text-xs tracking-wider uppercase transition-all duration-300 cursor-pointer"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout Account</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default UserProfileCard;

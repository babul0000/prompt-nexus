"use client";

import React, { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import { TrendingUp, BarChart3, LineChart } from "lucide-react";

export function CreatorAnalytics({ prompts = [] }) {
    // 1. Process copies data (Top prompts by copy count)
    const copiesData = useMemo(() => {
        if (!prompts || prompts.length === 0) return [];
        return [...prompts]
            .map((p) => ({
                name: p.title.length > 20 ? p.title.slice(0, 20) + "..." : p.title,
                fullName: p.title,
                copies: parseInt(p.copyCount) || 0,
            }))
            .sort((a, b) => b.copies - a.copies)
            .slice(0, 8); // Display top 8 prompts
    }, [prompts]);

    // 2. Process growth data (Cumulative prompts created over time)
    const growthData = useMemo(() => {
        if (!prompts || prompts.length === 0) return [];
        
        // Sort by creation date ascending
        const sorted = [...prompts].sort(
            (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
        );

        // Group by date (e.g. "Jun 21")
        const dailyCounts = {};
        sorted.forEach((p) => {
            const date = new Date(p.createdAt || new Date());
            const formattedDate = date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
            dailyCounts[formattedDate] = (dailyCounts[formattedDate] || 0) + 1;
        });

        // Accumulate counts
        let cumulative = 0;
        return Object.keys(dailyCounts).map((date) => {
            cumulative += dailyCounts[date];
            return {
                date,
                count: cumulative,
            };
        });
    }, [prompts]);

    if (!prompts || prompts.length === 0) {
        return (
            <div className="bg-[#090a16]/40 border border-white/[0.06] rounded-2xl p-8 text-center backdrop-blur-md">
                <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="p-4 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl">
                        <TrendingUp className="w-6 h-6 animate-pulse" />
                    </div>
                    <h3 className="text-base font-semibold text-white">Analytics Pending</h3>
                    <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                        Add prompt templates and build your audience to view copy count distributions and creation speed charts.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Total Copies */}
            <div className="bg-[#090a16]/50 border border-white/[0.06] p-6 rounded-2xl flex flex-col gap-4 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[200px] h-[100px] bg-purple-600/5 blur-[50px] rounded-full pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-purple-400" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Total Copies Distribution
                        </h3>
                    </div>
                    <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20 font-bold uppercase tracking-wider">
                        Top Prompts
                    </span>
                </div>

                <div className="h-[280px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={copiesData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="copiesGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.8} />
                                    <stop offset="100%" stopColor="#C084FC" stopOpacity={0.1} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke="#ffffff" strokeOpacity={0.03} vertical={false} />
                            <XAxis 
                                dataKey="name" 
                                stroke="#71717a" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            <YAxis 
                                stroke="#71717a" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false} 
                                allowDecimals={false}
                            />
                            <Tooltip 
                                cursor={{ fill: 'rgba(255, 255, 255, 0.03)' }}
                                contentStyle={{
                                    backgroundColor: '#0a0d26',
                                    borderColor: '#1e293b',
                                    borderRadius: '12px',
                                    color: '#ffffff',
                                    fontSize: '11px',
                                    fontWeight: 'bold'
                                }}
                                labelStyle={{ color: '#94a3b8', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                            />
                            <Bar dataKey="copies" fill="url(#copiesGrad)" stroke="#7C3AED" strokeWidth={1} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Chart 2: Prompt Growth */}
            <div className="bg-[#090a16]/50 border border-white/[0.06] p-6 rounded-2xl flex flex-col gap-4 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[200px] h-[100px] bg-blue-600/5 blur-[50px] rounded-full pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                        <LineChart className="w-4 h-4 text-blue-400" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                            Prompt Growth Trend
                        </h3>
                    </div>
                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 font-bold uppercase tracking-wider">
                        Cumulative
                    </span>
                </div>

                <div className="h-[280px] w-full mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke="#ffffff" strokeOpacity={0.03} vertical={false} />
                            <XAxis 
                                dataKey="date" 
                                stroke="#71717a" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            <YAxis 
                                stroke="#71717a" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false} 
                                allowDecimals={false}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: '#0a0d26',
                                    borderColor: '#1e293b',
                                    borderRadius: '12px',
                                    color: '#ffffff',
                                    fontSize: '11px',
                                    fontWeight: 'bold'
                                }}
                                labelStyle={{ color: '#94a3b8', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="count" 
                                stroke="#3B82F6" 
                                strokeWidth={2} 
                                fillOpacity={1} 
                                fill="url(#growthGrad)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

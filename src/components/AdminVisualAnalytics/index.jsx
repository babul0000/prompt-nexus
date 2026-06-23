"use client";

import React from "react";
import { TrendingUp, PieChart as PieIcon } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ["#7C3AED", "#3B82F6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#8B5CF6"];

export default function AdminVisualAnalytics({ charts }) {
  const userGrowth = charts?.userGrowth || [];
  const categories = charts?.categories || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* User Growth Line Chart */}
      <div className="bg-[#0a0d26] border border-[#13193e] p-6 rounded-2xl flex flex-col gap-4 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[200px] h-[100px] bg-purple-500/5 blur-[50px] rounded-full pointer-events-none" />
        <div className="flex items-center gap-2 border-b border-white/5 pb-4 text-left">
          <TrendingUp className="w-4.5 h-4.5 text-purple-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">User Growth Trend</h3>
        </div>
        <div className="h-[250px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={userGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="userGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#ffffff" strokeOpacity={0.03} vertical={false} />
              <XAxis dataKey="date" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
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
              <Area type="monotone" dataKey="Users" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#userGrowthGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Prompt Categories Pie Chart */}
      <div className="bg-[#0a0d26] border border-[#13193e] p-6 rounded-2xl flex flex-col gap-4 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[200px] h-[100px] bg-blue-500/5 blur-[50px] rounded-full pointer-events-none" />
        <div className="flex items-center gap-2 border-b border-white/5 pb-4 text-left">
          <PieIcon className="w-4.5 h-4.5 text-blue-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Prompt Categories</h3>
        </div>
        
        {categories.length === 0 ? (
          <div className="h-[250px] flex items-center justify-center text-xs text-zinc-500">
            No prompt categories registered.
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 h-[250px]">
            <div className="h-[180px] w-[180px] relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0a0d26',
                      borderColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex-1 flex flex-col gap-2 max-h-[180px] overflow-y-auto w-full px-2 scrollbar-thin scrollbar-thumb-zinc-800">
              {categories.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-[11px] border-b border-white/5 pb-1 text-left">
                  <div className="flex items-center gap-1.5 truncate">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-zinc-300 font-medium truncate max-w-[120px]">{entry.name}</span>
                  </div>
                  <span className="font-bold text-white shrink-0">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

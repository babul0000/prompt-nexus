"use client";

import React from "react";
import { TrendingUp, BarChart2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

const COLORS = ["#7C3AED", "#3B82F6", "#06B6D4", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#8B5CF6"];

export default function AdminAnalyticsCharts({ charts }) {
  const userGrowth = charts?.userGrowth || [];
  const categories = charts?.categories || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 30-Day User Growth Area Chart */}
      <div className="bg-[#0a0d26] border border-[#13193e] p-6 rounded-2xl flex flex-col gap-4 shadow-lg relative overflow-hidden lg:col-span-2">
        <div className="absolute top-0 right-0 w-[200px] h-[100px] bg-purple-500/5 blur-[50px] rounded-full pointer-events-none" />
        <div className="flex items-center gap-2 border-b border-white/5 pb-4 text-left">
          <TrendingUp className="w-4.5 h-4.5 text-purple-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">30-Day User Growth</h3>
        </div>
        <div className="h-[300px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={userGrowth} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="analyticsUserGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#ffffff" strokeOpacity={0.03} vertical={false} />
              <XAxis dataKey="date" stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} allowDecimals={false} />
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
              <Area type="monotone" dataKey="Users" stroke="#8B5CF6" strokeWidth={2} fillOpacity={1} fill="url(#analyticsUserGrowthGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Prompt Categories Bar Chart */}
      <div className="bg-[#0a0d26] border border-[#13193e] p-6 rounded-2xl flex flex-col gap-4 shadow-lg relative overflow-hidden lg:col-span-1">
        <div className="absolute top-0 right-0 w-[200px] h-[100px] bg-blue-500/5 blur-[50px] rounded-full pointer-events-none" />
        <div className="flex items-center gap-2 border-b border-white/5 pb-4 text-left">
          <BarChart2 className="w-4.5 h-4.5 text-blue-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Category Distribution</h3>
        </div>

        {categories.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-xs text-zinc-500">
            No category distribution data.
          </div>
        ) : (
          <div className="h-[300px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categories}
                layout="vertical"
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid stroke="#ffffff" strokeOpacity={0.03} horizontal={false} />
                <XAxis type="number" stroke="#71717a" fontSize={9} tickLine={false} axisLine={false} allowDecimals={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#71717a"
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  width={80}
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
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  UserCog, 
  Search, 
  ShieldAlert 
} from "lucide-react";
import { Button, Input, Table, Badge, Avatar } from "@heroui/react";

// Mock User Data
const initialUsers = [
  { id: "1", name: "Admin User", email: "admin@gmail.com", role: "admin", status: "active", joined: "2026-01-10", image: "" },
  { id: "2", name: "Creator Jane", email: "creator@gmail.com", role: "creator", status: "active", joined: "2026-02-15", image: "" },
  { id: "3", name: "Regular Joe", email: "joe@gmail.com", role: "user", status: "active", joined: "2026-03-01", image: "" },
  { id: "4", name: "Suspect User", email: "spammy@gmail.com", role: "user", status: "suspended", joined: "2026-05-12", image: "" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleUserStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === "active" ? "suspended" : "active" };
      }
      return u;
    }));
  };

  const changeUserRole = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextRole = u.role === "user" ? "creator" : u.role === "creator" ? "admin" : "user";
        return { ...u, role: nextRole };
      }
      return u;
    }));
  };

  return (
    <div className="space-y-8 p-6 text-white min-h-screen bg-[#030014]">
      {/* Header section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-white/10 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Manage roles, view user profiles, and toggle account states.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Total Users</p>
            <h3 className="text-2xl font-black mt-1 text-white">{users.length}</h3>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Active Accounts</p>
            <h3 className="text-2xl font-black mt-1 text-emerald-400">
              {users.filter(u => u.status === "active").length}
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Suspended</p>
            <h3 className="text-2xl font-black mt-1 text-rose-500">
              {users.filter(u => u.status === "suspended").length}
            </h3>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
            <UserMinus className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Admins / Creators</p>
            <h3 className="text-2xl font-black mt-1 text-purple-400">
              {users.filter(u => u.role === "admin" || u.role === "creator").length}
            </h3>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
            <UserCog className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control row */}
      <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full bg-zinc-950/60 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table block */}
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.01]">
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">User</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Role</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Status</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Joined</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.01] transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar size="sm" className="bg-purple-900 text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <div>
                      <div className="text-sm font-bold text-white">{user.name}</div>
                      <div className="text-xs text-zinc-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Badge 
                    className="capitalize text-[10px] font-extrabold px-2 py-0.5" 
                    color={user.role === "admin" ? "danger" : user.role === "creator" ? "secondary" : "default"}
                    variant="flat"
                  >
                    {user.role}
                  </Badge>
                </td>
                <td className="p-4">
                  <Badge 
                    className="capitalize text-[10px] font-extrabold px-2 py-0.5" 
                    color={user.status === "active" ? "success" : "warning"}
                    variant="flat"
                  >
                    {user.status}
                  </Badge>
                </td>
                <td className="p-4 text-xs text-zinc-400">{user.joined}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="flat" 
                      color="secondary"
                      className="text-xs font-bold cursor-pointer rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400"
                      onClick={() => changeUserRole(user.id)}
                    >
                      Cycle Role
                    </Button>
                    <Button 
                      size="sm" 
                      variant="flat" 
                      color={user.status === "active" ? "warning" : "success"}
                      className={`text-xs font-bold cursor-pointer rounded-xl ${
                        user.status === "active" 
                          ? "bg-rose-500/10 hover:bg-rose-500/20 text-rose-400" 
                          : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                      }`}
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      {user.status === "active" ? "Suspend" : "Activate"}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-zinc-500 text-sm">
                  No users found matching filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

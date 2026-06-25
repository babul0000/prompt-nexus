"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  UserCheck, 
  UserMinus, 
  UserCog, 
  Search, 
  ShieldAlert 
} from "lucide-react";
import { Button, Chip, Avatar } from "@heroui/react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("user");

  // Fetch Users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        } else {
          console.error("Failed to load user list");
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(search.toLowerCase()) || 
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Reset page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        const errData = await res.json();
        console.error("Failed to delete user:", errData.error);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };


  const toggleUserStatus = async (id) => {
    const userToUpdate = users.find(u => u.id === id);
    if (!userToUpdate) return;
    const currentStatus = (userToUpdate.status || "active").toLowerCase();
    const nextStatus = currentStatus === "active" ? "suspended" : "active";

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: nextStatus })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, status: nextStatus } : u));
      } else {
        console.error("Failed to update user status");
      }
    } catch (err) {
      console.error("Error updating user status:", err);
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setNewRole((user.role || "user").toLowerCase());
    setIsEditModalOpen(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedUser.id, role: newRole })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u));
        setIsEditModalOpen(false);
        setSelectedUser(null);
      } else {
        console.error("Failed to update user role");
      }
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-900 dark:text-white bg-transparent">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 text-zinc-900 dark:text-white min-h-screen bg-transparent relative">
      {/* Header section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-zinc-200 dark:border-white/10 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-950 via-zinc-900 to-purple-600 dark:from-white dark:via-white dark:to-purple-400 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-zinc-550 dark:text-zinc-400 text-sm mt-1">
            Manage roles, view user profiles, and toggle account states.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 p-4 rounded-2xl flex items-center justify-between shadow-sm dark:shadow-none">
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Total Users</p>
            <h3 className="text-2xl font-black mt-1 text-zinc-900 dark:text-white">{users.length}</h3>
          </div>
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 p-4 rounded-2xl flex items-center justify-between shadow-sm dark:shadow-none">
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Active Accounts</p>
            <h3 className="text-2xl font-black mt-1 text-emerald-605 dark:text-emerald-400">
              {users.filter(u => (u.status || "active").toLowerCase() === "active").length}
            </h3>
          </div>
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 p-4 rounded-2xl flex items-center justify-between shadow-sm dark:shadow-none">
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Suspended</p>
            <h3 className="text-2xl font-black mt-1 text-rose-600 dark:text-rose-500">
              {users.filter(u => (u.status || "").toLowerCase() === "suspended").length}
            </h3>
          </div>
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
            <UserMinus className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 p-4 rounded-2xl flex items-center justify-between shadow-sm dark:shadow-none">
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Admins / Creators</p>
            <h3 className="text-2xl font-black mt-1 text-purple-650 dark:text-purple-400">
              {users.filter(u => {
                const r = (u.role || "").toLowerCase();
                return r === "admin" || r === "creator";
              }).length}
            </h3>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
            <UserCog className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control row */}
      <div className="flex items-center gap-4 bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 p-4 rounded-2xl shadow-sm dark:shadow-none">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table block */}
      <div className="bg-white dark:bg-white/[0.02] border border-zinc-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-2xl">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-white/[0.01]">
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-400">User</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-400">Role</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-400">Status</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-400">Joined</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-550 dark:text-zinc-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-white/[0.01] transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar src={user.image || null} size="sm" className="bg-purple-900 text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <div>
                      <div className="text-sm font-bold text-zinc-900 dark:text-white">{user.name}</div>
                      <div className="text-xs text-zinc-550 dark:text-zinc-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <Chip 
                    className="capitalize text-[10px] font-extrabold px-2.5 py-1" 
                    color={user.role === "admin" ? "danger" : user.role === "creator" ? "secondary" : "default"}
                    variant="flat"
                  >
                    {user.role}
                  </Chip>
                </td>
                <td className="p-4">
                  <Chip 
                    className="capitalize text-[10px] font-extrabold px-2.5 py-1" 
                    color={user.status === "active" ? "success" : "warning"}
                    variant="flat"
                  >
                    {user.status}
                  </Chip>
                </td>
                <td className="p-4 text-xs text-zinc-500 dark:text-zinc-400">{user.joined}</td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="flat" 
                      color="secondary"
                      className="text-xs font-bold cursor-pointer rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 animate-none"
                      onClick={() => openEditModal(user)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="flat" 
                      color={user.status === "active" ? "warning" : "success"}
                      className={`text-xs font-bold cursor-pointer rounded-xl ${
                        user.status === "active" 
                          ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400" 
                          : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      }`}
                      onClick={() => toggleUserStatus(user.id)}
                    >
                      {user.status === "active" ? "Suspend" : "Activate"}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="flat" 
                      color="danger"
                      className="text-xs font-bold cursor-pointer rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-450 animate-none"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 py-4 border-t border-zinc-200 dark:border-white/5 select-none">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-650 dark:text-slate-300 hover:bg-zinc-100 dark:hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all cursor-pointer"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-xl text-xs font-bold flex items-center justify-center border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white border-transparent'
                      : 'bg-white dark:bg-white/5 border-zinc-200 dark:border-white/10 text-zinc-650 dark:text-slate-350 hover:bg-zinc-100 dark:hover:bg-white/15'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-650 dark:text-slate-300 hover:bg-zinc-100 dark:hover:bg-white/15 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all cursor-pointer"
            >
              Next
            </button>
          </div>
        )}

      </div>

      {/* Edit Role Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] rounded-2xl p-6 shadow-2xl relative space-y-4 text-zinc-900 dark:text-white">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Edit User Role</h3>
            <p className="text-xs text-zinc-550 dark:text-zinc-400">
              Assign a new system permission level to <span className="text-purple-600 dark:text-purple-400 font-semibold">{selectedUser.name}</span> ({selectedUser.email}).
            </p>
            
            <div className="space-y-2">
              <label className="text-xs text-zinc-500 font-bold uppercase tracking-wider block">Select Role</label>
              <select
                className="w-full bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-white/10 rounded-xl p-3 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500 transition-colors"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="user" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">User</option>
                <option value="creator" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">Creator</option>
                <option value="admin" className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white">Admin</option>
              </select>
            </div>
            
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-white/5">
              <Button
                size="sm"
                variant="flat"
                className="rounded-xl font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="rounded-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-650 text-white shadow-lg"
                onClick={handleSaveRole}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

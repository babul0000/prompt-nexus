"use client";

import { useSession, authClient } from "@/lib/auth-client";
import { getMyPrompts } from "@/lib/api/prompt";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Mail, FileText, CheckCircle2, Gem, Lock, X } from "lucide-react";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfilePage() {
  const { data: session, isPending: sessionPending } = useSession();
  const user = session?.user;

  const [promptsCount, setPromptsCount] = useState(0);
  const [loadingPrompts, setLoadingPrompts] = useState(true);

  // User plan check (lowercase e convert kore check kora safe)
  const isPro = user?.plan?.toLowerCase() === "pro";

  // Modal and Edit Profile states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (user) {
      setNameInput(user.name || "");
      setImagePreview(user.image || "");
      setSelectedFile(null);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      const fetchCounts = async () => {
        try {
          const data = await getMyPrompts(user.id);
          setPromptsCount(data ? data.length : 0);
        } catch (err) {
          console.error("Failed to load prompts count:", err);
        } finally {
          setLoadingPrompts(false);
        }
      };
      fetchCounts();
    }
  }, [user]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImageToImgbb = async (file) => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      throw new Error("ImgBB API Key is not configured in .env file.");
    }
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) {
      throw new Error("Failed to upload image to ImgBB");
    }
    const data = await res.json();
    return data.data.url;
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      toast.error("Name cannot be empty!");
      return;
    }
    setSaving(true);
    try {
      let imageUrl = user.image || "";
      if (selectedFile) {
        toast.info("Uploading profile picture to ImgBB...", { autoClose: 1500 });
        imageUrl = await uploadImageToImgbb(selectedFile);
      }

      const { data, error } = await authClient.user.update({
        name: nameInput,
        image: imageUrl,
      });

      if (error) {
        throw new Error(error.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      setIsModalOpen(false);
      
      // Force reload session data
      window.location.reload();
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err.message || "An error occurred while updating profile");
    } finally {
      setSaving(false);
    }
  };

  if (sessionPending) return <div className="p-20 text-center text-white">Loading...</div>;
  if (!user) return <div className="p-20 text-center text-white">Please sign in.</div>;

  const avatarFallback = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="relative min-h-screen bg-transparent text-zinc-900 dark:text-white pt-6 pb-20 px-4 sm:px-6 transition-colors duration-300">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-8">

        {/* Profile Card */}
        <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] rounded-2xl p-8 shadow-sm dark:shadow-none">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className={`relative w-24 h-24 rounded-full overflow-hidden border-2 ${isPro ? "border-yellow-500" : "border-purple-500"} shrink-0`}>
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-zinc-800 flex items-center justify-center font-bold text-2xl">{avatarFallback}</div>
              )}
            </div>

            <div className="text-center sm:text-left space-y-2 flex-1 w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{user.name}</h2>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-1.5 text-xs font-bold text-gray-500 bg-purple-650 hover:bg-purple-500 hover:text-white rounded-lg transition duration-200 cursor-pointer shadow-md inline-flex items-center gap-1.5 self-center sm:self-auto"
                >
                  Edit Profile
                </button>
              </div>
              <p className="text-sm text-zinc-550 dark:text-zinc-400 flex items-center gap-2 justify-center sm:justify-start"><Mail size={14} /> {user.email}</p>
              <div className="flex gap-2 justify-center sm:justify-start">
                <span className="bg-purple-500/10 dark:bg-purple-900 px-2 py-0.5 rounded text-[10px] uppercase text-purple-600 dark:text-purple-300 font-bold border border-purple-500/20">Role: {user.role}</span>
                <span className="bg-amber-700 px-2 py-0.5 rounded text-[10px] uppercase">Plan: {user.plan || "FREE"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] p-6 rounded-2xl shadow-sm dark:shadow-none text-zinc-900 dark:text-white">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
              <FileText size={14} /> Prompts Published
            </div>
            <div className="text-3xl font-black text-zinc-900 dark:text-white">{loadingPrompts ? "..." : promptsCount}</div>
          </div>
          <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] p-6 rounded-2xl shadow-sm dark:shadow-none text-zinc-900 dark:text-white">
            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 size={14} /> Account Status
            </div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Verified Member</div>
          </div>
        </div>

        {/* Upgrade Banner - Blur if Pro */}
        <div className={`border border-dashed border-zinc-300 dark:border-[#1e2554] bg-white dark:bg-[#090a16]/30 rounded-2xl p-8 flex items-center justify-between shadow-sm dark:shadow-none transition-all duration-300 ${isPro ? "blur-[2px] opacity-70 pointer-events-none grayscale" : ""}`}>
          <div>
            <h4 className="font-bold flex items-center gap-2 text-zinc-900 dark:text-white"><Gem className="text-cyan-600 dark:text-cyan-500" /> Upgrade to Pro Lifetime</h4>
            <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1">Unlock all private templates for $5 only.</p>
          </div>
          <Link href="/payment" className={isPro ? "pointer-events-none" : ""}>
            <button
              disabled={isPro}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-black text-xs font-bold px-6 py-3 rounded-xl disabled:opacity-50 cursor-pointer"
            >
              Upgrade Now ($5)
            </button>
          </Link>
        </div>

        {/* Edit Profile Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white dark:bg-[#0a0d26] border border-zinc-200 dark:border-[#13193e] rounded-2xl w-full max-w-md relative p-6 sm:p-8 space-y-6 text-left shadow-2xl text-zinc-900 dark:text-white">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-white/5 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Edit Profile Details</h3>
                  <p className="text-xs text-zinc-550 dark:text-zinc-400">Update your name and profile picture.</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 bg-zinc-100 dark:bg-white/5 hover:bg-zinc-250 dark:hover:bg-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 tracking-wider uppercase block">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full p-3 rounded-lg border border-zinc-200 dark:border-[#13183d] bg-zinc-50 dark:bg-[#040614] text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-purple-500/50"
                    required
                  />
                </div>

                <div className="space-y-3.5 flex flex-col items-center">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-purple-500/30 bg-[#040614] flex items-center justify-center shadow-lg">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-zinc-500">{avatarFallback}</span>
                    )}
                  </div>
                  <label className="cursor-pointer text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-xl">
                    Choose Profile Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition duration-200 cursor-pointer disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition duration-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </motion.div>
      <ToastContainer position="top-center" hideProgressBar newestOnTop />
    </div>
  );
}
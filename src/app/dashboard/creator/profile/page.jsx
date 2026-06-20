"use client";

import { useSession } from "@/lib/auth-client";
import { Card, Avatar, Button, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  if (!user) return <p className="p-10 text-center">Loading...</p>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto p-6"
    >
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <Card className="p-8 shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Profile Avatar */}
           <Avatar className="h-11 w-11 border border-white/10">
                                    <Avatar.Image
                                        alt={user?.name}
                                        src={
                                            user?.image ||
                                            "https://img.heroui.chat/image/avatar?w=400&h=400&u=3"
                                        }
                                    />

                                    <Avatar.Fallback>
                                        {user?.name?.slice(0, 2).toUpperCase()}
                                    </Avatar.Fallback>
                                </Avatar>

          {/* User Details */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>

            <div className="flex gap-4">
              <Chip color="secondary" variant="flat">Role: {user.role}</Chip>
              <Chip color={user.plan === "premium" ? "warning" : "default"} variant="flat">
                Plan: {user.plan || "Free"}
              </Chip>
            </div>

            {/* Upgrade Button */}
            {user.plan !== "premium" && (
              <Button 
                color="warning" 
                onClick={() => router.push("/payment")}
              >
                Upgrade to Premium
              </Button>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 border-t pt-8">
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500">Total Prompts</p>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500">Total Copies</p>
            <p className="text-2xl font-bold">0</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <p className="text-sm text-gray-500">Bookmarks</p>
            <p className="text-2xl font-bold">0</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
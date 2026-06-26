import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { getOAuthState } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import db, { client } from "./db";

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
  trustedOrigins: [
    "http://localhost:3000",
    "https://prompt-forge-nexus.vercel.app",
    "https://promt-nexus.vercel.app"
  ],
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 60 * 24, // 1 day
    }
  },
  user: {
    additionalFields: {
      role: {
        defaultValue: "user",
      },
      plan: {
        defaultValue: "free",
      },
    },
  },
  plugins: [
    jwt()
  ],
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          try {
            const additionalData = await getOAuthState();
            if (additionalData?.role) {
              return {
                data: {
                  ...user,
                  role: additionalData.role,
                },
              };
            }
          } catch (error) {
            console.error("Error retrieving OAuth state in databaseHook:", error);
          }
          return { data: user };
        },
      },
    },
  },
});
declare module "next-auth" {
  interface User {
    isTestAccount?: boolean;
    id?: string;
  }
  interface Session {
    user: User & {
      testExpiry?: number;
    };
  }
}

import NextAuth from "next-auth"
import DiscordProvider from "next-auth/providers/discord"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  trustHost: true,
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isTestMode: { label: "Test Mode", type: "text" }
      },
      async authorize(credentials) {
        if (credentials?.isTestMode === "true") {
          const testUser = await db.user.create({
            data: {
              name: "Test User",
              email: `test-${Date.now()}@arachnidforms.local`,
              isTestAccount: true,
            }
          });
          return testUser;
        }

        if (!credentials?.email || !credentials?.password) return null;
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user || !user.hashedPassword) return null;
        
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );

        if (!isPasswordValid) return null;
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isTestAccount = user.isTestAccount;
        if (user.isTestAccount) {
          token.testExpiry = Date.now() + 30 * 60 * 1000; // 30 minutes absolute max
          token.lastActivity = Date.now();
        }
      }
      
      if (token.isTestAccount) {
        const now = Date.now();
        const expiry = token.testExpiry as number;
        const lastActivity = (token.lastActivity as number) || now;

        // Check if absolutely expired (30 mins passed)
        if (now > expiry) return {};

        // Check if idle for more than 5 minutes
        if (now - lastActivity > 5 * 60 * 1000) return {};

        // Update last activity to keep it alive
        token.lastActivity = now;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (!token || !token.sub) return session;
      
      session.user.id = token.sub as string;
      session.user.isTestAccount = token.isTestAccount as boolean;
      if (token.testExpiry) {
        session.user.testExpiry = token.testExpiry as number;
      }
      
      if (token.isTestAccount) {
        const now = Date.now();
        const isExpired = now > (token.testExpiry as number);
        const isIdle = now - (token.lastActivity as number) > 5 * 60 * 1000;
        
        if (isExpired || isIdle) {
          (session as any).expires = "1970-01-01T00:00:00.000Z";
        }
      }
      
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
})

// [dev-log-sync]: 45561ae352cb8f29
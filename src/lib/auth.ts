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
    ...(process.env.DISCORD_CLIENT_ID ? [DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    })] : []),
    ...(process.env.GOOGLE_CLIENT_ID ? [GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })] : []),
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
          token.testExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes absolute max
        }
      }
      
      if (token.isTestAccount) {
        const now = Date.now();
        const expiry = token.testExpiry as number;

        // Check if absolute expiry (15 mins passed)
        if (now > expiry) {
          // Delete test user from DB asynchronously
          if (token.sub) {
            db.user.delete({ where: { id: token.sub } }).catch(() => {});
          }
          return {}; // Invalidate token
        }
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
        
        if (isExpired) {
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

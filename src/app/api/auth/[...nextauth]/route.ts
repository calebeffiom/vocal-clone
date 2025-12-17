// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongoClientSetup";

// Define your configuration object with the NextAuthOptions type
export const authOptions: NextAuthOptions = {
  // 1. Configure the Adapter
  adapter: MongoDBAdapter(clientPromise),

  // 2. Configure the Google Provider
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID || "",
      clientSecret: process.env.CLIENT_SECRET || "",
    }),
  ],

  // 3. Customize Callbacks to get the MongoDB User ID
  callbacks: {
    async session({ session, user }) {
      // When using an adapter, 'user' will be passed and contains the MongoDB user ID
      if (user && session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },

  // Optional: Set a secret
  secret: process.env.NEXTAUTH_SECRET,
  
  // 4. Configure pages for App Router compatibility
  pages: {
    signIn: '/signup',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };



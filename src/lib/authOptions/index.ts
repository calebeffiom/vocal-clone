import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongoClientSetup";
import { connectToMongo } from "@/lib/mongoDB";
import User from "@/models/user-model";

export const authOptions: NextAuthOptions = {
    // 1. Configure the Adapter (still used for persisting users/accounts in MongoDB)
    adapter: MongoDBAdapter(clientPromise),

    // 2. Use JWT session strategy for reliable mobile support
    session: {
        strategy: "jwt",
    },
    
  // ✅ Add this
  cookies: {
    sessionToken: {
        name: `next-auth.session-token`,
        options: {
            httpOnly: true,
            sameSite: "lax",  // ✅ fixes mobile
            path: "/",
            secure: process.env.NODE_ENV === "production", // ✅ true in prod, false in dev
        }
    }
},
    // 3. Configure the Google Provider
    providers: [
        GoogleProvider({
            clientId: process.env.CLIENT_ID || "",
            clientSecret: process.env.CLIENT_SECRET || "",
            allowDangerousEmailAccountLinking: false,
        }),
    ],

    // 4. Customize Callbacks
    callbacks: {
        async redirect({ url, baseUrl }) {
            // Allow relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Allow callback URLs on the same origin
            try {
                if (new URL(url).origin === baseUrl) return url;
            } catch {
                // Invalid URL, fall through to default
            }
            return `${baseUrl}/latest-stories`;
        },

        async signIn() {
            // Keep sign-in callback side-effect free.
            return true;
        },

        async jwt({ token }) {
            // Always derive app user id from NextAuth subject.
            if (token.sub) token.userId = token.sub;
            return token;
        },

        async session({ session, token }) {
            // With JWT strategy, session data comes from the token
            if (token && session.user) {
                session.user.id = token.userId as string;
            }
            return session;
        },
    },

    events: {
        async createUser({ user }) {
            // Adapter creates the base user; add app-specific defaults after creation.
            try {
                await connectToMongo();
                await User.findByIdAndUpdate(user.id, {
                    $set: {
                        username: user.email
                            ? `${user.email.split("@")[0]}_${Date.now()}`
                            : `user_${Date.now()}`,
                        bio: "Nothing to see here yet",
                        coverPicture: "black",
                        favoriteTopics: [],
                        blogsWritten: [],
                        pinnedStories: [],
                        bookmarks: [],
                    },
                });
            } catch (error) {
                console.error("Error initializing new user defaults:", error);
            }
        },
    },

    // 5. Set a secret
    secret: process.env.NEXTAUTH_SECRET || "",

    // 6. Configure pages for App Router compatibility
    pages: {
        signIn: "/signup",
        newUser: "/select-topics",
    },
};

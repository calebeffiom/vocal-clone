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
            allowDangerousEmailAccountLinking: true,
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

        async signIn({ user, account }) {
            // Sync OAuth user with custom Users collection
            if (account?.provider === "google" && user.email) {
                try {
                    await connectToMongo();
                    let existingUser: any = await User.findOne({ email: user.email });

                    if (!existingUser) {
                        // Create new user in our custom Users collection
                        existingUser = await User.create({
                            name: user.name || "Anonymous",
                            email: user.email,
                            image: user.image || "/images/profile.png",
                            username: user.email.split("@")[0] + "_" + Date.now(),
                        });
                        // New user needs onboarding
                        return "/select-topics";
                    }

                    // Existing user without topics still needs onboarding
                    const hasTopics =
                        Array.isArray(existingUser.favoriteTopics) &&
                        existingUser.favoriteTopics.length > 0;
                    if (!hasTopics) return "/select-topics";
                } catch (error) {
                    console.error("Error syncing user to custom collection:", error);
                    // Don't block sign-in if sync fails
                }
            }
            // Existing user with topics — allow sign-in, redirect handled by callbackUrl
            return true;
        },

        async jwt({ token, user, account }) {
            // On initial sign-in, fetch custom user data and attach to token
            if (account && user) {
                try {
                    await connectToMongo();
                    const customUser = await User.findOne({ email: user.email });
                    if (customUser) {
                        token.userId = customUser._id.toString();
                    }
                } catch (error) {
                    console.error("Error in jwt callback:", error);
                }
            }
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

    // 5. Set a secret
    secret: process.env.NEXTAUTH_SECRET || "",

    // 6. Configure pages for App Router compatibility
    pages: {
        signIn: "/signup",
    },
};

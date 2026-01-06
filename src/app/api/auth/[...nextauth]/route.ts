import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/lib/mongoClientSetup";
import { connectToMongo } from "@/lib/mongoDB";
import User from "@/models/user-model";
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
    // 3. Customize Callbacks
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log("DEBUG: signIn callback", { email: user.email, provider: account?.provider });
            // Sync OAuth user with custom Users collection
            if (account?.provider === "google" && user.email) {
                try {
                    await connectToMongo();
                    // Check if user exists in our custom Users collection
                    const existingUser = await User.findOne({ email: user.email });
                    console.log("DEBUG: existingUser check", { exists: !!existingUser });
                    if (!existingUser) {
                        // Create new user in our custom Users collection
                        const newUser = await User.create({
                            name: user.name || "Anonymous",
                            email: user.email,
                            image: user.image || "/images/profile.png",
                            username: user.email.split("@")[0] + "_" + Date.now(), // Generate unique username
                        });
                        console.log("DEBUG: new user created in custom collection", { id: newUser._id });
                    }
                } catch (error) {
                    console.error("DEBUG: Error syncing user to custom collection:", error);
                    // Don't block sign-in if sync fails
                }
            }
            return true;
        },
        async session({ session, user }) {
            // When using an adapter, 'user' will be passed and contains the MongoDB user ID
            if (user && session.user) {
                session.user.id = user.id;
                // Optionally, also fetch the custom user data
                try {
                    await connectToMongo();
                    const customUser = await User.findOne({ email: session.user.email });
                    if (customUser) {
                        // You can add custom fields to session here if needed
                        // session.user.username = customUser.username;
                    }
                } catch (error) {
                    console.error("Error fetching custom user:", error);
                }
            }
            return session;
        },
    },
    // Optional: Set a secret
    secret: process.env.NEXTAUTH_SECRET || "",

    // 4. Configure pages for App Router compatibility
    pages: {
        signIn: '/signup',
    },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

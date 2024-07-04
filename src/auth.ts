import { FirestoreAdapter } from '@auth/firebase-adapter';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { GoogleProfile } from 'next-auth/providers/google';
import Google from 'next-auth/providers/google';

import { adminDb } from '@/firebase-admin';
import dbConnect from '@/lib/connectDB';
import User from '@/models/User';

export const { auth, handlers } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile: (_profile: GoogleProfile) => ({
        id: _profile.sub,
        name: _profile.name,
        firstName: _profile.given_name,
        lastName: _profile.family_name,
        email: _profile.email,
        image: _profile.picture,
        emailVerified: _profile.email_verified,
      }),
    }),
    Credentials({
      credentials: {
        username: { label: 'Username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.username });
        if (user && user.password === credentials.password) {
          return {
            id: user._id.toString(),
            sub: user._id.toString(),
            name: user.name,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            image: user.image,
            emailVerified: null,
          };
        }
        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
  },
  adapter: FirestoreAdapter(adminDb),
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          name: token.name,
          email: token.email as string,
          image: token.picture,
          emailVerified: token.emailVerified as Date | null,
        };
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});

import 'next-auth/jwt';

import { FirestoreAdapter } from '@auth/firebase-adapter';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { GoogleProfile } from 'next-auth/providers/google';
import Google from 'next-auth/providers/google';

import { adminDb } from '@/firebase-admin';
import dbConnect from '@/lib/connectDB';
import User from '@/models/User';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile: (_profile: GoogleProfile) => {
        return {
          id: _profile.sub,
          firstname: _profile.given_name,
          lastname: _profile.family_name,
          email: _profile.email,
          image: _profile.picture,
        };
      },
    }),
    Credentials({
      credentials: {
        username: { label: 'Username' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(
        credentials: Partial<Record<'username' | 'password', unknown>>,
      ) {
        await dbConnect();

        const user = await User.findOne({
          email: credentials.username as string,
        });

        if (user && user.password && user.password === credentials.password) {
          console.log(user);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
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
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.picture,
        };
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string;
      name: string;
      email: string;
      image: string;
    };
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    picture?: string;
    accessToken?: string;
  }
}

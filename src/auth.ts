import { AdapterUser } from '@auth/core/adapters';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import type { GoogleProfile } from 'next-auth/providers/google';
import Google from 'next-auth/providers/google';

import { adminDb } from '@/firebase-admin';
import dbConnect from '@/lib/connectDB';
import { User as UserModel } from '@/models';

export const { auth, signIn, signOut, handlers } = NextAuth({
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
        const user = await UserModel.findOne({ email: credentials.username });

        // Custom error not possible, see:
        // https://github.com/nextauthjs/next-auth/issues/6512#issuecomment-1404902257
        if (!user) {
          // throw new CredentialsSignin('Invalid credentials. User not found.');
          // return null;
          return null;
        } else {
          if (user.accountSource !== 'credentials') {
            // throw new CredentialsSignin(
            //   'This email is registered with another login method. Please use that method to sign in.',
            // );
            return null;
          }

          if (user.password !== credentials.password) return null;
          // throw new CredentialsSignin('Invalid credentials.');
        }

        return {
          id: user._id.toString(),
          sub: user._id.toString(),
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          image: user.image,
          emailVerified: null,
        } as AdapterUser;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.JWT_SECRET!,
  adapter: FirestoreAdapter(adminDb),
  callbacks: {
    async signIn() {
      // { user, account, profile, email, credentials }
      //console.log('signIn callback START-------', {
      //   user,
      //   account,
      //   profile,
      //   email,
      //   credentials,
      // });

      return true;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async jwt({
      token,
      user,
      account,
      // profile,
      trigger,
    }) {
      // console.log('jwt callback START ---------', {
      //   token,
      //   user,
      //   account,
      //   profile,
      //   trigger,
      // });

      if (user) {
        token.id = user.id as string;
        token.role = user.role || 'user'; // Add role to token if it exists
      }

      // Add the newly created user into MongoDB
      if (account?.provider !== 'credentials' && trigger === 'signUp') {
        await dbConnect();
        user.accountSource = account?.provider;
        const newUser = await UserModel.create(user);
        //  console.log('New user created:', newUser);
        token.id = newUser._id.toString(); // Update token with new user's ID
      }

      return token;
    },
    async session({ session, token }) {
      // console.log('session callback', { session, token });
      session.user.id = token.id as string;
      session.user.role = token.role; // Add role to session
      session.author = 'RICKYLTWONG'; // Example custom property
      // console.log('session callback', { session, token });
      return session;
    },
  },
  pages: {
    error: '/api/auth/signin',
  },
});

declare module '@auth/core/jwt' {
  interface JWT {
    id: string;
    role?: string;
  }
}

declare module '@auth/core' {
  interface AdapterUser {
    source?: string;
  }
}

declare module 'next-auth' {
  interface User {
    role?: string;
    accountSource?: string;
  }

  interface Session {
    user: {
      id: string;
      role?: string;
      image?: string;
      name?: string;
      email?: string;
    };
    author?: string;
  }
}

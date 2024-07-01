'use server';

import { signIn, signOut } from '@/auth';

export async function handleSignIn() {
  await signIn('google');
}

export async function handleSignOut() {
  console.log('SIGNING OUT......');
  await signOut();
}

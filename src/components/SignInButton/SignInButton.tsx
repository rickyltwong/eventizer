import { Button } from '@mantine/core';
import { signIn } from 'next-auth/react';

// import { handleSignIn } from '@/actions';

export default function SignInButton() {
  return (
    <Button
      variant="default"
      onClick={() =>
        signIn('email', {
          callbackUrl: `${window.location.origin}/admin`,
        })
      }
    >
      {' '}
      Log in{' '}
    </Button>
  );
}

// import { handleSignIn } from '@/actions';

// export default function SignInButton() {
//   return (
//     <form action={handleSignIn}>
//       <button type="submit">Sign in with Google</button>
//     </form>
//   );
// }

import { Button } from '@mantine/core';
import { signIn } from 'next-auth/react';

// import { handleSignIn } from '@/actions';

export default function SignInButton() {
  return (
    <Button variant="default" onClick={() => signIn()}>
      {' '}
      Log in{' '}
    </Button>
  );
}

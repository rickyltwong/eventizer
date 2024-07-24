'use client';

// import './globals.css';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AppShell, Container, rem, useMantineTheme } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';

// import { HeaderSearch } from '@/components';
import AppMain from '@/components/AppMain';

// const openSans = Open_Sans({
//   subsets: ['latin'],
//   display: 'swap',
// });

type Props = {
  children: ReactNode;
};

export default function AppsLayout({ children }: Props) {
  // const theme = useMantineTheme();
  // const tablet_match = useMediaQuery('(max-width: 768px)');
  // const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  // const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user) {
      router.push(
        '/api/auth/signin?callbackUrl=' +
          encodeURIComponent(window.location.pathname),
      );
    }
  }, [session, router]);

  return !session ? null : (
    <>
      <AppMain>{children}</AppMain>
    </>
  );
}

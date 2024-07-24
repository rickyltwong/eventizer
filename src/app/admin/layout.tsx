'use client';

import './globals.css';

import { AppShell, Container, rem, useMantineTheme } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
// import { Open_Sans } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';

import AppMain from '@/components/AppMain';
import HeaderNav from '@/components/HeaderNav';
import Navigation from '@/components/Navigation';

// const openSans = Open_Sans({
//   subsets: ['latin'],
//   display: 'swap',
// });

type Props = {
  children: ReactNode;
};

export default function AppsLayout({ children }: Props) {
  const theme = useMantineTheme();
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (
      !session ||
      (session?.user?.email && !session.user.email.endsWith('@admin.com'))
    ) {
      router.replace('/');
    }
  }, [session, router]);

  return !session ||
    (session?.user?.email &&
      !session.user.email.endsWith('@admin.com')) ? null : (
    <AppShell
      layout="alt"
      header={{ height: 60 }}
      footer={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'md',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      padding={0}
    >
      <AppShell.Header
        style={{
          height: rem(60),
          border: 'none',
          boxShadow: tablet_match ? theme.shadows.md : theme.shadows.sm,
        }}
      >
        <Container fluid py="sm" px="lg">
          <HeaderNav
            desktopOpened={desktopOpened}
            mobileOpened={mobileOpened}
            toggleDesktop={toggleDesktop}
            toggleMobile={toggleMobile}
          />
        </Container>
      </AppShell.Header>
      <AppShell.Navbar>
        <Navigation onClose={toggleMobile} />
      </AppShell.Navbar>
      <AppShell.Main>
        <AppMain>{children}</AppMain>
      </AppShell.Main>
    </AppShell>
  );
}

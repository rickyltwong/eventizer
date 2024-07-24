import { Burger, Button, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { AuthUserButton, SignInButton } from '@/components';

import classes from './HeaderSearch.module.css';

const links = [{ link: '/about-us', label: 'About Us' }];

export default function HeaderSearch(): JSX.Element {
  const [opened, { toggle }] = useDisclosure(false);
  const { data: session } = useSession();

  const router = useRouter();

  const items = links.map((link) => (
    <Link key={link.label} href={link.link} className={classes.link}>
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          <Image
            src="/logo.svg"
            alt="Studio logo"
            height={300}
            width={200}
            onClick={() => router.push('/')}
          />
        </Group>
        {/* TODO: Create toggle mobile menu for the nav items */}

        <Group>
          <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
            {items}
            {session ? (
              <AuthUserButton />
            ) : (
              <Group>
                <SignInButton />
                <Button onClick={() => router.push('/auth/signup')}>
                  Sign up
                </Button>
              </Group>
            )}
          </Group>
        </Group>
      </div>
    </header>
  );
}

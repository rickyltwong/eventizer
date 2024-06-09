'use client';

import { Autocomplete, Group, Burger, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { MantineLogo } from '@mantinex/mantine-logo';
import classes from './HeaderSearch.module.css';
import { ColorSchemeToggle } from './ColorSchemeToggle';
import Image from 'next/image';
import Link from 'next/link';

const links = [
  { link: '/about-us', label: 'About Us' },
  { link: '/signin', label: 'Log In' },
  { link: '/signup', label: 'Sign Up' },
];

export function HeaderSearch() {
  const [opened, { open, close, toggle }] = useDisclosure(false);

  const items = links.map((link) => (
    <Link
      key={link.label}
      href={link.link}
      className={classes.link}
      // onClick={(event) => event.preventDefault()}
    >
      {link.label}
    </Link>
  ));

  return (
    <header className={classes.header}>
      <div className={classes.inner}>
        <Group>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
          <Image src="/logo.png" alt="Mantine logo" height={300} width={200} />
        </Group>
        {/* TODO: Create toggle mobile menu for the nav items */}

        <Group>
          <Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
            {items}
          </Group>

          {/* <Autocomplete
            className={classes.search}
            placeholder="Search"
            leftSection={
              <IconSearch
                style={{ width: rem(16), height: rem(16) }}
                stroke={1.5}
              />
            }
            data={
              [
                //   'React',
                //   'Angular',
                //   'Vue',
                //   'Next.js',
                //   'Riot.js',
                //   'Svelte',
                //   'Blitz.js',
              ]
            }
            visibleFrom="xs"
          /> */}
        </Group>
      </div>
    </header>
  );
}

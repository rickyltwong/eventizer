'use client';

import { Anchor, Container, Group } from '@mantine/core';
import Image from 'next/image';

const links = [
  { link: '/about-us', label: 'About Us' },
  { link: '#', label: 'Privacy' },
  { link: '#', label: 'Careers' },
];

export default function SideNav() {
  const items = links.map((link) => (
    <Anchor<'a'>
      c="dimmed"
      key={link.label}
      href={link.link}
      onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div>
      <Container>
        <Image
          src="/logo.svg"
          alt="Balance Studio logo"
          height={100}
          width={100}
        />
        <Group>{items}</Group>
      </Container>
    </div>
  );
}

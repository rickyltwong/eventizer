'use client';
import {
  IconHome,
  IconCalendarEvent,
  IconTicket,
  IconUser,
  IconChecklist,
} from '@tabler/icons-react';
import React from 'react';
import { useState } from 'react';
import { Group, Code } from '@mantine/core';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { IconSwitchHorizontal, IconLogout } from '@tabler/icons-react';
import classes from './Navbar.module.css';
import Link from 'next/link';

const data = [
  { link: '/admin/analytics', label: 'Home', icon: IconHome },
  { link: '/admin/events', label: 'Events', icon: IconCalendarEvent },
  { link: '/admin/tickets', label: 'Tickets', icon: IconTicket },
  { link: '/admin/users', label: 'Users', icon: IconUser },
  { link: '/admin/attendee', label: 'Attendees', icon: IconChecklist },
];

export function Navbar() {
  const pathname = usePathname();
  const [active, setActive] = useState('Home');

  const links = data.map((item) => (
    <Link
      data-active={item.label === active || undefined}
      key={item.label}
      href={item.link}
      className={clsx(
        classes.link,
        pathname === item.link ? classes.active : null
      )}>
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          {/* <Code fw={700}>v3.1.2</Code> */}
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>

        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}

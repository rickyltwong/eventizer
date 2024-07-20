'use client';

// import { Code, Group } from '@mantine/core';
import {
  IconHistory,
  IconLogout,
  IconSettings,
  IconStar,
  IconSwitchHorizontal,
} from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import classes from './ProfileNav.module.css';

const data = [
  { link: '/registration-history', label: 'History', icon: IconHistory },
  { link: '/favorites', label: 'Saved Events', icon: IconStar },
  { link: '', label: 'Other Settings', icon: IconSettings },
];

const ProfileNav = () => {
  // const [active, setActive] = useState('History');

  const pathname = usePathname();

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={pathname === item.link || undefined}
      href={item.link}
      key={item.label}
      // onClick={(event) => {
      //   event.preventDefault();
      //   setActive(item.label);
      // }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <Link
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </Link>

        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
};

export default ProfileNav;

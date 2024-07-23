// import { handleSignOut } from '@/actions';

// export default function SignOutButton() {
//   return (
//     <form action={handleSignOut}>
//       <button type="submit">Sign Out</button>
//     </form>
//   );
// }

'use client';

import {
  Avatar,
  Group,
  Menu,
  rem,
  Text,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import {
  IconChevronDown,
  IconLogout,
  // IconSettings,
  IconUser,
} from '@tabler/icons-react';
import cx from 'clsx';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { NextLink, SignInButton } from '@/components/';

import classes from './AuthUserButton.module.css';

// import { handleSignIn } from '@/actions';

export default function UserButton() {
  const theme = useMantineTheme();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();

  if (!session) {
    return <SignInButton />;
  }

  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: 'pop-top-right' }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal
    >
      <Menu.Target>
        <UnstyledButton
          className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
        >
          <Group gap={7}>
            <Avatar
              src={session?.user?.image}
              alt={session?.user?.name || undefined}
              radius="xl"
              size={26}
            />
            <div style={{ flex: 1 }}>
              <Text fw={500} size="sm" lh={1} mr={3}>
                {session?.user?.name}
              </Text>
              <Text c="dimmed" size="xs">
                {session?.user?.email}
              </Text>
            </div>

            <IconChevronDown
              style={{ width: rem(12), height: rem(12) }}
              stroke={1.5}
            />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          component={NextLink}
          href="/user/registration-history"
          leftSection={
            <IconUser
              style={{ width: rem(16), height: rem(16) }}
              color={theme.colors.yellow[6]}
              stroke={1.5}
            />
          }
        >
          Profile
        </Menu.Item>

        {/* <Menu.Label>Settings</Menu.Label>
        <Menu.Item
          component={NextLink}
          href="/u"
          leftSection={
            <IconSettings
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
        >
          Account settings
        </Menu.Item> */}

        <Menu.Item
          leftSection={
            <IconLogout
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          }
          onClick={() => {
            signOut();
            router.push('/events');
          }}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

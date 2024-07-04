'use client';

import {
  Avatar,
  Group,
  Text,
  UnstyledButton,
  UnstyledButtonProps,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

import classes from './UserButton.module.css';

type UserProfileButtonProps = {
  icon?: ReactNode;
  asAction?: boolean;
} & UnstyledButtonProps;

const UserProfileButton = ({
  icon,
  asAction,
  ...others
}: UserProfileButtonProps) => {
  const { data: session } = useSession();
  return (
    <UnstyledButton className={classes.user} {...others}>
      <Group>
        <Avatar src={session?.user?.image} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {session?.user?.name}
          </Text>

          <Text size="xs">{session?.user?.email}</Text>
        </div>

        {icon && asAction && <IconChevronRight size="0.9rem" stroke={1.5} />}
      </Group>
    </UnstyledButton>
  );
};

export default UserProfileButton;

import { ActionIcon, Box, Flex, Group, ScrollArea, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconCalendarEvent,
  IconChartBar,
  IconChecklist,
  IconTicket,
  IconUser,
  IconX,
} from '@tabler/icons-react';

import { Logo, UserProfileButton } from '@/components';
import { LinksGroup } from '@/components/Navigation/Links/Links';
import { PATH_DASHBOARD } from '@/routes';

import classes from './Navigation.module.css';

const mockdata = [
  {
    title: 'Dashboard',
    links: [
      { label: 'Analytics', icon: IconChartBar, link: PATH_DASHBOARD.default },
      {
        label: 'Events',
        icon: IconCalendarEvent,
        link: PATH_DASHBOARD.events,
      },
      { label: 'Tickets', icon: IconTicket, link: PATH_DASHBOARD.tickets },
      { label: 'Users', icon: IconUser, link: PATH_DASHBOARD.users },
      {
        label: 'Attendees',
        icon: IconChecklist,
        link: PATH_DASHBOARD.attendees,
      },
    ],
  },

  // {
  //   title: 'Auth',
  //   links: [
  //     { label: 'Sign In', icon: IconLogin2, link: PATH_AUTH.signin },
  //     { label: 'Sign Up', icon: IconUserPlus, link: PATH_AUTH.signup },
  //     {
  //       label: 'Reset Password',
  //       icon: IconRotateRectangle,
  //       link: PATH_AUTH.passwordReset,
  //     },
  //   ],
  // },
];

type NavigationProps = {
  onClose: () => void;
};

const Navigation = ({ onClose }: NavigationProps) => {
  const tablet_match = useMediaQuery('(max-width: 768px)');

  const links = mockdata.map((m) => (
    <Box pl={0} mb="md" key={m.title}>
      <Text
        tt="uppercase"
        size="xs"
        pl="md"
        fw={500}
        mb="sm"
        className={classes.linkHeader}
      >
        {m.title}
      </Text>
      {m.links.map((item) => (
        <LinksGroup
          key={item.label}
          {...item}
          closeSidebar={() => {
            setTimeout(() => {
              onClose();
            }, 250);
          }}
        />
      ))}
    </Box>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.header}>
        <Flex justify="space-between" align="center" gap="sm">
          <Group
            justify="space-between"
            style={{ flex: tablet_match ? 'auto' : 1 }}
          >
            <Logo className={classes.logo} />
          </Group>
          {tablet_match && (
            <ActionIcon
              onClick={onClose}
              // variant="transparent"
              variant="subtle"
            >
              <IconX color="white" />
            </ActionIcon>
          )}
        </Flex>
      </div>

      <ScrollArea className={classes.links}>
        <div className={classes.linksInner}>{links}</div>
      </ScrollArea>

      <div className={classes.footer}>
        <UserProfileButton />
      </div>
    </nav>
  );
};

export default Navigation;

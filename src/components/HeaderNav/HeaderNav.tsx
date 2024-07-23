'use client';

import {
  ActionIcon,
  Burger,
  Group,
  Menu,
  // rem,
  // TextInput,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconCircleHalf2,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconMoonStars,
  IconPower,
  IconSearch,
  IconSunHigh,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const ICON_SIZE = 20;

type HeaderNavProps = {
  mobileOpened?: boolean;
  toggleMobile?: () => void;
  desktopOpened?: boolean;
  toggleDesktop?: () => void;
};

const HeaderNav = (props: HeaderNavProps) => {
  const { desktopOpened, toggleDesktop, toggleMobile, mobileOpened } = props;
  const { setColorScheme, colorScheme } = useMantineColorScheme();
  // const laptop_match = useMediaQuery('(max-width: 992px)');
  // const tablet_match = useMediaQuery('(max-width: 768px)');
  const mobile_match = useMediaQuery('(max-width: 425px)');

  // const handleColorSwitch = (mode: 'light' | 'dark' | 'auto') => {
  //   setColorScheme(mode);
  // };

  const router = useRouter();

  return (
    <Group justify="space-between">
      <Group gap={0}>
        <Tooltip label="Toggle side navigation">
          <ActionIcon visibleFrom="md" onClick={toggleDesktop} variant="subtle">
            {desktopOpened ? (
              <IconLayoutSidebarLeftCollapse />
            ) : (
              <IconLayoutSidebarLeftExpand />
            )}
          </ActionIcon>
        </Tooltip>
        <Burger
          opened={mobileOpened}
          onClick={toggleMobile}
          hiddenFrom="md"
          size="sm"
        />
        {/*<Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="md" size="sm"/>*/}
        {/* {!mobile_match && (
          <TextInput
            placeholder="search"
            rightSection={<IconSearch size={ICON_SIZE} />}
            ml="md"
            style={{ width: tablet_match ? 'auto' : rem(400) }}
          />
        )} */}
      </Group>
      <Group>
        {mobile_match && (
          <ActionIcon>
            <IconSearch size={ICON_SIZE} />
          </ActionIcon>
        )}

        <Tooltip label="Logout">
          <ActionIcon
            variant="subtle"
            onClick={() => {
              signOut();
              router.push('/events');
            }}
          >
            <IconPower size={ICON_SIZE} />
          </ActionIcon>
        </Tooltip>
        <Menu shadow="lg" width={200}>
          <Menu.Target>
            <Tooltip label="Switch color modes">
              <ActionIcon variant="light">
                {colorScheme === 'auto' ? (
                  <IconCircleHalf2 size={ICON_SIZE} />
                ) : colorScheme === 'dark' ? (
                  <IconMoonStars size={ICON_SIZE} />
                ) : (
                  <IconSunHigh size={ICON_SIZE} />
                )}
              </ActionIcon>
            </Tooltip>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label tt="uppercase" ta="center" fw={600}>
              Select color modes
            </Menu.Label>
            <Menu.Item
              leftSection={<IconSunHigh size={16} />}
              onClick={() => setColorScheme('light')}
            >
              Light
            </Menu.Item>
            <Menu.Item
              leftSection={<IconMoonStars size={16} />}
              onClick={() => setColorScheme('dark')}
            >
              Dark
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
};

export default HeaderNav;

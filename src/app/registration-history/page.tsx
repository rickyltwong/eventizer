'use client';
import {
  ActionIcon,
  Anchor,
  Badge,
  Group,
  rem,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import axios from 'axios';
// import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { HeaderSearch, ResponsiveContainer } from '@/components';

type EventDetails = {
  _id: 1;
  eventName: 1;
  eventStartDateTime: 1;
  // Add other event details if needed
};
type UserTicket = {
  _id: string;
  event: string;
  user: string;
  ticketType: string;
  noOfTickets: number;
  price: number;
  purchaseDate: string;
  participating: boolean;
  status: string;
  eventDetails: EventDetails;
};

export default function UsersTable() {
  const { data: session, status } = useSession();
  const [tickets, setTickets] = useState<UserTicket[]>([]);

  console.log(session);
  if (status === 'loading') console.log('Loading');

  if (status === 'authenticated') {
    console.log(session.user);
  }

  // fetch user tickets
  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          `/api/user/${session?.user.id}/tickets`,
        );

        if (response.status === 200) {
          setTickets(response.data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    })();
  }, []);

  const rows = tickets.map((item) => (
    <Table.Tr key={item._id}>
      <Table.Td>
        <Group gap="sm">
          <Text fz="sm" fw={500}>
            {item.eventDetails.eventName}
          </Text>
        </Group>
      </Table.Td>

      <Table.Td>
        <Badge variant="light">{item.eventDetails.eventStartDateTime}</Badge>
      </Table.Td>
      <Table.Td>
        <Anchor component="button" size="sm">
          {item._id}
        </Anchor>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.ticketType}</Text>
      </Table.Td>
      <Table.Td>
        <Group gap={0} justify="flex-end">
          <ActionIcon variant="subtle" color="gray">
            <IconPencil
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          </ActionIcon>
          <ActionIcon variant="subtle" color="red">
            <IconTrash
              style={{ width: rem(16), height: rem(16) }}
              stroke={1.5}
            />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <HeaderSearch />
      {/* <ProfileNav /> */}
      <ResponsiveContainer>
        <Title order={1}>Registration History</Title>

        <Table.ScrollContainer minWidth={800} mt={25}>
          <Table verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Event Name</Table.Th>
                <Table.Th>Ticket Id</Table.Th>
                <Table.Th>Venue</Table.Th>
                <Table.Th>Date</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </ResponsiveContainer>
    </>
  );
}

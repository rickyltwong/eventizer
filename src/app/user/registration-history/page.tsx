'use client';
import { Anchor, Badge, Group, Table, Text, Title } from '@mantine/core';
// import { IconPencil, IconTrash } from '@tabler/icons-react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HeaderSearch, ProfileNav } from '@/components';

import classes from './page.module.css';

type EventDetails = {
  _id: 1;
  eventName: 1;
  eventStartDateTime: 1;
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

export default function Page() {
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
          {
            params: {
              email: session?.user.email,
            },
          },
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
        <Anchor
          fz="sm"
          fw={500}
          href={`/events/${item.eventDetails._id}`}
          target="_blank"
          underline="hover"
        >
          {item._id}
        </Anchor>
      </Table.Td>
      <Table.Td>
        <Text fz="sm">{item.ticketType}</Text>
      </Table.Td>
      <Table.Td>
        <Badge variant="light">{item.eventDetails.eventStartDateTime}</Badge>
      </Table.Td>
      <Table.Td>
        <Badge variant="light">{item.status}</Badge>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <HeaderSearch />
      <div className={classes.container}>
        <ProfileNav />
        <div className={classes.mainContent}>
          {/* <ResponsiveContainer> */}
          <Title order={1}>Registration History</Title>

          <Table.ScrollContainer minWidth={800} mt={25}>
            <Table verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Event Name</Table.Th>
                  <Table.Th>Ticket Id</Table.Th>
                  <Table.Th>Ticket Type</Table.Th>
                  <Table.Th>Event Date</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{rows}</Table.Tbody>
            </Table>
          </Table.ScrollContainer>
          {/* </ResponsiveContainer> */}
        </div>
      </div>
    </>
  );
}

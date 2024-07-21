'use client';

import {
  Avatar,
  Container,
  Divider,
  Group,
  Paper,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { useSession } from 'next-auth/react';

// Sample data for event history
const eventHistory = [
  { date: '2024-01-15', event: 'Mindfulness Workshop' },
  { date: '2024-02-10', event: 'Buddhist Chanting Event' },
  { date: '2024-03-05', event: 'Youth Leadership Training' },
];

export default function Page() {
  const { data: session } = useSession();

  return (
    <Container size="sm" mt="md">
      <Paper shadow="md" p="lg" withBorder>
        <Group justify="center">
          <Avatar
            src={session?.user?.image}
            size={120}
            radius={120}
            alt="User profile picture"
          />
        </Group>
        <Stack align="center" mt="md">
          <Title order={2}>{session?.user?.name}</Title>
          <Text size="lg" color="dimmed">
            {session?.user?.email}
          </Text>
        </Stack>
      </Paper>

      <Divider my="lg" />

      <Paper shadow="md" p="lg" withBorder>
        <Title order={3} mb="md">
          Event Registration History
        </Title>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Event</th>
            </tr>
          </thead>
          <tbody>
            {eventHistory.map((event, index) => (
              <tr key={index}>
                <td>{event.date}</td>
                <td>{event.event}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Paper>
    </Container>
  );
}

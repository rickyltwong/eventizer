'use client';

import {
  ActionIcon,
  Box,
  Button,
  Card,
  Container,
  Group,
  Select,
  Text,
} from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { useState } from 'react';

import { Attendee } from '@/app/admin/attendee/page';

import AttendeeStatus from './AttendeeStatus';

interface AttendeesTableProps {
  attendees: Attendee[];
  onCheckboxChange: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

export default function AttendeesTable({
  attendees,
  onCheckboxChange,
  onStatusChange,
}: AttendeesTableProps) {
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);

  const handleStatusChange = (id: string, newStatus: string) => {
    onStatusChange(id, newStatus);
    setEditingStatusId(null);
  };

  return (
    <Container style={{ maxWidth: '120%' }} className="mt-7 flow-root">
      <div className="inline-block min-w-full align-middle">
        <Card shadow="sm" p="lg" radius="md" withBorder className="mb-5">
          <Group grow style={{ fontSize: 12 }}>
            <Box style={{ flex: 0.5 }}></Box>
            <Box style={{ flex: 1 }}>
              <Text>Name</Text>
            </Box>
            <Box style={{ flex: 4 }}>
              <Text>Email</Text>
            </Box>
            <Box style={{ flex: 1 }}>
              <Text>Status</Text>
            </Box>
            <Box style={{ flex: 1 }}>
              <Text>Ticket Type</Text>
            </Box>
            <Box style={{ flex: 1 }}>
              <Text>Participating</Text>
            </Box>
          </Group>
        </Card>
        {attendees.map((attendee) => (
          <Card
            key={attendee._id}
            shadow="sm"
            p="lg"
            radius="md"
            withBorder
            className="mb-4"
          >
            <Group grow style={{ fontSize: '0.75rem' }}>
              <Box style={{ flex: 0.5 }}>
                <ActionIcon
                  onClick={() => setEditingStatusId(attendee._id)}
                  style={{ backgroundColor: '#59B6C7' }}
                >
                  <IconPencil size={14} />
                </ActionIcon>
              </Box>
              <Box style={{ flex: 1 }}>
                <Text>{attendee.name}</Text>
              </Box>
              <Box
                style={{
                  flex: 4,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <Text>{attendee.email}</Text>
              </Box>
              <Box style={{ flex: 1 }}>
                {editingStatusId === attendee._id ? (
                  <Select
                    value={attendee.status}
                    onChange={(value) =>
                      handleStatusChange(attendee._id, value ?? attendee.status)
                    }
                    data={[
                      { value: 'Attended', label: 'Attended' },
                      { value: 'Registered', label: 'Registered' },
                      { value: 'Pending', label: 'Pending' },
                      { value: 'Cancelled', label: 'Cancelled' },
                    ]}
                  />
                ) : (
                  <div onClick={() => setEditingStatusId(attendee._id)}>
                    <AttendeeStatus status={attendee.status} />
                  </div>
                )}
              </Box>
              <Box style={{ flex: 1 }}>
                <Text>{attendee.ticketType}</Text>
              </Box>
              <Box style={{ flex: 1 }}>
                <Button
                  variant={
                    attendee.participating === 'true' ? 'filled' : 'outline'
                  }
                  color={attendee.participating === 'true' ? 'green' : 'blue'}
                  onClick={() => onCheckboxChange(attendee._id)}
                >
                  {attendee.participating === 'true'
                    ? 'Checked In'
                    : 'Check In'}
                </Button>
              </Box>
            </Group>
          </Card>
        ))}
      </div>
    </Container>
  );
}

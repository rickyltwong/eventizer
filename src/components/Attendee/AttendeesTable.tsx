'use client';
import { Button, Select, Card, Group, Text, Container, ActionIcon } from '@mantine/core';
import { useState } from 'react';
import { Attendee } from '@/app/admin/attendee/page';
import AttendeeStatus from './AttendeeStatus';
import { IconPencil } from '@tabler/icons-react';

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
    <Container style={{ maxWidth: '1200px' }} className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <Card shadow="sm" p="lg" radius="md" withBorder className="mb-5">
          <Group grow style={{ fontSize: 12 }}>
            <Text style={{ flex: 0.01 }}></Text>
            <Text style={{ flex: 2 }}>Name</Text>
            <Text style={{ flex: 8 }}>Email</Text>
            <Text style={{ flex: 2 }}>Status</Text>
            <Text style={{ flex: 2 }}>Ticket Type</Text>
            <Text style={{ flex: 1 }}>Participating</Text>
          </Group>
        </Card>
        {attendees.map((attendee) => (
          <Card key={attendee._id} shadow="sm" p="lg" radius="md" withBorder className="mb-4">
            <Group grow style={{ fontSize: '0.75rem' }}>
              <ActionIcon onClick={() => setEditingStatusId(attendee._id)} style={{ flex: 0.001, backgroundColor: '#59B6C7' }}>
                <IconPencil size={14} />
              </ActionIcon>
              <Text style={{ flex: 2 }}>{attendee.name}</Text>
              <Text style={{ flex: 8, fontSize: 14 }}>{attendee.email}</Text>
              <Text style={{ flex: 2 }}>
                {editingStatusId === attendee._id ? (
                  <Select
                    value={attendee.status}
                    onChange={(value) =>
                      handleStatusChange(attendee._id, value ?? attendee.status)
                    }
                    data={[
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
              </Text>
              <Text style={{ flex: 2 }}>{attendee.ticketType}</Text>
              <Button
                variant={attendee.participating === 'true' ? 'filled' : 'outline'}
                color={attendee.participating === 'true' ? 'green' : 'blue'}
                onClick={() => onCheckboxChange(attendee._id)}
                style={{ flex: 1 }}
              >
                {attendee.participating === 'true' ? 'Checked In' : 'Check In'}
              </Button>
            </Group>
          </Card>
        ))}
      </div>
    </Container>
  );
}

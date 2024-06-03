"use client"
import { useState } from 'react';
import { Input, Select, Button, Container, Title, Group, Box } from '@mantine/core';
import AttendeesTable from './AttendeesTable';

export default function AttendeeManagementPage() {
  // Mark component as client component
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [attendees, setAttendees] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Registered' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Pending'},
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Registered'},
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', status: 'Cancelled'},
  ]);

  // Filter attendees based on search term and filter status
  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearchTerm = attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              attendee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || attendee.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearchTerm && matchesStatus;
  });

  return (
    <Container size="lg" my="md">
      <Box mb="xl">
        <Title order={2} mb="lg">
          Attendee Management
        </Title>
        <Group align="center">
          <Input
            type="text"
            placeholder="Search attendees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
          <Select
            value={filterStatus}
            onChange={(value) => setFilterStatus(value ?? 'all')}
            data={[
              { value: 'all', label: 'All' },
              { value: 'registered', label: 'Registered' },
              { value: 'pending', label: 'Pending' },
              { value: 'cancelled', label: 'Cancelled' }
            ]}
            style={{ marginLeft: '1rem' }}
          />
          <Button variant="filled" ml="md">
            Add Attendee
          </Button>
        </Group>
        <AttendeesTable attendees={filteredAttendees} />
      </Box>
    </Container>
  );
}

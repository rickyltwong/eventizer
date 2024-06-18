"use client"
import { useState } from 'react';
import { Input, Select, Button, Container, Title, Group, Box } from '@mantine/core';
import AttendeesTable from './AttendeesTable';
import { PATH_DASHBOARD } from '@/routes';


export interface Attendee {
  id: number;
  name: string;
  email: string;
  status: string;
  participating: boolean;
  registrationDate: string; // Date of registration
  ticketType: string; // Type of ticket (VIP, Regular, etc.)
}

export default function AttendeeManagementPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [attendees, setAttendees] = useState<Attendee[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Registered', participating: false, registrationDate: '2024-06-10', ticketType: 'VIP' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Pending', participating: true, registrationDate: '2024-06-12', ticketType: 'Regular' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Registered', participating: false, registrationDate: '2024-06-15', ticketType: 'VIP' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', status: 'Cancelled', participating: true, registrationDate: '2024-06-18', ticketType: 'Regular' },
  ]);

  // Filter attendees based on search term and filter status
  const filteredAttendees = attendees.filter(attendee => {
    const matchesSearchTerm = attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              attendee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || attendee.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearchTerm && matchesStatus;
  });

  // Handle checkbox change for participating status
  const handleCheckboxChange = (id: number) => {
    setAttendees(prevAttendees =>
      prevAttendees.map(attendee =>
        attendee.id === id ? { ...attendee, participating: !attendee.participating } : attendee
      )
    );
  };

  // Handle status change
  const handleStatusChange = (id: number, status: string) => {
    setAttendees(prevAttendees =>
      prevAttendees.map(attendee =>
        attendee.id === id ? { ...attendee, status } : attendee
      )
    );
  };

  return (
    <Container size="lg" my="md">
      <Box mb="xl">
        <Title order={2} mb="lg" style={{ color: '#64c1ff', fontWeight: 'bold', padding:20}}>
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
        <AttendeesTable
          attendees={filteredAttendees}
          onCheckboxChange={handleCheckboxChange}
          onStatusChange={handleStatusChange}
        />
      </Box>
    </Container>
  );
}

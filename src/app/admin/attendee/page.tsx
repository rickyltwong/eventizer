'use client';
import {
  Box,
  Button,
  Container,
  Group,
  Input,
  Select,
  Title,
  Text,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import AttendeesTable from '@/components/Attendee/AttendeesTable';

export interface Attendee {
  _id: string;
  name: string;
  email: string;
  status: string;
  participating: string;
  registrationDate: string;
  ticketType: string;
}

export default function AttendeeManagementPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    fetch('/api/attendee')
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((ticket: any) => ({
          _id: ticket._id,
          name: ticket.user.name,
          email: ticket.user.email,
          status: ticket.status,
          participating: ticket.participating,
          registrationDate: ticket.purchaseDate,
          ticketType: ticket.ticketType,
        }));
        setAttendees(formattedData);
      });
  }, []);

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearchTerm =
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      attendee.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearchTerm && matchesStatus;
  });

  const handleCheckboxChange = (id: string) => {
    setAttendees((prevAttendees) =>
      prevAttendees.map((attendee) =>
        attendee._id === id
          ? { ...attendee, participating: attendee.participating === 'true' ? 'false' : 'true' }
          : attendee,
      ),
    );

    const attendee = attendees.find((attendee) => attendee._id === id);
    if (attendee) {
      fetch(`/api/attendee`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          participating: attendee.participating === 'true' ? 'false' : 'true',
        }),
      });
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    setAttendees((prevAttendees) =>
      prevAttendees.map((attendee) =>
        attendee._id === id ? { ...attendee, status } : attendee,
      ),
    );
    fetch(`/api/attendee`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, status }),
    });
  };

  const totalAttendees = attendees.length;
  const checkedInAttendees = attendees.filter((attendee) => attendee.participating === 'true').length;

  return (
    <Container size="lg" my="md">
      <Title
        order={2}
        mb="lg"
        style={{ color: '#59B6C7', fontWeight: 'bold', padding: 20 }}
      >
        Check-In Attendees
      </Title>
      <Group className="mb-4">
        <div style={{ textAlign: 'center', marginRight: '20%', marginLeft: '20%' }}>
          <Text style={{ fontSize: 20 }}>Total Attendees</Text>
          <div style={{ borderRadius: '50%', width: '100px', height: '100px', backgroundColor: '#59B6C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Text>{totalAttendees}</Text>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Text style={{ fontSize: 20 }}>Checked In</Text>
          <div style={{ borderRadius: '50%', width: '100px', height: '100px', backgroundColor: '#59B6C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Text>{checkedInAttendees}</Text>
          </div>
        </div>
      </Group>
      <Box mb="xl">
        <Group align="center">
          <Input
            type="text"
            placeholder="Search attendee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 0.9, marginLeft: '5%' }}
          />
          <Select
            value={filterStatus}
            onChange={(value) => setFilterStatus(value ?? 'all')}
            data={[
              { value: 'all', label: 'All' },
              { value: 'registered', label: 'Registered' },
              { value: 'pending', label: 'Pending' },
              { value: 'cancelled', label: 'Cancelled' },
            ]}
            style={{ marginLeft: '0.785rem' }}
          />
          <Button variant="filled" ml="md" style={{ backgroundColor: '#59B6C7' }}>
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

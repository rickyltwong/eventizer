'use client';
import {
  Box,
  Button,
  Container,
  Group,
  Input,
  Select,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useEffect, useState } from 'react';

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

export interface Event {
  _id: string;
  eventName: string;
  eventShortName: string;
  eventType: string;
}

export default function AttendeeManagementPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [searchEvent, setSearchEvent] = useState<string>('');
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(
    null,
  );

  useEffect(() => {
    // Fetch events
    fetch('/api/events')
      .then((response) => response.json())
      .then((data: Event[]) => {
        const processedData = data.map((event: Event) => {
          const words = event?.eventName?.split(' ');
          const eventShortName = words.slice(3, 6).join(' ');
          return {
            ...event,
            eventShortName,
          };
        });
        setEvents(processedData);

        const types: string[] = Array.from(
          new Set(data.map((event: Event) => event.eventType)),
        );
        setEventTypes(types);
      })
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      // Fetch attendees for the selected event
      fetch(`/api/attendee?eventId=${selectedEventId}`)
        .then((response) => response.json())
        .then((data) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedData = data.map((ticket: any) => ({
            _id: ticket._id,
            name: ticket.user?.name ?? 'Anonymous',
            email: ticket.user?.email ?? 'Unknown',
            status: ticket.status,
            participating: ticket.participating,
            registrationDate: ticket.purchaseDate,
            ticketType: ticket.ticketType,
          }));
          setAttendees(formattedData);
        })
        .catch((error) => console.error('Error fetching attendees:', error));
    }
  }, [selectedEventId]);

  const filteredAttendees = attendees.filter((attendee) => {
    const matchesSearchTerm =
      attendee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      'unknown'.includes(searchTerm.toLowerCase()) ||
      attendee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      'unknown'.includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      attendee.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearchTerm && matchesStatus;
  });

  const filteredEvents = events.filter(
    (event) =>
      event.eventName.toLowerCase().includes(searchEvent.toLowerCase()) &&
      (selectedEventType ? event.eventType === selectedEventType : true),
  );

  const handleCheckboxChange = (id: string) => {
    setAttendees((prevAttendees) =>
      prevAttendees.map((attendee) =>
        attendee._id === id
          ? {
              ...attendee,
              participating:
                attendee.participating === 'true' ? 'false' : 'true',
            }
          : attendee,
      ),
    );

    const attendee = attendees.find((attendee) => attendee._id === id);
    if (attendee) {
      fetch('/api/attendee', {
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
    fetch('/api/attendee', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, status }),
    });
  };

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
  };

  const handleEventTypeClick = (eventType: string | null) => {
    setSelectedEventType(eventType);
  };

  const totalAttendees = attendees.length;
  const checkedInAttendees = attendees.filter(
    (attendee) => attendee.participating === 'true',
  ).length;

  return (
    <Container size="lg" my="md">
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Event Type Buttons */}
        <Group style={{ marginBottom: '2rem' }}>
          {eventTypes.map((type) => (
            <Button
              style={{
                backgroundColor: '#63bac9',
                fontSize: '20px',
                padding: '10px 20px',
              }}
              key={type}
              onClick={() => handleEventTypeClick(type)}
            >
              {type}
            </Button>
          ))}
          <Button
            style={{
              backgroundColor: '#63bac9',
              fontSize: '20px',
              padding: '10px 20px',
            }}
            onClick={() => handleEventTypeClick(null)}
          >
            All
          </Button>
        </Group>
        {/* Main content */}
        <Box style={{ display: 'flex', width: '100%' }}>
          {/* Sidebar for event names */}
          <Box style={{ width: '20%', paddingRight: '1rem' }}>
            <Title
              order={2}
              style={{
                color: '#59B6C7',
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: '24px',
              }}
            >
              Events Names
            </Title>
            <Input
              type="text"
              placeholder="Search Event..."
              value={searchEvent}
              onChange={(e) => setSearchEvent(e.target.value)}
              style={{ flex: 0.9, margin: '5%', padding: '5%' }}
            />
            {filteredEvents.map((event) => (
              <Tooltip key={event._id} label={event.eventName}>
                <Button
                  onClick={() => handleEventClick(event._id)}
                  variant="filled"
                  fullWidth
                  style={{
                    backgroundColor: '#59B6C7',
                    marginBottom: '0.5rem',
                    textAlign: 'left',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '15px',
                    padding: '10px 15px',
                  }}
                >
                  {event.eventShortName + ' ...'}
                </Button>
              </Tooltip>
            ))}
          </Box>
          {/* Main content for attendees */}
          <Box style={{ width: '80%' }}>
            <Title
              order={3}
              mb="lg"
              style={{
                color: '#59B6C7',
                fontWeight: 'bold',
                padding: 20,
                textAlign: 'center',
              }}
            >
              Check-In Attendees
            </Title>
            <Group className="mb-4">
              <Box
                style={{
                  textAlign: 'center',
                  marginRight: '20%',
                  marginLeft: '30%',
                }}
              >
                <Text style={{ fontSize: 15 }}>Total Attendees</Text>
                <Box
                  style={{
                    borderRadius: '40%',
                    width: '70px',
                    height: '70px',
                    backgroundColor: '#59B6C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {totalAttendees}
                  </Text>
                </Box>
              </Box>
              <Box style={{ textAlign: 'center' }}>
                <Text style={{ fontSize: 15 }}>Checked In</Text>
                <Box
                  style={{
                    borderRadius: '40%',
                    width: '70px',
                    height: '70px',
                    backgroundColor: '#59B6C7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                  }}
                >
                  <Text style={{ fontSize: '24px', fontWeight: 'bold' }}>
                    {checkedInAttendees}
                  </Text>
                </Box>
              </Box>
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
              </Group>
              <AttendeesTable
                attendees={filteredAttendees}
                onCheckboxChange={handleCheckboxChange}
                onStatusChange={handleStatusChange}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

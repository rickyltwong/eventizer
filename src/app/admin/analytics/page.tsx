'use client';
import 'react-datepicker/dist/react-datepicker.css';

import {
  Box,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Text,
  Title,
} from '@mantine/core';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  ArcElement,
  ChartDataLabels,
);

interface Event {
  _id: string;
  eventType: string;
  eventName: string;
  capacity: number;
  eventStartDateTime: string;
  eventFinishDateTime: string;
  ticketsClasses: {
    ticketType: string;
    availability: number;
  }[];
}

interface EventTicket {
  event: string;
  noOfTickets: number;
}

interface User {
  name: string;
  role: string;
}

const Dashboard = () => {
  const [totalSales, setTotalSales] = useState<number>(0);
  const [userCount, setUserCount] = useState<number>(0);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(
    null,
  );
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [pieData, setPieData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number;
    }[];
  }>({
    labels: [],
    datasets: [
      {
        label: 'Events',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      },
    ],
  });

  const [barData, setBarData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
      barThickness?: number;
      maxBarThickness?: number;
    }[];
  }>({
    labels: [],
    datasets: [
      {
        label: 'Total Capacity',
        data: [],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
      {
        label: 'Remaining Seats',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        barThickness: 15,
        maxBarThickness: 15,
      },
    ],
  });

  useEffect(() => {
    fetchBarData();
  }, [selectedEventType, startDate, endDate]);

  useEffect(() => {
    fetchPieData();
  }, [startDate, endDate]);

  async function fetchBarData(): Promise<void> {
    try {
      // Fetch event data
      const response = await fetch('/api/events');
      const eventData: Event[] = await response.json();
      // console.log('Events:', eventData);

      // Fetch ticket sales data
      const response2 = await fetch('/api/admin2');
      const ticketData: EventTicket[] = await response2.json();
      // console.log('Ticket Sales:', ticketData);

      // Filter events by selected type and date range
      const filteredEvents = eventData.filter((event) => {
        const eventDate = new Date(event.eventStartDateTime);
        const isInDateRange =
          (!startDate || eventDate >= startDate) &&
          (!endDate || eventDate <= endDate);
        const isTypeMatch =
          !selectedEventType || event.eventType === selectedEventType;
        return isInDateRange && isTypeMatch;
      });

      // Calculate total sales
      const totalSales = filteredEvents.reduce((acc, event) => {
        const soldTickets = ticketData
          .filter((ticket) => ticket.event === event._id)
          .reduce((total, ticket) => total + ticket.noOfTickets, 0);
        return acc + soldTickets;
      }, 0);
      setTotalSales(totalSales);

      // Fetch user data
      const response3 = await fetch('/api/admin');
      const user: User[] = await response3.json();
      // console.log('Users:', user);

      // Calculate Users numbers
      const userCount = user.length;
      setUserCount(userCount);

      // Update state with bar chart data
      setBarData({
        labels: filteredEvents.map((event) => {
          const words = event.eventName.split(' ');
          return words.length > 3 ? `${words[2]} ${words[3]}` : event.eventName;
        }),
        datasets: [
          {
            label: 'Total Capacity',
            data: filteredEvents.map((event) => event.capacity),
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
          {
            label: 'Remaining Seats',
            data: filteredEvents.map((event) =>
              Math.max(
                0,
                event.capacity - calculateSoldTickets(event, ticketData),
              ),
            ),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            barThickness: 15,
            maxBarThickness: 15,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }

  async function fetchPieData(): Promise<void> {
    try {
      // Fetch event data
      const response = await fetch('/api/events');
      const eventData: Event[] = await response.json();
      // console.log('Events:', eventData);

      // Filter events by date range
      const filteredEvents = eventData.filter((event) => {
        const eventDate = new Date(event.eventStartDateTime);
        return (
          (!startDate || eventDate >= startDate) &&
          (!endDate || eventDate <= endDate)
        );
      });

      // Calculate event counts
      const eventTypes = Array.from(
        new Set(eventData.map((event) => event.eventType)),
      );
      setEventTypes(eventTypes);

      const eventCounts = eventTypes.map(
        (type) =>
          filteredEvents.filter((event) => event.eventType === type).length,
      );

      // Update state with pie chart data
      setPieData({
        labels: eventTypes,
        datasets: [
          {
            label: 'Events',
            data: eventCounts,
            backgroundColor: eventTypes.map((_, index) => {
              const colors = [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ];
              return colors[index % colors.length];
            }),
            borderColor: eventTypes.map((_, index) => {
              const borderColors = [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ];
              return borderColors[index % borderColors.length];
            }),
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }

  function calculateSoldTickets(event: Event, tickets: EventTicket[]): number {
    return tickets
      .filter((ticket) => ticket.event === event._id)
      .reduce((total, ticket) => total + ticket.noOfTickets, 0);
  }

  return (
    <Container>
      {/* Event Type Cards */}
      <Group my="lg">
        {eventTypes.map((type) => (
          <Button
            key={type}
            onClick={() => setSelectedEventType(type)}
            style={{
              backgroundColor: '#59B6C7',
              minWidth: '100px',
              height: '80px',
              fontSize: '18px',
              margin: '0 10px',
            }}
          >
            {type}
          </Button>
        ))}
        <Button
          onClick={() => setSelectedEventType(null)}
          style={{
            backgroundColor: '#59B6C7',
            minWidth: '100px',
            height: '80px',
            fontSize: '18px',
            margin: '0 10px',
          }}
        >
          All
        </Button>
      </Group>

      {/* Date Range Pickers */}
      <Group my="lg" style={{ color: '#59B6C7' }}>
        <Box style={{ margin: '0 10px' }}>
          <Text style={{ color: 'black' }}>Select Start Date:</Text>
          <DatePicker
            selected={startDate}
            onChange={(date: Date) => setStartDate(date)}
          />
        </Box>
        <Box style={{ margin: '0 10px' }}>
          <Text style={{ color: 'black' }}>Select End Date:</Text>
          <DatePicker
            selected={endDate}
            onChange={(date: Date) => setEndDate(date)}
          />
        </Box>
      </Group>

      <SimpleGrid cols={2} spacing="lg">
        <Card
          shadow="sm"
          p="lg"
          style={{
            backgroundColor: '#f0f4f8',
            borderRadius: '12px',
            minHeight: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div>
            <Text
              size="lg"
              style={{
                marginBottom: '8px',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Total Sales
            </Text>
            <Text size="xl" style={{ textAlign: 'center' }}>
              {totalSales}
            </Text>
          </div>
        </Card>
        <Card
          shadow="sm"
          p="lg"
          style={{
            backgroundColor: '#f0f4f8',
            borderRadius: '12px',
            minHeight: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div>
            <Text
              size="lg"
              style={{
                marginBottom: '8px',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Active Subscriptions
            </Text>
            <Text size="xl" style={{ textAlign: 'center' }}>
              {userCount}
            </Text>
          </div>
        </Card>
      </SimpleGrid>
      <SimpleGrid cols={2} spacing="lg" mt="xl">
        <Card shadow="sm" p="lg" style={{ height: '450px' }}>
          <Title order={3}>Event Capacity Trends</Title>
          <Bar
            data={barData}
            options={{
              maintainAspectRatio: false,
              layout: {
                padding: {
                  left: 10,
                  right: 10,
                  top: 10,
                  bottom: 30,
                },
              },
              scales: {
                x: {
                  ticks: {
                    font: {
                      size: 14,
                    },
                    color: '#000',
                  },
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    font: {
                      size: 14,
                    },
                    color: '#000',
                    callback: function (value) {
                      return typeof value === 'number' && value >= 0
                        ? value
                        : '';
                    },
                  },
                },
              },
              plugins: {
                legend: {
                  labels: {
                    font: {
                      size: 14,
                    },
                    color: '#000',
                  },
                },
              },
            }}
          />
        </Card>
        <Card shadow="sm" p="lg" style={{ height: '450px' }}>
          <Title order={3}>Events Distribution</Title>
          <Pie
            data={pieData}
            options={{
              maintainAspectRatio: false,
              layout: {
                padding: {
                  left: 10,
                  right: 10,
                  top: 10,
                  bottom: 30,
                },
              },
              plugins: {
                legend: {
                  labels: {
                    font: {
                      size: 14,
                    },
                    color: '#000',
                  },
                },
                datalabels: {
                  color: '#000',
                  anchor: 'end',
                  align: 'start',
                  offset: 0,
                  font: {
                    size: 14,
                  },
                  formatter: (value) => value,
                },
              },
            }}
          />
        </Card>
      </SimpleGrid>
    </Container>
  );
};

export default Dashboard;

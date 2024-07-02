"use client";
import React, { useEffect, useState } from 'react';
import { Card, SimpleGrid, Text, Title, Container } from '@mantine/core';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement, ChartDataLabels);

interface Event {
  eventType: string;
  capacity: number;
  ticketsClasses: {
    ticketType: string;
    availability: number;
  }[];
}

interface EventTicket {
  event: string;
  noOfTickets: number;
}

const Dashboard = () => {
  const [totalSales, setTotalSales] = useState<number>(0);
  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Events',
        data: [],
      },
    ],
  });

  const [barData, setBarData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Remaining Seats',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total Capacity',
        data: [],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    async function fetchEvents() {
      try {
        // Fetch event data
        const response = await fetch('/api/events');
        const eventData: Event[] = await response.json();
        console.log('Events:', eventData);

        // Fetch ticket sales data
        const response2 = await fetch('/api/admin2');
        const ticketData: EventTicket[] = await response2.json();
        console.log('Ticket Sales:', ticketData);

        // Calculate total sales
        const totalSales = eventData.reduce((acc, event) => {
          const soldTickets = ticketData
            .filter(ticket => ticket.event === event._id)
            .reduce((total, ticket) => total + ticket.noOfTickets, 0);
          return acc + soldTickets;
        }, 0);
        setTotalSales(totalSales);

        // Calculate event counts
        const eventTypes = Array.from(new Set(eventData.map(event => event.eventType)));
        const eventCounts = eventTypes.map(type =>
          eventData.filter(event => event.eventType === type).length
        );

        // Calculate remaining seats and total capacity
        const remainingSeats = eventTypes.map(type =>
          eventData
            .filter(event => event.eventType === type)
            .reduce((acc, event) => acc + event.capacity - calculateSoldTickets(event, ticketData), 0)
        );
        const totalCapacity = eventTypes.map(type =>
          eventData
            .filter(event => event.eventType === type)
            .reduce((acc, event) => acc + event.capacity, 0)
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

        // Update state with bar chart data
        setBarData({
          labels: eventTypes,
          datasets: [
            {
              label: 'Remaining Seats',
              data: remainingSeats,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'Total Capacity',
              data: totalCapacity,
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }

    fetchEvents();
  }, []);

  function calculateSoldTickets(event: Event, tickets: EventTicket[]): number {
    return tickets
      .filter(ticket => ticket.event === event._id)
      .reduce((total, ticket) => total + ticket.noOfTickets, 0);
  }

  return (
    <Container>
      {/* <Title order={2} my="lg" style={{ color: '#64c1ff', fontWeight: 'bold', padding: 2 }}>
        Dashboard
      </Title> */}
      <SimpleGrid cols={2} spacing="lg">
        <Card shadow="sm" p="lg" style={{ backgroundColor: '#f0f4f8', borderRadius: '12px' }}>
          <Text size="lg" style={{ marginBottom: '8px', fontWeight: 'bold' }}>Total Sales</Text>
          <Text size="xl">{totalSales}</Text>
        </Card>
        <Card shadow="sm" p="lg" style={{ backgroundColor: '#f0f4f8', borderRadius: '12px' }}>
          <Text size="lg" style={{ marginBottom: '8px', fontWeight: 'bold' }}>Active Subscriptions</Text>
          <Text size="xl" >300</Text>
        </Card>
      </SimpleGrid>
      <SimpleGrid cols={2} spacing="lg" mt="xl">
        <Card shadow="sm" p="lg" style={{ height: '450px' }}>
          <Title order={3}>Sales Over Time</Title>
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

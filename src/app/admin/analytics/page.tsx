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
  remainingSeats: number;
  ticketsClasses: {
    ticketType: string;
    availability: number;
  }[];
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
      },
      {
        label: 'Total Capacity',
        data: [],
      },
    ],
  });

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events/v2');
        const data: Event[] = await response.json();
        console.log(data);

        const eventTypes = Array.from(new Set(data.map((event: Event) => event.eventType)));

        const eventCounts = eventTypes.map((type: string) =>
          data.filter((event: Event) => event.eventType === type).length
        );

        const remainingSeats = eventTypes.map((type: string) =>
          data.filter((event: Event) => event.eventType === type)
            .reduce((acc, event) => acc + event.remainingSeats, 0)
        );

        const totalCapacity = eventTypes.map((type: string) =>
          data.filter((event: Event) => event.eventType === type)
            .reduce((acc, event) => acc + event.capacity, 0)
        );

        const totalSales = data.reduce((acc, event) => acc + (event.capacity - event.remainingSeats), 0)
        setTotalSales(totalSales);

        // Pie chart data
        setPieData({
          labels: eventTypes,
          datasets: [
            {
              label: 'Events',
              data: eventCounts,
              backgroundColor: eventTypes.map((_, index) => {
                const colors = [
                  'rgba(255, 99, 132, 0.2)',
                  //'#8fbc8f',
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

        // Bar chart data
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

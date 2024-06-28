"use client";
import React from "react";
import { Card, SimpleGrid, Text, Title, Container } from "@mantine/core";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
);

const Dashboard = () => {
  const barData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Sales",
        data: [12, 19, 3, 5, 2, 3, 10],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: [
      "Conference",
      "Workshops",
      "Seminars",
      "Meetups",
      "Concerts",
      "Exhibitions",
    ],
    datasets: [
      {
        label: "Events",
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container>
      <Title
        order={2}
        my="lg"
        style={{ color: "#64c1ff", fontWeight: "bold", padding: 20 }}
      >
        Dashboard
      </Title>
      <SimpleGrid cols={3} spacing="lg">
        <Card shadow="sm" p="lg">
          <Text size="lg">Total Sales</Text>
          <Text size="sm">10,000</Text>
        </Card>
        <Card shadow="sm" p="lg">
          <Text size="lg">New Users</Text>
          <Text size="sm">50</Text>
        </Card>
        <Card shadow="sm" p="lg">
          <Text size="lg">Active Subscriptions</Text>
          <Text size="sm">300</Text>
        </Card>
      </SimpleGrid>
      <SimpleGrid cols={2} spacing="lg" mt="xl">
        <Card shadow="sm" p="lg">
          <Title order={3}>Sales Over Time</Title>
          <Bar data={barData} />
        </Card>
        <Card shadow="sm" p="lg">
          <Title order={3}>Events Distribution</Title>
          <Pie data={pieData} />
        </Card>
      </SimpleGrid>
    </Container>
  );
};

export default Dashboard;

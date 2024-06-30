'use client';
import { Card } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';

import analytics from '@/components/Analytics/analytics';

// Define props interface if needed
interface AnalyticsDashboardProps {}

// Define component
const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = () => {
  const [avgVisitorsPerDay, setAvgVisitorsPerDay] = useState<string>('');
  const [amtVisitorsToday, setAmtVisitorsToday] = useState<number>(0);
  const [visitorsLast7Days, setVisitorsLast7Days] = useState<number[]>([]);

  // Fetch visitor data on component mount
  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        // Fetch average visitors per day (if needed)
        // const avgVisitors = await analytics.getAverageVisitorsPerDay();

        // Fetch visitors today
        const visitorsToday = await analytics.getVisitorCount(
          new Date().toISOString().slice(0, 10),
        );

        // Fetch visitors over the last 7 days
        const visitorsLast7 = await analytics.getVisitorsLast7Days();

        // Update state
        setAvgVisitorsPerDay('TODO'); // Replace with actual data
        setAmtVisitorsToday(visitorsToday);
        setVisitorsLast7Days(visitorsLast7);
      } catch (error) {
        console.error('Error fetching visitor data:', error);
      }
    };

    fetchVisitorData();
  }, []);

  // Define chart data
  const barChartData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Visitors',
        data: visitorsLast7Days,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        data: visitorsLast7Days,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Render component
  return (
    <div className="flex flex-col gap-6">
      <div className="grid w-full mx-auto grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="w-full mx-auto max-w-xs bg-gray-800">
          <p className="text-tremor-default text-gray-400">Avg. visitors/day</p>
          <p className="text-3xl text-gray-200 font-semibold">
            {avgVisitorsPerDay}
          </p>
        </Card>
        <Card className="w-full mx-auto max-w-xs bg-gray-800">
          <p className="text-tremor-default text-gray-400">Visitors Today</p>
          <p className="text-3xl text-gray-200 font-semibold">
            {amtVisitorsToday}
          </p>
        </Card>

        <Card className="w-full mx-auto max-w-xs bg-gray-800">
          <p className="text-tremor-default text-gray-400 mb-4">
            Visitors Over the Last 7 Days
          </p>
          <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
        </Card>
        <Card className="w-full mx-auto max-w-xs bg-gray-800">
          <p className="text-tremor-default text-gray-400 mb-4">
            Visitors Distribution
          </p>
          <Pie data={pieChartData} options={{ maintainAspectRatio: false }} />
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

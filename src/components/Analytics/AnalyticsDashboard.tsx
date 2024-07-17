// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

'use client';

import { BarChart, Card, DonutChart } from '@tremor/react';

import analytics from './analytics';

interface AnalyticsDashboardProps {
  avgVisitorsPerDay: string;
  amtVisitorsToday: number;
  timeseriesPageviews: Awaited<ReturnType<typeof analytics.retreiveDays>>;
}

export const AnalyticsDashboard = ({
  avgVisitorsPerDay,
  amtVisitorsToday,
  timeseriesPageviews,
}: AnalyticsDashboardProps) => {
  const pieChartData = timeseriesPageviews.map((day) => ({
    name: day.date,
    value: day.events.reduce((acc, curr) => acc + Object.values(curr)[0]!, 0),
  }));

  const valueFormatter = (value: number) => `${value} visitors`;

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
          {timeseriesPageviews && (
            <BarChart
              allowDecimals={false}
              showAnimation
              data={timeseriesPageviews.map((day) => ({
                name: day.date,
                Visitors: day.events.reduce(
                  (acc, curr) => acc + Object.values(curr)[0]!,
                  0,
                ),
              }))}
              categories={['Visitors']}
              index="name"
            />
          )}
        </Card>
        <Card className="w-full mx-auto max-w-xs bg-gray-800">
          <p className="text-tremor-default text-gray-400 mb-4">
            Visitors Distribution
          </p>
          {timeseriesPageviews && (
            <DonutChart
              data={pieChartData}
              variant="pie"
              valueFormatter={valueFormatter}
              onValueChange={(v) => console.log(v)}
              showAnimation
            />
          )}
        </Card>
      </div>
    </div>
  );
};

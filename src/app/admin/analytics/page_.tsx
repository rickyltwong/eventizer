import { analytics } from '@/components/Analytics/analytics';
import { getDate } from '@/components/Analytics/analytics';
import { AnalyticsDashboard } from '@/components/Analytics/AnalyticsDashboard';

const page = async () => {
  const pageviews = await analytics.retreiveDays('pageview', 7);
  const totalPageViews = pageviews.reduce((acc, curr) => {
    return (
      acc +
      curr.events.reduce((acc, curr) => {
        return acc + Object.values(curr)[0]!;
      }, 0)
    );
  }, 0);

  const avgVisitorsPerDay = (totalPageViews / 7).toFixed(1);
  const amtVisitorsToday = pageviews
    .filter((ev) => ev.date === getDate())
    .reduce((acc, curr) => {
      return (
        acc +
        curr.events.reduce((acc, curr) => acc + Object.values(curr)[0]!, 0)
      );
    }, 0);

  return (
    <div className="min-h-screen w-full py-12 flex justify-center items-center">
      <div className="relative w-full max-w-6x1 ma-auto text-white">
        <AnalyticsDashboard
          avgVisitorsPerDay={avgVisitorsPerDay}
          amtVisitorsToday={amtVisitorsToday}
          timeseriesPageviews={pageviews}
        />
      </div>
    </div>
  );
};

export default page;

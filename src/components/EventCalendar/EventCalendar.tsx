'use client';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import moment from 'moment';
import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';

import { IEvent as EventType } from '@/types';

const localizer = momentLocalizer(moment);

interface CalendarEvent extends EventType {
  start: Date;
  end: Date;
  title: string;
}

interface EventCalendarProps {
  events: EventType[];
}

export default function EventCalendar({
  events,
}: EventCalendarProps): JSX.Element {
  const [calEvents, setCalEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<View>('month');
  const [date, setDate] = useState(new Date());

  const handleViewChange = (newView: View) => {
    setView(newView);
  };

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  useEffect(() => {
    const eventsData: CalendarEvent[] = events.map((event) => ({
      ...event,
      start: new Date(event.eventStartDateTime),
      end: new Date(event.eventEndDateTime),
      title: event.eventName,
    }));
    setCalEvents(eventsData);
    setIsLoading(false);
  }, [events]);

  //   useEffect(() => {
  //
  //   }, [date]);

  return (
    <div style={{ padding: '10px' }}>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Calendar
          localizer={localizer}
          events={calEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700, width: '100%' }}
          view={view}
          onView={handleViewChange}
          date={date}
          onNavigate={handleNavigate}
          onSelectEvent={(event) => {
            alert(event.title);
          }}
        />
      )}
    </div>
  );
}

'use client';

import {
  Button,
  Checkbox,
  Flex,
  Grid,
  GridCol,
  Loader,
  Pagination,
  Popover,
  SimpleGrid,
  Space,
  Tabs,
  Text,
} from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';
import axios from 'axios';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import {
  BadgeCard,
  CalendarIcon,
  EventCalendar,
  FooterSimple,
  GalleryIcon,
  HeaderSearch,
  HeroTitle,
  MapIcon,
  ResponsiveContainer,
} from '@/components';
import { LocationState } from '@/lib/constants';
import { IEvent, UserLocation } from '@/types';

const MapView = dynamic(() => import('@/components/MapView/MapView'), {
  ssr: false,
});

import { useMediaQuery } from '@mantine/hooks';

const categories: string[] = ['Yoga', 'Meditation', 'Fitness'];

export default function Page(): JSX.Element {
  const matches = useMediaQuery('(min-width: 48em)');
  const [activeTab, setActiveTab] = useState<string | null>('gallery');

  const [isLoading, setIsLoading] = useState(true);

  // Gallery tab
  const [events, setEvents] = useState<IEvent[]>([]);
  const itemsPerPage = matches ? 6 : 3;
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [inclCategory, setInclCategory] = useState<string[]>([]);

  const filteredEvents = events
    .filter((event: IEvent) => {
      if (inclCategory.length === 0) {
        return true;
      }
      return inclCategory.includes(event.eventType);
    })
    .sort((a, b) => {
      return (
        new Date(b.eventStartDateTime).getTime() -
        new Date(a.eventStartDateTime).getTime()
      );
    });

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 100,
      behavior: 'auto',
    });
  };

  // Events Near Me Tab
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationState, setLocationState] = useState<LocationState>(
    LocationState.LOADING,
  );

  // Fetch events with available tickets
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [eventsResponse, ticketsResponse] = await Promise.all([
          axios.get('/api/events'),
          axios.get('/admin/api/tickets'),
        ]);

        const eventsData = eventsResponse.data;
        const ticketsData = ticketsResponse.data;

        const eventsWithAvailableTickets: IEvent[] = eventsData
          .map((event: IEvent) => {
            const availableTickets = ticketsData.filter(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (ticket: any) =>
                ticket.event &&
                ticket.event._id === event._id &&
                ticket.status === 'Available',
            );

            if (availableTickets.length > 0) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              event.ticketsClasses = availableTickets.map((ticket: any) => ({
                ticketType: ticket.type,
                price: ticket.price,
                benefits: 'Sovenir',
                availability: ticket.status,
              }));
              return event;
            }
            return null;
          })
          .filter((event: IEvent) => event !== null) as IEvent[];

        const filteredEvents: IEvent[] = eventsWithAvailableTickets
          .filter((event) => {
            if (inclCategory.length === 0) {
              return true;
            }
            return inclCategory.includes(event.eventType);
          })
          .sort((a, b) => {
            return (
              new Date(b.eventStartDateTime).getTime() -
              new Date(a.eventStartDateTime).getTime()
            );
          });

        const calculatedPageCount = Math.ceil(
          filteredEvents.length / itemsPerPage,
        );
        setPageCount(calculatedPageCount);

        const adjustedCurrentPage = Math.min(
          Math.max(currentPage, 1),
          calculatedPageCount,
        );
        setCurrentPage(adjustedCurrentPage);

        setEvents(filteredEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [inclCategory, itemsPerPage, currentPage]);

  // Get user location
  useEffect(() => {
    if (activeTab === 'map') {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationState(LocationState.SUCCESS);
        },
        (error) => {
          console.error('Error obtaining location', error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationState(LocationState.PERMISSION_DENIED);
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationState(LocationState.POSITION_UNAVAILABLE);
              break;
            case error.TIMEOUT:
              setLocationState(LocationState.TIMEOUT);
              break;
            default:
              setLocationState(LocationState.UNKNOWN_ERROR);
              break;
          }
        },
      );
    }
  }, [activeTab]);

  return (
    <>
      <HeaderSearch />
      <HeroTitle />
      <Space h="md" />
      {!isLoading ? (
        <ResponsiveContainer>
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List>
              <Tabs.Tab value="gallery" leftSection={<GalleryIcon />}>
                Event Gallery
              </Tabs.Tab>
              <Tabs.Tab value="map" leftSection={<MapIcon />}>
                Events Near Me
              </Tabs.Tab>
              <Tabs.Tab value="calendar" leftSection={<CalendarIcon />}>
                Event Calendar
              </Tabs.Tab>
            </Tabs.List>
            <Space h="md" />
            <Tabs.Panel value="gallery">
              <Popover width={300} position="bottom-end" shadow="md">
                <Popover.Target>
                  <Button
                    leftSection={<IconFilter size={20} />}
                    variant="default"
                    styles={{
                      root: {
                        float: 'right',
                      },
                    }}
                  >
                    Filter
                  </Button>
                </Popover.Target>
                <Popover.Dropdown>
                  <Text
                    style={{
                      marginBottom: '1rem',
                    }}
                    fw={700}
                  >
                    Event Category
                  </Text>
                  <SimpleGrid cols={2}>
                    {categories.map((category) => (
                      <Checkbox
                        key={category}
                        label={category}
                        onChange={(event) => {
                          if (event.currentTarget.checked) {
                            setInclCategory([...inclCategory, category]);
                          } else {
                            setInclCategory(
                              inclCategory.filter((c) => c !== category),
                            );
                          }
                        }}
                      />
                    ))}
                  </SimpleGrid>
                </Popover.Dropdown>
              </Popover>
              <Space h="md" />
              <Grid>
                {paginatedEvents.map((event) => (
                  <GridCol span={{ base: 12, md: 6, lg: 4 }} key={event._id}>
                    <BadgeCard event={event} />
                  </GridCol>
                ))}
              </Grid>
              <Space h="lg" />
              <Space h="lg" />
              <Flex justify="center">
                <Pagination
                  total={pageCount}
                  value={currentPage}
                  onChange={handlePageChange}
                />
              </Flex>
            </Tabs.Panel>
            <Tabs.Panel value="map">
              {locationState !== LocationState.LOADING && (
                <MapView
                  events={events}
                  center={
                    locationState === LocationState.SUCCESS && userLocation
                      ? [userLocation.latitude, userLocation.longitude]
                      : [43.6532, -79.3832] // Default to Toronto
                  }
                  zoom={13}
                  isUserLocation={locationState === LocationState.SUCCESS}
                />
              )}
            </Tabs.Panel>
            <Tabs.Panel value="calendar">
              <EventCalendar events={events} />
            </Tabs.Panel>
          </Tabs>
        </ResponsiveContainer>
      ) : (
        <Loader
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
      <FooterSimple />
    </>
  );
}

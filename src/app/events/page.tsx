'use client';

import {
  Button,
  Checkbox,
  Flex,
  Grid,
  GridCol,
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

import { BadgeCard } from '@/components';
import EventCalendar from '@/components';
import { FooterSimple } from '@/components';
import { HeaderSearch } from '@/components';
import HeroClasses from '@/components/HeroTitle.module.css';
import ResponsiveContainer from '@/components/ResponsiveContainer/ResponsiveContainer';
import { IEvent } from '@/types';

// import MapView from '@/components/MapView';
const MapView = dynamic(
  () => import('@/components/MapView'),
  // , { ssr: false }
);

import { useMediaQuery } from '@mantine/hooks';

type UserLocation = {
  latitude: number;
  longitude: number;
} | null;

const categories: string[] = ['Yoga', 'Meditation', 'Fitness'];

enum LocationState {
  SUCCESS = 'success',
  PERMISSION_DENIED = 'permission_denied',
  POSITION_UNAVAILABLE = 'position_unavailable',
  TIMEOUT = 'timeout',
  UNKNOWN_ERROR = 'unknown_error',
  LOADING = 'loading',
}

export default function Page(): JSX.Element {
  const matches = useMediaQuery('(min-width: 48em)');
  const [activeTab, setActiveTab] = useState<string | null>('gallery');

  // Gallery tab
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Fetch events
  useEffect(() => {
    axios
      .get('/api/events')
      .then((response) => {
        setEvents(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  // Pagination
  useEffect(() => {
    setPageCount(Math.ceil(filteredEvents.length / itemsPerPage));

    if (currentPage > pageCount) {
      setCurrentPage(pageCount);
    } else if (currentPage < 1 && pageCount > 0) {
      setCurrentPage(1);
    }
  }, [filteredEvents, currentPage]);

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
      <ResponsiveContainer>
        <h1 className={HeroClasses.title}>
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            inherit
          >
            Upcoming Events
          </Text>
        </h1>
        <Grid>
          <GridCol span={{ base: 12, md: 11 }}>
            <Text className={HeroClasses.description} c="dimmed">
              Discover the latest events happening at Balance Studio. Browse our
              events to find the perfect class for you.
            </Text>
          </GridCol>
        </Grid>
      </ResponsiveContainer>
      <Space h="md" />
      <ResponsiveContainer>
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab
              value="gallery"
              leftSection={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
              }
            >
              Event Gallery
            </Tabs.Tab>
            <Tabs.Tab
              value="map"
              leftSection={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
                  />
                </svg>
              }
            >
              Events Near Me
            </Tabs.Tab>
            <Tabs.Tab
              value="calendar"
              leftSection={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 25 25"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                  />
                </svg>
              }
            >
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
                  <BadgeCard {...event} />
                </GridCol>
              ))}
            </Grid>
            <Space h="lg" />
            <Space h="lg" />
            {!isLoading && (
              <Flex justify="center">
                <Pagination
                  total={pageCount}
                  value={currentPage}
                  onChange={handlePageChange}
                />
              </Flex>
            )}
          </Tabs.Panel>
          <Tabs.Panel value="map">
            {/* {!isLoading && (
              <MapView
                events={events}
                center={
                  userLocation
                    ? [userLocation.latitude, userLocation.longitude]
                    : [43.6532, -79.3832] // Default to Toronto
                }
                zoom={13}
                isUserLocation={userLocation !== null}
              />
            )} */}
            {locationState !== LocationState.LOADING && (
              <MapView
                events={events}
                center={
                  locationState === LocationState.SUCCESS
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
      <FooterSimple />
    </>
  );
}

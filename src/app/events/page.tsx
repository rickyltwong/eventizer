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
import { Suspense, useEffect, useState } from 'react';

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
import { IEvent, UserLocation } from '@/types';

import Loading from './loading';

const MapView = dynamic(() => import('@/components/MapView/MapView'), {
  ssr: false,
});

import { useMediaQuery } from '@mantine/hooks';

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
    setIsLoading(true);

    axios
      .get('/api/events')
      .then((response) => {
        setEvents(response.data);
        const filtered = response.data
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

        const pageCount = Math.ceil(filtered.length / itemsPerPage);
        setPageCount(pageCount);

        const adjustedCurrentPage = Math.min(
          Math.max(currentPage, 1),
          pageCount,
        );
        setCurrentPage(adjustedCurrentPage);
      })
      .catch((error) => {
        console.error('Failed to fetch events:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [inclCategory, itemsPerPage]);

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
              <Suspense fallback={<Loading />}>
                {paginatedEvents.map((event) => (
                  <GridCol span={{ base: 12, md: 6, lg: 4 }} key={event._id}>
                    <BadgeCard event={event} />
                  </GridCol>
                ))}
              </Suspense>
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
      <FooterSimple />
    </>
  );
}

'use client';
import {
  Flex,
  Grid,
  GridCol,
  Group,
  Pagination,
  Space,
  Title,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BadgeCard, HeaderSearch, ProfileNav } from '@/components';
import { IEvent } from '@/types';

import classes from './page.module.css';

export default function Page() {
  const { data: session, status } = useSession();
  const [events, setEvents] = useState<IEvent[]>([]);
  const matches = useMediaQuery('(min-width: 48em)');
  const itemsPerPage = matches ? 6 : 3;
  const [pageCount, setPageCount] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  console.log(session);
  if (status === 'loading') console.log('Loading');

  if (status === 'authenticated') {
    console.log(session.user);
  }

  useEffect(() => {
    const fetchFavorites = async () => {
      if (session) {
        try {
          const response = await axios.get(
            `/api/user/${session.user.id}/favorites`,
          );
          const favoriteEvents = response.data;
          // setLiked(favoriteEvents.some((event: any) => event._id === eventId));
          setEvents(favoriteEvents);
          const pageCount = Math.ceil(favoriteEvents.length / itemsPerPage);
          setPageCount(pageCount);

          const adjustedCurrentPage = Math.min(
            Math.max(currentPage, 1),
            pageCount,
          );
          setCurrentPage(adjustedCurrentPage);
        } catch (error) {
          console.error('Error fetching favorites:', error);
        }
      }
    };
    fetchFavorites();
  }, [session?.user, itemsPerPage]);

  const paginatedEvents = events.slice(
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

  return (
    <>
      <HeaderSearch />
      <Group>
        <ProfileNav />
        <div className={classes.mainContent}>
          {/* <ResponsiveContainer> */}
          <Title order={1}>My Saved Events </Title>
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
          {/* </ResponsiveContainer> */}
        </div>
      </Group>
    </>
  );
}

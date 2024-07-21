'use client';

import { Flex, Grid, GridCol, Pagination, Space } from '@mantine/core';
import { useEffect, useState } from 'react';

import { BadgeCard } from '@/components';
import { IEvent } from '@/types';

interface EventsGalleryProps {
  events: IEvent[];
  itemsPerPage: number;
}

export default function EventsGallery({
  events,
  itemsPerPage,
}: EventsGalleryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    setPageCount(Math.ceil(events.length / itemsPerPage));
  }, [events, itemsPerPage]);

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
    </>
  );
}

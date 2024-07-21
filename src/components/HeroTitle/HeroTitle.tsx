'use client';

import { Grid, GridCol, Text } from '@mantine/core';

import { ResponsiveContainer } from '@/components';

import HeroClasses from './HeroTitle.module.css';

export default function HeroTitle() {
  return (
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
  );
}

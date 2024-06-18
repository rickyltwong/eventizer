'use client';

import {
  Anchor,
  Group,
  Button,
  CardProps,
  Container,
  SimpleGrid,
  Skeleton,
  Stack,
  Modal,
} from '@mantine/core';
import { PATH_DASHBOARD } from '@/routes';
import { ErrorAlert, PageHeader, ProjectsCard, EventForm } from '@/components';
import { useFetchData } from '../../../hooks';
import { useDisclosure } from '@mantine/hooks';

import { Event } from '@/types/event';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Events', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const ICON_SIZE = 18;

const CARD_PROPS: Omit<CardProps, 'children'> = {
  p: 'md',
  shadow: 'md',
  radius: 'md',
};

function Events() {
  const {
    data: events,
    loading: projectsLoading,
    error: projectsError,
  } = useFetchData('/api/events');
  const projectItems = events.map((p: any) => (
    <ProjectsCard key={p.id} {...p} {...CARD_PROPS} />
  ));
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <></>
      <Container fluid>
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <PageHeader title="Events" breadcrumbItems={items} />
            <Modal opened={opened} onClose={close} centered size="lg">
              <EventForm />
            </Modal>
            <Button variant="outline" color="blue" onClick={open}>
              Add New +
            </Button>
          </Group>
          {projectsError ? (
            <ErrorAlert
              title="Error loading projects"
              message={projectsError.toString()}
            />
          ) : (
            <SimpleGrid
              cols={{ base: 1, sm: 2, lg: 3, xl: 4 }}
              spacing={{ base: 10, sm: 'xl' }}
              verticalSpacing={{ base: 'md', sm: 'xl' }}>
              {projectsLoading
                ? Array.from({ length: 8 }).map((o, i) => (
                    <Skeleton
                      key={`project-loading-${i}`}
                      visible={true}
                      height={300}
                    />
                  ))
                : projectItems}
            </SimpleGrid>
          )}
        </Stack>
      </Container>
    </>
  );
}

export default Events;

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
  Notification
} from '@mantine/core';
import { PATH_DASHBOARD } from '@/routes';
import { ErrorAlert, PageHeader, ProjectsCard, EventForm } from '@/components';
import { useFetchData } from '../../../hooks';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { EventFormValues } from '@/types/event';

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
  const [eventList, setEventList] = useState<EventFormValues[]>([]);
  const [notification, setNotification] = useState({ message: '', color: '' });
  // const projectItems = eventList.map((p: any) => (
  //   <ProjectsCard key={p.id} {...p} {...CARD_PROPS} onDelete={handleDeleteEvent} />
  // ));
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    if (events) {
      setEventList(events);
    }
  }, [events]);

  const handleAddEvent = async () => {
    try {
      const response = await axios.get('/api/events');
      setEventList(response.data);
      setNotification({ message: 'Event created successfully!', color: 'green' });
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
    close();
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await axios.delete(`/admin/api/events/${id}`);
      console.log(id);
      const response = await axios.get('/api/events');
      setEventList(response.data);
      setNotification({ message: 'Event deleted successfully!', color: 'green' });
    } catch (error) {
      setNotification({ message: 'Failed to delete event. Please try again.', color: 'red' });
    }
  };

  return (
    <>
      <></>
      <Container fluid>
        <Stack gap="lg">
          <Group justify="space-between" align="center">
            <PageHeader title="Events" breadcrumbItems={items} />
            <Modal opened={opened} onClose={close} centered size="lg">
              <EventForm onAddEvent={handleAddEvent} closeModal={close} />
            </Modal>
            <Button variant="outline" color="blue" onClick={open}>
              Add New +
            </Button>
          </Group>
          {notification.message && (
            <Notification color={notification.color} onClose={() => setNotification({ message: '', color: '' })}>
              {notification.message}
            </Notification>
          )}
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
                :  eventList.map((p: any) => (
                  <ProjectsCard key={p.id} {...p} {...CARD_PROPS} onDelete={handleDeleteEvent} />
                ))}
            </SimpleGrid>
          )}
        </Stack>
      </Container>
    </>
  );
}

export default Events;

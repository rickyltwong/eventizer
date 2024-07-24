'use client';

import {
  Anchor,
  Button,
  Container,
  Group,
  Modal,
  Notification,
  PaperProps,
  SimpleGrid,
  Skeleton,
  Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { ErrorAlert, EventForm, PageHeader, ProjectsCard } from '@/components';
import { useFetchData } from '@/hooks';
import { PATH_DASHBOARD } from '@/routes';
import { EventFormValues } from '@/types';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Events', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

const CARD_PROPS: Omit<PaperProps, 'children'> = {
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
      setNotification({
        message: 'Event created successfully!',
        color: 'green',
      });
    } catch (error) {
      console.error('Failed to create event:', error);
      setNotification({
        message: 'Failed to create event. Please try again.',
        color: 'red',
      });
    }
    close();
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await axios.delete('/admin/api/events', { data: { id } });
      console.log(`Deleted event with ID: ${id}`);
      setEventList((prevEvents) =>
        prevEvents.filter((event) => event._id !== id),
      );
      setNotification({
        message: 'Event deleted successfully!',
        color: 'green',
      });
    } catch (error) {
      console.error('Failed to delete event:', error);
      setNotification({
        message: 'Failed to delete event. Please try again.',
        color: 'red',
      });
    }
  };

  const handleUpdateEvent = async (updatedEvent: EventFormValues) => {
    try {
      const { _id, ...updateData } = updatedEvent;
      const response = await axios.put('/admin/api/events', {
        id: _id,
        ...updateData,
      });
      const updatedEventData = response.data.event;
      setEventList((prevEvents) =>
        prevEvents.map((event) =>
          event._id === _id ? updatedEventData : event,
        ),
      );
      setNotification({
        message: 'Event updated successfully!',
        color: 'green',
      });
    } catch (error) {
      console.error('Failed to update event:', error);
      setNotification({
        message: 'Failed to update event. Please try again.',
        color: 'red',
      });
    }
  };

  return (
    <>
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
            <Notification
              color={notification.color}
              onClose={() => setNotification({ message: '', color: '' })}
            >
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
              verticalSpacing={{ base: 'md', sm: 'xl' }}
            >
              {projectsLoading
                ? Array.from({ length: 8 }).map((o, i) => (
                    <Skeleton
                      key={`project-loading-${i}`}
                      visible={true}
                      height={300}
                    />
                  ))
                : eventList.map((event) =>
                    event._id ? (
                      <ProjectsCard
                        key={event._id as string}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        {...(event as any)}
                        {...CARD_PROPS}
                        onDelete={handleDeleteEvent}
                        onUpdate={handleUpdateEvent}
                      />
                    ) : null,
                  )}
            </SimpleGrid>
          )}
        </Stack>
      </Container>
    </>
  );
}

export default Events;

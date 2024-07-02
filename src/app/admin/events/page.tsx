'use client';

import {
  Anchor,
  Button,
  CardProps,
  Container,
  Group,
  SimpleGrid,
  Skeleton,
  Stack,
  Modal,
  Notification,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { EventFormValues } from '@/types/event';
import { ErrorAlert, EventForm, PageHeader, ProjectsCard } from '@/components';
import { useFetchData } from '@/hooks';
import { PATH_DASHBOARD } from '@/routes';
import { IEvent } from '@/types';

const items = [
  { title: 'Dashboard', href: PATH_DASHBOARD.default },
  { title: 'Events', href: '#' },
].map((item, index) => (
  <Anchor href={item.href} key={index}>
    {item.title}
  </Anchor>
));

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
      setNotification({
        message: 'Event created successfully!',
        color: 'green',
      });
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
    close();
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await axios.delete(`/admin/api/events`, { data: { id } });

      console.log(`Deleted event with ID: ${id}`);
      setEventList((prevEvents) =>
        prevEvents.filter((event) => event._id !== id),
      );
      setNotification({
        message: 'Event deleted successfully!',
        color: 'green',
      });
    } catch (error) {
      setNotification({
        message: 'Failed to delete event. Please try again.',
        color: 'red',
      });
    }
  };

  const handleUpdateEvent = async (
    updatedEvent: EventFormValues & { _id: string },
  ) => {
    try {
      const { _id, ...updateData } = updatedEvent;
      await axios.put(`/admin/api/events`, { id: _id, ...updateData });
      const response = await axios.get('/api/events');
      setEventList(response.data);
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
                : eventList.map((event) => (
                    <ProjectsCard
                      key={event._id}
                      {...event}
                      {...CARD_PROPS}
                      onDelete={handleDeleteEvent}
                      onUpdate={handleUpdateEvent}
                    />
                  ))}
            </SimpleGrid>
          )}
        </Stack>
      </Container>
    </>
  );
}

export default Events;

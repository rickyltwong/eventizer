'use client';

import {
  Badge,
  Button,
  Card,
  Group,
  Image,
  MantineColor,
  Text,
} from '@mantine/core';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import EventRegistrationModal from '@/app/events/[eventid]/EventRegistrationModal';
import { LikeButton } from '@/components';
import { IEvent, Status } from '@/types';

import classes from './BadgeCard.module.css';

const StatusBadge = ({ status }: { status: Status }) => {
  let color: MantineColor = '';

  switch (status) {
    case 'Upcoming':
      color = 'green';
      break;
    case 'Cancelled':
      color = 'red';
      break;
    case 'Expired':
      color = 'dark';
      break;
    default:
      color = 'gray';
  }

  return (
    <Badge
      color={color}
      variant="filled"
      radius="sm"
      className={classes.statusBadge}
    >
      {status}
    </Badge>
  );
};

export default function BadgeCard({ event }: { event: IEvent }) {
  const router = useRouter();
  const [isBookModalOpen, setBookModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent>();
  const [isUserFavorite, setIsUserFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { data: session } = useSession();
  const handleShowDetails = (id: string) => {
    router.push(`/events/${id}`);
  };

  const {
    eventName,
    eventStartDateTime,
    eventType,
    ticketsClasses,
    instructorName,
    difficulty,
    _id,
  } = event;

  const image =
    eventType === 'Yoga'
      ? 'https://plus.unsplash.com/premium_photo-1713908274754-4610e1ca3a89?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
      : eventType === 'Meditation'
        ? 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        : 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  const eventDate = new Date(eventStartDateTime).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const isExpired = new Date(eventStartDateTime) < new Date();
  const status =
    instructorName === 'Ricky Wong'
      ? 'Cancelled'
      : isExpired
        ? 'Expired'
        : 'Upcoming';

  const features = ticketsClasses
    ? ticketsClasses.map((ticketsClass) => (
        <Badge variant="light" key={ticketsClass.ticketType}>
          {ticketsClass.ticketType}
        </Badge>
      ))
    : [];

  const onCloseBookingModal = () => {
    setBookModalOpen(false);
  };

  useEffect(() => {
    setIsLoading(true);
    const checkLiked = async () => {
      if (session?.user) {
        try {
          const response = await axios.get(
            `/api/user/${session.user.id}/favourites`,
            {
              params: { email: session.user.email },
            },
          );

          const favoriteEvents = response.data;
          const favoriteMatch = favoriteEvents.filter(
            (event: IEvent) => event._id === _id,
          );
          console.log('filtered favorite: ', favoriteMatch.length);
          setIsUserFavorite(favoriteMatch.length > 0);

          // set isLoading to false
          setIsLoading(false);
        } catch (error) {
          console.error('Error fetching favorites:', error);
          setIsLoading(false);
        } finally {
          setIsLoading(false);
        }
      }
    };
    checkLiked();
    setIsLoading(false);
  }, [isUserFavorite]);

  return (
    !isLoading && (
      <>
        <Card
          shadow="sm"
          withBorder
          radius="md"
          p="md"
          className={classes.card}
        >
          <Card.Section className={classes.imageSection}>
            <StatusBadge status={status} />
            <Image
              src={image}
              alt={eventName}
              height={180}
              className={status === 'Expired' ? classes.dimmedImage : ''}
            />
          </Card.Section>

          <Card.Section className={classes.section} mt="md">
            <Group justify="apart">
              <Text fz="h4" fw={700} truncate component="p">
                {eventName}
              </Text>
            </Group>
            <Badge size="sm" variant="light">
              {difficulty}
            </Badge>
            <Text fz="sm" mt="xs" c="gray">
              {eventDate}
            </Text>
          </Card.Section>

          <Card.Section className={classes.section}>
            <Text mt="md" className={classes.label} c="dimmed">
              Available Ticket Classes
            </Text>
            <Group gap={7} mt={5}>
              {features}
            </Group>
          </Card.Section>
          <Group mt="xs">
            {session?.user && (
              <LikeButton eventId={_id} status={isUserFavorite}></LikeButton>
            )}
            <Button
              radius="md"
              variant="light"
              style={{ flex: 1 }}
              onClick={() => handleShowDetails(_id)}
            >
              Show details
            </Button>
            <Button
              radius="md"
              style={{ flex: 1 }}
              onClick={() => {
                setBookModalOpen(true);
                setSelectedEvent(event);
              }}
            >
              Book now
            </Button>
          </Group>
        </Card>
        {selectedEvent && (
          <EventRegistrationModal
            event={selectedEvent}
            isOpen={isBookModalOpen}
            onCloseModal={onCloseBookingModal}
          />
        )}
      </>
    )
  );
}

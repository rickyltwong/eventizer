'use client';

import {
  Badge,
  Button,
  Divider,
  Flex,
  Group,
  MantineColor,
  Modal,
  Paper,
  PaperProps,
  Progress,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBuilding, IconEdit, IconTrash } from '@tabler/icons-react';
import axios from 'axios';
import { format } from 'date-fns';
import { useState } from 'react';

import { EventForm } from '@/components';
import { EventFormValues } from '@/types/event';

const determineEventStatus = (
  eventStartDateTime: Date,
  eventEndDateTime: Date,
): Status => {
  const now = new Date();
  const start = new Date(eventStartDateTime);
  const end = new Date(eventEndDateTime);

  if (now < start) {
    return 'upcoming';
  } else if (now >= start && now <= end) {
    return 'ongoing';
  } else {
    return 'expired';
  }
};

type Status = 'upcoming' | 'cancelled' | 'expired' | 'ongoing';

type ProjectsCardProps = {
  _id: string;
  remainingSeats: number;
  onDelete: (id: string) => void;
  onUpdate: (event: EventFormValues & { _id: string }) => void;
} & EventFormValues &
  Omit<PaperProps, 'children'>;

const StatusBadge = ({ status }: { status: string }) => {
  let color: MantineColor;

  switch (status) {
    case 'expired':
      color = 'dark';
      break;
    case 'cancelled':
      color = 'gray';
      break;
    case 'upcoming':
      color = 'yellow.8';
      break;
    case 'ongoing':
      color = 'teal';
      break;
    default:
      color = 'gray';
  }

  return (
    <Badge color={color} variant="filled" radius="sm">
      {status}
    </Badge>
  );
};

const ProjectsCard = (props: ProjectsCardProps) => {
  // const { colorScheme } = useMantineColorScheme();
  const {
    _id,
    capacity,
    remainingSeats,
    eventAddress,
    eventStartDateTime,
    eventEndDateTime,
    // eventDescription,
    eventName,
    onDelete,
    onUpdate,
    ...others
  } = props;

  const [opened, { open, close }] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [eventDetails, setEventDetails] = useState<EventFormValues | null>(
    null,
  );

  const formattedStart = eventStartDateTime
    ? format(new Date(eventStartDateTime), 'PPpp')
    : 'Invalid date';
  const formattedEnd = eventEndDateTime
    ? format(new Date(eventEndDateTime), 'PPpp')
    : 'Invalid date';
  const status = determineEventStatus(eventStartDateTime, eventEndDateTime);
  const venueName = eventAddress?.venueName || 'Unknown venue';

  const handleEdit = async () => {
    try {
      console.log('Fetching event details...');
      const response = await axios.get(`/api/events/${_id}`);
      setEventDetails({
        _id,
        eventName: response.data.eventName,
        eventDescription: response.data.eventDescription,
        eventAddress: {
          venueName: response.data.eventAddress.venueName,
          addressLine1: response.data.eventAddress.addressLine1,
        },
        eventStartDateTime: new Date(response.data.eventStartDateTime),
        eventEndDateTime: new Date(response.data.eventEndDateTime),
        instructorName: response.data.instructorName,
        eventType: response.data.eventType,
        capacity: response.data.capacity,
        difficulty: response.data.difficulty,
        minimumAge: response.data.minimumAge,
      });
      open();
    } catch (error) {
      console.error('Failed to fetch event details:', error);
    }
  };

  const handleDelete = () => {
    onDelete(_id);
    closeDeleteModal();
  };

  return (
    <Paper {...others}>
      <Stack gap="sm">
        <Flex justify="space-between" align="center">
          <Flex align="center" gap="xs">
            <Text fz="md" fw={600} lineClamp={1}>
              {eventName}
            </Text>
          </Flex>
        </Flex>
        <Text fz="sm" lineClamp={1}>
          From: {formattedStart}
        </Text>
        <Text fz="sm" lineClamp={1}>
          To: {formattedEnd}
        </Text>

        <Text fz="sm">
          Enrollment:{' '}
          <Text span fz="sm" fw={500}>
            {capacity - remainingSeats} / {capacity}
          </Text>
        </Text>

        <Progress
          value={((capacity - remainingSeats) * 100) / capacity}
          mt={5}
          size="sm"
          color={
            ((capacity - remainingSeats) * 100) / capacity < 21
              ? 'red'
              : ((capacity - remainingSeats) * 100) / capacity < 51
                ? 'yellow'
                : ((capacity - remainingSeats) * 100) / capacity < 86
                  ? 'blue'
                  : 'green'
          }
        />
        <Group align="center" gap="xs" wrap="nowrap">
          <IconBuilding size={14} />
          <Text fz="sm" lineClamp={1}>
            {venueName}
          </Text>
        </Group>

        <Divider />

        <Group gap="sm">
          <StatusBadge status={status} />
          <Modal
            opened={opened}
            onClose={close}
            title="Event Detail"
            centered
            size="lg"
          >
            {eventDetails && (
              <EventForm
                onUpdateEvent={onUpdate}
                closeModal={close}
                initialValues={eventDetails}
              />
            )}
          </Modal>
          <Button
            size="compact-md"
            variant="subtle"
            onClick={handleEdit}
            leftSection={<IconEdit size={14} />}
          >
            Edit
          </Button>
          <IconTrash
            style={{ width: 20, height: 20 }}
            color="var(--mantine-color-red-filled)"
            onClick={openDeleteModal}
          />
          <Modal
            opened={deleteModalOpened}
            onClose={closeDeleteModal}
            title="Confirm Deletion"
            centered
            size="sm"
          >
            <Text>Are you sure you want to delete this event?</Text>
            <Group align="center" mt="md">
              <Button color="red" onClick={handleDelete}>
                Confirm
              </Button>
              <Button variant="outline" onClick={closeDeleteModal}>
                Cancel
              </Button>
            </Group>
          </Modal>
        </Group>
      </Stack>
    </Paper>
  );
};

export default ProjectsCard;

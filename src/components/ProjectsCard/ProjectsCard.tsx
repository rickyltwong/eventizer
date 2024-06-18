'use client';

import {
  Avatar,
  Badge,
  Button,
  Divider,
  Flex,
  Group,
  Image,
  Modal,
  MantineColor,
  Paper,
  PaperProps,
  Progress,
  Stack,
  Text,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { Surface, EventForm } from '@/components';
import { IconNotebook, IconShare, IconEdit, IconBuilding,  IconTrash} from '@tabler/icons-react';
import classes from './ProjectsCard.module.css';
import { useDisclosure } from '@mantine/hooks';
import { format } from 'date-fns';

type Address = {
  venueName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
};
type ProjectsCardProps = {
  id: string;
  eventName: string;
  eventDescription: string;
  eventAddress: Address;
  capacity: number;
  remainingSeats: number;
  eventStartDateTime: string;
  eventEndDateTime: string
} & Omit<PaperProps, 'children'>;

const determineEventStatus = (eventStartDateTime: string, eventEndDateTime: string): Status => {
  const now = new Date();
  const start = new Date(eventStartDateTime);
  const end = new Date(eventEndDateTime);

  if (now < start) {
    return 'upcoming'; // The current time is before the event start time
  } else if (now >= start && now <= end) {
    return 'ongoing'; // The current time is during the event
  } else {
    return 'expired'; // The current time is after the event end time
  }
};

type Status =
  | 'upcoming'
  | 'cancelled'
  | 'expired'
  | string;

type StatusProps = {
  status: Status;
};

const StatusBadge = ({ status }: { status: string}) => {
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
  const { colorScheme } = useMantineColorScheme();
  const { id, capacity,remainingSeats,eventAddress, eventStartDateTime,eventEndDateTime, eventDescription, eventName, venue, ...others } =
    props;
const [opened, { open, close }] = useDisclosure(false);
const formattedStart = format(new Date(eventStartDateTime), 'PPpp');
  const formattedEnd = format(new Date(eventEndDateTime), 'PPpp');
  const status = determineEventStatus(eventStartDateTime, eventEndDateTime);
  const venueName = eventAddress.venueName;
  return (
    <Surface component={Paper} {...others}>
      <Stack gap="sm">
        <Flex justify="space-between" align="center">
          <Flex align="center" gap="xs">
            {/* {image && <Image src={image} width={20} height={20} radius="50%" />} */}
            <Text fz="md" fw={600} lineClamp={1}>
              {eventName}
            </Text>
          </Flex>
          {/* <StatusBadge status={status} /> */}
        </Flex>
        <Text fz="sm" lineClamp={1}>
          From: {formattedStart}
        </Text>
        <Text fz="sm" lineClamp={1}>
          To: {formattedEnd}
        </Text>

        <Text fz="sm">
          Enrollment:{' '}
          <Text span fz="sm" fw={500} className={classes.tasksCompleted}>
            {capacity - remainingSeats} / {capacity}
          </Text>
        </Text>

        <Progress
          value={((capacity - remainingSeats) * 100 / capacity)}
          mt={5}
          size="sm"
          color={
            ((capacity - remainingSeats) * 100 / capacity)  < 21
              ? 'red'
              : ((capacity - remainingSeats) * 100 / capacity) < 51
                ? 'yellow'
                : ((capacity - remainingSeats) * 100 / capacity) < 86
                  ? 'blue'
                  : 'green'
          }
        />
        <Group align="center" gap="xs" wrap="nowrap">
          <IconBuilding size={14} />
          <Text fz="sm" lineClamp={1}>{venueName}</Text>
        </Group>



        <Divider />

        <Group gap="sm">
        <StatusBadge status={status} />
          <Modal opened={opened} onClose={close} title="Event Detail" centered size="lg">
            <EventForm />
          </Modal>
          <Button
            size="compact-md"
            variant="subtle"
            onClick={open}
            leftSection={<IconEdit size={14}
             />}
          >
            Edit
          </Button>
          <IconTrash style={{ width: (20), height: (20) }} color="var(--mantine-color-red-filled)"></IconTrash>
        </Group>
      </Stack>
    </Surface>
  );
};

export default ProjectsCard;

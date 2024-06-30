'use client';
import {
  Button,
  Container,
  Group,
  NumberInput,
  Select,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';

interface EventFormValues {
  title: string;
  description: string;
  venue: string;
  address: string;
  startDateTime: Date | null;
  endDateTime: Date | null;
  instructor: string;
  type: string;
  capacity: number;
  difficulty: string;
  minimumAge: number;
}

const difficulties = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const types = [
  { value: 'workshop', label: 'Workshop' },
  { value: 'seminar', label: 'Seminar' },
  { value: 'course', label: 'Course' },
];

const EventForm = () => {
  const form = useForm<EventFormValues>({
    initialValues: {
      title: '',
      description: '',
      venue: '',
      address: '',
      startDateTime: null,
      endDateTime: null,
      instructor: '',
      type: '',
      capacity: 1,
      difficulty: '',
      minimumAge: 0,
    },
  });

  return (
    <Container size="xxl" px={50} py={30}>
      <Title order={2} ta="center">
        Event Details
      </Title>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput
          label="Event Title"
          placeholder="Enter event title"
          {...form.getInputProps('title')}
          mt="md"
          mb="sm"
        />
        <Textarea
          label="Description"
          placeholder="Enter event description"
          {...form.getInputProps('description')}
          mb="sm"
        />
        <TextInput
          label="Venue"
          placeholder="Enter event venue"
          {...form.getInputProps('venue')}
          mb="sm"
        />
        <TextInput
          label="Address"
          placeholder="Enter venue address"
          {...form.getInputProps('address')}
          mb="sm"
        />
        <DateTimePicker
          label="Start Date Time"
          placeholder="Pick start date and time"
          {...form.getInputProps('startDateTime')}
          mb="sm"
        />
        <DateTimePicker
          label="End Date Time"
          placeholder="Pick end date and time"
          {...form.getInputProps('endDateTime')}
          mb="sm"
        />
        <TextInput
          label="Instructor"
          placeholder="Enter instructor's name"
          {...form.getInputProps('instructor')}
          mb="sm"
        />
        <Select
          label="Type"
          placeholder="Select event type"
          data={types}
          {...form.getInputProps('type')}
          mb="sm"
        />
        <NumberInput
          label="Capacity"
          placeholder="Enter capacity"
          {...form.getInputProps('capacity')}
          mb="sm"
        />
        <Select
          label="Difficulty"
          placeholder="Select difficulty level"
          data={difficulties}
          {...form.getInputProps('difficulty')}
          mb="sm"
        />
        <NumberInput
          label="Minimum Age"
          placeholder="Enter minimum age requirement"
          {...form.getInputProps('minimumAge')}
          mb="sm"
        />
        <Group align="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Container>
  );
};
export default EventForm;

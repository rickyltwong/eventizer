import {
  Button,
  Checkbox,
  Container,
  Group,
  Notification,
  NumberInput,
  Select,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { useEffect, useState } from 'react';

// import { DropzoneButton } from '@/components';
import { EventFormValues } from '@/types/event';

interface EventFormProps {
  onAddEvent?: (event: EventFormValues) => void;
  onUpdateEvent?: (event: EventFormValues) => void;
  closeModal: () => void;
  initialValues?: EventFormValues;
}

const difficulties = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const types = [
  { value: 'Fitness', label: 'Fitness' },
  { value: 'Yoga', label: 'Yoga' },
  { value: 'Meditation', label: 'Meditation' },
];

const EventForm = ({
  onAddEvent,
  closeModal,
  onUpdateEvent,
  initialValues,
}: EventFormProps) => {
  const [notification, setNotification] = useState({ message: '', color: '' });

  const form = useForm<EventFormValues>({
    initialValues: initialValues || {
      eventName: '',
      eventDescription: '',
      eventAddress: {
        venueName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        latitude: 43.6532,
        longitude: -79.3832,
      },
      eventStartDateTime: null,
      eventEndDateTime: null,
      instructorName: '',
      eventType: '',
      capacity: 1,
      difficulty: '',
      minimumAge: 18,
      ticketTypes: [],
      image: '',
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.setValues({
        ...initialValues,
        eventAddress: {
          ...form.values.eventAddress,
          ...initialValues.eventAddress,
        },
      });
    }
  }, [initialValues]);

  const handleSubmit = async (values: EventFormValues) => {
    try {
      let imageUrl = '';

      // Assign predefined image URL based on event type
      if (values.eventType === 'Yoga') {
        imageUrl =
          'https://plus.unsplash.com/premium_photo-1713908274754-4610e1ca3a89?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
      } else if (values.eventType === 'Meditation') {
        imageUrl =
          'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
      } else {
        imageUrl =
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
      }

      if (onAddEvent) {
        const eventResponse = await axios.post('/admin/api/events', {
          ...values,
          image: imageUrl,
        });

        onAddEvent(eventResponse.data);

        if (eventResponse.data) {
          const eventId = eventResponse.data.event._id;
          const ticketCreationPromises = values.ticketTypes.map((ticketType) =>
            axios.post('/admin/api/tickets', {
              event: eventId,
              type: ticketType,
              markedPrice: 50,
              price: 50,
              discount: 0,
              status: 'Pending',
              sold: 0,
            }),
          );

          await Promise.all(ticketCreationPromises);
        }
      } else if (onUpdateEvent) {
        const { _id, ...updateData } = values;
        await axios.put('/admin/api/events', { id: _id, ...updateData });
        onUpdateEvent({ ...values, _id: initialValues?._id });
      }

      closeModal();
    } catch (error) {
      console.error('Error:', error);
      setNotification({
        message: 'Failed to create event. Please try again.',
        color: 'red',
      });
    }
  };

  return (
    <Container size="xxl" px={50} py={30}>
      <Title order={2} ta="center">
        Event Details
      </Title>
      {notification.message && (
        <Notification
          color={notification.color}
          onClose={() => setNotification({ message: '', color: '' })}
        >
          {notification.message}
        </Notification>
      )}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Event Name"
          placeholder="Enter event title"
          {...form.getInputProps('eventName')}
          mt="md"
          mb="sm"
        />
        <Textarea
          label="Description"
          placeholder="Enter event description"
          {...form.getInputProps('eventDescription')}
          mb="sm"
        />
        <TextInput
          label="Venue"
          placeholder="Enter event venue"
          {...form.getInputProps('eventAddress.venueName')}
          mb="sm"
        />
        <TextInput
          label="Address"
          placeholder="Enter venue address"
          {...form.getInputProps('eventAddress.addressLine1')}
          mb="sm"
        />
        <DateTimePicker
          label="Start Date Time"
          placeholder="Pick start date and time"
          {...form.getInputProps('eventStartDateTime')}
          mb="sm"
        />
        <DateTimePicker
          label="End Date Time"
          placeholder="Pick end date and time"
          {...form.getInputProps('eventEndDateTime')}
          mb="sm"
        />
        <TextInput
          label="Instructor"
          placeholder="Enter instructor's name"
          {...form.getInputProps('instructorName')}
          mb="sm"
        />
        <Select
          label="Type"
          placeholder="Select event type"
          data={types}
          {...form.getInputProps('eventType')}
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
        <Checkbox.Group
          label="Ticket Type"
          {...form.getInputProps('ticketTypes', { type: 'checkbox' })}
          mb="sm"
        >
          <Group>
            <Checkbox value="general" label="General" />
            <Checkbox value="vip" label="VIP" />
          </Group>
        </Checkbox.Group>

        <Group align="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Container>
  );
};

export default EventForm;

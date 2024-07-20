import { Button, TextInput, Textarea, NumberInput, Select, Group, Container, Title, Notification, Checkbox, Text } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { EventFormValues } from '@/types/event';
import { DropzoneButton } from '@/components';

interface EventFormProps {
  onAddEvent?: (event: EventFormValues) => void;
  onUpdateEvent?: (event: EventFormValues & { _id: string }) => void;
  closeModal: () => void;
  initialValues?: EventFormValues & { _id: string };
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

const ticketTypes = [
  { value: 'general', label: 'General' },
  { value: 'vip', label: 'VIP' },
];

const EventForm = ({ onAddEvent, closeModal, onUpdateEvent, initialValues }: EventFormProps) => {
  const [notification, setNotification] = useState({ message: '', color: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<EventFormValues>({
    initialValues: initialValues || {
      eventName: '',
      eventDescription: '',
      eventAddress: {
        venueName: '',
        addressLine1: '',
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
      form.setValues(initialValues);
    }
  }, [initialValues]);

  const handleFileUpload = (file: File) => {
    setImageFile(file);
  };

  const handleSubmit = async (values: EventFormValues) => {
    try {
      let imageUrl = '';
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const uploadResponse = await axios.post('/admin/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        imageUrl = uploadResponse.data.imageUrl;
      }

      const eventResponse = await axios.post('/admin/api/events', {
        ...values,
        image: imageUrl,
      });

      if (onAddEvent) {
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
            })
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
      setNotification({ message: 'Failed to create event. Please try again.', color: 'red' });
    }
  };

  return (
    <Container size="xxl" px={50} py={30}>
      <Title order={2} ta="center">
        Event Details
      </Title>
      {notification.message && (
        <Notification color={notification.color} onClose={() => setNotification({ message: '', color: '' })}>
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
        <DropzoneButton onFileUpload={handleFileUpload} />
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






'use client';

import 'react-toastify/dist/ReactToastify.css';

import {
  Button,
  Flex,
  Modal,
  NumberInput,
  Select,
  Space,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';

import { IEvent } from '@/types';

type EventRegistrationModalProps = {
  event: IEvent;
  isOpen: boolean;
  onCloseModal: () => void;
};

type Ticket = {
  eventId: string;
  userId: string | undefined;
  ticketType: string;
  noOfTickets: number;
  price: number;
  purchaseDate: Date;
};

type TicketForm = {
  name: string;
  email: string;
  ticketType: string;
  noOfTicket: number;
};

const EventRegistrationModal = function ({
  event,
  isOpen,
  onCloseModal,
}: EventRegistrationModalProps) {
  const { eventid } = useParams();
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session?.user?.email) {
      router.push(
        '/api/auth/signin?callbackUrl=' +
          encodeURIComponent(window.location.pathname),
      );
      return;
    }
  }, []);

  const form = useForm({
    initialValues: {
      name: session?.user?.name || '', // Provide default values to avoid undefined errors
      email: session?.user?.email || '',
      ticketType: '',
      noOfTicket: 1,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      name: (value) => (value.length > 0 ? null : 'Name is required'),
      noOfTicket: (value) =>
        value >= 1 && value <= (event?.capacity || 1)
          ? null
          : `Number of tickets must be between 1 and ${event?.capacity || 1}`,
    },
  });
  const [price, setPrice] = useState(event.ticketsClasses[0].price);
  const [maxCapacity, setMaxCapacity] = useState(1);

  useEffect(() => {
    const selectedTicket = event.ticketsClasses.find(
      (ticket) => ticket.ticketType === form.values.ticketType,
    );
    setPrice((selectedTicket?.price || 1) * form.values.noOfTicket);
    setMaxCapacity(selectedTicket?.availability || 1);
  }, [form.values.ticketType, form.values.noOfTicket]);

  const handleClose = () => {
    form.reset();
    close();
    onCloseModal();
  };

  const handleEventRegister = (register: TicketForm) => {
    const ticketRegistration: Ticket = {
      eventId: eventid ? eventid.toString() : event._id,
      userId: register.email,
      noOfTickets: register.noOfTicket,
      ticketType: register.ticketType,
      price: price,
      purchaseDate: new Date(),
    };

    axios
      .post(
        `/api/events/${eventid ? eventid.toString() : event._id}/register`,
        JSON.stringify(ticketRegistration),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(() => {
        toast.success('Successfully registered the event');
        handleClose();
      })
      .catch((error) => {
        console.log(error);
        toast.error(
          error?.response?.data?.error || 'Unable to register the event',
        );
        console.error(error);
      });
  };

  return (
    <div>
      {/*<h2>Test Page</h2>*/}
      <Modal
        opened={isOpen}
        onClose={handleClose}
        title={<Title order={2}>{`Register for ${event.eventName}`}</Title>}
        closeOnClickOutside={false}
        centered
        size="lg"
      >
        <form onSubmit={form.onSubmit((values) => handleEventRegister(values))}>
          <Text className="mb-4">{`Location: ${event.eventAddress?.venueName}, ${event.eventAddress?.addressLine1}, ${event.eventAddress?.city}`}</Text>
          <Text className="mb-4">{`Date: ${new Date(event.eventStartDateTime).toLocaleString()}`}</Text>
          <TextInput
            withAsterisk
            label="Full Name"
            disabled
            placeholder="Full name"
            {...form.getInputProps('name')}
            classNames={{
              input: 'p-2 border border-gray-300 rounded-lg',
              label: 'font-semibold mb-2',
            }}
          />
          <TextInput
            withAsterisk
            label="Email"
            disabled
            placeholder="your@email.com"
            {...form.getInputProps('email')}
            classNames={{
              input: 'p-2 border border-gray-300 rounded-lg',
              label: 'font-semibold mb-2',
            }}
          />
          <Select
            withAsterisk
            label="Ticket Type"
            placeholder="Select ticket type"
            data={event.ticketsClasses.map((ticket) => ({
              value: ticket.ticketType,
              label: `${ticket.ticketType} - $${ticket.price}`,
            }))}
            {...form.getInputProps('ticketType')}
            classNames={{
              input: 'p-2 border border-gray-300 rounded-lg',
              label: 'font-semibold mb-2',
            }}
          />
          <NumberInput
            withAsterisk
            label="No Of Tickets"
            placeholder={`Enter number of tickets (Max: ${maxCapacity})`}
            {...form.getInputProps('noOfTicket')}
            min={1}
            max={maxCapacity}
            classNames={{
              input: 'p-2 border border-gray-300 rounded-lg',
              label: 'font-semibold mb-2',
            }}
          />{' '}
          <Space h="sm" />
          <Text fw={700} size="xl">
            Price: ${price}
          </Text>
          <Flex
            mih={50}
            gap="md"
            justify="flex-end"
            align="center"
            direction="row"
            wrap="wrap-reverse"
          >
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </Button>
          </Flex>
        </form>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default EventRegistrationModal;

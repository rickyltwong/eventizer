'use client';

import { Badge, Button, Card, Divider, Group, Text } from '@mantine/core';
import axios from 'axios';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

import EventRegistrationModal from '@/app/events/[eventid]/EventRegistrationModal';
import { FooterSimple, HeaderSearch } from '@/components';
import { IEvent } from '@/types';

const Page = () => {
  const { eventid } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<IEvent>();
  const [registrationModalOpen, setModalOpen] = useState(false);
  const [qrData, setQrData] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.email) {
      router.push(
        '/api/auth/signin?callbackUrl=' +
          encodeURIComponent(window.location.pathname),
      );
      return;
    }

    setIsAuthenticated(true);
    axios
      .get('/api/events/' + eventid + '/ticket?user=' + session?.user?.email)
      .then((response) => {
        setQrData(response.data.qr);
        setLoading(false);
      })
      .catch((error) => {
        getEventData();
        console.error(error);
      });
  }, []);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = qrData;
    link.download = 'ticket.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getEventData = () => {
    axios
      .get('/api/events/' + eventid)
      .then((response) => {
        setEvent(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getEventDate = (date: Date | undefined) => {
    if (date == null) {
      date = new Date();
    }
    return new Date(date)
      .toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      .toString();
  };

  const registrationModalClose = () => {
    setModalOpen(false);
  };

  const handleRegisterClick = () => {
    if (!isAuthenticated) {
      router.push(
        '/api/auth/signin?callbackUrl=' +
          encodeURIComponent(window.location.pathname),
      );
    } else {
      setModalOpen(true);
    }
  };

  const override: React.CSSProperties = {
    display: 'block',
    margin: '0 auto',
    borderColor: 'black',
  };

  return (
    <>
      <HeaderSearch />
      <div className="sweet-loading">
        <ClipLoader
          cssOverride={override}
          size={200}
          color="#123abc"
          loading={loading}
          speedMultiplier={1.5}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
      {!loading &&
        (event?.eventType ? (
          <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
            <Card
              shadow="md"
              padding="lg"
              className="w-full max-w-2xl justify-center"
            >
              <Card.Section
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Image
                  src={
                    'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                  }
                  width={400}
                  height={200}
                  alt="Event image"
                />
              </Card.Section>
              <Group style={{ marginBottom: 5, marginTop: 10 }}>
                <Text size="lg">{event?.eventName}</Text>
                <Badge color="pink" variant="light">
                  Upcoming
                </Badge>
              </Group>
              <Text size="sm" color="dimmed">
                {getEventDate(event?.eventStartDateTime)}
              </Text>
              <Divider my="sm" />
              <Text size="md">Description:</Text>
              <Text size="md" style={{ marginTop: 5 }}>
                {event?.eventDescription}
              </Text>
              <Divider my="sm" />
              <Text size="md">Venue:</Text>
              <Text size="sm" color="dimmed">
                {`${event?.eventAddress?.addressLine1} ${event?.eventAddress?.addressLine2} ${event?.eventAddress?.city}` ??
                  ''}
              </Text>
              <Divider my="sm" />
              <Text size="md">Price:</Text>
              <Text size="sm" color="dimmed">
                {200}
              </Text>
              <Divider my="sm" />
              <Text size="md">Cancellation Policy:</Text>
              <Text size="sm" color="dimmed">
                {
                  'we strive to ensure that every event goes as planned, but unforeseen circumstances may necessitate a cancellation or rescheduling. In such cases, we will notify all ticket holders promptly via email, our website, and social media channels. If an event is canceled, all ticket holders will receive a full refund, including service charges, processed within [specify time frame, e.g., 7-10 business days]. If rescheduled, ticket holders can use their tickets for the new date or request a full refund. Ticket holders may request a refund up to [specify number of days, e.g., 7 days] before the event date; refunds will not be granted for requests made within [specify shorter timeframe, e.g., 7 days] of the event.'
                }
              </Text>
              <Button
                onClick={handleRegisterClick}
                variant="light"
                color="blue"
                fullWidth
                style={{ marginTop: 14 }}
              >
                Register Now
              </Button>
            </Card>
          </div>
        ) : (
          <div className="max-w-sm mx-auto bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h1 className="text-gray-900 font-bold text-xl">Your Ticket</h1>
                <span className="bg-pink-200 text-pink-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                  QR Code
                </span>
              </div>
              <p className="mt-2 text-gray-600 text-sm">
                Please scan this QR code to attend the event.
              </p>
              <div className="flex justify-center mt-4">
                <Image src={qrData} alt={'qr'} width={500} height={600} />
              </div>
              <button
                onClick={handleDownload}
                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Download
              </button>
            </div>
          </div>
        ))}
      <FooterSimple />
      {event != undefined && (
        <EventRegistrationModal
          event={event}
          isOpen={registrationModalOpen}
          onCloseModal={registrationModalClose}
        ></EventRegistrationModal>
      )}
    </>
  );
};

export default Page;

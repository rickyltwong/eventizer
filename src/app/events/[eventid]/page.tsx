'use client';
import {useParams} from 'next/navigation';
import {HeaderSearch} from '@/components/HeaderSearch';
import {FooterSimple} from '@/components/FooterSimple';
import {useEffect, useState} from 'react';
import axios from 'axios';
import {IEvent} from '@/types/event';
import {Card, Text, Badge, Button, Group, Divider} from '@mantine/core';

import Image from 'next/image';
import EventRegistrationModal from "@/app/events/[eventid]/EventRegistrationModal";

const Page = () => {
    const {eventid} = useParams();
    const [event, setEvent] = useState<IEvent>();

    const [registrationModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        axios
            .get('/api/events/' + eventid)
            .then((response) => {
                setEvent(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

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
    }

    return (
        <>
            <HeaderSearch/>
            <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
                <Card
                    shadow="md"
                    padding="lg"
                    className="w-full max-w-2xl justify-center">
                    <Card.Section
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <Image
                            src={
                                'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                            }
                            width={400}
                            height={200}
                            alt="Event image"
                        />
                    </Card.Section>
                    <Group style={{marginBottom: 5, marginTop: 10}}>
                        <Text size="lg">{event?.eventName}</Text>
                        <Badge color="pink" variant="light">
                            Upcoming
                        </Badge>
                    </Group>
                    <Text size="sm" color="dimmed">
                        {getEventDate(event?.eventStartDateTime)}
                    </Text>
                    <Divider my="sm"/>
                    <Text size="md">Description:</Text>
                    <Text size="md" style={{marginTop: 5}}>
                        {event?.eventDescription}
                    </Text>
                    <Divider my="sm"/>
                    <Text size="md">Venue:</Text>
                    <Text size="sm" color="dimmed">
                        {`${event?.eventAddress.addressLine1} ${event?.eventAddress.addressLine2} ${event?.eventAddress.city}` ??
                            ''}
                    </Text>
                    <Divider my="sm"/>
                    <Text size="md">Price:</Text>
                    <Text size="sm" color="dimmed">
                        {200}
                    </Text>
                    <Divider my="sm"/>
                    <Text size="md">Cancellation Policy:</Text>
                    <Text size="sm" color="dimmed">
                        {
                            'we strive to ensure that every event goes as planned, but unforeseen circumstances may necessitate a cancellation or rescheduling. In such cases, we will notify all ticket holders promptly via email, our website, and social media channels. If an event is canceled, all ticket holders will receive a full refund, including service charges, processed within [specify time frame, e.g., 7-10 business days]. If rescheduled, ticket holders can use their tickets for the new date or request a full refund. Ticket holders may request a refund up to [specify number of days, e.g., 7 days] before the event date; refunds will not be granted for requests made within [specify shorter timeframe, e.g., 7 days] of the event.'
                        }
                    </Text>
                    <Button onClick={() => setModalOpen(true)}
                            variant="light"
                            color="blue"
                            fullWidth
                            style={{marginTop: 14}}>
                        Register Now
                    </Button>
                </Card>
            </div>
            <FooterSimple/>

            {event != undefined &&
                <EventRegistrationModal event={event} isOpen={registrationModalOpen}
                                        onCloseModal={registrationModalClose}></EventRegistrationModal>
            }

        </>
    );
};

export default Page;

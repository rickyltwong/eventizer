'use client'

import React, {useState, useEffect} from 'react';
import {
    Modal,
    TextInput,
    NumberInput,
    Button,
    Text,
    Space,
    Flex,
    Title,
    Select
} from '@mantine/core';
import {useForm} from "@mantine/form";
import {IEvent} from "@/types/event";
import {useParams} from "next/navigation";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";


type EventRegistrationModalProps = {
    event: IEvent,
    isOpen: boolean,
    onCloseModal: () => void
}

type Ticket = {
    eventId: string;
    userId: string;
    ticketType: string;
    noOfTickets: number;
    price: number;
    purchaseDate: Date;
}

const EventRegistrationModal = function ({event, isOpen, onCloseModal}: EventRegistrationModalProps) {
    const {eventid} = useParams();

    const form = useForm({
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            ticketType: event.ticketsClasses[0].ticketType,
            noOfTicket: 1,
            termsOfService: false,
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            firstName: (value) => (value.length > 0 ? null : 'First name is required'),
            lastName: (value) => (value.length > 0 ? null : 'Last name is required'),
            noOfTicket: (value) =>
                value >= 1 && value <= event.capacity
                    ? null
                    : `Number of tickets must be between 1 and ${event.capacity}`,
        },
    });

    const [price, setPrice] = useState(event.ticketsClasses[0].price);
    const [maxCapacity, setMaxCapacity] = useState(1);

    useEffect(() => {
        const selectedTicket = event.ticketsClasses.find(
            (ticket) => ticket.ticketType === form.values.ticketType
        );
        setPrice((selectedTicket?.price || 1) * form.values.noOfTicket);
        setMaxCapacity(selectedTicket?.availability || 1)
    }, [form.values.ticketType, form.values.noOfTicket]);

    const handleClose = () => {
        form.reset();
        close();
        onCloseModal();
    };

    const handleEventRegister = (register: any) => {
        console.log(register)

        const ticketRegistration: Ticket = {
            eventId: eventid.toString(),
            userId: "666933bf8757909f1d0dbb47",
            noOfTickets: register.noOfTicket,
            ticketType: register.ticketType,
            price: price,
            purchaseDate: new Date()
        }

        axios
            .post(`/api/events/${eventid.toString()}/register`,
                JSON.stringify(ticketRegistration),
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            .then((response) => {
                toast.success("Successfully registered the event");
                handleClose();
            })
            .catch((error) => {
                console.log(error)
                toast.error(error?.response?.data?.error || "Unable to register the event");
                console.error(error);
            });
    }

    return (
        <div>
            <h2>Test Page</h2>
            <Modal
                opened={isOpen}
                onClose={handleClose}
                title={<Title order={2}>{`Register for ${event.eventName}`}</Title>}
                closeOnClickOutside={false}
                centered
                size="lg"
            >
                <form onSubmit={form.onSubmit((values) => handleEventRegister(values))}>
                    <Text
                        className="mb-4">{`Location: ${event.eventAddress.venueName}, ${event.eventAddress.addressLine1}, ${event.eventAddress.city}`}</Text>
                    <Text className="mb-4">{`Date: ${new Date(event.eventStartDateTime).toLocaleString()}`}</Text>
                    <TextInput
                        withAsterisk
                        label="First Name"
                        placeholder="First name"
                        {...form.getInputProps('firstName')}
                        classNames={{
                            input: 'p-2 border border-gray-300 rounded-lg',
                            label: 'font-semibold mb-2',
                        }}
                    />
                    <TextInput
                        withAsterisk
                        label="Last Name"
                        placeholder="Last name"
                        {...form.getInputProps('lastName')}
                        classNames={{
                            input: 'p-2 border border-gray-300 rounded-lg',
                            label: 'font-semibold mb-2',
                        }}
                    />
                    <TextInput
                        withAsterisk
                        label="Email"
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
                    /> <Space h="sm"/>
                    <Text fw={700} size="xl">Price: ${price}</Text>


                    <Flex
                        mih={50}
                        gap="md"
                        justify="flex-end"
                        align="center"
                        direction="row"
                        wrap="wrap-reverse"
                    >
                        <Button type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Submit
                        </Button>
                    </Flex>
                </form>
            </Modal>
            <ToastContainer/>
        </div>
    );
};

export default EventRegistrationModal;
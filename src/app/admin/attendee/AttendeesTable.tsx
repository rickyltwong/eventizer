'use client'
import React, { useState } from 'react';
import { Checkbox, Button, Select } from '@mantine/core';
import AttendeeStatus from './AttendeeStatus';
import { Attendee } from './page';

interface AttendeesTableProps {
  attendees: Attendee[];
  onCheckboxChange: (id: number) => void;
  onStatusChange: (id: number, status: string) => void;
}

export default function AttendeesTable({ attendees, onCheckboxChange, onStatusChange }: AttendeesTableProps) {
  const [editingStatusId, setEditingStatusId] = useState<number | null>(null);

  const handleStatusChange = (id: number, newStatus: string) => {
    onStatusChange(id, newStatus);
    setEditingStatusId(null); // Exit edit mode after changing the status
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Registration Date
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Ticket Type
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Participating
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {attendees.map((attendee) => (
                <tr
                  key={attendee.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{attendee.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {attendee.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {editingStatusId === attendee.id ? (
                      <Select
                        value={attendee.status}
                        onChange={(value) => handleStatusChange(attendee.id, value ?? attendee.status)}
                        data={[
                          { value: 'Registered', label: 'Registered' },
                          { value: 'Pending', label: 'Pending' },
                          { value: 'Cancelled', label: 'Cancelled' }
                        ]}
                      />
                    ) : (
                      <div onClick={() => setEditingStatusId(attendee.id)}>
                        <AttendeeStatus status={attendee.status} />
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {attendee.registrationDate}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {attendee.ticketType}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <Checkbox
                      checked={attendee.participating}
                      onChange={() => onCheckboxChange(attendee.id)}
                    />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <Button onClick={() => setEditingStatusId(attendee.id)}>
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

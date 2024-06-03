import Image from 'next/image';
import { UpdateAttendee, DeleteAttendee } from './buttons';
import AttendeeStatus from './AttendeeStatus';

interface Attendee {
  id: number;
  name: string;
  email: string;
  status: string;
  image_url: string;
}

interface AttendeesTableProps {
  attendees: Attendee[];
}

export default function AttendeesTable({ attendees }: AttendeesTableProps) {
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
                      <Image
                        src={attendee.image_url}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${attendee.name}'s profile picture`}
                      />
                      <p>{attendee.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {attendee.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <AttendeeStatus status={attendee.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      <UpdateAttendee id={attendee.id.toString()} />
                      <DeleteAttendee id={attendee.id.toString()} />
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

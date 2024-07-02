import { ActionIcon } from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';

// UpdateAttendee Component
export function UpdateAttendee({ id }: { id: string }) {
  return (
    <Link href={`/dashboard/attendees/edit/${id}`} passHref>
      <ActionIcon variant="outline" size="md" component="a">
        <IconPencil size={20} />
      </ActionIcon>
    </Link>
  );
}

// DeleteAttendee Component

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function DeleteAttendee({ id }: { id: string }) {
  // FIXME: id is never used
  const handleDelete = () => {
    // Implement delete logic
  };

  return (
    <ActionIcon variant="outline" size="md" onClick={handleDelete}>
      <IconTrash size={20} />
    </ActionIcon>
  );
}

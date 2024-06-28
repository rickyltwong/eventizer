import { ActionIcon } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";

export function DeleteAttendee({ id }: { id: string }) {
  const handleDelete = () => {
    // Implement delete logic
  };

  return (
    <ActionIcon variant="outline" size="md" onClick={handleDelete}>
      <IconTrash size={20} />
    </ActionIcon>
  );
}

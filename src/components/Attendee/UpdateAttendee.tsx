import { ActionIcon } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import Link from "next/link";

export function UpdateAttendee({ id }: { id: string }) {
  return (
    <Link href="/dashboard/invoices">
      <ActionIcon variant="outline" size="md" component="span">
        <IconPencil size={20} />
      </ActionIcon>
    </Link>
  );
}

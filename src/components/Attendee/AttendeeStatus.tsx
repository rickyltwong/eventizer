import { Badge } from '@mantine/core';

interface AttendeeStatusProps {
  status: string;
}

export default function AttendeeStatus({ status }: AttendeeStatusProps) {
  const statusColor =
    {
      Registered: 'green',
      Pending: 'yellow',
      Cancelled: 'red',
    }[status] || 'gray';

  return <Badge color={statusColor}>{status}</Badge>;
}

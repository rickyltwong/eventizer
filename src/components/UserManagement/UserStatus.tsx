import { Badge } from '@mantine/core';
import React from 'react';

interface UserStatusProps {
  status: string;
}

const UserStatus: React.FC<UserStatusProps> = ({ status }) => {
  const color = status.toLowerCase() === 'active' ? 'green' : 'red';

  return (
    <Badge color={color} variant="light">
      {status}
    </Badge>
  );
};

export default UserStatus;

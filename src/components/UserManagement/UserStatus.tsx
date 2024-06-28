import React from "react";
import { Badge } from "@mantine/core";

interface UserStatusProps {
  status: string;
}

const UserStatus: React.FC<UserStatusProps> = ({ status }) => {
  const color = status === "Active" ? "green" : "red";

  return (
    <Badge color={color} variant="light">
      {status}
    </Badge>
  );
};

export default UserStatus;

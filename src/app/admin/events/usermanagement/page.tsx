"use client"

import { useState } from "react";
import { Input, Button, Table, Badge, Container, Title, Group, Box } from "@mantine/core";

export default function UserManagement() {
  const [users, setUsers] = useState([
    { id: 1, name: "Admin User", role: "Admin", status: "Active" },
    { id: 2, name: "Regular User", role: "User", status: "Active" },
    { id: 3, name: "Disabled User", role: "User", status: "Disabled" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user) => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <Container size="lg" my="md">
      <Box mb="xl">
        <Title order={2} mb="lg">User Management</Title>
        <Group mb="md">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button variant="filled" ml="md">Add User</Button>
        </Group>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>
                  <Badge color={user.status === "Active" ? "green" : "red"}>{user.status}</Badge>
                </td>
                <td>
                  <Button variant="outline" size="xs" className="mr-2">
                    View
                  </Button>
                  <Button variant="outline" size="xs" className="mr-2">
                    Edit
                  </Button>
                  <Button variant="outline" size="xs" className="mr-2">
                    Manage Permissions
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
    </Container>
  );
}

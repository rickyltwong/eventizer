"use client"
import { useState } from 'react';
import { Input, Select, Button, Container, Title, Group, Box } from '@mantine/core';
import UserTable from './UserTable';

export interface User {
  id: number;
  name: string;
  role: string;
  status: string;
  createdAt: string;
  createdBy: string;
}

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Admin User', role: 'Admin', status: 'Active', createdAt: '2024-06-10', createdBy: 'Admin' },
    { id: 2, name: 'Regular User', role: 'User', status: 'Active', createdAt: '2024-06-12', createdBy: 'Admin' },
    { id: 3, name: 'Disabled User', role: 'User', status: 'Disabled', createdAt: '2024-06-15', createdBy: 'Admin' },
  ]);

  // Filter users based on search term and filter status
  const filteredUsers = users.filter(user => {
    const matchesSearchTerm = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearchTerm && matchesStatus;
  });

  // Handle status change
  const handleStatusChange = (id: number, status: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === id ? { ...user, status } : user
      )
    );
  };

  // Handle role change
  const handleRoleChange = (id: number, role: string) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === id ? { ...user, role } : user
      )
    );
  };

  return (
    <Container size="lg" my="md">
      <Box mb="xl">
        <Title order={2} mb="lg">
          User Management
        </Title>
        <Group align="center">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
          <Select
            value={filterStatus}
            onChange={(value) => setFilterStatus(value ?? 'all')}
            data={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'disabled', label: 'Disabled' }
            ]}
            style={{ marginLeft: '1rem' }}
          />
          <Button variant="filled" ml="md">
            Add User
          </Button>
        </Group>
        <UserTable
          users={filteredUsers}
          onStatusChange={handleStatusChange}
          onRoleChange={handleRoleChange} 
        />
      </Box>
    </Container>
  );
}

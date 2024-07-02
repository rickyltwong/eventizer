'use client';
import { Box, Button, Container, Group, Input, Select, Title } from '@mantine/core';
import { useEffect, useState } from 'react';

import UserTable from '@/components/UserManagement/UserTable';

export interface User {
  id: number;
  name: string;
  role: string;
  status: string;
  createdAt: string;
  email: string;
  phoneNumber: string;
  authentication: {
    provider: string,
  },
}

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/admin');
        console.log(response);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
    fetchUsers();
  }, []);

  // Filter users based on search term and filter status
  const filteredUsers = users.filter((user) => {
    const matchesSearchTerm = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' ||
      user.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearchTerm && matchesStatus;
  });

  // Handle status change
  const handleStatusChange = async (id: number, status: string) => {
    try {
      const response = await fetch('/api/admin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, status: status }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to update user status');
      }

      const updatedUser = await response.json();

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user,
        ),
      );
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // Handle role change
  const handleRoleChange = async (id: number, role: string) => {
    try {
      const response = await fetch('/api/admin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, role: role }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to update user role');
      }

      const updatedUser = await response.json();

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await fetch('/api/admin', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleAddUser = async () => {
    setNewUser({
      id: Math.random(),
      name: '',
      role: '',
      status: '',
      createdAt: '',
      email: '',
      phoneNumber: '',
      authentication: {
        provider: 'credential',
      },
    });

    setShowAddUser(!showAddUser);
  };

  const handleSaveUser = async (newUser: User) => {
    try {
      const response = await fetch('/api/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error('Failed to add user');
      }

      const addedUser = await response.json();
      setUsers((prevUsers) => [...prevUsers, addedUser]);
      setShowAddUser(false); // Hide the AddUser form after successful addition
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleCancelAddUser = () => {
    // Reset newUser and hide the Add User section
    //setNewUser(null);
    setShowAddUser(false);
  };

  return (
    <Container size="lg" my="md">
      <Box mb="xl">
        <Title
          order={2}
          mb="lg"
          style={{ color: '#64c1ff', fontWeight: 'bold', padding: 20 }}
        >
          User Management
        </Title>
        <Group align="center" mb="lg">
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
              { value: 'disabled', label: 'Disabled' },
              { value: 'pending', label: 'Pending' },
            ]}
            style={{ marginLeft: '1rem' }}
          />
          <Button variant="filled" ml="md" onClick={handleAddUser}>
            Add User
          </Button>
        </Group>
        <UserTable
          users={filteredUsers}
          onStatusChange={handleStatusChange}
          onRoleChange={handleRoleChange}
          onDeleteUser={handleDeleteUser}
          showAddUser={showAddUser}
          newUser={newUser}
          onSaveUser={handleSaveUser}
          onCancelUser={handleCancelAddUser}
        />
      </Box>
    </Container>
  );
}

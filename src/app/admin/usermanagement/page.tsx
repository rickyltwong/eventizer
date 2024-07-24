'use client';
import {
  Box,
  Button,
  Container,
  Group,
  Input,
  Select,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';

import UserTable from '@/components/UserManagement/UserTable';

export interface User {
  _id?: number;
  name: string;
  role: string;
  status: string;
  createdAt: string;
  email: string;
  phoneNumber: string;
  authentication: {
    provider: string;
  };
  image: string;
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
        // console.log(response);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
    fetchUsers();
  }, []);

  // Filter users based on search term and filter status
  // console.log(users);
  const filteredUsers = users.filter((user) => {
    const matchesSearchTerm = user.name
      ? user.name.toLowerCase().includes(searchTerm.toLowerCase())
      : false;
    const matchesStatus =
      filterStatus === 'all' ||
      (user.status && user.status.toLowerCase() === filterStatus.toLowerCase());
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
          user._id === updatedUser._id ? updatedUser : user,
        ),
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

  const handleAddUser = () => {
    setNewUser({
      _id: Math.random(),
      name: '',
      role: '',
      status: '',
      createdAt: '',
      email: '',
      phoneNumber: '',
      authentication: {
        provider: 'credential',
      },
      image: '',
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
      setShowAddUser(false);
    } catch (error) {
      setShowAddUser(false);
    }
  };

  const handleCancelAddUser = () => {
    setShowAddUser(false);
  };

  return (
    <Container size="lg" my="md">
      <Box mb="xl">
        <Title
          order={2}
          mb="lg"
          style={{
            color: '#59B6C7',
            fontWeight: 'bold',
            padding: 20,
            textAlign: 'center',
          }}
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
          <Button
            display="none"
            variant="filled"
            ml="md"
            onClick={handleAddUser}
            style={{ backgroundColor: '#59B6C7', color: 'white' }}
          >
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

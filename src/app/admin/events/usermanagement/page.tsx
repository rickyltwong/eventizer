'use client';
import React, { useState, useEffect } from 'react';
import { Button, Select, Input, Container, Title, Group, Box } from '@mantine/core';
import UserTable from './UserTable';

export interface User {
  id: number;
  username: string;
  role: string;
  status: string;
  createdAt: string;
  profile:{
   phone: string;
  }
}

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [users, setUsers] = useState<User[]>([]);
  

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/admin'); // Fetching the list of users from the API
        console.log(response);
        const data = await response.json(); // Parsing the response JSON data
        setUsers(data); // Setting the users state with the fetched data
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
    fetchUsers(); // Calling the fetchUsers function when the component mounts
  }, []);

  // Filter users based on search term and filter status
  const filteredUsers = users.filter(user => {
    const matchesSearchTerm = user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status.toLowerCase() === filterStatus.toLowerCase();
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
        body: JSON.stringify({"id": id,"status": status }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || 'Failed to update user status');
      }
    
      const updatedUser = await response.json();
    
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      );

    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // Handle role change
  const handleRoleChange = async (id: number, role: string) => {
    try {
      await fetch('/api/admin', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "id":id, "role":role }),
      });
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === id ? { ...user, role } : user
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
        body: JSON.stringify({ "id":id}),
      });
      setUsers(prevUsers =>
        prevUsers.filter(user => user._id !== id)
      );
  
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <Container size="lg" my="md">
      <Box mb="xl">
        <Title order={2} mb="lg" style={{ color: '#64c1ff', fontWeight: 'bold', padding: 20 }}>
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
              { value: 'pending', label: 'Pending' }
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
          onDeleteUser={handleDeleteUser}
        />
      </Box>
    </Container>
  );
}

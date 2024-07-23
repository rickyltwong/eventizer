import { Box, Button, Group, Select, Text, TextInput } from '@mantine/core';
import { useState } from 'react';

import { User } from '@/app/admin/usermanagement/page';

interface AddUserProps {
  onSubmit: (newUserData: User) => void;
  onCancel: () => void;
}

export default function AddUser({ onSubmit, onCancel }: AddUserProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const provider = 'credential';

  const handleRoleChange = (value: string | null) => {
    if (value) {
      setRole(value);
    }
  };

  const handleStatusChange = (value: string | null) => {
    if (value) {
      setStatus(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newUser: User = {
      name: name,
      role: role,
      status: status,
      createdAt: new Date().toISOString(),
      email: email,
      phoneNumber: phone,
      authentication: {
        provider: provider,
      },
      image: image,
      _id: Math.random(),
    };

    try {
      await onSubmit(newUser);
      setName('');
      setRole('');
      setStatus('');
      setEmail('');
      setPhone('');
      setImage('');
      setError(null);
    } catch (error) {
      console.error('Error adding user:', error);
      setError(
        'Failed to add user. Please check the input data and try again.',
      );
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      style={{
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
      }}
    >
      {error && (
        <Text color="red" mb="sm">
          {error}
        </Text>
      )}
      <TextInput
        label="Username"
        placeholder="Username"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        mb="sm"
      />
      <Select
        label="Role"
        placeholder="Select role"
        value={role}
        onChange={handleRoleChange}
        data={[
          { value: 'attendee', label: 'Attendee' },
          { value: 'admin', label: 'Admin' },
        ]}
        required
        mb="sm"
      />
      <Select
        label="Status"
        placeholder="Select status"
        value={status}
        onChange={handleStatusChange}
        data={[
          { value: 'active', label: 'Active' },
          { value: 'disabled', label: 'Disabled' },
          { value: 'pending', label: 'Pending' },
        ]}
        required
        mb="sm"
      />
      <TextInput
        label="Email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        mb="sm"
      />
      <TextInput
        label="Phone"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        mb="sm"
      />
      <Group mt="md">
        <Button
          variant="filled"
          type="submit"
          style={{ backgroundColor: '#59B6C7', color: 'white' }}
        >
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </Group>
    </Box>
  );
}

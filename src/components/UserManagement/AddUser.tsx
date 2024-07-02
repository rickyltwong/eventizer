import { Button } from '@mantine/core';
import { useState } from 'react';

import { User } from '@/app/admin/usermanagement/page';

interface AddUserProps {
  onSubmit: (newUserData: User) => void;
  onCancel: () => void;
}

export default function AddUser({ onSubmit, onCancel }: AddUserProps) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newUser: User = {
      id: Math.random(),
      username: username,
      role: role,
      status: status,
      createdAt: '2024-06-11T12:00:00Z', // new Date()
      profile: {
        phone: phone,
      },
    };
    console.log(newUser);
    onSubmit(newUser);
    setUsername('');
    setRole('');
    setStatus('');
    setPhone('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required // Added the "required" attribute for validation
      />
      <input
        type="text"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required // Added the "required" attribute for validation
      />
      <input
        type="text"
        placeholder="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        required // Added the "required" attribute for validation
      />
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required // Added the "required" attribute for validation
      />
      <Button variant="filled" ml="md" type="submit">
        Save
      </Button>
      &nbsp;
      <Button variant="filled" ml="md" onClick={onCancel}>
        Cancel
      </Button>
    </form>
  );
}

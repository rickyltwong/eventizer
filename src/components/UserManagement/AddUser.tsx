import { Button } from '@mantine/core';
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
  const provider = 'credential';

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newUser: User = {
      _id: Math.random(),
      name: name,
      role: role,
      status: status,
      createdAt: new Date().toISOString(),
      email: email,
      phoneNumber: phone,
      authentication: {
        provider: provider,
      },
    };
    console.log(newUser);
    onSubmit(newUser);
    setName('');
    setRole('');
    setStatus('');
    setEmail('');
    setPhone('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
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

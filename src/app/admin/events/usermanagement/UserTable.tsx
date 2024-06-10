import React, { useState } from 'react';
import { Button, Select } from '@mantine/core';
import UserStatus from './UserStatus';
import { User } from './page';

interface UsersTableProps {
  users: User[];
  onStatusChange: (id: number, status: string) => void;
  onRoleChange: (id: number, role: string) => void;
}

export default function UsersTable({ users, onStatusChange, onRoleChange }: UsersTableProps) {
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editedRole, setEditedRole] = useState<string>('');
  const [editedStatus, setEditedStatus] = useState<string>('');

  const handleRoleChange = (id: number, newRole: string) => {
    setEditedRole(newRole);
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setEditedStatus(newStatus);
  };

  const handleSave = (id: number) => {
    onRoleChange(id, editedRole);
    onStatusChange(id, editedStatus);
    setEditingUserId(null);
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Role
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date Created
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Created By
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p>{user.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {editingUserId === user.id ? (
                      <Select
                        value={editedRole}
                        onChange={(value) => setEditedRole(value ?? '')}
                        data={[
                          { value: 'Admin', label: 'Admin' },
                          { value: 'User', label: 'User' },
                          { value: 'Organizer', label: 'Organizer' }
                        ]}
                      />
                    ) : (
                      user.role
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {editingUserId === user.id ? (
                      <Select
                        value={editedStatus}
                        onChange={(value) => setEditedStatus(value ?? '')}
                        data={[
                          { value: 'Active', label: 'Active' },
                          { value: 'Disabled', label: 'Disabled' }
                        ]}
                      />
                    ) : (
                      <div onClick={() => setEditingUserId(user.id)}>
                        <UserStatus status={user.status} />
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {user.createdAt}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {user.createdBy}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {editingUserId === user.id ? (
                        <Button onClick={() => handleSave(user.id)}>Save</Button>
                      ) : (
                        <Button onClick={() => setEditingUserId(user.id)}>Edit</Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { Select } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

import { User } from '@/app/admin/usermanagement/page';

import AddUser from './AddUser';
import UserStatus from './UserStatus';

interface UsersTableProps {
  users: User[];
  onStatusChange: (id: number, status: string) => Promise<void>;
  onRoleChange: (id: number, role: string) => Promise<void>;
  onDeleteUser: (id: number) => Promise<void>;
  showAddUser: boolean;
  newUser: User | null;
  onSaveUser: (newUser: User) => Promise<void>;
  onCancelUser: () => void;
}

export default function UsersTable({
  users,
  onStatusChange,
  onRoleChange,
  onDeleteUser,
  onSaveUser,
  onCancelUser,
  showAddUser,
}: UsersTableProps) {
  const [editingUserRole, setEditingUserRole] = useState<number | null>(null);
  const [editingUserStatus, setEditingUserStatus] = useState<number | null>(
    null,
  );

  const handleRoleChange = async (id: number, newRole: string) => {
    await onRoleChange(id, newRole);
    setEditingUserRole(null);
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    await onStatusChange(id, newStatus);
    setEditingUserStatus(null);
  };

  const handleDeleteUser = async (id: number) => {
    await onDeleteUser(id);
  };

  const handleSaveUser = async (newUser: User) => {
    await onSaveUser(newUser);
  };

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div style={{ marginBottom: '20px' }}>
            {showAddUser && (
              <AddUser onSubmit={handleSaveUser} onCancel={onCancelUser} />
            )}
          </div>
          <table className="min-w-full text-gray-900">
            <thead className="rounded-lg text-left text-sm font-normal bg-[#59B6C7] text-white">
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
                  Email
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Phone
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.image ||
                          'https://via.placeholder.com/40?text=Unknown'
                        }
                        alt={user.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <p>{user.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {editingUserRole === user._id ? (
                      <Select
                        value={user.role}
                        onChange={(value) => {
                          if (user._id !== undefined) {
                            handleRoleChange(user._id, value ?? user.role);
                          }
                        }}
                        data={[
                          { value: 'Admin', label: 'Admin' },
                          { value: 'attendee', label: 'Attendee' },
                        ]}
                      />
                    ) : (
                      <div
                        onClick={() => {
                          if (user._id !== undefined) {
                            setEditingUserRole(user._id);
                          }
                        }}
                      >
                        {user.role}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {editingUserStatus === user._id ? (
                      <Select
                        value={user.status}
                        onChange={(value) => {
                          if (user._id !== undefined) {
                            handleStatusChange(user._id, value ?? user.status);
                          }
                        }}
                        data={[
                          { value: 'active', label: 'Active' },
                          { value: 'disabled', label: 'Disabled' },
                          { value: 'pending', label: 'Pending' },
                        ]}
                      />
                    ) : (
                      <div
                        onClick={() => {
                          if (user._id !== undefined) {
                            setEditingUserStatus(user._id);
                          }
                        }}
                      >
                        <UserStatus status={user.status} />
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {new Date(user.createdAt).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                      second: 'numeric',
                    })}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">{user.email}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {user.phoneNumber}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <button
                      onClick={() => {
                        if (user._id !== undefined) {
                          handleDeleteUser(user._id);
                        }
                      }}
                    >
                      <IconTrash className="h-5 w-5 text-red-500" />
                    </button>
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

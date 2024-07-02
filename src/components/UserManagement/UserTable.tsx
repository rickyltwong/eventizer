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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [deleteUser, setDeleteUser] = useState<number | null>(null); // FIXME: deleteUser is never used

  const handleRoleChange = (id: number, newRole: string) => {
    onRoleChange(id, newRole);
    setEditingUserRole(null);
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    onStatusChange(id, newStatus);
    setEditingUserStatus(null);
  };

  const handleDeleteUser = (id: number) => {
    onDeleteUser(id);
    setDeleteUser(null);
  };

  const handleSaveUser = (newUser: User) => {
    onSaveUser(newUser);
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
                      <p>{user.name}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {editingUserRole === user._id ? (
                      <Select
                        value={user.role}
                        onChange={(value) =>
                          handleRoleChange(user._id, value ?? user.role)
                        }
                        data={[
                          { value: 'Admin', label: 'Admin' },
                          { value: 'Attendee', label: 'User' },
                        ]}
                      />
                    ) : (
                      <div onClick={() => setEditingUserRole(user._id)}>
                        {user.role}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {editingUserStatus === user._id ? (
                      <Select
                        value={user.status}
                        onChange={(value) =>
                          handleStatusChange(user._id, value ?? user.status)
                        }
                        data={[
                          { value: 'Active', label: 'Active' },
                          { value: 'Disabled', label: 'Disabled' },
                          { value: 'Pending', label: 'Pending' },
                        ]}
                      />
                    ) : (
                      <div onClick={() => setEditingUserStatus(user._id)}>
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
                  <td className="whitespace-nowrap px-3 py-3">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    {user.phoneNumber}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <button onClick={() => handleDeleteUser(user._id)}>
                      <IconTrash className="h-5 w-5 text-red-500" />{' '}
                      {/* Adjust size and color as needed */}
                    </button>
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {/* <Button onClick={() => setEditingUserRole(user.id)}>Edit Role</Button>
                      <Button onClick={() => setEditingUserStatus(user.id)}>Edit Status</Button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ marginBottom: '20px' }}>
        {showAddUser && (
          <AddUser onSubmit={handleSaveUser} onCancel={onCancelUser} />
        )}
      </div>
    </div>
  );
}

import { createFileRoute } from '@tanstack/react-router';

import { UserForm } from '@/features/user/user-form.js';
import { UserList } from '@/features/user/user-list.js';

export const Route = createFileRoute('/users/')({
  component: UsersPage,
});

function UsersPage() {
  console.log('UsersPage rendered');

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <UserList />
      </div>

      <div>
        <h2 className="text-lg font-medium text-gray-900">Add a user</h2>
        <div className="mt-2">
          <UserForm />
        </div>
      </div>
    </div>
  );
}

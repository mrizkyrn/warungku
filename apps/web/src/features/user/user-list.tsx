import { Alert, AlertDescription } from '@/components/ui/alert';

import { useUsersQuery } from './queries.js';
import { UserCard } from './user-card.js';

export function UserList() {
  const { data, isLoading, isError, error } = useUsersQuery({
    page: 1,
    limit: 10,
  });

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Loading users...</p>;
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!data?.data.length) {
    return <p className="text-muted-foreground text-sm">No users yet.</p>;
  }

  return (
    <div className="space-y-2">
      {data.data.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}

      {data.meta && (
        <p className="text-muted-foreground pt-2 text-xs">
          Page {data.meta.page} of {data.meta.totalPages} · {data.meta.total} total
        </p>
      )}
    </div>
  );
}

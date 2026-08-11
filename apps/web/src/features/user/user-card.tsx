import type { User } from '@warungku/shared-types';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { useDeleteUserMutation } from './queries.js';

interface UserCardProps {
  user: User;
}

export function UserCard({ user }: UserCardProps) {
  const deleteUser = useDeleteUserMutation();

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 py-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{user.name}</p>
          <p className="text-muted-foreground truncate text-sm">{user.email}</p>
        </div>

        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => {
            deleteUser.mutate(user.id);
          }}
          disabled={deleteUser.isPending}
        >
          {deleteUser.isPending ? 'Deleting...' : 'Delete'}
        </Button>
      </CardContent>
    </Card>
  );
}

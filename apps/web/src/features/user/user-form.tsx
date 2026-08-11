import { zodResolver } from '@hookform/resolvers/zod';
import { createUserBodySchema, type CreateUserInput } from '@warungku/shared-schemas';
import { useForm } from 'react-hook-form';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useCreateUserMutation } from './queries.js';

interface UserFormProps {
  onSuccess?: () => void;
}

export function UserForm({ onSuccess }: UserFormProps) {
  const createUser = useCreateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(createUserBodySchema),
  });

  const onSubmit = handleSubmit(async (input) => {
    await createUser.mutateAsync(input);
    reset();
    onSuccess?.();
  });

  return (
    <form
      onSubmit={(event) => {
        void onSubmit(event);
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>

        <Input id="name" type="text" {...register('name')} />

        {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>

        <Input id="email" type="email" {...register('email')} />

        {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
      </div>

      {createUser.isError && (
        <Alert variant="destructive">
          <AlertDescription>{createUser.error.message}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create user'}
      </Button>
    </form>
  );
}

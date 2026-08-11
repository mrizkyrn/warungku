import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Outlet />
    </div>
  );
}

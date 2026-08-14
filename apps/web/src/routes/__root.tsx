import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-4 sm:px-6 sm:py-6">
      <Outlet />
    </div>
  );
}

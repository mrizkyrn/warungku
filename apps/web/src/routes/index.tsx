import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Monorepo Starter</h1>
      <Link to="/users" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
        View users →
      </Link>
    </div>
  );
}

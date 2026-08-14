import { createFileRoute, Link } from '@tanstack/react-router';

import { buttonVariants } from '@/components/ui/button.js';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div>
      <h1 className="text-foreground text-2xl font-semibold">Warungku</h1>
      <p className="text-muted-foreground mt-1 text-sm">Kelola produk warung Anda.</p>
      <Link
        to="/products"
        className={buttonVariants({ variant: 'default', className: 'mt-4 w-full sm:w-auto' })}
      >
        Kelola Produk
      </Link>
    </div>
  );
}

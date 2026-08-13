import { createFileRoute, Link } from '@tanstack/react-router';

import { ProductForm } from '@/features/product/components/product-form.js';

export const Route = createFileRoute('/products/new')({
  component: ProductNewPage,
});

function ProductNewPage() {
  return (
    <div className="flex flex-col gap-4">
      <Link to="/products" className="text-primary text-sm hover:underline">
        ← Kembali ke Produk
      </Link>
      <div>
        <h1 className="text-foreground text-2xl font-semibold">Tambah Produk</h1>
        <p className="text-muted-foreground text-sm">Buat produk baru beserta pilihan harganya.</p>
      </div>
      <ProductForm />
    </div>
  );
}

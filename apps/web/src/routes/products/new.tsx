import { createFileRoute } from '@tanstack/react-router';

import { PageHeader } from '@/components/ui/page-header.js';
import { ProductForm } from '@/features/product/components/product-form.js';

export const Route = createFileRoute('/products/new')({
  component: ProductNewPage,
});

function ProductNewPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader to="/products" title="Tambah Produk" />
      <ProductForm />
    </div>
  );
}

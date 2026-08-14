import { createFileRoute } from '@tanstack/react-router';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.js';
import { PageHeader } from '@/components/ui/page-header.js';
import { ProductForm } from '@/features/product/components/product-form.js';
import { useProductQuery } from '@/features/product/queries.js';

export const Route = createFileRoute('/products/$productId/edit')({
  component: ProductEditPage,
});

function ProductEditPage() {
  const { productId } = Route.useParams();
  const { data: product, isLoading, isError, error } = useProductQuery(productId);

  if (isLoading) {
    return <p className="text-muted-foreground text-sm">Memuat produk…</p>;
  }

  if (isError || !product) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Gagal memuat produk</AlertTitle>
        <AlertDescription>{error?.message ?? 'Produk tidak ditemukan.'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        to="/products/$productId"
        params={{ productId }}
        title="Edit Produk"
        description="Perbarui data produk dan pilihan harganya."
      />

      <ProductForm product={product} />
    </div>
  );
}

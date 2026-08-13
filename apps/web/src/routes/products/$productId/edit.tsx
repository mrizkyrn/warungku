import { createFileRoute, Link } from '@tanstack/react-router';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.js';
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
      <Link
        to="/products/$productId"
        params={{ productId }}
        className="text-primary text-sm hover:underline"
      >
        ← Kembali ke Detail
      </Link>

      <div>
        <h1 className="text-foreground text-2xl font-semibold">Edit Produk</h1>
        <p className="text-muted-foreground text-sm">Perbarui data produk dan pilihan harganya.</p>
      </div>

      <ProductForm product={product} />
    </div>
  );
}

import { Link } from '@tanstack/react-router';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.js';
import { Button, buttonVariants } from '@/components/ui/button.js';
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Input } from '@/components/ui/input.js';

import { useProductList } from '../hooks';
import { getProductPriceLabel } from '../utils.js';

export function ProductList() {
  const { search, handleSearchChange, page, setPage, totalPages, data, isLoading, isError, error } =
    useProductList();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-foreground text-2xl font-semibold">Produk</h1>
          <p className="text-muted-foreground text-sm">Kelola produk beserta pilihan harganya.</p>
        </div>
        <Link to="/products/new" className={buttonVariants({ variant: 'default' })}>
          Tambah Produk
        </Link>
      </div>

      <Input
        value={search}
        onChange={(event) => handleSearchChange(event.target.value)}
        placeholder="Cari produk…"
        aria-label="Cari produk"
      />

      {isLoading && <p className="text-muted-foreground text-sm">Memuat produk…</p>}

      {isError && (
        <Alert variant="destructive">
          <AlertTitle>Gagal memuat produk</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && (data?.data?.length ?? 0) === 0 && (
        <p className="text-muted-foreground text-sm">Tidak ada produk yang ditemukan.</p>
      )}

      {!isLoading && !isError && (data?.data?.length ?? 0) > 0 && (
        <div className="flex flex-col gap-2">
          {data?.data.map((product) => (
            <Card key={product.id} size="sm">
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{getProductPriceLabel(product)}</CardDescription>
                <CardAction>
                  <Link
                    to="/products/$productId"
                    params={{ productId: product.id }}
                    className={buttonVariants({ variant: 'outline', size: 'sm' })}
                  >
                    Detail
                  </Link>
                </CardAction>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page <= 1}
          >
            Sebelumnya
          </Button>
          <span className="text-muted-foreground text-sm">
            Halaman {page} dari {totalPages}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page >= totalPages}
          >
            Berikutnya
          </Button>
        </div>
      )}
    </div>
  );
}

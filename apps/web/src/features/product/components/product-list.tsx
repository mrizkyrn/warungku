import { Link } from '@tanstack/react-router';
import { PackagePlus, SearchX } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.js';
import { Button, buttonVariants } from '@/components/ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Input } from '@/components/ui/input.js';
import { Skeleton } from '@/components/ui/skeleton.js';
import { formatPrice, formatUnit } from '@/lib/format.js';

import { useProductList } from '../hooks';
import { getOptionLabel } from '../utils.js';

export function ProductList() {
  const { search, handleSearchChange, page, setPage, totalPages, data, isLoading, isError, error } =
    useProductList();

  const isEmpty = !isLoading && !isError && (data?.data?.length ?? 0) === 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-semibold">Produk</h1>
          <p className="text-muted-foreground text-sm">Kelola produk beserta pilihan harganya.</p>
        </div>
        <Link
          to="/products/new"
          className={buttonVariants({ variant: 'default', className: 'w-full sm:w-auto' })}
        >
          Tambah Produk
        </Link>
      </div>

      <Input
        value={search}
        onChange={(event) => handleSearchChange(event.target.value)}
        placeholder="Cari produk…"
        aria-label="Cari produk"
      />

      {isLoading && (
        <div className="flex flex-col gap-2" aria-hidden="true">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} size="sm">
              <CardHeader>
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
              <CardContent className="flex flex-row items-center justify-between gap-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertTitle>Gagal memuat produk</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {isEmpty && search ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-2 py-12 text-center">
          <SearchX className="text-muted-foreground size-8" strokeWidth={1.5} />
          <div className="flex flex-col gap-1">
            <p className="text-foreground text-sm font-medium">Produk tidak ditemukan</p>
            <p className="text-muted-foreground text-sm">
              Coba kata kunci lain, atau hapus pencarian untuk melihat semua produk.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => handleSearchChange('')}>
            Hapus pencarian
          </Button>
        </div>
      ) : null}

      {isEmpty && !search ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-2 py-12 text-center">
          <PackagePlus className="text-muted-foreground size-8" strokeWidth={1.5} />
          <div className="flex flex-col gap-1">
            <p className="text-foreground text-sm font-medium">Belum ada produk</p>
            <p className="text-muted-foreground text-sm">
              Tambahkan produk pertama untuk mulai berjualan.
            </p>
          </div>
        </div>
      ) : null}

      {!isLoading && !isError && (data?.data?.length ?? 0) > 0 && (
        <div className="flex flex-col gap-2">
          {data?.data.map((product) => (
            <Link
              key={product.id}
              to="/products/$productId"
              params={{ productId: product.id }}
              className="focus-visible:ring-ring block rounded-xl outline-none focus-visible:ring-2"
            >
              <Card
                size="sm"
                className="hover:bg-muted/50 focus-within:bg-muted/50 transition-colors"
              >
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1.5">
                  {product.options.map((option) => (
                    <div key={option.id} className="flex items-center justify-between gap-2">
                      <span className="text-muted-foreground text-sm">
                        {getOptionLabel(option)}
                      </span>
                      <span className="text-foreground text-sm font-medium">
                        {formatPrice(option.price)}
                        {option.unit && `/${formatUnit(option.unit)}`}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </Link>
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

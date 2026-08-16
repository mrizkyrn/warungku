import { Link, useNavigate } from '@tanstack/react-router';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.js';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.js';
import { Button, buttonVariants } from '@/components/ui/button.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.js';
import { PageHeader } from '@/components/ui/page-header.js';
import { Skeleton } from '@/components/ui/skeleton.js';
import { formatPrice, formatUnit } from '@/lib/format.js';

import { useDeleteProductMutation, useProductQuery } from '../queries.js';
import { getOptionLabel } from '../utils.js';

interface ProductDetailProps {
  productId: string;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const navigate = useNavigate();

  const { data: product, isLoading, isError, error } = useProductQuery(productId);
  const deleteMutation = useDeleteProductMutation();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4" aria-hidden="true">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Skeleton className="h-6 w-1/3" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full rounded-lg" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Gagal memuat produk</AlertTitle>
        <AlertDescription>{error?.message ?? 'Produk tidak ditemukan.'}</AlertDescription>
      </Alert>
    );
  }

  function handleDelete() {
    if (!product) return;

    deleteMutation.mutate(product.id, {
      onSuccess: () => void navigate({ to: '/products' }),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <PageHeader to="/products" title={product.name} />
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/products/$productId/edit"
            params={{ productId }}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Edit
          </Link>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button variant="destructive" size="sm" disabled={deleteMutation.isPending} />
              }
            >
              Hapus
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hapus produk?</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus{' '}
                  <span className="text-foreground font-medium">{product.name}</span>? Tindakan ini
                  tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={deleteMutation.isPending}>
                  {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {deleteMutation.error && (
        <Alert variant="destructive">
          <AlertTitle>Gagal menghapus produk</AlertTitle>
          <AlertDescription>{deleteMutation.error.message}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pilihan Produk</CardTitle>
        </CardHeader>
        <CardContent>
          {product.options.length === 0 ? (
            <p className="text-muted-foreground text-sm">Produk ini belum memiliki pilihan.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {product.options.map((option) => (
                <li
                  key={option.id}
                  className="border-border flex items-center justify-between gap-2 rounded-lg border px-3 py-2"
                >
                  <div className="flex flex-col">
                    <span className="text-foreground text-sm font-medium">
                      {getOptionLabel(option)}
                    </span>
                    {option.unit && (
                      <span className="text-muted-foreground text-xs">
                        {formatUnit(option.unit)}
                      </span>
                    )}
                  </div>
                  <span className="text-foreground text-sm">{formatPrice(option.price)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

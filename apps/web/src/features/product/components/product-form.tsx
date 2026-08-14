import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { createProductBodySchema, type CreateProductInput } from '@warungku/shared-schemas';
import type { Product, Unit } from '@warungku/shared-types';
import { Trash2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.js';
import { Button, buttonVariants } from '@/components/ui/button.js';
import { Input } from '@/components/ui/input.js';
import { Label } from '@/components/ui/label.js';
import { Select } from '@/components/ui/select.js';
import { unitLabels } from '@/lib/format.js';

import { useProductOptions } from '../hooks';
import { useCreateProductMutation, useUpdateProductMutation } from '../queries.js';
import { buildProductInput } from '../utils.js';

interface ProductFormProps {
  product?: Product;
}

export function ProductForm({ product }: ProductFormProps) {
  const isEdit = Boolean(product);
  const navigate = useNavigate();
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation(product?.id ?? '');
  const mutation = isEdit ? updateMutation : createMutation;

  const form = useForm<CreateProductInput>({
    resolver: zodResolver(createProductBodySchema),
    defaultValues: product
      ? {
          name: product.name,
          options: product.options.map((option) => ({
            name: option.name,
            price: option.price,
            unit: option.unit ?? undefined,
          })),
        }
      : { name: '', options: [{ name: null, price: 1, unit: undefined }] },
  });

  const { fields, remove, isDefaultPriceMode, handleAddOption } = useProductOptions(form.control);

  function onSubmit(data: CreateProductInput) {
    const input = buildProductInput(data);

    mutation.mutate(input, {
      onSuccess: () => {
        if (isEdit) {
          void navigate({ to: '/products/$productId', params: { productId: product!.id } });
        } else {
          void navigate({ to: '/products' });
        }
      },
    });
  }

  return (
    <form
      onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
      className="flex flex-col gap-4"
    >
      {mutation.error && (
        <Alert variant="destructive">
          <AlertTitle>Gagal menyimpan produk</AlertTitle>
          <AlertDescription>{mutation.error.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-1">
        <Label htmlFor="name">Nama Produk</Label>
        <Input
          id="name"
          placeholder="mis. Kopi Susu"
          aria-invalid={Boolean(form.formState.errors.name)}
          {...form.register('name')}
        />
        {form.formState.errors.name && (
          <span className="text-destructive text-sm">{form.formState.errors.name.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-foreground text-lg font-medium">
              {isDefaultPriceMode ? 'Harga' : 'Pilihan Produk'}
            </h2>
            <p className="text-muted-foreground text-sm">
              {isDefaultPriceMode
                ? 'Satu harga untuk produk ini.'
                : 'Tambahkan varian beserta harganya.'}
            </p>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={handleAddOption}>
            Tambah Pilihan
          </Button>
        </div>

        {isDefaultPriceMode && fields[0] ? (
          <div className="border-border flex flex-col gap-2 rounded-lg border p-3">
            <div className="flex flex-row gap-2">
              <div className="flex min-w-0 flex-3 flex-col gap-1">
                <Label>Harga (Rp)</Label>
                <Controller
                  control={form.control}
                  name="options.0.price"
                  render={({ field }) => (
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      placeholder="15000"
                      value={Number.isFinite(field.value) ? field.value : ''}
                      onChange={(event) => field.onChange(event.target.valueAsNumber)}
                      onBlur={field.onBlur}
                      aria-invalid={Boolean(form.formState.errors.options?.[0]?.price)}
                    />
                  )}
                />
                {form.formState.errors.options?.[0]?.price && (
                  <span className="text-destructive text-sm">
                    {form.formState.errors.options[0]?.price?.message}
                  </span>
                )}
              </div>

              <div className="flex min-w-0 flex-2 flex-col gap-1">
                <Label>Satuan</Label>
                <Controller
                  control={form.control}
                  name="options.0.unit"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? ''}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value === '' ? undefined : (event.target.value as Unit),
                        )
                      }
                      onBlur={field.onBlur}
                    >
                      <option value="">Tidak ada</option>
                      {Object.entries(unitLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>
        ) : (
          fields.map((field, index) => (
            <div key={field.id} className="border-border flex flex-col gap-2 rounded-lg border p-3">
              <div className="flex items-end gap-2">
                <div className="flex flex-1 flex-col gap-1">
                  <Label htmlFor={`options.${index}.name`}>Nama Pilihan</Label>
                  <Input
                    id={`options.${index}.name`}
                    placeholder="mis. Reguler"
                    {...form.register(`options.${index}.name`)}
                  />
                  {form.formState.errors.options?.[index]?.name && (
                    <span className="text-destructive text-sm">
                      {form.formState.errors.options[index]?.name?.message}
                    </span>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Hapus pilihan"
                  disabled={fields.length <= 1}
                  onClick={() => remove(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              <div className="flex flex-row gap-2">
                <div className="flex min-w-0 flex-3 flex-col gap-1">
                  <Label>Harga (Rp)</Label>
                  <Controller
                    control={form.control}
                    name={`options.${index}.price`}
                    render={({ field }) => (
                      <Input
                        type="number"
                        inputMode="numeric"
                        min={1}
                        placeholder="15000"
                        value={Number.isFinite(field.value) ? field.value : ''}
                        onChange={(event) => field.onChange(event.target.valueAsNumber)}
                        onBlur={field.onBlur}
                        aria-invalid={Boolean(form.formState.errors.options?.[index]?.price)}
                      />
                    )}
                  />
                  {form.formState.errors.options?.[index]?.price && (
                    <span className="text-destructive text-sm">
                      {form.formState.errors.options[index]?.price?.message}
                    </span>
                  )}
                </div>

                <div className="flex min-w-0 flex-2 flex-col gap-1">
                  <Label>Satuan</Label>
                  <Controller
                    control={form.control}
                    name={`options.${index}.unit`}
                    render={({ field }) => (
                      <Select
                        value={field.value ?? ''}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value === '' ? undefined : (event.target.value as Unit),
                          )
                        }
                        onBlur={field.onBlur}
                      >
                        <option value="">Tidak ada</option>
                        {Object.entries(unitLabels).map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={mutation.isPending || form.formState.isSubmitting}>
          {isEdit ? 'Simpan Perubahan' : 'Simpan Produk'}
        </Button>
        {isEdit ? (
          <Link
            to="/products/$productId"
            params={{ productId: product!.id }}
            className={buttonVariants({ variant: 'ghost' })}
          >
            Batal
          </Link>
        ) : (
          <Link to="/products" className={buttonVariants({ variant: 'ghost' })}>
            Batal
          </Link>
        )}
      </div>
    </form>
  );
}

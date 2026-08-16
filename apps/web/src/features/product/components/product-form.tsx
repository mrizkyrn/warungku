import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from '@tanstack/react-router';
import { createProductBodySchema, type CreateProductInput } from '@warungku/shared-schemas';
import type { Product, Unit } from '@warungku/shared-types';
import { Trash2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.js';
import { Button, buttonVariants } from '@/components/ui/button.js';
import { CurrencyInput } from '@/components/ui/currency-input.js';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field.js';
import { Input } from '@/components/ui/input.js';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.js';
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

      <FieldGroup>
        <Field data-invalid={Boolean(form.formState.errors.name)}>
          <FieldLabel htmlFor="name">Nama Produk</FieldLabel>
          <Input
            id="name"
            placeholder="mis. Kopi Susu"
            aria-invalid={Boolean(form.formState.errors.name)}
            {...form.register('name')}
          />
          <FieldError errors={[form.formState.errors.name]} />
        </Field>

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
                <Field
                  className="min-w-0 flex-3"
                  data-invalid={Boolean(form.formState.errors.options?.[0]?.price)}
                >
                  <FieldLabel>Harga (Rp)</FieldLabel>
                  <Controller
                    control={form.control}
                    name="options.0.price"
                    render={({ field }) => (
                      <CurrencyInput
                        placeholder="5.000"
                        value={field.value}
                        onValueChange={(value) => field.onChange(value ?? NaN)}
                        onBlur={field.onBlur}
                        aria-invalid={Boolean(form.formState.errors.options?.[0]?.price)}
                      />
                    )}
                  />
                  <FieldError errors={[form.formState.errors.options?.[0]?.price]} />
                </Field>

                <Field className="min-w-0 flex-2">
                  <FieldLabel>Satuan</FieldLabel>
                  <Controller
                    control={form.control}
                    name="options.0.unit"
                    render={({ field }) => (
                      <Select
                        value={field.value ?? null}
                        onValueChange={(value) =>
                          field.onChange(value === null ? undefined : (value as Unit))
                        }
                      >
                        <SelectTrigger className="w-full" onBlur={field.onBlur}>
                          <SelectValue placeholder="Tidak ada" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={null}>Tidak ada</SelectItem>
                          {Object.entries(unitLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>
            </div>
          ) : (
            fields.map((field, index) => (
              <div
                key={field.id}
                className="border-border flex flex-col gap-2 rounded-lg border p-3"
              >
                <div className="flex items-end gap-2">
                  <Field
                    className="flex-1"
                    data-invalid={Boolean(form.formState.errors.options?.[index]?.name)}
                  >
                    <FieldLabel htmlFor={`options.${index}.name`}>Nama Pilihan</FieldLabel>
                    <Input
                      id={`options.${index}.name`}
                      placeholder="mis. Reguler"
                      aria-invalid={Boolean(form.formState.errors.options?.[index]?.name)}
                      {...form.register(`options.${index}.name`)}
                    />
                    <FieldError errors={[form.formState.errors.options?.[index]?.name]} />
                  </Field>
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
                  <Field
                    className="min-w-0 flex-3"
                    data-invalid={Boolean(form.formState.errors.options?.[index]?.price)}
                  >
                    <FieldLabel>Harga (Rp)</FieldLabel>
                    <Controller
                      control={form.control}
                      name={`options.${index}.price`}
                      render={({ field }) => (
                        <CurrencyInput
                          placeholder="5.000"
                          value={field.value}
                          onValueChange={(value) => field.onChange(value ?? NaN)}
                          onBlur={field.onBlur}
                          aria-invalid={Boolean(form.formState.errors.options?.[index]?.price)}
                        />
                      )}
                    />
                    <FieldError errors={[form.formState.errors.options?.[index]?.price]} />
                  </Field>

                  <Field className="min-w-0 flex-2">
                    <FieldLabel>Satuan</FieldLabel>
                    <Controller
                      control={form.control}
                      name={`options.${index}.unit`}
                      render={({ field }) => (
                        <Select
                          value={field.value ?? null}
                          onValueChange={(value) =>
                            field.onChange(value === null ? undefined : (value as Unit))
                          }
                        >
                          <SelectTrigger className="w-full" onBlur={field.onBlur}>
                            <SelectValue placeholder="Tidak ada" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={null}>Tidak ada</SelectItem>
                            {Object.entries(unitLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                </div>
              </div>
            ))
          )}
        </div>
      </FieldGroup>

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

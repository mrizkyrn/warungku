import type { CreateProductInput } from '@warungku/shared-schemas';
import type { Product, ProductOption } from '@warungku/shared-types';

import { formatPrice } from '@/lib/format.js';

export function isDefaultPriceOptions(options: Array<{ name?: string | null }>): boolean {
  return options.length === 1 && !(options[0]?.name?.trim() ?? '');
}

export function buildProductInput(formData: CreateProductInput): CreateProductInput {
  return {
    name: formData.name,
    options: formData.options.map((option) => ({
      name: option.name?.trim() || null,
      price: option.price,
      unit: option.unit,
    })),
  };
}

export function getProductPriceLabel(product: Product): string {
  const [option] = product.options;

  if (isDefaultPriceOptions(product.options) && option) {
    return formatPrice(option.price);
  }

  return `${product.options.length} pilihan`;
}

export function getOptionLabel(option: Pick<ProductOption, 'name'>): string {
  return option.name ?? 'Harga';
}

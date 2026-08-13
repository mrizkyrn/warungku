import type { Unit } from '@warungku/shared-types';

export const unitLabels: Record<Unit, string> = {
  GRAM: 'Gram',
  KILOGRAM: 'Kilogram',
  MILLILITER: 'Mililiter',
  LITER: 'Liter',
};

const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

export function formatPrice(price: number): string {
  return idrFormatter.format(price);
}

export function formatUnit(unit: Unit | null): string {
  return unit ? unitLabels[unit] : '';
}

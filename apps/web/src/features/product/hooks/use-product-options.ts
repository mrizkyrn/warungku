import type { CreateProductInput } from '@warungku/shared-schemas';
import type { Control } from 'react-hook-form';
import { useFieldArray } from 'react-hook-form';

export function useProductOptions(control: Control<CreateProductInput>) {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'options',
  });

  const isDefaultPriceMode = fields.length === 1 && !(fields[0]?.name?.trim() ?? '');

  function handleAddOption() {
    if (isDefaultPriceMode && fields[0]) {
      update(0, { name: '', price: fields[0].price, unit: fields[0].unit });
    }

    append({ name: '', price: 1, unit: undefined });
  }

  return { fields, remove, isDefaultPriceMode, handleAddOption };
}

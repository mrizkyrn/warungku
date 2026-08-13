import { createFileRoute } from '@tanstack/react-router';

import { ProductList } from '@/features/product/components/product-list.js';

export const Route = createFileRoute('/products/')({
  component: ProductList,
});

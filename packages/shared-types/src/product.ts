export type Unit = 'GRAM' | 'KILOGRAM' | 'MILLILITER' | 'LITER';

export interface ProductOption {
  id: string;
  productId: string;
  name: string | null;
  price: number;
  unit: Unit | null;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  options: ProductOption[];
}

export interface SaleProduct {
  id: string | number;
  brand?: string;
  title: string;
  description: string;
  price: number;
  salePrice?: number;
  size?: string[];
  images?: string[];
  category?: string;
  stock?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

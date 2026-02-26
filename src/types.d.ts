export declare global {
  export interface Product {
    id: string;
    name: string;
    category: string;
    description: string;
    price: number;
    stock: number;
    image?: string | undefined;
    rating?: number | undefined;
  }
}

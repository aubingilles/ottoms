export type ProductImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ProductOption = {
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: number;
  title: string;
  price: string;
  compareAtPrice: string | null;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  sku: string | null;
};

export type Product = {
  id: number;
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  tags: string;
  descriptionHtml: string;
  options: ProductOption[];
  images: ProductImage[];
  variants: ProductVariant[];
};

export type Collection = {
  id: number;
  handle: string;
  title: string;
  descriptionHtml: string;
  image: string | null;
  productHandles: string[];
};

export type ContentPage = {
  handle: string;
  title: string;
  bodyHtml: string;
};

export type CartLine = {
  variantId: number;
  productHandle: string;
  productTitle: string;
  variantTitle: string;
  price: string;
  image: string | null;
  quantity: number;
};

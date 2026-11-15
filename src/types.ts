export type ProductCategory = 'shakes' | 'bars' | 'bites' | 'packs';

export type ScreenRoute = 'drop' | 'catalog' | 'builder' | 'lab' | 'pdp';

export interface FlavorVariant {
  id: string;
  name: string;
  dotColor: string;
  accentHex: string;
  image: string;
  tagline: string;
  inStock: boolean;
}

export interface ProductMacros {
  proteinG: number;
  netCarbsG: number;
  calories: number;
  sugarG: number;
  bcaaG: number;
  fatG: number;
  fiberG: number;
}

export interface PackOption {
  id: string;
  label: string;
  count: number;
  price: number;
  compareAtPrice?: number;
}

export interface ProductReview {
  id: string;
  author: string;
  role: string;
  rating: number;
  flavorName: string;
  quote: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  shortDesc: string;
  longDesc: string;
  borderAccent: 'lime' | 'magenta' | 'cobalt';
  badgeText?: string;
  macros: ProductMacros;
  flavors: FlavorVariant[];
  packOptions: PackOption[];
  ingredients: string[];
  highlights: string[];
  reviews: ProductReview[];
}

export interface CartItem {
  cartKey: string;
  productId: string;
  productName: string;
  categoryLabel: string;
  flavorId: string;
  flavorName: string;
  flavorDot: string;
  packId: string;
  packLabel: string;
  unitPrice: number;
  isSubscription: boolean;
  quantity: number;
  image: string;
  customSummary?: string;
}

export interface ConfirmedOrder {
  orderNumber: string;
  customerName: string;
  email: string;
  address: string;
  postalCode: string;
  paymentMethod: 'card' | 'cod';
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  placedAt: string;
}

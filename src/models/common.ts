export interface Cart {
  weight: number;
  dimensions: {
    length?: number;
    width?: number;
    height?: number;
  };
  total: number;
}

export interface Address {
  city: string;
  street: string;
  house: string;
  apartment?: string;
}

export interface DeliveryOption {
  provider: string;
  name: string;
  cost: number;
  days: number;
  description?: string;
}

export interface DeliveryRequest {
  cart: Cart;
  address: Address;
}

export interface DeliveryResponse {
  options: DeliveryOption[];
}

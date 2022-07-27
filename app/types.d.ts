declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    STRIPE_SECRET_KEY: string;
    STRIPE_API_KEY: string;
    PUBLIC_HOST: string;
    SENDINBLUE_API_KEY: string;
  }
}

// Metadata object use to transfer data from Stripe session item to backend
interface StripeMetadata {
  id: string;
  variant?: string;
  stock: number;
}

interface OrderItemSerialized {
  quantity: number;
  productId: string;
  variantId?: string;
}

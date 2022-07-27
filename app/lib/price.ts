import minBy from "lodash/minBy";
import {
  GetProductsCheckoutQuery,
  GetSettingsQuery,
} from "~/graphql/generated/graphql";
import { ProductHomepage } from "~/routes";
import { ProductCategory } from "~/routes/categories/$slug";

export interface ShippedProduct {
  quantity: number;
  stock: number;
  product: GetProductsCheckoutQuery["products"][number];
  variant?: GetProductsCheckoutQuery["products"][number]["variants"][number];
}

// This is from Hygraph json settings
type ShippingSettings = {
  letters: Record<string, number>;
  package: Record<string, number>;
};

export const formatPrice = (price: number) =>
  Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(price / 100);

export const getMinPriceForProduct = (
  product: ProductHomepage | ProductCategory
) =>
  `${formatPrice(minBy(product.variants, "price")?.price || 0)}${
    product.variants.length > 0 ? " +" : ""
  }`;

export const calculateShipping = (
  products: ShippedProduct[],
  settings: GetSettingsQuery["settings"][number]
) => {
  const needsPackage = !!products.find(
    (product) => product.product.needsPackage
  );
  let totalWeight = 0;
  products.forEach(
    (product) =>
      (totalWeight += product.variant?.weight || product.product.weight)
  );
  const shippingSettings: ShippingSettings = settings.shipping;
  const shippingPriceEntry = Object.entries(
    needsPackage ? shippingSettings.package : shippingSettings.letters
  ).find(([shippingWeight]) => {
    return parseInt(shippingWeight) >= totalWeight;
  });

  return (shippingPriceEntry && shippingPriceEntry[1]) || 0;
};

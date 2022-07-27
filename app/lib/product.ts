import sortBy from "lodash/sortBy";
import { ProductHomepage } from "~/routes";
import { ProductCategory } from "~/routes/categories/$slug";

export const isAvailable = (product: ProductHomepage | ProductCategory) => {
  return product.variants.length
    ? product.variants.find((variant) => variant.stock > 0)
    : 0;
};

export const sortProducts = (
  products: (ProductHomepage | ProductCategory)[]
) => {
  return sortBy(products, (product) => (isAvailable(product) ? 0 : 1));
};

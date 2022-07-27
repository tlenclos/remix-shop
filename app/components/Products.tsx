import { SimpleGrid } from "@chakra-ui/react";
import { sortProducts } from "~/lib/product";
import { ProductHomepage } from "~/routes";
import Product from "./Product";

type Props = {
  products: ProductHomepage[];
};

export default function Products({ products }: Props) {
  const orderedProducts = sortProducts(products);

  return (
    <SimpleGrid pb={20} w="full" gridGap="5" columns={[1, 2, 3]}>
      {orderedProducts.map((product) => (
        <Product
          key={product.id}
          product={product}
        />
      ))}
    </SimpleGrid>
  );
}

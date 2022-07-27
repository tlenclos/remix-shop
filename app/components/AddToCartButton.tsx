import { Button, ButtonProps } from "@chakra-ui/react";
import { useCartContext } from "~/context/CartContext";
import { Product, Variant } from "~/routes/products/$slug";

type Props = {
  product: Product;
  productVariant?: Variant;
} & ButtonProps;

export default function AddToCartButton({
  product,
  productVariant,
  ...buttonProps
}: Props) {
  const { addToCart, isAvailable } = useCartContext();
  const defaultVariant = {
    id: product.id,
    name: product.name,
    stock: productVariant?.stock || 0,
  };
  const available = isAvailable(product, productVariant?.id || product.id);

  return (
    <Button
      variant="secondary"
      onClick={() =>
        addToCart({
          ...product,
          productId: product.id,
          productVariant: productVariant || defaultVariant,
          quantity: 1,
          price: productVariant?.price || 0,
        })
      }
      {...buttonProps}
      disabled={!available}
    >
      {available ? "Ajouter au panier" : "En rupture de stock"}
    </Button>
  );
}

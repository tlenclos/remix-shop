import { useDisclosure } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { Item, useCart } from "react-use-cart";
import { useToast } from "@chakra-ui/react";
import { useSearchParams } from "remix";

import { Product, Variant } from "~/routes/products/$slug";

type CartContextType = {
  isCartOpen: boolean;
  onCartOpen: () => void;
  onCartClose: () => void;
  addToCart: (product: ProductCart) => void;
  checkout: (products: Item[]) => Promise<void>;
  isCheckingOut: boolean;
  isAvailable: (product: Product, variantId: string) => boolean;
} & ReturnType<typeof useCart>;

export type ProductCart = {
  id: string;
  productId: string;
  price: number;
  name: string;
  images: Array<{ __typename?: "Asset" | undefined; url: string }>;
  quantity: number;
  productVariant: Variant;
};

export interface ICartLines {
  [productId: string]: ProductCart;
}

export const CartContext = React.createContext<CartContextType>(
  {} as CartContextType
);

export const CartContextProvider: React.FC<{}> = ({ children }) => {
  const {
    isOpen: isCartOpen,
    onOpen: onCartOpen,
    onClose: onCartClose,
  } = useDisclosure();

  const [isCheckingOut, setIsCheckoutOut] = useState(false);
  const toast = useToast();
  const cart = useCart();
  let [searchParams, setSearchParams] = useSearchParams();

  function addToCart(product: ProductCart) {
    cart.addItem({ ...product, id: product.productVariant.id });
    onCartOpen();
  }

  async function checkout(products: Item[]) {
    setIsCheckoutOut(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "post",
        body: JSON.stringify(products),
      });
      const data = await response.json();

      if (response.status === 200 && data.url) {
        window.location.href = data.url;
      } else {
        toast({
          title: data.error || "Une erreur est intervenue",
          status: "error",
          isClosable: true,
        });
      }
    } catch (e) {
    } finally {
      setIsCheckoutOut(false);
    }
  }

  function isAvailable(product: Product, variantId: string) {
    const item = cart.getItem(variantId) as ProductCart;
    let stock = 0;

    if (product.variants.length > 0) {
      const variant = product.variants.find((variant) => {
        if (variantId) {
          return variant.id === variantId;
        } else {
          return variant.stock > 0;
        }
      });

      if (variant) {
        stock = variant.stock;
      }
    }

    return (
      stock > 0 && (item ? item.quantity < item.productVariant.stock : true)
    );
  }

  useEffect(() => {
    if (searchParams.get("clearCart")) {
      cart.emptyCart();
      setSearchParams({});
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        ...cart,
        isCartOpen,
        onCartOpen,
        onCartClose,
        addToCart,
        checkout,
        isCheckingOut,
        isAvailable,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  return useContext(CartContext);
};

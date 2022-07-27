import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import { useCartContext, ProductCart } from "~/context/CartContext";
import { formatPrice } from "~/lib/price";

export function Cart() {
  const {
    totalItems,
    items,
    removeItem,
    cartTotal,
    isCartOpen,
    onCartClose,
    checkout,
    isCheckingOut,
  } = useCartContext();

  return (
    <Drawer
      size="sm"
      isOpen={isCartOpen}
      placement="right"
      onClose={onCartClose}
    >
      <DrawerOverlay backgroundColor="whiteAlpha.800" />
      <DrawerContent borderLeft="1px" borderColor="secondary.500" shadow="none">
        <DrawerCloseButton color="secondary.800" top={3} />
        <DrawerHeader
          borderBottom="1px"
          borderColor="secondary.500"
          fontSize="md"
          bg="secondary.200"
          color="secondary.800"
        >
          Panier ({totalItems})
        </DrawerHeader>
        <DrawerBody p={0}>
          {totalItems === 0 && <Text p={4}>Panier vide</Text>}
          {(items as ProductCart[]).map((product, index) => (
            <Flex borderBottom="1px" borderColor="secondary.500" key={index}>
              <Image
                borderRight="1px"
                borderColor="secondary.500"
                objectFit="cover"
                width="7rem"
                src={product.images[0].url}
              />
              <Flex justifyContent="space-between" flexDirection="column" p={2}>
                <Box>
                  <Text fontWeight="semibold" fontSize="xl" color="primary.600">
                    {product.name}
                  </Text>
                  {product.productVariant &&
                    product.productVariant.id !== product.productId && (
                      <Text color="primary.600">
                        Variante : {product.productVariant?.name}
                      </Text>
                    )}
                  <Text color="primary.600">
                    {formatPrice(product.productVariant.price || 0)} - Quantité:{" "}
                    {product.quantity}
                  </Text>
                </Box>
                <Text
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                  onClick={() => removeItem(product.id)}
                  fontSize="sm"
                  color="primary.500"
                >
                  Supprimer
                </Text>
              </Flex>
            </Flex>
          ))}
          {totalItems > 0 && (
            <Box p={4}>
              <Button
                onClick={() => checkout(items)}
                variant="secondary"
                pointerEvents={totalItems === 0 ? "none" : "all"}
                disabled={totalItems === 0}
                width="100%"
                py={4}
                isLoading={isCheckingOut}
              >
                Payer ({formatPrice(cartTotal)})
              </Button>
            </Box>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

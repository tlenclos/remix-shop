import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link as ChakraLink,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useMatch } from "react-router";
import { Link, NavLink } from "remix";

import { useCartContext } from "~/context/CartContext";
import { formatPrice } from "~/lib/price";
import { Cart } from "./Cart";
import Logo from "./Logo";

const menu = [
  { title: "Shop", href: "/" },
  { title: "Catégorie 1", href: "/categories/categorie-1" },
  { title: "À propos", href: "/pages/a-propos" },
];

const MenuLink = ({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) => {
  const isProduct = useMatch("/products/*");
  const forceActive = isProduct && href === "/";

  return (
    <ChakraLink
      as={NavLink}
      to={href}
      color="primary.900"
      pb={1}
      _hover={{
        textDecoration: "none",
      }}
      borderBottom="1px solid transparent"
      // @ts-ignore
      style={({ isActive }) =>
        isActive || forceActive
          ? { fontWeight: "bold", borderBottom: "1px solid black" }
          : undefined
      }
    >
      {children}
    </ChakraLink>
  );
};

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { totalItems, cartTotal, onCartOpen } = useCartContext();

  return (
    <Box as="header" px={4} py={3} bg="primary.200">
      <Container maxW="container.xl">
        <Flex alignItems={"center"} justifyContent={"space-between"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
            mr={3}
            color="primary.600"
          />
          <HStack spacing={8} alignItems={"center"} flex={1} mr={10}>
            <Link to="/">
              <Logo />
            </Link>
            <HStack
              as={"nav"}
              spacing={8}
              pr={4}
              display={{ base: "none", md: "flex" }}
              flex={1}
              justifyContent="right"
            >
              {menu.map((link) => (
                <MenuLink key={link.href} href={link.href}>
                  {link.title}
                </MenuLink>
              ))}
            </HStack>
          </HStack>
          <HStack alignItems={"center"}>
            <Text fontSize="xs" color="secondary.600">
              {formatPrice(cartTotal)}
            </Text>
            <Box position="relative">
              <Icon
                as={MdOutlineShoppingCart}
                w={8}
                h={8}
                color="secondary.600"
                onClick={onCartOpen}
                _hover={{
                  cursor: "pointer",
                }}
              />
              {totalItems > 0 && (
                <Box
                  borderRadius="10"
                  height="20px"
                  width="20px"
                  position="absolute"
                  top="-8px"
                  right="-8px"
                  bg="secondary.400"
                  p={1}
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  fontSize="xs"
                  lineHeight="12px"
                  textColor="white"
                >
                  {totalItems}
                </Box>
              )}
            </Box>
          </HStack>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: "none" }}>
            <Stack as={"nav"} spacing={4}>
              {menu.map((link) => (
                <MenuLink key={link.href} href={link.href}>
                  {link.title}
                </MenuLink>
              ))}
            </Stack>
          </Box>
        ) : null}
        <Cart />
      </Container>
    </Box>
  );
}

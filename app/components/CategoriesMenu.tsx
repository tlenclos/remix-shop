import { Flex, Link as ChakraLink } from "@chakra-ui/react";
import { Link, NavLink } from "remix";

type Props = {
  categories: {
    name: string;
    slug?: string | null;
    image?: {
      url: string | null;
    } | null;
  }[];
};

export default function CategoriesMenu({ categories }: Props) {
  return (
    <Flex
      as={"nav"}
      alignItems={"center"}
      bg="secondary.200"
      justifyContent="center"
    >
      {categories.map((category) => (
        <ChakraLink
          p={4}
          borderWidth={1}
          borderColor="secondary.500"
          color="secondary.700"
          as={NavLink}
          key={category.slug}
          to={`/categories/${category.slug}`}
          flex={1}
          textAlign="center"
          margin={0}
          backgroundImage={
            category.image ? `url(${category.image.url})` : undefined
          }
          backgroundSize="contain"
          backgroundRepeat="no-repeat"
          // @ts-ignore
          style={({ isActive }) =>
            isActive
              ? {
                  fontWeight: "bold",
                  backgroundColor: "#F4FAD7",
                }
              : undefined
          }
        >
          {category.name}
        </ChakraLink>
      ))}
    </Flex>
  );
}

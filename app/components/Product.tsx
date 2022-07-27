import {
  Box,
  Heading,
  Image,
  Stack,
  Text,
  Link as ChakraLink,
  AspectRatio,
  Center,
} from "@chakra-ui/react";
import { Link } from "remix";
import { ProductHomepage } from "~/routes";
import { ProductCategory } from "~/routes/categories/$slug";
import { getMinPriceForProduct } from "~/lib/price";
import { isAvailable } from "~/lib/product";

interface Props {
  product: ProductHomepage | ProductCategory;
}

const Product = ({ product }: Props) => {
  const { id, slug, images, name } = product;
  const available = isAvailable(product);

  return (
    <Stack
      borderWidth={1}
      position="relative"
      opacity={available || product.variants.length === 0 ? 1 : 0.5}
    >
      <ChakraLink
        as={Link}
        key={id}
        to={`/products/${slug}`}
        _hover={{ backgroundColor: "primary.200" }}
        display="flex"
        flex={1}
        flexDirection="column"
      >
        <AspectRatio ratio={4 / 3}>
          <Box position="relative">
            {images[0] && <Image src={images[0].url} alt={name} width="100%" />}
            {images[1] && (
              <Image
                src={images[1].url}
                alt={name}
                position="absolute"
                top={0}
                left={0}
                opacity={0}
                _hover={{ opacity: 1 }}
                width="100%"
              />
            )}
          </Box>
        </AspectRatio>
        <Box px={4} py={3}>
          <Heading size="md" color="primary.600">
            {name}
          </Heading>
          {product.variants.length > 0 && (
            <Text color="primary.600">{getMinPriceForProduct(product)}</Text>
          )}
        </Box>
      </ChakraLink>
    </Stack>
  );
};

export default Product;

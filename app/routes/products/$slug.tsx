import {
  Box,
  Heading,
  Image,
  Select,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import navigationSwiperCss from "node_modules/swiper/modules/navigation/navigation.min.css";
import thumbsSwiperCss from "node_modules/swiper/modules/thumbs/thumbs.min.css";
import zoomSwiperCss from "node_modules/swiper/modules/zoom/zoom.min.css";
import swiperCss from "node_modules/swiper/swiper.min.css";
import { useState } from "react";
import type { LoaderFunction, MetaFunction } from "remix";
import { json, useLoaderData } from "remix";
import { FreeMode, Navigation, Thumbs, Zoom } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import AddToCartButton from "~/components/AddToCartButton";
import api from "~/lib/api";
import { defaultMeta } from "~/lib/meta";
import { formatPrice, getMinPriceForProduct } from "~/lib/price";

export type Product = NonNullable<
  Awaited<ReturnType<typeof api.getProduct>>["product"]
>;
export type Variant = Product["variants"][number];

export const links = () => {
  return [
    { rel: "stylesheet", href: swiperCss },
    { rel: "stylesheet", href: navigationSwiperCss },
    { rel: "stylesheet", href: zoomSwiperCss },
    { rel: "stylesheet", href: thumbsSwiperCss },
  ];
};

export let loader: LoaderFunction = async ({ params }) => {
  const { product } = await api.getProduct({ slug: params.slug! });

  if (!product) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json(product);
};

export const meta: MetaFunction = ({ data }: { data: Product }) => {
  const image = data.images[0].url;
  return {
    ...defaultMeta,
    "og:type": "og:product",
    title: data.name,
    "og:title": data.name,
    description: data.description,
    "og:description": data.description,
    "og:image:url": image,
    "twitter:image": image,
    "product:price:amount": getMinPriceForProduct(data),
    "product:price:currency": "EUR",
  };
};

export default function Product() {
  const product = useLoaderData<Product>();
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [variant, setVariant] = useState<Variant>();

  return (
    <SimpleGrid minChildWidth="300px" spacing={10} py={10}>
      <Box color="white">
        <Swiper
          modules={[Navigation, Zoom, Thumbs]}
          slidesPerView={1}
          navigation
          zoom
          onSlideChange={(swiper) => {
            setSelectedSlide(swiper.activeIndex);
          }}
          thumbs={{ swiper: thumbsSwiper }}
        >
          {product.images.map((image) => (
            <SwiperSlide zoom key={image.url}>
              <Image src={image.url} alt={product.name} />
            </SwiperSlide>
          ))}
        </Swiper>
        {product.images.length > 1 && (
          <Box mt={2}>
            <Swiper
              modules={[FreeMode, Navigation, Thumbs]}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              spaceBetween={10}
              // @ts-ignore
              onSwiper={setThumbsSwiper}
            >
              {product.images.map((image, i) => (
                <SwiperSlide zoom key={image.url}>
                  <Image
                    src={image.url}
                    alt={product.name}
                    opacity={selectedSlide === i ? 0.5 : 1}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        )}
      </Box>
      <VStack spacing={2} minW="200px" alignItems="left">
        <Heading color="primary.600">{product.name}</Heading>
        {product.variants.length > 0 && (
          <Text color="primary.500" pb={2}>
            {getMinPriceForProduct(product)}
          </Text>
        )}
        <Text color="primary.500" textAlign="justify">
          {product.description}
        </Text>
        {product.variants.length === 1 &&
          !variant &&
          setVariant(product.variants[0])}
        {product.variants.length > 1 && (
          <Select
            placeholder="Sélectionnez une variante"
            color="secondary.600"
            onChange={(e) => {
              const selectedVariant = product.variants.find(
                (variant) => variant.id === e.target.value
              );
              setVariant(selectedVariant);
            }}
          >
            {product.variants.map((variant) => (
              <option
                key={variant.id}
                value={variant.id}
                disabled={variant.stock === 0}
              >
                {variant.name} - {formatPrice(variant.price || 0)}
              </option>
            ))}
          </Select>
        )}

        {product.variants.length > 0 ? (
          <AddToCartButton product={product} productVariant={variant} />
        ) : null}
      </VStack>
    </SimpleGrid>
  );
}

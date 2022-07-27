import { Box, Image } from "@chakra-ui/react";
import { json, LoaderFunction, MetaFunction, useLoaderData } from "remix";
import Products from "~/components/Products";
import api from "~/lib/api";
import { defaultMeta } from "~/lib/meta";

type Category = NonNullable<
  Awaited<ReturnType<typeof api.getCategory>>["category"]
>;
export type ProductCategory = Category["products"][number];

export let loader: LoaderFunction = async ({ params }) => {
  const { category } = await api.getCategory({ slug: params.slug! });

  if (!category) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json(category);
};

export const meta: MetaFunction = ({ data }: { data: Category }) => {
  return {
    ...defaultMeta,
    title: data.name,
    "og:title": data.name,
    "og:image:url": "TODO",
    "twitter:image": "TODO",
  };
};

export default function Index() {
  const category = useLoaderData<Category>();

  return (
    <>
      {category?.image && (
        <Image
          src={category?.image?.url}
          maxHeight="150px"
          marginX="auto"
          marginY={6}
          alt={category.name}
        />
      )}
      {category.description && (
        <Box
          mb={5}
          textAlign="center"
          dangerouslySetInnerHTML={{ __html: category.description.html }}
        />
      )}
      {category?.products && <Products products={category?.products} />}
    </>
  );
}

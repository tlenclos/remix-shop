import { Box } from "@chakra-ui/react";
import { json, LoaderFunction, MetaFunction, useLoaderData } from "remix";
import Products from "~/components/Products";
import { HomepageQuery } from "~/graphql/generated/graphql";
import api from "~/lib/api";
import { defaultMeta } from "~/lib/meta";

export type ProductHomepage = HomepageQuery["products"][0];

export const meta: MetaFunction = () => {
  return {
    ...defaultMeta,
    title: "Remix Shop - Homepage",
    description: "Homepage",
    "og:description": "This is a simple ecommerce website built with Remix.",
  };
};

export let loader: LoaderFunction = async () => {
  const data = await api.homepage();
  return json(data);
};

export default function Index() {
  const { products, settings } =
    useLoaderData<Awaited<ReturnType<typeof api.homepage>>>();
  const setting = settings.pop();

  return (
    <>
      {setting && setting.vacation && setting.vacationDescription && (
        <Box
          backgroundColor="primary.300"
          p={4}
          mb={5}
          dangerouslySetInnerHTML={{ __html: setting.vacationDescription.html }}
        />
      )}
      <Products products={products} />
    </>
  );
}

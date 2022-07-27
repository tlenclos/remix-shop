import { Box, Image, SimpleGrid, Stack, VStack } from "@chakra-ui/react";
import type { LoaderFunction, MetaFunction } from "remix";
import { json, useLoaderData } from "remix";
import api from "~/lib/api";
import { defaultMeta } from "~/lib/meta";

type Page = NonNullable<Awaited<ReturnType<typeof api.getPage>>["page"]>;

export let loader: LoaderFunction = async ({ params }) => {
  const { page } = await api.getPage({ slug: params.slug! });

  if (!page) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json(page);
};

export const meta: MetaFunction = ({ data }: { data: Page }) => {
  const image = data?.cover?.url;
  return {
    ...defaultMeta,
    title: data?.title,
    "og:title": data?.title,
    "og:image:url": image || defaultMeta["og:image:url"],
    "twitter:image": image || defaultMeta["og:image:url"],
  };
};

export default function Page() {
  const page = useLoaderData<Page>();
  const isVerticalLayout =
    page.coverPosition === "top" || page.coverPosition === "bottom";
  const childrens = (
    <>
      {page.cover &&
        (page.coverPosition === "left" || page.coverPosition === "top") && (
          <Image src={page.cover?.url} width={page.coverWidth || "100%"} />
        )}
      <Box
        className="wysiwyg"
        px={4}
        dangerouslySetInnerHTML={{ __html: page?.content.html! }}
        textAlign={
          page.coverPosition === "top" || page.coverPosition === "bottom"
            ? "center"
            : "justify"
        }
      />
      {page.cover &&
        (page.coverPosition === "right" || page.coverPosition === "bottom") && (
          <Image src={page.cover?.url} width={page.coverWidth || "100%"} />
        )}
    </>
  );

  return isVerticalLayout ? (
    <VStack paddingTop={page.paddingTop || 0} spacing={8}>
      {childrens}
    </VStack>
  ) : (
    <SimpleGrid
      minChildWidth="300px"
      spacing={10}
      py={10}
      paddingTop={page.paddingTop || 0}
    >
      {childrens}
    </SimpleGrid>
  );
}

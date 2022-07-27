import { Box, ChakraProvider, Container, Heading } from "@chakra-ui/react";
import React from "react";
import { CartProvider } from "react-use-cart";
import {
  Links,
  LiveReload,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "remix";

import Footer from "./components/Footer";
import Header from "./components/Header";
import { CartContextProvider } from "./context/CartContext";
import theme from "./theme";

if (typeof document === "undefined") {
  React.useLayoutEffect = React.useEffect;
}

export const meta: MetaFunction = () => {
  return { title: "My shop" };
};

export const links = () => {
  return [
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    {
      rel: "preconnect",
      href: "https://fonts.gstatic.com",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@300&display=swap",
    },
  ];
};

function Document({
  children,
  title = "My shop website",
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <title>{title}</title>
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <Container
        flex="1"
        flexDirection="column"
        display="flex"
        maxWidth="container.lg"
        pt={4}
      >
        {children}
      </Container>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Document>
      <ChakraProvider theme={theme}>
        <CartProvider>
          <CartContextProvider>
            <Layout>
              <Outlet />
            </Layout>
          </CartContextProvider>
        </CartProvider>
      </ChakraProvider>
    </Document>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <ChakraProvider>
        <Box>
          <Heading as="h1">
            {caught.status} {caught.statusText}
          </Heading>
        </Box>
      </ChakraProvider>
    </Document>
  );
}

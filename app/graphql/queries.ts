import { gql } from "graphql-request";

const VariantsFragment = gql`
  fragment VariantsFragment on Product {
    variants {
      id
      name
      stock
      price
      weight
    }
  }
`;

// Route /
const homepageQuery = gql`
  query homepage {
    products(
      where: { visible: true, categories_none: {} }
      orderBy: featured_DESC
    ) {
      id
      slug
      name
      ...VariantsFragment
      images {
        url(
          transformation: {
            image: { resize: { width: 400, height: 350, fit: clip } }
            document: { output: { format: webp } }
          }
        )
      }
    }
    settings(first: 1) {
      vacation
      vacationDescription {
        html
      }
    }
  }
`;

// Route /products/:slug
const productQuery = gql`
  query getProduct($slug: String!) {
    product(where: { slug: $slug }) {
      id
      slug
      name
      description
      ...VariantsFragment
      images {
        url(
          transformation: {
            image: { resize: { width: 600 } }
            document: { output: { format: webp } }
          }
        )
      }
    }
  }
`;

// Route /pages/:slug
const pageQuery = gql`
  query getPage($slug: String!) {
    page(where: { slug: $slug }) {
      title
      content {
        html
      }
      coverPosition
      cover {
        url(
          transformation: {
            image: { resize: { width: 500 } }
            document: { output: { format: webp } }
          }
        )
      }
      coverWidth
      paddingTop
    }
  }
`;

// Route /categories/:slug
const categoryQuery = gql`
  query getCategory($slug: String!) {
    category(where: { slug: $slug }) {
      name
      description {
        html
      }
      products(where: { visible: true }, orderBy: featured_DESC) {
        id
        slug
        name
        ...VariantsFragment
        images {
          url(
            transformation: {
              image: { resize: { width: 400, height: 350, fit: clip } }
              document: { output: { format: webp } }
            }
          )
        }
      }
      image {
        url(
          transformation: {
            image: { resize: { width: 500 } }
            document: { output: { format: webp } }
          }
        )
      }
    }
  }
`;

// Route /api/checkout
const getProductsCheckoutQuery = gql`
  query getProductsCheckout($ids: [ID!]) {
    products(where: { id_in: $ids }) {
      id
      name
      description
      weight
      ...VariantsFragment
      needsPackage
      images(first: 1) {
        url
      }
    }
  }
`;
const getShippingSettings = gql`
  query getSettings {
    settings(first: 1) {
      shipping
    }
  }
`;

// Route /api/wehhook
// const updateProductStock = gql`
//   mutation updateProductStock($id: ID, $stock: Int) {
//     updateProduct(where: { id: $id }, data: { stock: $stock }) {
//       stock
//     }
//   }
// `;
const publishProduct = gql`
  mutation publishProduct($id: ID) {
    publishProduct(where: { id: $id }, to: PUBLISHED) {
      id
    }
  }
`;
const updateProductVariantStock = gql`
  mutation updateProductVariantStock($id: ID, $stock: Int) {
    updateProductVariant(where: { id: $id }, data: { stock: $stock }) {
      stock
    }
  }
`;
const publishProductVariant = gql`
  mutation publishProductVariant($id: ID) {
    publishProductVariant(where: { id: $id }, to: PUBLISHED) {
      id
    }
  }
`;
const createOrder = gql`
  mutation createOrder($order: OrderCreateInput!) {
    createOrder(data: $order) {
      id
    }
  }
`;
const setOrderSent = gql`
  mutation setOrderSent($id: ID, $sentAt: DateTime) {
    updateOrder(where: { id: $id }, data: { shippedEmailSentAt: $sentAt }) {
      id
    }
  }
`;
const publishOrder = gql`
  mutation publishOrder($id: ID) {
    publishOrder(where: { id: $id }, to: PUBLISHED) {
      id
    }
  }
`;
const getProductsItems = gql`
  query getProductsItems($ids: [ID!]) {
    products(where: { id_in: $ids }) {
      id
      name
      ...VariantsFragment
      images(first: 1) {
        url
      }
    }
  }
`;

// Scripts
const getAllOrderItems = gql`
  query getAllOrderItems {
    orderItems(stage: DRAFT) {
      product {
        name
      }
      productVariant {
        price
        name
      }
      quantity
    }
  }
`;

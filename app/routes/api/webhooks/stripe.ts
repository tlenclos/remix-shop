import { ActionFunction, json } from "remix";
import Stripe from "stripe";
import { ShippingMode } from "~/graphql/generated/graphql";
import api from "~/lib/api";

type MetadataProduct = {
  id: string;
  variant?: string;
  stock: number;
};

const headers = {
  Authorization: `Bearer ${process.env.GRAPH_CMS_AUTH_TOKEN}`,
};

async function updateStock(session: Stripe.Response<Stripe.Checkout.Session>) {
  if (!session.line_items) {
    return;
  }

  return Promise.all(
    session.line_items.data.map((lineItem) => {
      // @ts-ignore See app/routes/api/checkout.ts
      const product = lineItem.price?.product.metadata as MetadataProduct;

      return api
        .updateProductVariantStock(
          {
            id: product.variant,
            stock: product.stock - lineItem.quantity!,
          },
          headers
        )
        .then(() =>
          product.variant
            ? api.publishProductVariant({ id: product.variant }, headers)
            : api.publishProduct({ id: product.id }, headers)
        );
    })
  );
}

async function createOrder(session: Stripe.Response<Stripe.Checkout.Session>) {
  const orderItemSerialized: OrderItemSerialized[] =
    session.line_items!.data.map((item) => ({
      quantity: item.quantity!,
      productId: (item.price?.product as Stripe.Product).metadata.id,
      variantId: (item.price?.product as Stripe.Product).metadata.variant,
    }));

  return api.createOrder(
    {
      order: {
        stripeCheckoutId: session.id,
        // A bit weird but we don't have more information about shipping in the session
        shippingMode:
          session.shipping_options.find(
            (shippingOption) =>
              shippingOption.shipping_rate === session.shipping_rate
          )?.shipping_amount === 0
            ? ShippingMode.HandDelivery
            : ShippingMode.Postal,
        email: session.customer_details?.email!,
        total: session.amount_total!,
        address: session.shipping?.address?.line1!,
        city: session.shipping?.address?.city!,
        country: session.shipping?.address?.country!,
        postalCode: session.shipping?.address?.postal_code!,
        orderItems: {
          create: session.line_items?.data.map((item) => {
            // @ts-ignore
            const metadata: StripeMetadata = (
              item.price?.product as Stripe.Product
            ).metadata;

            return {
              quantity: item.quantity!,
              product: {
                connect: {
                  id: metadata.id,
                },
              },
              productVariant: metadata.variant
                ? {
                    connect: {
                      id: metadata.variant,
                    },
                  }
                : undefined,
            };
          }),
        },
        orderItemSerialized,
      },
    },
    headers
  );
}

export const action: ActionFunction = async ({ request }) => {
  const payload = await request.text();
  const sig = request.headers.get("stripe-signature");
  const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2020-08-27",
  });

  let event;

  try {
    event = stripeClient.webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_ENDPOINT_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const stripeSession = await stripeClient.checkout.sessions.retrieve(
        // @ts-ignore
        event.data.object.id,
        {
          expand: ["line_items.data.price.product", "customer"],
        }
      );

      await updateStock(stripeSession);
      await createOrder(stripeSession);
    }
  } catch (err: any) {
    console.error(err);
    throw json(
      {
        errors: [
          {
            message: err.message,
          },
        ],
      },
      400
    );
  }

  return new Response(null, { status: 200 });
};

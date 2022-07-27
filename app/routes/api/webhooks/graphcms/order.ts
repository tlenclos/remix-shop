import { ActionFunction } from "remix";
import mails from "~/lib/mails";
import api from "~/lib/api";
import { Order } from "~/graphql/generated/graphql";
import { formatPrice } from "~/lib/price";

export const action: ActionFunction = async ({ request }) => {
  const payload = await request.json();
  const order: Order = payload.data;

  // New order
  if (payload.operation === "create") {
    const orderItemsSerialized =
      order.orderItemSerialized as OrderItemSerialized[];
    const products = (
      await api.getProductsItems({
        ids: orderItemsSerialized.map((orderItem) => orderItem.productId),
      })
    ).products;
    const address = `${order.address}, ${order.city} ${order.postalCode}`;

    await mails.sendTransacEmail({
      templateId: 1,
      to: [{ email: payload.data.email }],
      params: {
        orderId: order.id,
        address,
        products: orderItemsSerialized.map((orderItem) => {
          const product = products.find(
            (product) => product.id === orderItem.productId
          )!;
          const variant = product.variants.find(
            (variant) => variant.id === orderItem.variantId
          );

          return {
            name: variant?.name || product.name,
            price: formatPrice(variant?.price || 0),
            image: product.images[0].url,
            quantity: orderItemsSerialized.find(
              (orderItem) => orderItem.productId === product.id
            )?.quantity,
          };
        }),
      },
    });
  }

  if (
    payload.operation === "publish" &&
    order.shipped === true &&
    order.shippingTrackingUrl !== null &&
    !order.shippedEmailSentAt
  ) {
    // Order is being sent
    // Send email
    await mails.sendTransacEmail({
      templateId: 2,
      to: [{ email: payload.data.email }],
      params: {
        orderId: order.id,
        trackingUrl: order.shippingTrackingUrl,
      },
    });

    const headers = {
      Authorization: `Bearer ${process.env.GRAPH_CMS_AUTH_TOKEN}`,
    };
    await api.setOrderSent({ id: order.id, sentAt: new Date() }, headers);
    await api.publishOrder({ id: order.id }, headers);
  }

  return new Response(null, { status: 200 });
};

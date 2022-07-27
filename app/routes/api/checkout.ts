import { ActionFunction, json } from "remix";
import Stripe from "stripe";
import { ProductCart } from "~/context/CartContext";
import api from "~/lib/api";
import { calculateShipping, ShippedProduct } from "~/lib/price";

const formatProducts = async (
  cartProducts: ProductCart[]
): Promise<ShippedProduct[]> => {
  // TODO Handle only variant ids
  const ids = cartProducts.map((cartProduct) => cartProduct.productId);
  const productsData = await (await api.getProductsCheckout({ ids })).products;
  return cartProducts.map((cartProduct) => {
    const product = productsData.find(
      (product) => product.id === cartProduct.productId
    );
    const variant = product?.variants.find(
      (variant) => variant.id === cartProduct.productVariant.id
    );
    const stock = variant?.stock || 0;

    if (!product || !stock || stock < cartProduct.quantity!) {
      throw new Error(`Le produit ${product?.name} n'est plus disponible`);
    }

    return {
      product,
      stock,
      variant,
      quantity: cartProduct!.quantity!,
    };
  });
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const cartProducts: ProductCart[] = await request.json();
    const shippingSettings = await api.getSettings();
    const products = await formatProducts(cartProducts);

    const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2020-08-27",
    });

    const checkoutSession = await stripeClient.checkout.sessions.create({
      allow_promotion_codes: true,
      shipping_address_collection: {
        allowed_countries: ["FR"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            display_name: "Livraison",
            type: "fixed_amount",
            fixed_amount: {
              amount: calculateShipping(
                products,
                shippingSettings["settings"][0]
              ),
              currency: "eur",
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "eur",
            },
            display_name:
              "Remise en main propre sur Paris",
          },
        },
      ],
      // @ts-ignore
      line_items: products.map(({ product, stock, variant, quantity }) => {
        const metadata: StripeMetadata = {
          id: product.id,
          variant: variant?.id,
          stock,
        };

        return {
          price_data: {
            currency: "EUR",
            product_data: {
              name: product!.name,
              description: variant ? `Variante: ${variant?.name}` : undefined,
              images: product!.images.map((img) => img.url),
              metadata,
            },
            unit_amount: variant?.price || 0,
          },
          quantity,
        };
      }),
      mode: "payment",
      success_url: `${process.env.PUBLIC_HOST}pages/commande-validee?clearCart=true`,
      cancel_url: `${process.env.PUBLIC_HOST}pages/erreur-de-commande`,
    });

    return json({ url: checkoutSession.url });
  } catch (e) {
    console.log(e);
    return json({ error: (e as Error).message }, { status: 400 });
  }
};

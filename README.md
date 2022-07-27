# Welcome to Remix Shop!

- [Live example](https://remix-shop-example.vercel.app/) 
- [Remix Docs](https://remix.run/docs)

This is a template to start a small Ecommerce website with Remix, Hygraph and Stripe.

You can read more about it on our website TODO LINK (🇫🇷)

⚠️ This project is given as an example, some choices were made and might be specific to the website we built.

## External services

### Hygraph

You will need to create a Hygraph account and project. 
This is a data CMS with a full GraphQL API.

A Hygraph project is available here and you can start by [cloning it](https://app.hygraph.com/clone/a335f7c481a144f59d49e7634ddd307c?name=Ecommerce%20Remix). 
### Stripe

The project use the Stripe checkout component to handle payments.

You can create an account and get API keys on the [Stripe developer page](https://dashboard.stripe.com/test/developers).
### Sendinblue

You will need to create a [Sendinblue](https://fr.sendinblue.com/) account and setup 2 emails template  :

- Order completed (template id `1`)
- Order shipped (template id `2`)

## Development

- Copy `.env.dist` file and fill necessary env variables.
- Install dependencies.

```sh
yarn install
```

- Update schema url in `codegen.yml` , `.graphqlrc.yml` & `api.ts` with Hygraph Content API and run `yarn codegen

- Afterwards, start the Remix development server like so:

```sh
yarn run dev
```

Open up [http://localhost:3000](http://localhost:3000) and you should be ready to go!

## Schema / database evolutions

Once you have modifications to the schema on Hygraph, you can generate the API client again with `yarn codegen`.

If you plan to do a lot of modifications, we advise to run these 2 commands in parallel `yarn codegen --watch` and `yarn tsc --watch`.

## Webhooks

- To debug webhooks start ngrok with

```sh
ngrok http 3000
```

- [Update Hygraph url on the webhook settings page](https://hygraph.com/docs/api-reference/basics/webhooks).
- [Create Stripe webhook url here to get return data from checkout.](https://dashboard.stripe.com/test/webhooks/create)

## Deployment

This app uses Vercel for deployment but you can deploy anywhere with the [available adapters](https://remix.run/docs/en/v1/other-api/adapter).

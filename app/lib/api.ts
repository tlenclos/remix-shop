import { GraphQLClient } from "graphql-request";
import { getSdk } from "~/graphql/generated/graphql";

const client = new GraphQLClient(
  "https://api-eu-central-1.graphcms.com/v2/cl45qjhvc0tzn01yw0z1idy5l/master",
  { fetch: fetch }
);
const sdk = getSdk(client);

export default sdk;

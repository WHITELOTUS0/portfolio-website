//sanity/sanity.client.ts

import { createClient, type ClientConfig } from "@sanity/client";

const config: ClientConfig = {
  projectId: "tmp7nhha",
  dataset: "production",
  apiVersion: "2024-03-11",
  useCdn: false,
};

const client = createClient(config);

export default client;
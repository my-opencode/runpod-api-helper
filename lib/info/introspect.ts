import { runRunpodGraphqlQuery } from "../queryRunner";

export async function introspectSchema(apiKey: string) {
  return await runRunpodGraphqlQuery(
    apiKey,
    `{__schema { queryType {name fields {name}} mutationType {name fields {name}}}}`,
    `introspectSchema`
  ) as Promise<{ data: { __schema: any } }>
}
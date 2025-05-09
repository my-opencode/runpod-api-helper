import { jsonToGraphQLQuery, VariableType } from "json-to-graphql-query";
import { runRunpodGraphqlQuery } from "lib/queryRunner";
import { DeleteEndpointResponse } from "../runpod.responses.type";

/* Dangerous to enable. Use at your own risk.  */
const ENABLED = false;
/**
 * Sends request to delete an endpoint
 */
export async function deleteEndpoint(apiKey: string, endpointId: string) {
  if (ENABLED)
    return await runRunpodGraphqlQuery(
      apiKey,
      {
        variables: {
          endpointId
        },
        query: jsonToGraphQLQuery({
          mutation: {
            deleteEndpoint: {
              __args: {
                id: new VariableType(`endpointId`),
              }
            }
          }
        })
      },
      // `mutation { deleteEndpoint(id: \"${endpointId}\") }`,
      `delete endpoint`
    ) as Promise<DeleteEndpointResponse>;
  throw new Error(`Endpoint deletion is disabled by default.`);
}
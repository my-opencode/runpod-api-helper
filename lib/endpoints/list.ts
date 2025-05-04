import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { runRunpodGraphqlQuery } from "lib/queryRunner";
import { Discount, Endpoint, Pod } from "../runpod.graphql.types";
import { ListEndpointsResponse } from "../runpod.responses.type";

/**
 * Sends request to list all endpoints
 * @returns {Promise<ListEndpointsResponse>}
 */
export async function listEndpoints(apiKey: string) {
  return await runRunpodGraphqlQuery(
    apiKey,
    jsonToGraphQLQuery({
      query: {
        __name: `Endpoints`,
        myself: {
          endpoints: {
            ...{
              gpuIds: true,
              id: true,
              idleTimeout: true,
              locations: true,
              name: true,
              networkVolumeId: true,
              scalerType: true,
              scalerValue: true,
              templateId: true,
              workersMax: true,
              workersMin: true,
            } as Record<keyof Endpoint, boolean>,
            pods: {
              desiredStatus: true
            } as Record<keyof Pod, boolean>,
          },
          serverlessDiscount: {
            discountFactor: true,
            type: true,
            expirationDate: true,
          } as Record<keyof Discount, boolean>
        }
      }
    }),
    `list endpoints`
  ) as Promise<ListEndpointsResponse>;
}
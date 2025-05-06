import { jsonToGraphQLQuery, VariableType } from "json-to-graphql-query";
import { runRunpodGraphqlQuery } from "../queryRunner";
import { JsonRequestBody } from "../runpod.request.type";
import { StopPodResponse } from "../runpod.responses.type";
import { Pod } from "../runpod.graphql.types";

/**
 * Sends a request to stop an existing on-demand pod
 */
export async function stopPod(apiKey: string, podId: string) {
  return await runRunpodGraphqlQuery(
    apiKey,
    {
      variables: {
        podId
      },
      query: jsonToGraphQLQuery({
        mutation: {
          __variables: {
            podId: `String!`
          },
          podStop: {
            __args: {
              input: {
                podId: new VariableType(`podId`),
              }
            },
            ...{
              id: true,
              desiredStatus: true,
            } as Partial<Record<keyof Pod, boolean>>
          }
        }
      }),
      // `mutation { podStop(input: {podId: \"${podId}\"}) { id desiredStatus } }`,
    } as JsonRequestBody,
    `stop pod`
  ) as Promise<StopPodResponse>;
}
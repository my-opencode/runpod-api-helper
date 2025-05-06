import { jsonToGraphQLQuery, VariableType } from "json-to-graphql-query";
import { runRunpodGraphqlQuery } from "../queryRunner";
import { EnvironmentVariable, Pod, PodMachineInfo } from "../runpod.graphql.types";
import { StartPodResponse } from "../runpod.responses.type";
import { JsonRequestBody } from "../runpod.request.type";

/**
 * Sends a request to start an existing on-demand pod
 */
export async function startPod(apiKey: string, podId: string) {
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
          podResume: {
            __args: {
              input: {
                podId: new VariableType(`podId`),
              }
            },
            ...{
              id: true,
              desiredStatus: true,
              imageName: true,
              machineId: true,
            } as Record<keyof Pod, boolean>,
            env: {
              key: true,
              value: true,
            } as Record<keyof EnvironmentVariable, boolean>,
            machine: {
              podHostId: true
            } as Partial<Record<keyof PodMachineInfo, boolean>>
          }
        }
      })
    } as JsonRequestBody,
    // `mutation { podResume( input: ${inputText} ) { id desiredStatus imageName env machineId machine { podHostId } } }`,
    `start pod`
  ) as Promise<StartPodResponse>;
}
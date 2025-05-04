import { jsonToGraphQLQuery, VariableType } from "json-to-graphql-query";
import { runRunpodGraphqlQuery } from "lib/queryRunner";
import { JsonRequestBody } from "../runpod.request.type";
import { GetPodResponse } from "../runpod.responses.type";
import { Pod, PodRuntime, PodRuntimeContainer, PodRuntimeGpus, PodRuntimePorts } from "../runpod.graphql.types";

/**
 * Sends a request to get a pod's information
 */
export async function getPod(apiKey: string, podId: string) {
  return await runRunpodGraphqlQuery(
    apiKey,
    {
      variables: {
        podId
      },
      query: jsonToGraphQLQuery({
        query: {
          __name: `Pod`,
          __variables: {
            podId: `String!`
          },
          pod: {
            __args: {
              input: {
                podId: new VariableType(`podId`),
              }
            },
            ... {
              id: true,
              name: true,
              networkVolumeId: true,
            } as Partial<Record<keyof Pod, boolean>>,
            runtime: {
              ...{
                uptimeInSeconds: true,
              } as Partial<Record<keyof PodRuntime, boolean>>,
              ports: {
                ip: true,
                isIpPublic: true,
                privatePort: true,
                publicPort: true,
                type: true,
              } as Partial<Record<keyof PodRuntimePorts, boolean>>,
              gpus: {
                id: true,
                gpuUtilPercent: true,
                memoryUtilPercent: true,
              } as Partial<Record<keyof PodRuntimeGpus, boolean>>,
              container: {
                cpuPercent: true,
                memoryPercent: true,
              } as Partial<Record<keyof PodRuntimeContainer, boolean>>,
            }
          }
        }
      }),
    } as JsonRequestBody,
    // `query Pod { pod(input: {podId: \"${podId}\"}) { id name runtime { uptimeInSeconds ports { ip isIpPublic privatePort publicPort type } gpus { id gpuUtilPercent memoryUtilPercent } container { cpuPercent memoryPercent } } } }`,
    `get pod`
  ) as Promise<GetPodResponse>;
}
import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { runRunpodGraphqlQuery } from "lib/queryRunner";
import { JsonRequestBody } from "../runpod.request.type";
import { ListPodResponse } from "../runpod.responses.type";
import { Pod, PodRuntime, PodRuntimeContainer, PodRuntimeGpus, PodRuntimePorts } from "../runpod.graphql.types";

/**
 * Sends a request to list pods
 * @returns {Promise<ListPodResponse>}
 */
export async function listPods(apiKey: string) {
  return await runRunpodGraphqlQuery(
    apiKey,
    {
      query: jsonToGraphQLQuery({
        query: {
          __name: `Pods`,
          myself: {
            pods: {
              ...{
                id: true,
                name: true,
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
        }
      }),
    } as JsonRequestBody,
    // `query Pods { myself { pods { id name runtime { uptimeInSeconds ports { ip isIpPublic privatePort publicPort type } gpus { id gpuUtilPercent memoryUtilPercent } container { cpuPercent memoryPercent } } } } }`,
    `list pods`
  ) as Promise<ListPodResponse>;
}
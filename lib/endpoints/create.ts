import { jsonToGraphQLQuery, VariableType } from "json-to-graphql-query";
import { runRunpodGraphqlQuery } from "lib/queryRunner";
import { Endpoint } from "../runpod.graphql.types";
import { applyDefaults } from "../utilities";
import { CreateEndpointInput, JsonRequestBody } from "../runpod.request.type";
import { COMPUTE_TYPE, GPU_TYPE_IDS, SCALER_TYPE } from "../runpod.constants";
import { CreateEndpointResponse } from "../runpod.responses.type";

/**
 * Sends request to create an endpoint
 */
export async function createEndpoint(apiKey: string, input: Partial<CreateEndpointInput>) {

  const defaults: Partial<CreateEndpointInput> = {
    computeType: COMPUTE_TYPE.gpu,
    gpuCount: 1,
    executionTimeoutMs: 600000,
    idleTimeout: 5,
    gpuTypeIds: [GPU_TYPE_IDS.nvidia[4090]],
    scalerType: SCALER_TYPE.queueDelay,
    scalerValue: 4,
    vcpuCount: 2,
    workersMax: 3,
  };
  applyDefaults(input, defaults);

  return await runRunpodGraphqlQuery(
    apiKey,
    {
      variables: {
        input
      },
      query: jsonToGraphQLQuery({
        mutation: {
          saveEndpoint: {
            __args: {
              input: new VariableType(`input`),
            },
            ...{
              gpuIds: true,
              id: true,
              idleTimeout: true,
              locations: true,
              name: true,
              scalerType: true,
              scalerValue: true,
              templateId: true,
              workersMax: true,
              workersMin: true,
              networkVolumeId: true,
            } as Record<keyof Endpoint, boolean>
          }
        }
      }),
    } as JsonRequestBody,
    `create endpoint`
  ) as Promise<CreateEndpointResponse>;
}

//`mutation { saveEndpoint(input: { ${inputText} }) { gpuIds id idleTimeout locations name scalerType scalerValue templateId workersMax workersMin } }`,
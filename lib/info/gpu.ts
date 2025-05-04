import { jsonToGraphQLQuery, VariableType } from "json-to-graphql-query";
import { runRunpodGraphqlQuery } from "lib/queryRunner";
import { JsonRequestBody } from "../runpod.request.type";
import { AvailableGpu, ListAvailableGpusResponse, ListGpuResponse } from "../runpod.responses.type";
import { DataCenter, DataCenterId, GpuAvailability, GpuLowestPriceInput, GpuType, GpuTypeId, LowestPrice } from "../runpod.graphql.types";

/**
 * Sends a request to list gpu types
 * @returns {Promise<ListGpuResponse>}
 */
export async function listGpuTypes() {
  const payload: JsonRequestBody = {
    operationName: "GpuTypes",
    variables: {},
    query: jsonToGraphQLQuery({
      query: {
        __name: `GpuTypes`,
        gpuTypes: {
          maxGpuCount: true,
          maxGpuCountCommunityCloud: true,
          maxGpuCountSecureCloud: true,
          minPodGpuCount: true,
          id: true,
          displayName: true,
          memoryInGb: true,
          secureCloud: true,
          communityCloud: true,
          manufacturer: true,
        } as Partial<Record<keyof GpuType, boolean>>,
        __typename: true,
      }
    }),
    // query: "query GpuTypes {  gpuTypes {    maxGpuCount\n    maxGpuCountCommunityCloud\n    maxGpuCountSecureCloud\n    minPodGpuCount\n    id\n    displayName\n    memoryInGb\n    secureCloud\n    communityCloud\n    manufacturer\n    __typename\n  }\n}"
  }
  return await runRunpodGraphqlQuery(
    "",
    payload,
    `list gpu extended`
  ) as Promise<ListGpuResponse>;
}

export async function listCommunityGpuTypes(gpuTypeId: GpuTypeId, lowestPrice?: Partial<GpuLowestPriceInput>) {
  const payload: JsonRequestBody = {
    variables: {
      "gpuTypesInput": { "id": gpuTypeId },
      "lowestPriceInput": {
        "gpuCount": 1,
        "minDisk": 0,
        "minMemoryInGb": 8,
        "minVcpuCount": 2,
        "countryCode": null,
        "minDownload": 400,
        "minUpload": 400,
        "supportPublicIp": false,
        ...(lowestPrice ?? {}),
        "secureCloud": false,
      }
    },
    query: jsonToGraphQLQuery({
      query: {
        __name: `CommunityGpuTypes`,
        __variables: {
          lowestPriceInput: `GpuLowestPriceInput`,
          gpuTypesInput: `GpuTypeFilter`,
        },
        gpuTypes: {
          __args: {
            input: new VariableType(`gpuTypesInput`),
          },
          ...{
            id: true,
            displayName: true,
            memoryInGb: true,
            communityPrice: true,
            communitySpotPrice: true,
          } as Partial<Record<keyof GpuType, boolean>>,
          __typename: true,
          lowestPrice: {
            __args: {
              input: new VariableType(`lowestPriceInput`),
            },
            ... {
              minimumBidPrice: true,
              uninterruptablePrice: true,
              minVcpu: true,
              minMemory: true,
              stockStatus: true,
              maxUnreservedGpuCount: true,
              availableGpuCounts: true,
              __typename: true,
            } as Partial<Record<keyof LowestPrice, boolean>>
          }
        }
      }
    }),
    // "query": "query CommunityGpuTypes($lowestPriceInput: GpuLowestPriceInput, $gpuTypesInput: GpuTypeFilter) {\n  gpuTypes(input: $gpuTypesInput) {\n    lowestPrice(input: $lowestPriceInput) {\n      minimumBidPrice\n      uninterruptablePrice\n      minVcpu\n      minMemory\n      stockStatus\n      maxUnreservedGpuCount\n      availableGpuCounts\n      __typename\n    }\n    id\n    displayName\n    memoryInGb\n    communityPrice\n    communitySpotPrice\n    __typename\n  }\n}"
  };
  return await runRunpodGraphqlQuery(
    "",
    payload,
    `list community gpu types`
  ) as Promise<ListGpuResponse>;
}

export async function listSecureGpuTypes(gpuTypeId: GpuTypeId, lowestPrice?: Partial<GpuLowestPriceInput>) {
  const payload: JsonRequestBody = {
    variables: {
      "gpuTypesInput": { "id": gpuTypeId },
      "lowestPriceInput": {
        "gpuCount": 1,
        "minDisk": 0,
        "minMemoryInGb": 8,
        "minVcpuCount": 2,
        "countryCode": null,
        "minDownload": 400,
        "minUpload": 400,
        "supportPublicIp": false,
        ...(lowestPrice ?? {}),
        "secureCloud": true,
      }
    },
    query: jsonToGraphQLQuery({
      query: {
        __name: `SecureGpuTypes`,
        __variables: {
          lowestPriceInput: `GpuLowestPriceInput`,
          gpuTypesInput: `GpuTypeFilter`,
        },
        gpuTypes: {
          __args: {
            input: new VariableType(`gpuTypesInput`),
          },
          ...{
            id: true,
            displayName: true,
            memoryInGb: true,
            securePrice: true,
            oneMonthPrice: true,
            oneWeekPrice: true,
            threeMonthPrice: true,
            sixMonthPrice: true,
            secureSpotPrice: true,
          } as Partial<Record<keyof GpuType, boolean>>,
          __typename: true,
          lowestPrice: {
            __args: {
              input: new VariableType(`lowestPriceInput`),
            },
            ... {
              minimumBidPrice: true,
              uninterruptablePrice: true,
              minVcpu: true,
              minMemory: true,
              stockStatus: true,
              compliance: true,
              maxUnreservedGpuCount: true,
              availableGpuCounts: true,
              __typename: true,
            } as Partial<Record<keyof LowestPrice, boolean>>
          }
        }
      }
    }),
    // "query": "query SecureGpuTypes($gpuTypesInput: GpuTypeFilter, $lowestPriceInput: GpuLowestPriceInput) { gpuTypes(input: $gpuTypesInput) { lowestPrice(input: $lowestPriceInput) { minimumBidPrice uninterruptablePrice minVcpu minMemory stockStatus compliance maxUnreservedGpuCount availableGpuCounts } id displayName memoryInGb securePrice communityPrice oneMonthPrice oneWeekPrice threeMonthPrice sixMonthPrice secureSpotPrice } }"
  };
  return await runRunpodGraphqlQuery(
    "",
    payload,
    `list secure gpu types`
  ) as Promise<ListGpuResponse>;
}

export async function listAvailableGpus(dataCenterId: DataCenterId, minRam = 8): Promise<ListAvailableGpusResponse> {
  const payload: JsonRequestBody = {
    query: jsonToGraphQLQuery({
      query: {
        dataCenters: {
          ...{
            id: true,
            // name: true,
            // location: true,
            // compliance: true,
            // storageSupport: true,
            // listed: true,
          } as Partial<Record<keyof DataCenter, boolean>>,
          gpuAvailability: {
            // available: true,
            stockStatus: true,
            gpuTypeId: true,
            // gpuType: true,
            gpuTypeDisplayName: true,
            displayName: true,
            id: true,
          } as Partial<Record<keyof GpuAvailability, boolean>>
        },
        gpuTypes: {
          maxGpuCount: true,
          maxGpuCountCommunityCloud: true,
          maxGpuCountSecureCloud: true,
          minPodGpuCount: true,
          id: true,
          displayName: true,
          memoryInGb: true,
          secureCloud: true,
          securePrice: true,
          communityCloud: true,
          communityPrice: true,
          manufacturer: true,
        } as Partial<Record<keyof GpuType, boolean>>,
      }
    })
  };

  const data = await runRunpodGraphqlQuery(
    "",
    payload,
    `list available gpus`
  ) as { data: { dataCenters: DataCenter[], gpuTypes: GpuType[] } };

  // console.log(JSON.stringify(data));

  if (!data?.data?.dataCenters?.length) {
    throw new Error(`Runpod returned an empty list of datacenters.`);
  }
  if (!data?.data?.gpuTypes?.length) {
    throw new Error(`Runpod returned an empty list of GPU types.`);
  }
  const dataCenter = data.data.dataCenters.find(d => d.id === dataCenterId);
  if (!dataCenter) {
    throw new Error(`Requested data center "${dataCenterId}" is not available.`);
  }

  const availableGpusInDataCenter = dataCenter?.gpuAvailability || [];

  const availableGpus: AvailableGpu[] = availableGpusInDataCenter
    .map(a => ({ ...a, ...(data.data.gpuTypes.find(g => a.id === g.id)) } as AvailableGpu))
    .filter(g => (g.memoryInGb || 0) > minRam)
    .sort((a, b) => (a.securePrice || 999) - (b.securePrice || 999));

  return { data: { dataCenterId, availableGpus } };
}
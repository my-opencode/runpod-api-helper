import { jsonToGraphQLQuery, VariableType } from "json-to-graphql-query";
import { JsonRequestBody, SpecificsInput } from "../runpod.request.type";
import { CpuFlavor, Specifics } from "../runpod.graphql.types";
import { runRunpodGraphqlQuery } from "../queryRunner";
import { ListCpuFlavorsResponse } from "../runpod.responses.type";

export async function listCpuFlavors() {
  const payload: JsonRequestBody = {
    query: jsonToGraphQLQuery({
      query: {
        __name: `CpuFlavors`,
        // countryCodes: true,
        // dataCenters: {
        //   id: true,
        //   name: true,
        //   listed: true,
        //   // gpuAvailability: true,
        //   // cpuAvailability: true,
        // } as Record<keyof DataCenter, boolean>,
        cpuFlavors: {
          ...{
            id: true,
            groupId: true,
            groupName: true,
            displayName: true,
            minVcpu: true,
            maxVcpu: true,
            ramMultiplier: true,
            diskLimitPerVcpu: true,
            // specifics: true,
          } as Record<keyof CpuFlavor, boolean>,
          // specifics: {
          //   stockStatus: true,
          //   securePrice: true,
          // } as Record<keyof Specifics, boolean>,
        }
      }
    }),
    //"query CpuFlavors { countryCodes dataCenters { id name listed } cpuFlavors { id groupId groupName displayName minVcpu maxVcpu ramMultiplier diskLimitPerVcpu } }"
  };
  return await runRunpodGraphqlQuery(
    "",
    payload,
    `list cpu flavors`
  ) as Promise<ListCpuFlavorsResponse>;
}

export async function listSecureCpuTypes(cpuFlavorId: string, specifics?: SpecificsInput) {
  const payload: JsonRequestBody = {
    variables: {
      cpuFlavorInput: { "id": cpuFlavorId },
      specificsInput: {
        dataCenterId: null,
        instanceId: specifics?.instanceId ?? null,
      }
    },
    query: jsonToGraphQLQuery({
      query: {
        __name: `SecureCpuTypes`,
        __variables: {
          cpuFlavorInput: `CpuFlavorInput`,
          specificsInput: `SpecificsInput`,
        },
        cpuFlavors: {
          __args: {
            input: new VariableType(`cpuFlavorInput`)
          },
          specifics: {
            __args: {
              input: new VariableType(`specificsInput`),
            },
            ...{
              stockStatus: true,
              securePrice: true,
              slsPrice: true,
            } as Record<keyof Specifics, boolean>,
            __typename: true,
          },
          __typename: true,
        }
      }
    }),
    // "query SecureCpuTypes($cpuFlavorInput: CpuFlavorInput, $specificsInput: SpecificsInput) {\n  cpuFlavors(input: $cpuFlavorInput) {\n    specifics(input: $specificsInput) {\n      stockStatus\n      securePrice\n      slsPrice\n      __typename\n    }\n    __typename\n  }\n}"
  };
  return await runRunpodGraphqlQuery(
    "",
    payload,
    `list secure cpu names`
  ) as Promise<ListCpuFlavorsResponse>;
}

export async function listCpuNames() {
  const payload: JsonRequestBody = {
    operationName: `getCpuNames`,
    query: jsonToGraphQLQuery({
      query: {
        __name: `getCpuNames`,
        cpuFlavors: {
          id: true,
          groupName: true,
          displayName: true,
        } as Partial<Record<keyof CpuFlavor, boolean>>
      }
    })
    // "query": "query getCpuNames { cpuFlavors { id groupName displayName } }"
  };
  return await runRunpodGraphqlQuery(
    "",
    payload,
    `list cpu names`
  ) as Promise<ListCpuFlavorsResponse>;
}
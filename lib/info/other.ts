import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { JsonRequestBody } from "../runpod.request.type";
import { DataCenter } from "../runpod.graphql.types";
import { runRunpodGraphqlQuery } from "lib/queryRunner";
import { ListCountryCodesResponse, ListDataCentersResponse } from "../runpod.responses.type";

export async function listDataCenters() {
  const payload: JsonRequestBody = {
    query: jsonToGraphQLQuery({
      query: {
        dataCenters: {
          id: true,
          name: true,
          listed: true,
          // gpuAvailability: true,
          // cpuAvailability: true,
        } as Record<keyof DataCenter, boolean>,
      }
    }),
  };
  return await runRunpodGraphqlQuery(
    "",
    payload,
    `list data centers`
  ) as Promise<ListDataCentersResponse>;
}

export async function listCountryCodes() {
  const payload: JsonRequestBody = {
    query: jsonToGraphQLQuery({
      query: {
        countryCodes: true,
      }
    }),
  };
  return await runRunpodGraphqlQuery(
    "",
    payload,
    `list country codes`
  ) as Promise<ListCountryCodesResponse>;
}
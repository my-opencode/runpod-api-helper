import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { runRunpodGraphqlQuery } from "../queryRunner";
import { JsonRequestBody } from "../runpod.request.type";
import { EnvironmentVariable, PodTemplate } from "../runpod.graphql.types";
import { ListPodTemplatesResponse } from "../runpod.responses.type";

/**
 * Sends request to list templates
 * @returns {Promise<ListPodTemplatesResponse>}
 */
export async function listTemplates(apiKey: string) {
  return await runRunpodGraphqlQuery(
    apiKey,
    {
      query:
        jsonToGraphQLQuery({
          query: {
            __name: `myself`,
            myself: {
              podTemplates: {
                ...{
                  advancedStart: true,
                  containerDiskInGb: true,
                  containerRegistryAuthId: true,
                  dockerArgs: true,
                  earned: true,
                  id: true,
                  imageName: true,
                  isPublic: true,
                  isRunpod: true,
                  isServerless: true,
                  boundEndpointId: true,
                  name: true,
                  ports: true,
                  readme: true,
                  runtimeInMin: true,
                  startJupyter: true,
                  startScript: true,
                  startSsh: true,
                  volumeInGb: true,
                  volumeMountPath: true,
                  config: true,
                  category: true,
                } as Partial<Record<keyof PodTemplate, boolean>>,
                env: {
                  key: true,
                  value: true,
                } as Partial<Record<keyof EnvironmentVariable, boolean>>
              }
            }
          }
        }),
      // query: `query myself { myself { podTemplates { advancedStart containerDiskInGb containerRegistryAuthId dockerArgs earned env { key value } id imageName isPublic isRunpod isServerless boundEndpointId name ports readme runtimeInMin startJupyter startScript startSsh volumeInGb volumeMountPath config category } } }`,
    } as JsonRequestBody,
    `list templates`
  ) as Promise<ListPodTemplatesResponse>;
}
import { jsonToGraphQLQuery, VariableType } from "json-to-graphql-query";
import { runRunpodGraphqlQuery } from "../queryRunner";
import { Endpoint } from "../runpod.graphql.types";

/* Dangerous to enable. Use at your own risk.  */
const ENABLED = false;
/**
 * Sends request to modify an endpoint
 */
export async function modifyEndpoint(apiKey: string, input: Partial<Endpoint>) {
  // TODO generate list of fields to query from the list of updated fields
  if (ENABLED)
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
                name: true,
                networkVolumeId: true,
                templateId: true,
                workersMax: true,
              } as Record<keyof Endpoint, boolean>
            }
          }
        })
      },
      // `mutation { saveEndpoint(input: { ${inputText} }) { id gpuIds name templateId workersMax } }`,
      `modify endpoint`
    );
  throw new Error(`Endpoint modification is disabled by default.`);
}
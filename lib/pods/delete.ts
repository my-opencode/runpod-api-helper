import { jsonToGraphQLQuery, VariableType } from "json-to-graphql-query";
import { runRunpodGraphqlQuery } from "../queryRunner";
import { TerminatePodResponse } from "../runpod.responses.type";

/* Dangerous to enable. Use at your own risk.  */
const ENABLED = true;
/**
 * Sends request to delete a pod
 */
export async function deletePod(apiKey: string, podId: string) {
  if (ENABLED)
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
            podTerminate: {
              __args: {
                input: {
                  podId: new VariableType(`podId`),
                }
              }
            }
          }
        })
      },
      // `mutation { podTerminate(input: {podId: \"${podId}\"}) }`,
      `delete pod`
    ) as Promise<TerminatePodResponse>;
  throw new Error(`Pod deletion is disabled by default.`);
}
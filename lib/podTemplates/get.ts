import { jsonToGraphQLQuery } from "json-to-graphql-query";
import { runRunpodGraphqlQuery } from "../queryRunner";
import { schemaToJson } from "../utils/schemaToJson";

// const query = "query GetPodTemplates {\n    myself {\n      podTemplates {\n        id\n        name\n        advancedStart\n        containerDiskInGb\n        containerRegistryAuthId\n        dockerArgs\n        earned\n        env {\n          key\n          value\n        }\n        isPublic\n        isRunpod\n        isServerless\n        boundEndpointId\n        ports\n        readme\n        runtimeInMin\n        startJupyter\n        startScript\n        startSsh\n        volumeInGb\n        volumeMountPath\n        config\n        category\n        userId\n        presentationOrder\n      }\n    }\n  }\n";

const schema = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetPodTemplates" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "myself" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "podTemplates" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "id" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "name" },
                      },
                      {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "advancedStart",
                        },
                      },
                      {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "containerDiskInGb",
                        },
                      },
                      {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "containerRegistryAuthId",
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "dockerArgs" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "earned" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "env" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "key" },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "value" },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isPublic" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isRunpod" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "isServerless" },
                      },
                      {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "boundEndpointId",
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "ports" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "readme" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "runtimeInMin" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "startJupyter" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "startScript" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "startSsh" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "volumeInGb" },
                      },
                      {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "volumeMountPath",
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "config" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "category" },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "userId" },
                      },
                      {
                        kind: "Field",
                        name: {
                          kind: "Name",
                          value: "presentationOrder",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
}

const jsonQuery = schemaToJson(schema);

export async function getPodTemplates (apiKey: string) {
  return await runRunpodGraphqlQuery(
    apiKey,
    {
      query: jsonToGraphQLQuery(jsonQuery),
    },
    `get pod templates`,
  );
}
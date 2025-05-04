import { EnumType, jsonToGraphQLQuery } from "json-to-graphql-query";
import { CLOUD_TYPES_SUPPORTED_ON_CREATE_POD, COMPUTE_TYPE } from "../runpod.constants";
import { Pod, PodFindAndDeployOnDemandInput, PodMachineInfo } from "../runpod.graphql.types";
import { JsonRequestBody } from "../runpod.request.type";
import { runRunpodGraphqlQuery } from "lib/queryRunner";
import { CreatePodResponse } from "../runpod.responses.type";
import { applyDefaults } from "../utilities";

/**
 * Sends a request to create an on-demand GPU pod.
 */
export async function createGpuPod(apiKey: string, input: Partial<PodFindAndDeployOnDemandInput>) {
  if (!input.gpuTypeId) {
    throw new TypeError(`pod.gpuTypeId is required.`);
  }
  if (!input.templateId && !input.imageName) {
    throw new TypeError(`pod.templateId or pod.imageName is required.`)
  }
  const defaults = {
    cloudType: CLOUD_TYPES_SUPPORTED_ON_CREATE_POD.secure,
    computeType: COMPUTE_TYPE.gpu,
    containerDiskInGb: 40,
    // countryCode: null,
    // cudaVersion: null,
    // dataCenterId: null,
    dockerArgs: "",
    gpuCount: 1,
    // networkVolumeId: null,
    ports: "22/tcp",
    startJupyter: false,
    startSsh: true,
    // volumeKey: null,
    volumeMountPath: "/workspace",
  } as Partial<PodFindAndDeployOnDemandInput>;
  // deployCost: pod.deployCost || 0.06,
  // env: [{ key: "ENV_VAR", value: "value" }],
  // vcpuCount: 2,
  applyDefaults(input, defaults, { onlyUndefined: true });

  const inputEnums: Partial<Record<keyof PodFindAndDeployOnDemandInput, EnumType>> = {};
  for (const enumProp of ["cloudType", "computeType", /* "gpuTypeId", "dataCenterId"*/] as (keyof PodFindAndDeployOnDemandInput)[])
    if (input[enumProp])
      inputEnums[enumProp] = new EnumType(String(input[enumProp])!);

  const query = jsonToGraphQLQuery({
    mutation: {
      // __name: `podFindAndDeployOnDemand`,
      // __variables: {
      //   input: `PodFindAndDeployOnDemandInput`,
      // },
      podFindAndDeployOnDemand: {
        __args: {
          // input: new VariableType(`input`)
          input: { ...input, ...inputEnums }
        },
        ...{
          id: true,
          imageName: true,
          machineId: true,
          env: true,
        } as Record<keyof Pod, boolean>,
        machine: {
          podHostId: true
        } as Record<keyof PodMachineInfo, boolean>
      }
    }
  });
  // console.log(query);

  const payload: JsonRequestBody = {
    // variables: { input },
    query,
  };
  return await runRunpodGraphqlQuery(
    apiKey,
    payload,
    // query,
    `deploy gpu pod`
  ) as Promise<CreatePodResponse>;
}
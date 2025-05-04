import { EnumType, jsonToGraphQLQuery } from "json-to-graphql-query";
import { CLOUD_TYPES_SUPPORTED_ON_CREATE_POD, CPU_FLAVOR_IDS } from "../runpod.constants";
import { Pod, PodFindAndDeployOnDemandInput, PodMachineInfo, SpecificsInput } from "../runpod.graphql.types";
import { JsonRequestBody } from "../runpod.request.type";
import { runRunpodGraphqlQuery } from "lib/queryRunner";
import { DeployCpuPodResponse } from "../runpod.responses.type";
import { applyDefaults } from "../utilities";

export async function createCpuPod(apiKey: string, input: Partial<PodFindAndDeployOnDemandInput> & Partial<SpecificsInput>) {
  if (!input.instanceId) {
    input.instanceId = CPU_FLAVOR_IDS.cpu3.compute + "-2-4";
  } else if (input.instanceId && input.instanceId.slice(0, 3) !== `cpu`) {
    throw new Error(`Expecting a cpu instance`);
  }

  const defaults = {
    cloudType: CLOUD_TYPES_SUPPORTED_ON_CREATE_POD.secure,
    containerDiskInGb: 5,
    deployCost: 0.06,
    dataCenterId: null,
    networkVolumeId: null,
    startJupyter: false,
    startSsh: true,
    dockerArgs: "",
    volumeKey: null,
    ports: "22/tcp",
  };
  applyDefaults(input, defaults, { onlyUndefined: true });

  // overrides
  // https://github.com/runpod/runpod-python/issues/314
  // `mutation { deployCpuPod(input: { instanceId: "cpu3c-2-4", cloudType: SECURE, containerDiskInGb: 5, deployCost: 0.06, dataCenterId: null, networkVolumeId: null, startJupyter: true, startSsh: true, templateId: "runpod-ubuntu", volumeKey: null, ports: "22/tcp" }) { id imageName env machineId machine { podHostId } } }`,
  input.imageName = ""; // Undocumented: not supported for CPU pods.
  input.templateId = "runpod-ubuntu"; // Undocumented: cannot be changed.

  const inputEnums = {
    cloudType: new EnumType(input.cloudType!),
  };

  const query = jsonToGraphQLQuery({
    mutation: {
      // __name: `deployCpuPod`,
      // __variables: {
      //   input: "DeployCpuPodInput",
      // },
      deployCpuPod: {
        __args: {
          // input: new VariableType(`input`)
          input: { ...input, ...inputEnums }
        },
        ...{
          id: true,
          imageName: true,
          env: true,
          machineId: true,
        } as Record<keyof Pod, boolean>,
        machine: {
          podHostId: true
        } as Record<keyof PodMachineInfo, boolean>
      }
    }
  });
  // console.log(query);

  const payload: JsonRequestBody = {
    query,
    // variables: { input },
    // `mutation { deployCpuPod(input: { instanceId: "cpu3c-2-4", cloudType: SECURE, containerDiskInGb: 5, deployCost: 0.06, dataCenterId: null, networkVolumeId: null, startJupyter: true, startSsh: true, templateId: "runpod-ubuntu", volumeKey: null, ports: "22/tcp" }) { id imageName env machineId machine { podHostId } } }`,

  };
  return await runRunpodGraphqlQuery(
    apiKey,
    payload,
    // query,
    `deploy cpu pod`
  ) as Promise<DeployCpuPodResponse>;
}
import { EnumType, jsonToGraphQLQuery, VariableType } from "json-to-graphql-query";
import { CpuFlavor, CreatePodResponse, DataCenter, DeployCpuPodOutput, Discount, Endpoint, GetPodResponse, GpuLowestPriceInput, JsonRequestBody, ListCpuFlavorsResponse, ListEndpointsResponse, ListGpuExtendedResponse, ListGpuResponse, ListPodResponse, ListSecureCpuTypes, Pod, PodBidResumeInput, PodFindAndDeployOnDemandInput, PodMachineInfo, ResumePodResponse, RunpodApiConstructorOptions, Specifics, SpecificsInput, StartPodResponse, StopPodResponse, TerminatePodResponse, User } from "./runpod.types";
import { CLOUD_TYPES, CLOUD_TYPES_SUPPORTED_ON_CREATE_POD, COMPUTE_TYPE, CPU_FLAVOR_IDS } from "./runpod.constants";

const jsonHeader = { "content-type": `application/json` };

export class RunpodApi {
  apiKey: string;
  constructor(options: RunpodApiConstructorOptions) {
    this.apiKey = options.apiKey;
  }

  async runRunpodGraphqlQuery(queryOrPayload: string | JsonRequestBody, actionDescription: string) {
    const body = JSON.stringify(
      typeof queryOrPayload === `string`
        ? { query: queryOrPayload }
        : queryOrPayload
    );
    console.log("graphql request body:", body);

    try {
      const response = await fetch(
        `https://api.runpod.io/graphql?api_key=${this.apiKey}`,
        {
          headers: jsonHeader,
          method: `POST`,
          body,
        });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(withError(`Unable to ${actionDescription}.`, error));
    }
  }

  /**
   * Sends request to list all endpoints
   * @returns {Promise<ListEndpointsResponse>}
   */
  async endpointsList() {
    return await this.runRunpodGraphqlQuery(
      jsonToGraphQLQuery({
        query: {
          __name: `Endpoints`,
          myself: {
            endpoints: {
              ...{
                gpuIds: true,
                id: true,
                idleTimeout: true,
                locations: true,
                name: true,
                networkVolumeId: true,
                scalerType: true,
                scalerValue: true,
                templateId: true,
                workersMax: true,
                workersMin: true,
              } as Record<keyof Endpoint, boolean>,
              pods: {
                desiredStatus: true
              } as Record<keyof Pod, boolean>,
            },
            serverlessDiscount: {
              discountFactor: true,
              type: true,
              expirationDate: true,
            } as Record<keyof Discount, boolean>
          }
        }
      }),
      // `query Endpoints { myself { endpoints { gpuIds id idleTimeout locations name networkVolumeId pods { desiredStatus } scalerType scalerValue templateId workersMax workersMin } serverlessDiscount { discountFactor type expirationDate } } }`,
      `list endpoints`
    ) as Promise<ListEndpointsResponse>;
  }

  /**
   * Sends request to create an endpoint
   * @param options endpoint options
   * @returns {Promise<Endpoint>}
   */
  async endpointsCreate(options: Partial<Endpoint>) {
    const inputText = optionsToString(options);
    return await this.runRunpodGraphqlQuery(
      `mutation { saveEndpoint(input: { ${inputText} }) { gpuIds id idleTimeout locations name scalerType scalerValue templateId workersMax workersMin } }`,
      `create endpoint`
    ) as Promise<Endpoint>;
  }

  /* Too dangerous to enable
  async endpointsDelete(endpointId:string) {
    return await this.runRunpodGraphqlQuery(
      `mutation { deleteEndpoint(id: \"${endpointId}\") }`,
      `delete endpoint`
    );
  }
  */

  /* Too dangerous to enable
  async endpointsModify(endpointId: string, updates: Partial<EndpointOptions>) {
    const inputText = Object.entries({ ...updates, id: endpointId }).map(([key, value]) => `${key}: "${value}"`).join(`, `);
    return await this.runRunpodGraphqlQuery(
      `mutation { saveEndpoint(input: { ${inputText} }) { id gpuIds name templateId workersMax } }`,
      `modify endpoint`
    );
  }
  */

  /**
   * Sends a request to create an on-demand pod.
   * @param options Pod options
   * @returns {Promise<CreatePodResponse>}
   */
  async podDeployGpu(pod: Partial<PodFindAndDeployOnDemandInput>) {
    if (!pod.gpuTypeId) {
      throw new TypeError(`pod.gpuTypeId is required.`);
    }
    const input = {
      ...pod,
      cloudType: pod.cloudType || CLOUD_TYPES_SUPPORTED_ON_CREATE_POD.secure,
      containerDiskInGb: pod.containerDiskInGb || 40,
      // deployCost: pod.deployCost || 0.06,
      dataCenterId: pod.dataCenterId || null,
      networkVolumeId: pod.networkVolumeId || null,
      startJupyter: pod.startJupyter ?? false,
      startSsh: pod.startSsh ?? true,
      dockerArgs: pod.dockerArgs || "",
      volumeKey: pod.volumeKey ?? null,
      ports: pod.ports ?? "8888/http,22/tcp",

      cudaVersion: null,
      computeType: COMPUTE_TYPE.gpu,
      // containerRegistryAuthId: null,
      countryCode: null,
      // dockerEntrypoint: "",
      // dockerStartCmd: "",
      env: [{ key: "ENV_VAR", value: "value" }],
      gpuCount: 1,
      // templateId: "runpod-ubuntu", // Undocumented: cannot be changed.
      // imageName: "", // Undocumented: not supported for CPU pods.
      imageName: "runpod/pytorch:2.1.0-py3.10-cuda11.8.0-devel-ubuntu22.04",
      // interruptible: false,
      // locked: false,
      // minDiskBandwidthMBps: 1,
      // minDownloadMbps: 1,
      // minRAMPerGPU: 8,
      // minUploadMbps: 1,
      // minVCPUPerGPU: 2,
      // supportPublicIp: true,
      // vcpuCount: 2,
      // volumeInGb: 20,
      // volumeMountPath: "/workspace"

    } as Partial<PodFindAndDeployOnDemandInput>;

    const inputEnums: Partial<Record<keyof PodFindAndDeployOnDemandInput, EnumType>> = {};

    for (const enumProp of ["cloudType", "computeType", /* "gpuTypeId", "dataCenterId"*/] as (keyof PodFindAndDeployOnDemandInput)[])
      if (input[enumProp])
        inputEnums[enumProp] = new EnumType(String(input[enumProp])!);

    const query = jsonToGraphQLQuery({
      mutation: {
        podFindAndDeployOnDemand: {
          __args: {
            //input: new VariableType(`input`)
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
    console.log(query);

    const payload: JsonRequestBody = {
      operationName: "Mutation",
      variables: { input },
      query,
    };
    return await this.runRunpodGraphqlQuery(
      // payload,
      query,
      `deploy cpu pod`
    ) as Promise<CreatePodResponse>;
  }

  async podDeployCpu(pod: Partial<PodFindAndDeployOnDemandInput> & Partial<SpecificsInput>) {

    // https://github.com/runpod/runpod-python/issues/314
    // `mutation { deployCpuPod(input: { instanceId: "cpu3c-2-4", cloudType: SECURE, containerDiskInGb: 5, deployCost: 0.06, dataCenterId: null, networkVolumeId: null, startJupyter: true, startSsh: true, templateId: "runpod-ubuntu", volumeKey: null, ports: "22/tcp" }) { id imageName env machineId machine { podHostId } } }`,

    if (!pod.instanceId) {
      pod.instanceId = CPU_FLAVOR_IDS.cpu3.compute + "-2-4";
    } else if (pod.instanceId && pod.instanceId.slice(0, 3) !== `cpu`) {
      throw new Error(`Expecting a cpu instance`);
    }

    const input = {
      ...pod,
      instanceId: pod.instanceId,
      cloudType: pod.cloudType || CLOUD_TYPES_SUPPORTED_ON_CREATE_POD.secure,
      containerDiskInGb: pod.containerDiskInGb || 5,
      deployCost: pod.deployCost || 0.06,
      dataCenterId: pod.dataCenterId || null,
      networkVolumeId: pod.networkVolumeId || null,
      startJupyter: pod.startJupyter ?? false,
      startSsh: pod.startSsh ?? true,
      templateId: "runpod-ubuntu", // Undocumented: cannot be changed.
      // imageName: "", // Undocumented: not supported for CPU pods.
      dockerArgs: pod.dockerArgs || "",
      volumeKey: pod.volumeKey ?? null,
      ports: pod.ports ?? "22/tcp",
    } as Partial<PodFindAndDeployOnDemandInput>;
    const inputEnums = {
      cloudType: new EnumType(input.cloudType!),
    };

    const query = jsonToGraphQLQuery({
      mutation: {
        deployCpuPod: {
          __args: {
            //input: new VariableType(`input`)
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
    console.log(query);

    const payload: JsonRequestBody = {
      operationName: "Mutation",
      variables: { input },
      query,
      // `mutation { deployCpuPod(input: { instanceId: "cpu3c-2-4", cloudType: SECURE, containerDiskInGb: 5, deployCost: 0.06, dataCenterId: null, networkVolumeId: null, startJupyter: true, startSsh: true, templateId: "runpod-ubuntu", volumeKey: null, ports: "22/tcp" }) { id imageName env machineId machine { podHostId } } }`,

    };
    return await this.runRunpodGraphqlQuery(
      // payload,
      query,
      `deploy cpu pod`
    ) as Promise<DeployCpuPodOutput>;
  }

  /**
   * Sends a request to start an existing on-demand pod
   * @param podId
   * @param options 
   * @returns {Promise<StartPodResponse>}
   */
  async podStart(podId: string, options: Partial<Pod>) {
    const inputText = optionsToString({ podId, ...options });
    return await this.runRunpodGraphqlQuery(
      `mutation { podResume( input: ${inputText} ) { id desiredStatus imageName env machineId machine { podHostId } } }`,
      `start pod`
    ) as Promise<StartPodResponse>;
  }

  /**
   * Sends a request to resume a stopped on-demand pod
   * @param options
   * @returns {Promise<StopPodResponse>}
   */
  async podResume(options: Partial<PodBidResumeInput>) {
    return await this.runRunpodGraphqlQuery(
      `mutation { podResume(input: ${optionsToString(options)}) { id desiredStatus } }`,
      `resume pod`
    ) as Promise<ResumePodResponse>;
  }

  /**
   * Sends a request to stop an existing on-demand pod
   * @param podId Id of the pod to stop
   * @returns {Promise<StopPodResponse>}
   */
  async podStop(podId: string) {
    return await this.runRunpodGraphqlQuery(
      `mutation { podStop(input: {podId: \"${podId}\"}) { id desiredStatus } }`,
      `stop pod`
    ) as Promise<StopPodResponse>;
  }

  /**
   * Sends a request to terminate an existing on-demand pod
   * @param podId Id of the pod to terminate
   * @returns {Promise<StopPodResponse>}
   */
  async podTerminate(podId: string) {
    return await this.runRunpodGraphqlQuery(
      `mutation { podTerminate(input: {podId: \"${podId}\"}) }`,
      `stop pod`
    ) as Promise<TerminatePodResponse>;
  }

  /**
   * Sends a request to get a pod's information
   * @param podId Id of the pod to get
   * @returns {Promise<GetPodResponse>}
   */
  async podGet(podId: string) {
    return await this.runRunpodGraphqlQuery(
      `query Pod { pod(input: {podId: \"${podId}\"}) { id name runtime { uptimeInSeconds ports { ip isIpPublic privatePort publicPort type } gpus { id gpuUtilPercent memoryUtilPercent } container { cpuPercent memoryPercent } } } }`,
      `get pod`
    ) as Promise<GetPodResponse>;
  }

  /**
   * Sends a request to list pods
   * @returns {Promise<ListPodResponse>}
   */
  async podList() {
    return await this.runRunpodGraphqlQuery(
      `query Pods { myself { pods { id name runtime { uptimeInSeconds ports { ip isIpPublic privatePort publicPort type } gpus { id gpuUtilPercent memoryUtilPercent } container { cpuPercent memoryPercent } } } } }`,
      `list pods`
    ) as Promise<ListPodResponse>;
  }

  /**
   * Sends a request to list gpu types
   * @returns {Promise<ListGpuResponse>}
   */
  async gpuList() {
    return await this.runRunpodGraphqlQuery(
      `query GpuTypes { gpuTypes { id displayName memoryInGb } }`,
      `list gpu types`
    ) as Promise<ListGpuResponse>;
  }
  async gpuExtendedList() {
    const payload: JsonRequestBody = {
      operationName: "GpuTypes",
      variables: {},
      query: "query GpuTypes {\n  countryCodes\n  dataCenters {\n    id\n    name\n    listed\n    globalNetwork\n    location\n    __typename\n  }\n  gpuTypes {\n    maxGpuCount\n    maxGpuCountCommunityCloud\n    maxGpuCountSecureCloud\n    minPodGpuCount\n    id\n    displayName\n    memoryInGb\n    secureCloud\n    communityCloud\n    manufacturer\n    __typename\n  }\n}"
    }

    /*
      id: string;
      name: string;
      location: string;
      storage: DataCenterStorage;
      storageSupport: boolean;
      listed: boolean;
      gpuAvailability: GpuAvailability[]
      compliance: Compliance[];
    */
    return await this.runRunpodGraphqlQuery(
      payload,
      `list gpu extended`
    ) as Promise<ListGpuExtendedResponse>;
  }

  async gpuCommunityTypeList(gpuTypeId: string, lowestPrice?: Partial<GpuLowestPriceInput>) {
    const payload: JsonRequestBody = {
      "operationName": "CommunityGpuTypes",
      "variables": {
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
      "query": "query CommunityGpuTypes($lowestPriceInput: GpuLowestPriceInput, $gpuTypesInput: GpuTypeFilter) {\n  gpuTypes(input: $gpuTypesInput) {\n    lowestPrice(input: $lowestPriceInput) {\n      minimumBidPrice\n      uninterruptablePrice\n      minVcpu\n      minMemory\n      stockStatus\n      maxUnreservedGpuCount\n      availableGpuCounts\n      __typename\n    }\n    id\n    displayName\n    memoryInGb\n    communityPrice\n    communitySpotPrice\n    __typename\n  }\n}"
    };
    return await this.runRunpodGraphqlQuery(
      payload,
      `list community gpu types`
    ) as Promise<ListGpuResponse>;
  }

  async gpuSecureTypeList(gpuTypeId: string, lowestPrice?: Partial<GpuLowestPriceInput>) {
    const payload: JsonRequestBody = {
      "operationName": "SecureGpuTypes",
      "variables": {
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
      "query": "query SecureGpuTypes($gpuTypesInput: GpuTypeFilter, $lowestPriceInput: GpuLowestPriceInput) { gpuTypes(input: $gpuTypesInput) { lowestPrice(input: $lowestPriceInput) { minimumBidPrice uninterruptablePrice minVcpu minMemory stockStatus compliance maxUnreservedGpuCount availableGpuCounts } id displayName memoryInGb securePrice communityPrice oneMonthPrice oneWeekPrice threeMonthPrice sixMonthPrice secureSpotPrice } }"
    };
    return await this.runRunpodGraphqlQuery(
      payload,
      `list secure gpu types`
    ) as Promise<ListGpuResponse>;
  }

  async gpuAvailabilityList(dataCenterId: string): Promise<{ data: { dataCenters: DataCenter[] } }> {
    const payload: JsonRequestBody = {
      "operationName": "Query",
      "variables": {
        dataCenterId
      },
      "query": jsonToGraphQLQuery({
        query: {
          // __name: `DataCenters`,
          dataCenters: {
            __args: {
              where: { id: new VariableType("dataCenterId") }
            },
            id: true,
            name: true,
            location: true,
            storageSupport: true,
            listed: true,
            gpuAvailability: {
              available: true,
              stockStatus: true,
              gpuTypeId: true,
              gpuType: true,
              gpuTypeDisplayName: true,
              displayName: true,
              id: true,
            }
          }
        }
      })
    };

    return await this.runRunpodGraphqlQuery(
      payload,
      `list availabel gpu`
    ) as Promise<{ data: { dataCenters: DataCenter[] } }>;
  }

  async cpuFlavorsList() {
    const payload: JsonRequestBody = {
      "operationName": "CpuFlavors",
      "query": jsonToGraphQLQuery({
        query: {
          __name: `CpuFlavors`,
          countryCodes: true,
          dataCenters: {
            id: true,
            name: true,
            listed: true,
            // gpuAvailability: true,
            // cpuAvailability: true,
          } as Record<keyof DataCenter, boolean>,
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
    return await this.runRunpodGraphqlQuery(
      payload,
      `list cpu flavors`
    ) as Promise<ListCpuFlavorsResponse>;
  }

  async cpuSecureTypesList(cpuFlavorId: string, specifics?: SpecificsInput) {
    const payload: JsonRequestBody = {
      operationName: "SecureCpuTypes",
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
    return await this.runRunpodGraphqlQuery(
      payload,
      `list secure cpu names`
    ) as Promise<ListSecureCpuTypes>;
  }

  async cpuNamesList() {
    const payload: JsonRequestBody = {
      "operationName": "getCpuNames",
      "query": "query getCpuNames { cpuFlavors { id groupName displayName } }"
    };
    return await this.runRunpodGraphqlQuery(
      payload,
      `list cpu names`
    ) as Promise<ListSecureCpuTypes>;
  }

  /**
   * Sends request to list templates
   * @returns {Promise<{data: {myself: Partial<User>}}>}
   */
  async templatesList() {
    return await this.runRunpodGraphqlQuery(
      `query myself { myself { podTemplates { advancedStart containerDiskInGb containerRegistryAuthId dockerArgs earned env { key value } id imageName isPublic isRunpod isServerless boundEndpointId name ports readme runtimeInMin startJupyter startScript startSsh volumeInGb volumeMountPath config category } } }`,
      `list templates`
    ) as Promise<{ data: { myself: Partial<User> } }>;
  }
}

function withError(message: string, error: any) {
  return `${message}\n${error instanceof Error ? error.message : String(error)}`;
}

export function optionsToString(options: any, noQuotes = false): string {
  const segments: string[] = [];
  if (typeof options !== `object`) {
    return String(options);
  } else if (Array.isArray(options)) {
    return `[${options.map(v => optionsToString(v, noQuotes)).join(`, `)}]`;
  } else {
    for (const key in options) {
      if (typeof options[key] === `object`) {
        segments.push(`${key}: ${optionsToString(options[key], noQuotes)}`);
      } else if (typeof options[key] === `number`) {
        segments.push(`${key}: ${options[key]}`);
      } else if (typeof options[key] === `string`) {
        segments.push(
          !noQuotes
            ? `${key}: ${JSON.stringify(options[key])}`
            : `${key}: ${options[key]}`
        );
      } else {
        segments.push(`${key}: "${options[key]}"`);
      }
    }
  }
  return `{ ${segments.join(`, `)} }`;
}
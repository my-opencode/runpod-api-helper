import { CreatePodResponse, Endpoint, GetPodResponse, GetUserResponse, GpuAvailabilityInput, GpuLowestPriceInput, GpuType, JsonRequestBody, ListCpuFlavorsResponse, ListEndpointsResponse, ListGpuExtendedResponse, ListGpuResponse, ListPodResponse, ListSecureCpuTypes, LowestPrice, Pod, PodBidResumeInput, PodFindAndDeployOnDemandInput, ResumePodResponse, RunpodApiConstructorOptions, SpecificsInput, StartPodResponse, StopPodResponse, TerminatePodResponse, User } from "./runpod.types";

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
      `query Endpoints { myself { endpoints { gpuIds id idleTimeout locations name networkVolumeId pods { desiredStatus } scalerType scalerValue templateId workersMax workersMin } serverlessDiscount { discountFactor type expirationDate } } }`,
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

  // endpoints = {
  //   create: this.endpointsCreate,
  //   list: this.endpointsList,
  // };

  /**
   * Sends a request to create an on-demand pod.
   * @param options Pod options
   * @returns {Promise<CreatePodResponse>}
   */
  async podCreate(options: Partial<PodFindAndDeployOnDemandInput>) {
    // const inputText = optionsToString(options, true);
    return await this.runRunpodGraphqlQuery(
      // `mutation { podFindAndDeployOnDemand( input: ${inputText} ) { id imageName env machineId machine { podHostId } } }`,
      `
mutation {
  podFindAndDeployOnDemand(
    input: {
      cloudType: SECURE
      computeType: CPU
      gpuCount: 0
      containerDiskInGb: 40
      minVcpuCount: 2
      minMemoryInGb: 15
      name: "ApiHelperTestPod"
      imageName: "runpod/base:0.5.1-cpu"
      dockerArgs: ""
    }
  ) {
    id
    imageName
    env
    machineId
    machine {
      podHostId
      }
  }
}
`.replaceAll(/[\s\n]+/g, ` `),
      // gpuTypeId: "NVIDIA RTX A6000"
      // `mutation { podFindAndDeployOnDemand( input: { computeType: CPU, cloudType: SECURE, dataCenterId: "eu-se-1", name: "ApiHelperTestPod", imageName: "runpod/base:0.5.1-cpu" } ) { id imageName env machineId machine { podHostId } } }`,
      `create pod`
    ) as Promise<CreatePodResponse>;
  }
  async podDeployCpu(pod: Partial<PodFindAndDeployOnDemandInput>&Partial<SpecificsInput>) {
    if(!pod.instanceId) {
      pod.instanceId = "cpu3c-2-4";
    } else if(pod.instanceId && pod.instanceId.slice(0,3) !== `cpu`) {
      throw new Error(`Expecting a cpu instance`);
    }
    const payload: JsonRequestBody = {
      operationName: "Mutation",
      variables: {
        input: {
          cloudType: "SECURE",
          containerDiskInGb: 20,
          deployCost: 0.06,
          // dataCenterId: "EU-RO-1",
          // networkVolumeId: "poh305z8m2",
          volumeKey: null,
          startJupyter: true,
          startSsh: true,
          ports: "22/tcp",
          templateId: "runpod-ubuntu",
          ...pod,
        }
      },
      "query": "mutation Mutation($input: deployCpuPodInput!) {\n  deployCpuPod(input: $input) {\n    id\n    imageName\n    env\n    machineId\n    machine {\n      podHostId\n      __typename\n    }\n    __typename\n  }\n}"
    };
    return await this.runRunpodGraphqlQuery(
      payload,
      `deploy cpu pod`
    ) as Promise<CreatePodResponse>;
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

  // pods = {
  //   podCreate: this.podCreate,
  //   start: this.podStart,
  //   stop: this.podStop,
  //   get: this.podGet,
  //   list: this.podList,
  // };

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
    const payload : JsonRequestBody = {
      operationName:"GpuTypes",
      variables:{},
      query:"query GpuTypes {\n  countryCodes\n  dataCenters {\n    id\n    name\n    listed\n    globalNetwork\n    location\n    __typename\n  }\n  gpuTypes {\n    maxGpuCount\n    maxGpuCountCommunityCloud\n    maxGpuCountSecureCloud\n    minPodGpuCount\n    id\n    displayName\n    memoryInGb\n    secureCloud\n    communityCloud\n    manufacturer\n    __typename\n  }\n}"}

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

  async cpuFlavorsList() {
    const payload: JsonRequestBody = {
      "operationName": "CpuFlavors",
      "query": "query CpuFlavors { countryCodes dataCenters { id name listed } cpuFlavors { id groupId groupName displayName minVcpu maxVcpu ramMultiplier diskLimitPerVcpu } }"
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
      query: "query SecureCpuTypes($cpuFlavorInput: CpuFlavorInput, $specificsInput: SpecificsInput) {\n  cpuFlavors(input: $cpuFlavorInput) {\n    specifics(input: $specificsInput) {\n      stockStatus\n      securePrice\n      slsPrice\n      __typename\n    }\n    __typename\n  }\n}"
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
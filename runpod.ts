import { CreatePodResponse, Endpoint, GetPodResponse, GetUserResponse, ListEndpointsResponse, ListGpuResponse, ListPodResponse, Pod, RunpodApiConstructorOptions, StartPodResponse, StopPodResponse, TerminatePodResponse, User } from "./runpod.types";

const jsonHeader = { "content-type": `application/json` };

export class RunpodApi {
  apiKey: string;
  constructor(options: RunpodApiConstructorOptions) {
    this.apiKey = options.apiKey;
  }

  async runRunpodGraphqlQuery(query: string, actionDescription: string) {
    try {
      const response = await fetch(
        `https://api.runpod.io/graphql?api_key=${this.apiKey}`,
        {
          headers: jsonHeader,
          method: `POST`,
          body: JSON.stringify(
            { query }
          ),
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
  async podCreate(options: Partial<Pod>) {
    const inputText = optionsToString(options);
    return await this.runRunpodGraphqlQuery(
      `mutation { podFindAndDeployOnDemand( input: { cloudType: ALL, ${inputText} } ) { id imageName env machineId machine { podHostId } } }`,
      `create pod`
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
      `mutation { podResume( input: { ${inputText} } ) { id desiredStatus imageName env machineId machine { podHostId } } }`,
      `start pod`
    ) as Promise<StartPodResponse>;
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

  // gpus = {
  //   list: this.gpuList,
  // }


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

export function optionsToString(options: any): string {
  const segments: string[] = [];
  if (typeof options !== `object`) {
    return String(options);
  } else if (Array.isArray(options)) {
    return `[${options.map(v => optionsToString(v)).join(`, `)}]`;
  } else {
    for (const key in options) {
      if (typeof options[key] === `object`) {
        segments.push(`${key}: ${optionsToString(options[key])}`);
      } else if (typeof options[key] === `number`) {
        segments.push(`${key}: ${options[key]}`);
      } else {
        segments.push(`${key}: "${options[key]}"`);
      }
    }
  }
  return `{ ${segments.join(`, `)} }`;
}
import { DataCenterId, Endpoint, GpuLowestPriceInput, GpuTypeId, RunpodApiConstructorOptions } from "./lib/runpod.graphql.types";
import { runRunpodGraphqlQuery } from "./lib/queryRunner";
import { listEndpoints } from "./lib/endpoints/list";
import { createEndpoint } from "./lib/endpoints/create";
import { CreateEndpointInput, JsonRequestBody, PodCreateCpuInput, PodFindAndDeployOnDemandInput, SpecificsInput } from "./lib/runpod.request.type";
import { CreatePodResponse, DeployCpuPodResponse, GetPodResponse, ListEndpointsResponse, ListGpuResponse, ListPodResponse, ListCpuFlavorsResponse, StartPodResponse, StopPodResponse, TerminatePodResponse, ListDataCentersResponse, ListCountryCodesResponse, ListPodTemplatesResponse, ListAvailableGpusResponse, CreateEndpointResponse, ModifyEndpointResponse, DeleteEndpointResponse } from "./lib/runpod.responses.type";
import { modifyEndpoint } from "./lib/endpoints/modify";
import { deleteEndpoint } from "./lib/endpoints/delete";
import { createGpuPod } from "./lib/pods/createGpu";
import { createCpuPod } from "./lib/pods/createCpu";
import { startPod } from "./lib/pods/start";
import { stopPod } from "./lib/pods/stop";
import { deletePod } from "./lib/pods/delete";
import { getPod } from "./lib/pods/get";
import { listPods } from "./lib/pods/list";
import { listTemplates } from "./lib/info/templates";
import { listCpuFlavors, listCpuNames, listSecureCpuTypes } from "./lib/info/cpu";
import { listCountryCodes, listDataCenters } from "./lib/info/other";
import { listAvailableGpus, listCommunityGpuTypes, listGpuTypes, listSecureGpuTypes } from "./lib/info/gpu";

export class RunpodApi {
  apiKey: string;
  runRunpodGraphqlQuery: (
    queryOrPayload: string | JsonRequestBody,
    actionDescription: string
  ) => Promise<any>;
  endpoints: {
    list(): Promise<ListEndpointsResponse>;
    create(input: Partial<CreateEndpointInput>): Promise<CreateEndpointResponse>;
    modify(input: Partial<Endpoint>): Promise<ModifyEndpointResponse>;
    delete(endpointId: string): Promise<DeleteEndpointResponse>;
  }
  pods: {
    list(): Promise<ListPodResponse>;
    get(podId: string): Promise<GetPodResponse>;
    createCpu(input: PodCreateCpuInput): Promise<DeployCpuPodResponse>;
    createGpu(input: Partial<PodFindAndDeployOnDemandInput>): Promise<CreatePodResponse>;
    start(podId: string): Promise<StartPodResponse>;
    stop(podId: string): Promise<StopPodResponse>;
    delete(podId: string): Promise<TerminatePodResponse>;
  }
  info: {
    cpu: {
      listFlavors(): Promise<ListCpuFlavorsResponse>;
      listSecure(cpuFlavorId: string, specifics?: SpecificsInput): Promise<ListCpuFlavorsResponse>;
      listNames(): Promise<ListCpuFlavorsResponse>;
    };
    gpu: {
      list(): Promise<ListGpuResponse>,
      listCommunity(gpuTypeId: GpuTypeId, lowestPrice?: Partial<GpuLowestPriceInput>): Promise<ListGpuResponse>,
      listSecure(gpuTypeId: GpuTypeId, lowestPrice?: Partial<GpuLowestPriceInput>): Promise<ListGpuResponse>,
      listAvailable(dataCenterId: DataCenterId, minRam?: number): Promise<ListAvailableGpusResponse>,
    };
    templates: {
      list(): Promise<ListPodTemplatesResponse>
    };
    dataCenters: {
      list(): Promise<ListDataCentersResponse>
    };
    countryCodes: {
      list(): Promise<ListCountryCodesResponse>
    };
  }

  constructor(options: RunpodApiConstructorOptions) {
    this.apiKey = options.apiKey;

    this.runRunpodGraphqlQuery = (queryOrPayload, actionDescription) => runRunpodGraphqlQuery(this.apiKey, queryOrPayload, actionDescription);

    this.endpoints = {
      list: async () => listEndpoints(this.apiKey),
      create: async (options) => createEndpoint(this.apiKey, options),
      modify: async (input) => modifyEndpoint(this.apiKey, input),
      delete: async (endpointId) => deleteEndpoint(this.apiKey, endpointId),
    };

    this.pods = {
      createCpu: async (input) => createCpuPod(this.apiKey, input),
      createGpu: async (input) => createGpuPod(this.apiKey, input),
      get: async (podId) => getPod(this.apiKey, podId),
      list: async () => listPods(this.apiKey),
      start: async (podId) => startPod(this.apiKey, podId),
      stop: async (podId) => stopPod(this.apiKey, podId),
      delete: async (podId) => deletePod(this.apiKey, podId),
    };

    this.info = {
      cpu: {
        listFlavors: () => listCpuFlavors(),
        listSecure: (cpuFlavorId, specifics) => listSecureCpuTypes(cpuFlavorId, specifics),
        listNames: () => listCpuNames(),
      },
      gpu: {
        list: () => listGpuTypes(),
        listCommunity: (gpuTypeId, lowestPrice) => listCommunityGpuTypes(gpuTypeId, lowestPrice),
        listSecure: (gpuTypeId, lowestPrice) => listSecureGpuTypes(gpuTypeId, lowestPrice),
        listAvailable: (dataCenterId, minRam?: number) => listAvailableGpus(dataCenterId, minRam),
      },
      templates: {
        list: async () => listTemplates(this.apiKey),
      },
      dataCenters: {
        list: async () => listDataCenters(),
      },
      countryCodes: {
        list: async () => listCountryCodes(),
      }
    };
  }
}

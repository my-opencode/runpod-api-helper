import { CountryCode, CpuFlavor, DataCenter, DataCenterId, DiscountType, Endpoint, GpuAvailability, GpuType, Pod, PodMachineInfo, PodTemplate, User } from "./runpod.graphql.types";

export interface CreateEndpointResponse {
  data: {
    saveEndpoint: Partial<Endpoint>;
  }
}
export type ModifyEndpointResponse = CreateEndpointResponse;
export interface DeleteEndpointResponse {
  data: {
    deleteEndpoint: null;
  }
}
export interface ListEndpointsResponse {
  data: {
    myself: Pick<User, "endpoints"|"serverlessDiscount">;
  }
}
export type PartialPod = Partial<Omit<Pod, "machine">> & { machine: Partial<PodMachineInfo> };
export interface CreatePodResponse {
  data: {
    podFindAndDeployOnDemand:  PartialPod
  }
}
export interface ResumePodResponse {
  data: {
    podResume: PartialPod
  }
}
export type StartPodResponse = ResumePodResponse;
export interface StopPodResponse {
  data: {
    podStop: Pick<Pod, "id" | "desiredStatus"> & Partial<Pod>;
  }
}
export interface TerminatePodResponse {
  data: {
    podTerminate: null;
  }
}
export interface ListPodResponse {
  data: {
    myself: {
      pods: (Pick<Pod, "id" | "name" | "runtime"> & Partial<Pod>)[];
    }
  }
}
export interface GetPodResponse {
  data: {
    pod: Pod;
  }
}
export interface ListGpuResponse {
  data: {
    gpuTypes: GpuType[];
  }
}
export interface ListExtendedResponse {
  data: {
    countryCodes: CountryCode[],
    cpuFlavors: CpuFlavor[],
    dataCenters: DataCenter[],
    gpuTypes: GpuType[],
  }
}
export interface ListCpuFlavorsResponse {
  data: {
    cpuFlavors: CpuFlavor[]
  }
}
export interface ListGpuExtendedResponse {
  data: {
    countryCodes: CountryCode[],
    dataCenters: DataCenter[],
    gpuTypes: GpuType[],
  }
}
export interface ListDataCentersResponse {
  data: {
    dataCenters: DataCenter[],
  }
}
export interface ListCountryCodesResponse {
  data: {
    countryCodes: CountryCode[],
  }
}
export interface DeployCpuPodResponse {
  data: {
    deployCpuPod: Partial<Pod>
  }
}
export interface GetUserResponse {
  data: {
    myself: User
  }
}
export interface GetInfoResponse { data: { myself: Partial<User> } }

export interface ListPodTemplatesResponse {
  data: {
    myself: Pick<User,"podTemplates">
  }
}
export type AvailableGpu = GpuType & GpuAvailability;
export interface ListAvailableGpusResponse {
  data: {
    dataCenterId: DataCenterId;
    availableGpus: AvailableGpu[];
  }
}
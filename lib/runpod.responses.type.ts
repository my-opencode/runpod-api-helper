import { CountryCode, CpuFlavor, DataCenter, DataCenterId, DiscountType, Endpoint, GpuAvailability, GpuType, Pod, PodMachineInfo, PodTemplate, User } from "./runpod.graphql.types";

export interface CreateEndpointResponse {
  data: {
    saveEndpoint: Partial<Endpoint>;
  }
}
export interface ModifyEndointResponse {
  data: {
    saveEndpoint: Partial<Endpoint>;
  }
}
export interface DeleteEndpointResponse {
  data: {
    deleteEndpoint: null;
  }
}
export interface ListEndpointsResponse {
  data: {
    myself: {
      endpoints: Partial<Endpoint>[],
      serverlessDiscount: null | DiscountType;
    }
  }
}
export interface CreatePodResponse {
  data: {
    podFindAndDeployOnDemand: Partial<Omit<Pod, "machine">> & { machine: Partial<PodMachineInfo> };
  }
}
export interface ResumePodResponse {
  data: {
    podResume: Partial<Omit<Pod, "machine">> & { machine: Partial<PodMachineInfo> };
  }
}
export interface StartPodResponse {
  data: {
    podResume: Partial<Omit<Pod, "machine">> & { machine: Partial<PodMachineInfo> };
  }
}
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
    countryCodes: CountryCode[],
    dataCenters: DataCenter[],
    cpuFlavors: CpuFlavor[],
  }
}
export interface ListCpuTypesResponse {
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
    myself: {
      podTemplates: PodTemplate[];
    }
  }
}
export type AvailableGpu = GpuType & GpuAvailability;
export interface ListAvailableGpusResponse {
  data: {
    dataCenterId: DataCenterId;
    availableGpus: AvailableGpu[];
  }
}
import { ComputeType, CpuFlavorKnown, DataCenterId, Endpoint, GpuTypeId, ScalerType } from "./runpod.graphql.types";

export type OperationName =
  "GpuTypes" |
  "getCpuNames" |
  "deployCpuPodInput" |
  "podTerminate" |
  "podResume" |
  "podStop";
export interface JsonRequestBody {
  operationName?: OperationName;
  variables?: Record<string, any>;
  query: string;
}
export interface CreateEndpointInput extends Partial<Endpoint> {
  allowedCudaVersions: string[];
  computeType: ComputeType;
  cpuFlavorIds: CpuFlavorKnown[];
  dataCenterIds: DataCenterId[];
  executionTimeoutMs: number;
  flashboot: boolean;
  gpuCount: number;
  gpuTypeIds: GpuTypeId[];
  idleTimeout: number;
  name: string;
  networkVolumeId?: string;
  scalerType: ScalerType;
  scalerValue: number;
  templateId?: string;
  vcpuCount: number;
  workersMax: number;
  workersMin: number;
}
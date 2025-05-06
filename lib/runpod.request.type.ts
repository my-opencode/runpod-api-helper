import { BillingGranualarity, CloudTypeEnum, ComputeType, CountryCode, CpuFlavorKnown, DataCenterId, Endpoint, EndpointStatisticGranularity, EnvironmentVariableInput, GpuTypeId, ScalerType, UserServerlessBillingGroupBy } from "./runpod.graphql.types";

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


export interface NetworkStorageEarningInput {
  granularity: string;
}
export interface PodBidResumeInput {
  podId: string;
  gpuCount: number;
  bidPerGpu: number;
}
export interface PodEditJobInput {
  podId: string;
  dockerArgs: string;
  imageName: string;
  env: EnvironmentVariableInput[],
  port: number;
  ports: string;
  containerDiskInGb: number;
  volumeInGb: number;
  volumeMountPath: string;
  containerRegistryAuthId: string;
}
export type PodCreateCpuInput = Partial<PodFindAndDeployOnDemandInput> & Partial<SpecificsInput>;
export interface PodFindAndDeployOnDemandInput {
  aiApiId: string;
  cloudType: CloudTypeEnum;
  containerDiskInGb: number;
  countryCode: CountryCode | null;
  deployCost: number;
  dockerArgs: string;
  env: EnvironmentVariableInput[],
  gpuCount: number;
  gpuTypeId: GpuTypeId | null;
  gpuTypeIdList: string[],
  imageName: string;
  minDisk: number;
  minDownload: number;
  minMemoryInGb: number;
  minUpload: number;
  minVcpuCount: number;
  name: string;
  networkVolumeId: string | null;
  port: number;
  ports: string;
  startJupyter: boolean,
  startSsh: boolean,
  stopAfter: string;
  supportPublicIp: boolean,
  templateId: string | null;
  terminateAfter: string;
  volumeInGb: number;
  volumeKey: string | null;
  volumeMountPath: string;
  dataCenterId: DataCenterId | null;
  savingsPlan: SavingsPlanInput,
  cudaVersion: string | null;
  allowedCudaVersions: string[],
  instanceIds: string[];
  computeType: ComputeType;

  globalNetwork: boolean;
  containerRegistryAuthId: string | null;
}
export interface PodRentInterruptableInput {
  bidPerGpu: number;
  cloudType: CloudTypeEnum,
  containerDiskInGb: number;
  countryCode: CountryCode;
  dockerArgs: string;
  env: EnvironmentVariableInput[],
  gpuCount: number;
  gpuTypeId: string;
  imageName: string;
  minDisk: number;
  minDownload: number;
  minMemoryInGb: number;
  minUpload: number;
  minVcpuCount: number;
  name: string;
  networkVolumeId: string;
  port: number;
  ports: string;
  startJupyter: boolean,
  startSsh: boolean,
  stopAfter: string;
  supportPublicIp: boolean,
  templateId: string;
  terminateAfter: string;
  volumeInGb: number;
  volumeKey: string;
  volumeMountPath: string;
  dataCenterId: string;
  cudaVersion: string;
  allowedCudaVersions: string[]
}
export interface PodResumeInput {
  podId: string;
  gpuCount: number;
  syncMachine: boolean,
  computeType: ComputeType;
}
export interface PodStopInput {
  podId: string;
  incrementVersion: true
}
export interface PodTerminateInput {
  podId: string;
}
export interface SaveRegistryAuthInput {
  name: string;
  username: string;
  password: string;
}
export interface SavingsPlanInput {
  planLength: string;
  upfrontCost: number;
}
export interface SpecificsInput {
  instanceId: string;
  dataCenterId: string;
}
export interface UserBillingInput {
  granularity: BillingGranualarity;
}
export interface UserServerlessBillingInput {
  groupBy: UserServerlessBillingGroupBy;
}
export interface WebhookRequestsInput {
  granularity: EndpointStatisticGranularity;
}
export interface WorkerStateInput {
  granularity: EndpointStatisticGranularity;
}
export interface backgroundPodTelemetryInput {
  machineId: string;
  gpuIndex: number;
}
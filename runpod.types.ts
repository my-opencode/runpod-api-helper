export interface PodEnvironmentOptions {
  key: string;
  value: string;
}
export interface RunpodApiConstructorOptions {
  apiKey: string;
}
export type GpuId = "AMPERE_16" | "AMPERE_24" | "ADA_24" | "AMPERE_48" | "ADA_48_PRO" | "AMPERE_80" | "ADA_80_PRO";
export type Location = "CZ" | "FR" | "GB" | "NO" | "RO" | "US";

export type BillingGranualarity = "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY";
export type ClientCreditChargeType = "CHARGE_SERVERLESS" | "CHARGE_POD" | "CHARGE_API" | "CHARGE_STORAGE" | "CHARGE_SAVINGS_PLAN";
export type CloudType = "SECURE" | "COMMUNITY" | "ALL";
export type Compliance = "GDPR" | "ISO_IEC_27001" | "ISO_14001" | "PCI_DSS" | "HITRUST" | "SOC_1_TYPE_2" | "SOC_2_TYPE_2" | "SOC_3_TYPE_2" | "ITAR" | "FISMA_HIGH";
export type ComputeType = "CPU" | "GPU";
export type CsrType = "admin" | "support_write" | "support_read";
export type DiscountType = "SERVERLESS";
export type EndpointStatisticGranularity = "LIVE" | "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY";
export type PodStatus = "CREATED" | "RUNNING" | "RESTARTING" | "EXITED" | "PAUSED" | "DEAD" | "TERMINATED";
export type PodType = "INTERRUPTABLE" | "RESERVED" | "BID" | "BACKGROUND";
export type Scope = "CSR_ADMIN" | "CSR_IMPERSONATION" | "CSR_READ" | "CSR_WRITE" | "TEAM_ADMIN" | "TEAM_DEV" | "TEAM_BILLING" | "TEAM_BASIC" | "HOST";
export type TeamRole = "owner" | "admin" | "member" | "dev" | "billing" | "basic";
export type TransactionMedium = "STRIPE" | "CRYPTO" | "RUNPOD" | "COINBASE" | "WIRE" | "REFERRAL";
export type TransactionType = "RELOAD" | "CREDIT" | "DEBIT" | "PAYOUT";
export type UserServerlessBillingGroupBy = "GPU_TYPE" | "ENDPOINT" | "INSTANCE_ID";

export interface Gpu {
  id: string;
  podId: string;
}
export interface PodRegistry {
  auth: string;
  pass: string;
  url: string;
  user: string;
  username: string;
}
export interface Specifics {
  stockStatus: string;
  securePrice: number;
  slsPrice: number;
}
export interface CpuFlavor {
  id: string;
  groupId: string;
  groupName: string;
  displayName: string;
  minVcpu: number;
  maxVcpu: number;
  vcpuBurstable: boolean;
  ramMultiplier: number;
  diskLimitPerVcpu: number;
  specifics: Specifics;
}
export interface PodRuntimeContainer {
  cpuPercent: number;
  memoryPercent: number;
}
export interface PodRuntimeGpus {
  id: number;
  gpuUtilPercent: number;
  memoryUtilPercent: number;
}
export interface PodRuntimePorts {
  ip: string;
  isIpPublic: boolean;
  privatePort: number;
  publicPort: number;
  type: string;
}
export interface PodRuntime {
  container: PodRuntimeContainer;
  gpus: PodRuntimeGpus[];
  ports: PodRuntimePorts[];
  uptimeInSeconds: number;
}
export interface LowestPrice {
  gpuName: string;
  gpuTypeId: string;
  minimumBidPrice: number;
  uninterruptablePrice: number;
  minMemory: number;
  minVcpu: number;
  rentalPercentage: number;
  rentedCount: number;
  totalCount: number;
  stockStatus: string;
  minDownload: number;
  minDisk: number;
  minUpload: number;
  countryCode: string;
  supportPublicIp: boolean;
  compliance: Compliance[];
}
export interface GpuType {
  lowestPrice: LowestPrice;
  maxGpuCount: number;
  maxGpuCountCommunityCloud: number;
  maxGpuCountSecureCloud: number;
  minPodGpuCount: number;
  id: string;
  displayName: string;
  manufacturer: string;
  memoryInGb: number;
  cudaCores: number;
  secureCloud: boolean;
  communityCloud: boolean;
  securePrice: number;
  communityPrice: number;
  oneMonthPrice: number;
  threeMonthPrice: number;
  sixMonthPrice: number;
  oneWeekPrice: number;
  communitySpotPrice: number;
  secureSpotPrice: number;
}
export interface MachineSystem {
  os: string;
  cudaVersion: string;
  diskTotal: number;
  diskFree: number;
  dockerVersion: string;
  kernelVersion: string;
}
export interface CpuType {
  id: string;
  displayName: string;
  manufacturer: string;
  cores: number;
  threadsPerCore: number;
  groupId: string;
}
export interface PodMachineInfo {
  id: string;
  costPerHr: string;
  currentPricePerGpu: string;
  diskMBps: number;
  gpuAvailable: number;
  gpuDisplayName: string;
  gpuTypeId: string;
  gpuType: GpuType;
  listed: boolean;
  location: string;
  machineType: string;
  maintenanceEnd: string;
  maintenanceNote: string;
  maintenanceStart: string;
  maxDownloadSpeedMbps: number;
  maxUploadSpeedMbps: number;
  note: string;
  podHostId: string;
  runpodIp: string;
  secureCloud: boolean;
  supportPublicIp: boolean;
  minPodGpuCount: number;
  machineSystem: MachineSystem;
  dataCenterId: string;
  cpuTypeId: string;
  cpuType: CpuType;
  cpuCount: number;
  vcpuTotal: number;
  vcpuReserved: string;
  memoryTotal: number;
  memoryReserved: number;
}
export interface GpuTelemetry {
  id: string;
  percentUtilization: number;
  temperatureCelcius: number;
  memoryUtilization: number;
  powerWatts: number;
}
export interface PodTelemetry {
  state: string;
  time: string;
  cpuUtilization: number;
  memoryUtilization: number;
  averageGpuMetrics: GpuTelemetry;
  individualGpuMetrics: GpuTelemetry[];
  lastStateTransitionTimestamp: number;
}
export interface DataCenterStorageList {
  mnt: string;
  pw: string;
  servers: String[];
  type: string;
  versions: number[];
  primary: boolean;
}
export interface DataCenterStorage {
  hostname: string;
  ips: string[];
  pw: string;
  type: string;
  user: string;
  list: DataCenterStorageList[];
}
export interface GpuAvailability {
  available: boolean;
  stockStatus: string;
  gpuTypeId: string;
  gpuType: GpuType;
  gpuTypeDisplayName: string;
  displayName: string;
  id: string;
}
export interface DataCenter {
  id: string;
  name: string;
  location: string;
  storage: DataCenterStorage;
  storageSupport: boolean;
  listed: boolean;
  gpuAvailability: GpuAvailability[]
  compliance: Compliance[];
}
export interface NetworkVolume {
  id: string;
  name: string;
  size: number;
  dataCenterId: string;
  dataCenter: DataCenter;
}
export interface SavingsPlan {
  endTime: string;
  startTime: string;
  gpuType: GpuType;
  podId: string;
  gpuTypeId: string;
  pod: Pod;
  savingsPlanType: string;
  costPerHr: number;
  upfrontCost: number;
  planLength: string;
}
export interface Pod {
  lowestBidPriceToResume: number;
  aiApiId: string;
  apiKey: string;
  consumerUserId: string;
  containerDiskInGb: number;
  containerRegistryAuthId: string;
  costMultiplier: number;
  costPerHr: number;
  createdAt: string;
  adjustedCostPerHr: number;
  desiredStatus: PodStatus;
  dockerArgs: string;
  dockerId: string;
  env: string[];
  gpuCount: number;
  gpuPowerLimitPercent: number;
  gpus: Gpu[];
  id: string;
  imageName: string;
  lastStatusChange: string;
  locked: Boolean
  machineId: string;
  memoryInGb: number;
  name: string;
  podType: PodType;
  port: number;
  ports: string;
  registry: PodRegistry;
  templateId: string;
  uptimeSeconds: number;
  vcpuCount: number;
  version: number;
  volumeEncrypted: boolean;
  volumeInGb: number;
  volumeKey: string;
  volumeMountPath: string;
  lastStartedAt: string;
  cpuFlavorId: string;
  machineType: string;
  slsVersion: number;
  networkVolumeId: string;
  cpuFlavor: CpuFlavor;
  runtime: PodRuntime;
  machine: PodMachineInfo;
  latestTelemetry: PodTelemetry;
  endpoint: Endpoint;
  networkVolume: NetworkVolume;
  savingsPlans: SavingsPlan[];
}
export interface EnvironmentVariable {
  key: string;
  value: string;
}
export interface PodTemplate {
  advancedStart: boolean;
  containerDiskInGb: number;
  // If your container image is private, you can also specify Docker login credentials with a containerRegistryAuthId argument,
  // which takes the ID (not the name) of the container registry credentials you saved in your RunPod user settings as a string.
  containerRegistryAuthId: string;
  dockerArgs: string;
  earned: number;
  env: EnvironmentVariable[];
  id: string;
  imageName: string;
  isPublic: boolean;
  isRunpod: boolean;
  isServerless: boolean;
  boundEndpointId: string;
  name: string;
  ports: string;
  readme: string;
  runtimeInMin: number;
  startJupyter: boolean;
  startScript: string;
  startSsh: boolean;
  volumeInGb: number;
  volumeMountPath: string;
  config: JSON;
  category: string;
}
export interface WorkerState {
  time: string;
  initialized: number;
  ready: number;
  running: number;
  throttled: number;
}
export interface WebhookRequestStatus {
  time: number;
  responses: number;
}
export interface Endpoint {
  aiKey: string;
  gpuIds: GpuId;
  id: string;
  idleTimeout: number;
  // append -fb to your endpoint's name to enable FlashBoot
  name: string;
  networkVolumeId?: string;
  locations?: null | "" | Location;
  pods: Pod[];
  scalerType: string; //"QUEUE_DELAY";
  scalerValue: number;
  template: PodTemplate;
  templateId: string;
  type: string;
  userId: string;
  version: number;
  workersMax: number;
  workersMin: number;
  workersStandby: number;
  gpuCount: number;
  env: string[];
  createdAt?: string;
  allowedCudaVersions: string;
  executionTimeoutMs: number;
  instanceIds: string[];
  computeType: ComputeType;
  workerState: WorkerState[];
  webhookRequests: WebhookRequestStatus[];
  networkVolume: NetworkVolume;
}
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
    podFindAndDeployOnDemand: Partial<Omit<Pod,"machine">> & { machine: Partial<PodMachineInfo>  };
  }
}
export interface StartPodResponse {
  data: {
    podResume: Partial<Omit<Pod,"machine">> & { machine: Partial<PodMachineInfo>  };
  }
}
export interface StopPodResponse {
  data: {
    podStop: Pick<Pod,"id"|"desiredStatus"> & Partial<Pod>;
  }
}
export interface ListPodResponse {
  data: {
    myself: {
      pods: (Pick<Pod, "id"|"name"|"runtime"> & Partial<Pod>) [];
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
export interface PodEnvironmentOptions {
  key: string;
  value: string;
}
export interface RunpodApiConstructorOptions {
  apiKey: string;
}

export interface ApiKey {
  id: string;
  permissions: string;
  createdAt: string;
  lastUsed: string;
  name: string;
}
export interface AuditLog {
  actorId: string;
  email: string;
  ownerId: string;
  resourceType: string;
  resourceId: string;
  action: string;
  value: string;
  timestamp: string;
}
export interface AuditLogConnection {
  edges: AuditLog[],
  pageInfo: PageInfo
}
export interface BenchmarkPod {
  id: string;
  desiredStatus: string;
}
export type BillingGranualarity = "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY";
export interface ClientCreditCharge {
  amount: number;
  updatedAt: string;
  diskCharges: number;
  podCharges: number;
  apiCharges: number;
  serverlessCharges: number;
  type: ClientCreditChargeType
}
export type ClientCreditChargeType = "CHARGE_SERVERLESS" | "CHARGE_POD" | "CHARGE_API" | "CHARGE_STORAGE" | "CHARGE_SAVINGS_PLAN";
export type CloudTypeEnum = "SECURE" | "COMMUNITY" | "ALL";
export type Compliance = "GDPR" | "ISO_IEC_27001" | "ISO_14001" | "PCI_DSS" | "HITRUST" | "SOC_1_TYPE_2" | "SOC_2_TYPE_2" | "SOC_3_TYPE_2" | "ITAR" | "FISMA_HIGH";
export type ComputeType = "CPU" | "GPU";
export interface ContainerRegistryAuth {
  id: string;
  name: string;
  userId: string;
  registryAuth: string;
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
export interface CpuType {
  id: string;
  displayName: string;
  manufacturer: string;
  cores: number;
  threadsPerCore: number;
  groupId: string;
}
export interface CreditCode {
  id: string;
  issuerId: string;
  createdAt: string;
  redeemedAt: string;
  amount: number;
}
export type CsrType = "admin" | "support_write" | "support_read";
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
export interface DataCenterStorage {
  hostname: string;
  ips: string[];
  pw: string;
  type: string;
  user: string;
  list: DataCenterStorageList[];
}
export interface DataCenterStorageList {
  mnt: string;
  pw: string;
  servers: String[];
  type: string;
  versions: number[];
  primary: boolean;
}
export interface Discount {
  userId: string;
  type: DiscountType;
  discountFactor: number;
  expirationDate: string;
  activeDiscountFactor: number;
  activeWorkers: number;
}
export type DiscountType = "SERVERLESS";
export interface EarningsCustomRangeInput {
  startDate: string;
  endDate: string;
}
export interface Endpoint {
  aiKey: string;
  gpuIds: GpuId;
  id: string;
  idleTimeout: number;
  // append -fb to your endpoint's name to enable FlashBoot
  name: string;
  networkVolumeId: string;
  locations: null | "" | Location;
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
  env: EnvironmentVariable[];
  createdAt: string;
  allowedCudaVersions: string;
  executionTimeoutMs: number;
  instanceIds: string[];
  computeType: ComputeType;
  workerState: WorkerState[];
  webhookRequests: WebhookRequestStatus[];
  networkVolume: NetworkVolume;
}
export type EndpointStatisticGranularity = "LIVE" | "HOURLY" | "DAILY" | "WEEKLY" | "MONTHLY";
export interface EnvironmentVariable {
  key: string;
  value: string;
}
export interface EnvironmentVariableInput {
  key: string;
  value: string;
}
export interface Gpu {
  id: string;
  podId: string;
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
export interface GpuAvailabilityInput {
  gpuCount: number;
  minDisk: number;
  minMemoryInGb: number;
  minVcpuCount: number;
  secureCloud: true,
  allowedCudaVersions: string[],
  includeAiApi: false
}
export type GpuId = "AMPERE_16" | "AMPERE_24" | "ADA_24" | "AMPERE_48" | "ADA_48_PRO" | "AMPERE_80" | "ADA_80_PRO";
export interface GpuLowestPriceInput {
  countryCode: string;
  dataCenterId: string;
  gpuCount: number;
  includeAiApi: true,
  minDisk: number;
  minDownload: number;
  minMemoryInGb: number;
  minUpload: number;
  minVcpuCount: number;
  secureCloud: false,
  supportPublicIp: true,
  totalDisk: number;
  cudaVersion: string;
  allowedCudaVersions: string[],
  compliance: Compliance[]

}
export interface GpuTelemetry {
  id: string;
  percentUtilization: number;
  temperatureCelcius: number;
  memoryUtilization: number;
  powerWatts: number;
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
export interface GpuTypeFilter {
  id: string;
  ids: string[]
}
export interface Impersonation {
  auditLogs: AuditLogConnection,
  id: number;
  zendeskTicketId: string;
  impersonateUserId: string;
  createdAt: string;
  expiresAt: string;
  accepted: false,
  acceptedAt: string;
}
export type Location = "CZ" | "FR" | "GB" | "NO" | "RO" | "US";
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
export interface MachineBalance {
  hostDiskEarnings: number;
  hostGpuEarnings: number;
  hostTotalEarnings: number;
}
export interface MachineBenchmark {
  errors: string;
  benchmarkedAt: string;
  gpuCount: number;
  pod: BenchmarkPod;
}
export interface MachineEarning {
  name: string;
  date: string;
  machineId: string;
  hostTotalEarnings: number;
  hostGpuEarnings: number;
  hostDiskEarnings: number;
}
export interface MachineMaintenance {
  id: string;
  machineId: string;
  maintenanceStart: string;
  maintenanceEnd: string;
  maintenanceNote: string;
}
export interface MachineSummary {
  cpuTypeId: string;
  diskProfitPerHr: number;
  displayName: string;
  gpuTotal: number;
  gpuTypeId: string;
  id: string;
  listed: number;
  machineType: string;
  onDemandPods: number;
  podProfitPerHr: number;
  spotPods: number;
  gpuRented: number;
  cpuRented: number;
  vcpuTotal: number;
}
export interface Machine {
  pods: Pod[];
  id: string;
  userId: string;
  name: string;
  registered: boolean,
  aiApiOnly: boolean,
  priority: number,
  minPodGpuCount: number,
  gpuTypeId: string;
  gpuType: GpuType,
  gpuPowerLimitPercentageRented: number,
  gpuPowerLimitPercentageSelf: number,
  cpuCount: number,
  cpuTypeId: string;
  cpuType: CpuType,
  dataCenter: DataCenter,
  moboName: string;
  hidden: boolean,
  hostPricePerGpu: number,
  hostMinBidPerGpu: number,
  defaultImageName: string;
  defaultStartScript: string;
  defaultArguments: string;
  defaultDiskInGb: number,
  defaultPort: number;
  defaultEnv: string[],
  location: string;
  listed: boolean,
  verified: boolean,
  machineId: string;
  diskReserved: number,
  diskTotal: number,
  diskMBps: number,
  downloadMbps: number,
  gpuReserved: number,
  gpuTotal: number,
  pcieLink: number,
  pcieLinkWidth: number,
  memoryReserved: number,
  memoryTotal: number,
  uploadMbps: number,
  vcpuReserved: number,
  vcpuTotal: number,
  installCert: string;
  uptimePercentListedOneWeek: number;
  uptimePercentListedFourWeek: number,
  uptimePercentListedTwelveWeek: number;
  uptimePercentAbsoluteTwelveWeek: number;
  margin: number;
  gpuCloudPrice: number;
  supportPublicIp: boolean,
  secureCloud: boolean,
  ownedByMe: boolean,
  idleJobTemplateId: string;
  idleJobTemplate: PodTemplate,
  maintenanceStart: string;
  maintenanceEnd: string;
  maintenanceNote: string;
  maintenanceMode: boolean,
  note: string;
  machineBalance: MachineBalance,
  machineSystem: MachineSystem,
  dataCenterId: string;
  machineType: string;
  lastBenchmark: MachineBenchmark,
  upcomingMaintenances: MachineMaintenance[],
  nextMaintenance: MachineMaintenance,
  backgroundPodTelemetry: PodTelemetry,
  latestTelemetry: MachineTelemetry,
  uptime: MachineUptime,
  runpodIp: string;
  publicIp: string;
}
export interface MachineSystem {
  os: string;
  cudaVersion: string;
  diskTotal: number;
  diskFree: number;
  dockerVersion: string;
  kernelVersion: string;
}
export interface MachineTelemetry {
  time: string;
  cpuUtilization: number;
  memoryUtilization: number;
  averageGpuMetrics: GpuTelemetry;
  individualGpuMetrics: GpuTelemetry[];
}
export interface MachineUptime {
  error: string;
  lastSyncTimestamp: number;
  seconds: number;
  sysUptimeSeconds: number;
}
export interface NetworkStorageEarning {
  date: string;
  dailyNetworkVolumeEarn: number;
  dataCenterId: string;
  runpodEarnings: number;
}
export interface NetworkStorageEarningInput {
  granularity: string;
}
export interface NetworkVolume {
  id: string;
  name: string;
  size: number;
  dataCenterId: string;
  dataCenter: DataCenter;
}
export interface PageInfo {
  endCursor: string;
  hasNextPage: false
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
export interface PodFilter {
  podId: string;
}
export interface PodFindAndDeployOnDemandInput {
  aiApiId: string;
  cloudType: CloudTypeEnum;
  containerDiskInGb: number;
  countryCode: string;
  deployCost: number;
  dockerArgs: string;
  env: EnvironmentVariableInput[],
  gpuCount: number;
  gpuTypeId: string;
  gpuTypeIdList: string[],
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
  startJupyter: false,
  startSsh: true,
  stopAfter: string;
  supportPublicIp: true,
  templateId: string;
  terminateAfter: string;
  volumeInGb: number;
  volumeKey: string;
  volumeMountPath: string;
  dataCenterId: string;
  savingsPlan: SavingsPlanInput,
  cudaVersion: string;
  allowedCudaVersions: string[],
  instanceIds: string[];
  computeType: ComputeType;
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
export interface PodRegistry {
  auth: string;
  pass: string;
  url: string;
  user: string;
  username: string;
}
export interface PodRentInterruptableInput {
  bidPerGpu: number;
  cloudType: "SECURE",
  containerDiskInGb: number;
  countryCode: string;
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
  startJupyter: true,
  startSsh: true,
  stopAfter: string;
  supportPublicIp: false,
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
  syncMachine: true,
  computeType: ComputeType;
}
export interface PodRuntime {
  container: PodRuntimeContainer;
  gpus: PodRuntimeGpus[];
  ports: PodRuntimePorts[];
  uptimeInSeconds: number;
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
export type PodStatus = "CREATED" | "RUNNING" | "RESTARTING" | "EXITED" | "PAUSED" | "DEAD" | "TERMINATED";
export interface PodStopInput {
  podId: string;
  incrementVersion: true
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
export interface PodTerminateInput {
  podId: string;
}
export type PodType = "INTERRUPTABLE" | "RESERVED" | "BID" | "BACKGROUND";
export interface SaveRegistryAuthInput {
  name: string;
  username: string;
  password: string;
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
export interface SavingsPlanInput {
  planLength: string;
  upfrontCost: number;
}
export type Scope = "CSR_ADMIN" | "CSR_IMPERSONATION" | "CSR_READ" | "CSR_WRITE" | "TEAM_ADMIN" | "TEAM_DEV" | "TEAM_BILLING" | "TEAM_BASIC" | "HOST";
export interface Secret {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  lastRetrievedAt: string;
  lastUpdatedAt: string;
}
export interface Specifics {
  stockStatus: string;
  securePrice: number;
  slsPrice: number;
}
export interface SpecificsInput {
  instanceId: string;
  dataCenterId: string;
}
export interface SpendDetails {
  localStoragePerHour: number;
  networkStoragePerHour: number;
  gpuComputePerHour: number;
}
export interface StripeReloadTransaction {
  id: string;
  mediumId: string;
  transactionCompletedAt: string;
  receiptLink: string;
  amount: number;
  medium: TransactionMedium
  type: TransactionType
}
export interface Team {
  id: string;
  name: string;
  owner: User,
  memberships: TeamMembership[],
  membership: TeamMembership,
  members: TeamMembership[],
  invites: TeamInvite[],
  isOwner: false,
  availableRoles: string[]
}
export interface TeamInvite {
  id: number;
  team: TeamInviteTeam,
  role: TeamRole;
  createdAt: string;
  expiresAt: string;
}
export interface TeamInviteOwner {
  email: string;
}
export interface TeamInviteTeam {
  id: string;
  name: string;
  owner: TeamInviteOwner
}
export interface TeamMembership {
  id: number;
  member: User,
  team: Team,
  scopes: {},
  createdAt: string;
  updatedAt: string;
}
export type TeamRole = "owner" | "admin" | "member" | "dev" | "billing" | "basic";
export interface TeamScopes {
  role: string;
}
export type TransactionMedium = "STRIPE" | "CRYPTO" | "RUNPOD" | "COINBASE" | "WIRE" | "REFERRAL";
export type TransactionType = "RELOAD" | "CREDIT" | "DEBIT" | "PAYOUT";
export interface User {
  pods: Pod[];
  machines: Machine[],
  machinesSummary: MachineSummary[],
  id: string,
  authId: string,
  email: string,
  containerRegistryCreds: ContainerRegistryAuth[],
  currentSpendPerHr: number,
  machineQuota: number,
  referralEarned: number,
  signedTermsOfService: boolean,
  spendLimit: number,
  stripeSavedPaymentId: string,
  stripeSavedPaymentLast4: string,
  templateEarned: number,
  multiFactorEnabled: boolean,
  machineEarnings: MachineEarning[],
  machineEarningsCustomRange: MachineEarning[],
  networkStorageEarnings: NetworkStorageEarning[],
  underBalance: boolean,
  minBalance: number,
  stripeAutoReloadAmount: number,
  stripeAutoPaymentThreshold: number,
  spendDetails: SpendDetails,
  maxServerlessConcurrency: number,
  clientLifetimeSpend: number,
  referralId: string,
  datacenters: DataCenter[],
  clientBalance: number,
  hostBalance: number,
  hostStripeLinked: boolean,
  stripeAccountId: string,
  stripeReloadHistory: StripeReloadTransaction[],
  dailyCharges: ClientCreditCharge[],
  referral: UserReferral,
  pubKey: string,
  information: UserInformation,
  notifyPodsStale: boolean,
  notifyPodsGeneral: boolean,
  notifyLowBalance: boolean,
  creditAlertThreshold: number,
  notifyOther: boolean,
  podTemplates: PodTemplate[],
  creditCodes: CreditCode[],
  endpoint: Endpoint,
  endpoints: Endpoint[],
  networkVolumes: NetworkVolume[],
  teams: Team[],
  ownedTeams: Team[],
  team: Team,
  teamMembership: TeamMembership,
  teamScopes: TeamScopes,
  isTeam: boolean,
  savingsPlans: SavingsPlan[],
  serverlessDiscount: Discount,
  billing: UserBilling,
  csrRole: "admin",
  secrets: Secret[],
  impersonations: Impersonation[],
  activeImpersonation: Impersonation,
  apiKeys: ApiKey[]
}
export interface UserBilling {
  gpuCloud: UserGpuCloudBilling[],
  cpuCloud: UserCpuCloudBilling[],
  serverless: UserServerlessBilling[],
  runpodEndpoint: UserRunpodEndpointBilling[],
  storage: UserStorageBilling[],
  summary: UserSummaryBilling[]
}
export interface UserBillingInput {
  granularity: BillingGranualarity
}
export interface UserCpuCloudBilling {
  cpuFlavorId: string;
  time: string;
  timeBilledSeconds: number;
  amount: number;
}
export interface UserGpuCloudBilling {
  gpuTypeId: string;
  time: string;
  timeBilledSeconds: number;
  amount: number;
}
export interface UserInformation {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  countryCode: string;
  companyName: string;
  companyIdentification: string;
  taxIdentification: string;
}
export interface UserMachinesFilter {
  start: number;
  end: number;
}
export interface UserReferral {
  code: string;
  currentMonth: UserReferralMonth
}
export interface UserReferralMonth {
  totalReferrals: number;
  totalSpend: number;
}
export interface UserRunpodEndpointBilling {
  time: string;
  amount: number;
}
export interface UserServerlessBilling {
  time: string;
  amount: number;
  timeBilledSeconds: number;
  endpointId: string;
  gpuTypeId: string;
  instanceId: string;
}
export type UserServerlessBillingGroupBy = "GPU_TYPE" | "ENDPOINT" | "INSTANCE_ID";
export interface UserServerlessBillingInput {
  groupBy: UserServerlessBillingGroupBy
}
export interface UserStorageBilling {
  time: string;
  amount: number;
  diskSpaceBilledGB: number;
  networkStorageDiskSpaceBilledGB: number;
  networkStorageAmount: number;
  gpuDiskSpaceBilledGB: number;
  gpuStorageAmount: number;
  cpuDiskSpaceBilledGB: number;
  cpuStorageAmount: number;
  slsDiskSpaceBilledGB: number;
  slsStorageAmount: number;
}
export interface UserSummaryBilling {
  time: string;
  gpuCloudAmount: number;
  cpuCloudAmount: number;
  serverlessAmount: number;
  storageAmount: number;
  runpodEndpointAmount: number;
}
export interface WebhookRequestStatus {
  time: number;
  responses: number;
}
export interface WebhookRequestsInput {
  granularity: EndpointStatisticGranularity
}
export interface WorkerState {
  time: string;
  initialized: number;
  ready: number;
  running: number;
  throttled: number;
}
export interface WorkerStateInput {
  granularity: EndpointStatisticGranularity
}
export interface backgroundPodTelemetryInput {
  machineId: string;
  gpuIndex: number;
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
export type CountryCode = "AR" | "AT" | "BG" | "CA" | "CZ" | "ES" | "FR" | "IL" | "NL" | "PT" | "SE" | "SK" | "TT" | "US";
export interface ListCpuFlavorsResponse {
  data: {
    countryCodes: CountryCode[],
    dataCenters: DataCenter[],
    cpuFlavors: CpuFlavor[],
  }
}
export interface ListSecureCpuTypes {
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
export interface DeployCpuPodOutput {
  data: {
    deployCpuPod: Partial<Pod>
  }
  // {"data":{"deployCpuPod":{"id":"mv94ietm9k8gdc","imageName":"runpod/base:0.5.1-cpu","env":["PUBLIC_KEY=ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC9cfCdaNGZPo+wL9iQxSLUASnamHp5aDapI6GUCJpvRhHhhI9IsxLWKw8ClyZRy8YqjcjLMzWgc0T/t2paMCCfTyTXyGwt1JwAUTo7/F1MF4P31hrAGDqvDgPpqXHukDdc9ijoJXjDVG+hrYl5EAIC6g5sv6eYdmLk84dnidPRC1sbIX2ui0Eb1W/SEss0UVDb7A0sNKrWdzbslufSL1rW1neYMcCz01aLGLgFiGbwcxdAjlFpBH4eBzfIbT/Y39phuBRfo5xUCnbYQiNZVpPp87TtZxWdGyGUAAv2EzrzKnbFTRVjXPlNt5CGC0dcdqRURsYJqdP0P59RHu1ivUvB RunPod-Key-Go\n\nssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC0ivN65dcURqvZx5ivqiF6RveXEz9TKAf7qphBP4Phr1QKjg8VyJjJRxS2X3KrG/d+HJx/ZYDk0VpNEZinGCYhzStAovczdQ5heKOkPPdin8bvHHetMImQlCRXIbPwINdKcDc4i1xVg1l+fySWP10NWx/WXQEPu+kgZTLyuhqdfum+eeTWgCEuLrALi1ZDCS0juGOxHWehs4B87yYKFWaMNCYQmMmh+5YhztCRrOOUvy2vwqF3sdzkQZOvhUD4GafdSJb9iH1xFrarciDg+/KPgGyVQ1XHyLNOdIIqYMc+rpPf2+fSx4clZGWSd5L1pXp9LYCKVYIB+82Lh9HyfgHJ RunPod-Key-Go","JUPYTER_PASSWORD=lpwk4uvp8lc9nw3wc0h3"],"machineId":"mmadrui2hmum","machine":{"podHostId":"mv94ietm9k8gdc-64411746","__typename":"PodMachineInfo"},"__typename":"Pod"}}}

}


export interface GetUserResponse {
  data: {
    myself: User
  }
}

export type OperationName = "Mutation" | "Query" | "CommunityGpuTypes" | "SecureGpuTypes" | "CpuFlavors" | "getCpuNames" | "SecureCpuTypes" | "getPodTemplate" | "deployCpuPodInput" | "GpuTypes";
export interface JsonRequestBody {
  operationName: OperationName;
  variables?: Record<string, any>;
  query: string;
}
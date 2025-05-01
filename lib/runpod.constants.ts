import { ClientCreditChargeType, CloudTypeEnum, Compliance, ComputeType, CpuFlavorKnown, DataCenterId, GpuTypeId, ScalerType } from "./runpod.graphql.types";

export const CLIENT_CREDIT_CHARGE_TYPE = {
  chargeServerless: "CHARGE_SERVERLESS" as ClientCreditChargeType,
  chargePod: "CHARGE_POD" as ClientCreditChargeType,
  chargeApi: "CHARGE_API" as ClientCreditChargeType,
  chargeStorage: "CHARGE_STORAGE" as ClientCreditChargeType,
  chargeSavingPlan: "CHARGE_SAVINGS_PLAN" as ClientCreditChargeType,
};
export const CLOUD_TYPES = {
  all: "ALL" as CloudTypeEnum,
  community: "COMMUNITY" as CloudTypeEnum,
  secure: "SECURE" as CloudTypeEnum,
}
export const CLOUD_TYPES_SUPPORTED_ON_CREATE_POD = {
  community: "COMMUNITY" as CloudTypeEnum,
  secure: "SECURE" as CloudTypeEnum,
}
export const COMPLIANCE = {
  gdpr: "GDPR" as Compliance,
  iso27001: "ISO_IEC_27001" as Compliance,
  iso14001: "ISO_14001" as Compliance,
  pciDss: "PCI_DSS" as Compliance,
  hitrust: "HITRUST" as Compliance,
  soc1: "SOC_1_TYPE_2" as Compliance,
  soc2: "SOC_2_TYPE_2" as Compliance,
  soc3: "SOC_3_TYPE_2" as Compliance,
  itar: "ITAR" as Compliance,
  fismaHigh: "FISMA_HIGH" as Compliance,
};
export const COMPUTE_TYPE = {
  cpu: "CPU" as ComputeType,
  gpu: "GPU" as ComputeType,
};
// source: https://rest.runpod.io/v1/docs#tag/pods/POST/pods
export const CPU_FLAVOR_IDS = {
  cpu3: {
    compute: "cpu3c" as CpuFlavorKnown,
    general: "cpu3g" as CpuFlavorKnown,
    memory: "cpu3m" as CpuFlavorKnown,
  },
  cpu5: {
    compute: "cpu5c" as CpuFlavorKnown,
    general: "cpu5g" as CpuFlavorKnown,
    memory: "cpu5m" as CpuFlavorKnown,
  }
}
export const DATA_CENTER_IDS = {
  "Camtl1": "CA-MTL-1" as DataCenterId,
  "CaMtl2": "CA-MTL-2" as DataCenterId,
  "CaMtl3": "CA-MTL-3" as DataCenterId,
  "EuCz1": "EU-CZ-1" as DataCenterId,
  "EuFr1": "EU-FR-1" as DataCenterId,
  "EuNl1": "EU-NL-1" as DataCenterId,
  "EurIs1": "EUR-IS-1" as DataCenterId,
  "EurIs2": "EUR-IS-2" as DataCenterId,
  "EurIs3": "EUR-IS-3" as DataCenterId,
  "EurNo1": "EUR-NO-1" as DataCenterId,
  "EuRo1": "EU-RO-1" as DataCenterId,
  "EuSe1": "EU-SE-1" as DataCenterId,
  "OcAu1": "OC-AU-1" as DataCenterId,
  "UsCa2": "US-CA-2" as DataCenterId,
  "UsDe1": "US-DE-1" as DataCenterId,
  "UsGa2": "US-GA-2" as DataCenterId,
  "UsIl1": "US-IL-1" as DataCenterId,
  "UsKs1": "US-KS-1" as DataCenterId,
  "UsKs2": "US-KS-2" as DataCenterId,
  "UsKs3": "US-KS-3" as DataCenterId,
  "UsNc1": "US-NC-1" as DataCenterId,
  "UsTx1": "US-TX-1" as DataCenterId,
  "UsTx2": "US-TX-2" as DataCenterId,
  "UsTx3": "US-TX-3" as DataCenterId,
  "UsTx4": "US-TX-4" as DataCenterId,
};
export const GPU_TYPE_IDS = {
  amd: {
    mi300x: "AMD Instinct MI300X OAM" as GpuTypeId,
  },
  nvidia: {
    "4090": "NVIDIA GeForce RTX 4090" as GpuTypeId,
    "A5000": "NVIDIA RTX A5000" as GpuTypeId,
    "A40": "NVIDIA A40" as GpuTypeId,
    "3090": "NVIDIA GeForce RTX 3090" as GpuTypeId,
    "A6000": "NVIDIA RTX A6000" as GpuTypeId,
    "A4000": "NVIDIA RTX A4000" as GpuTypeId,
    "A4500": "NVIDIA RTX A4500" as GpuTypeId,
    "A100 80GB PCIe": "NVIDIA A100 80GB PCIe" as GpuTypeId,
    "L4": "NVIDIA L4" as GpuTypeId,
    "4000 Ada Generation": "NVIDIA RTX 4000 Ada Generation" as GpuTypeId,
    "A100-SXM4-80GB": "NVIDIA A100-SXM4-80GB" as GpuTypeId,
    "6000 Ada Generation": "NVIDIA RTX 6000 Ada Generation" as GpuTypeId,
    "H100 80GB HBM3": "NVIDIA H100 80GB HBM3" as GpuTypeId,
    "L40S": "NVIDIA L40S" as GpuTypeId,
    "L40": "NVIDIA L40" as GpuTypeId,
    "H100 PCIe": "NVIDIA H100 PCIe" as GpuTypeId,
    "2000 Ada Generation": "NVIDIA RTX 2000 Ada Generation" as GpuTypeId,
    "3080 Ti": "NVIDIA GeForce RTX 3080 Ti" as GpuTypeId,
    "H100 NVL": "NVIDIA H100 NVL" as GpuTypeId,
    "3080": "NVIDIA GeForce RTX 3080" as GpuTypeId,
    "3070": "NVIDIA GeForce RTX 3070" as GpuTypeId,
    "A2000": "NVIDIA RTX A2000" as GpuTypeId,
    "A30": "NVIDIA A30" as GpuTypeId,
    "H200": "NVIDIA H200" as GpuTypeId,
    "4080": "NVIDIA GeForce RTX 4080" as GpuTypeId,
    "4070 Ti": "NVIDIA GeForce RTX 4070 Ti" as GpuTypeId,
    "5000 Ada Generation": "NVIDIA RTX 5000 Ada Generation" as GpuTypeId,
    "3090 Ti": "NVIDIA GeForce RTX 3090 Ti" as GpuTypeId,
    "4000 SFF Ada Generation": "NVIDIA RTX 4000 SFF Ada Generation" as GpuTypeId,
    "4080 SUPER": "NVIDIA GeForce RTX 4080 SUPER" as GpuTypeId,
    "A100-SXM4-40GB": "NVIDIA A100-SXM4-40GB" as GpuTypeId,
    "5080": "NVIDIA GeForce RTX 5080" as GpuTypeId,
    "5090": "NVIDIA GeForce RTX 5090" as GpuTypeId,
  },
  tesla: {
    "V100-SXM2-32GB": "Tesla V100-SXM2-32GB" as GpuTypeId,
    "V100-SXM2-16GB": "Tesla V100-SXM2-16GB" as GpuTypeId,
    "V100-PCIE-16GB": "Tesla V100-PCIE-16GB" as GpuTypeId,
    "V100-FHHL-16GB": "Tesla V100-FHHL-16GB" as GpuTypeId,
  }
};
export const SCALER_TYPE = {
  queueDelay: "QUEUE_DELAY" as ScalerType,
  requestCount: "REQUEST_COUNT" as ScalerType,
};
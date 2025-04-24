import { readFileSync } from "node:fs";
import { CpuFlavor, DataCenter, GpuType } from "./runpod.types";
import assert from "node:assert";

const apiKey = readFileSync(`../../.env.api.key`, { encoding: `utf-8` });
(async function () {
  const response = await fetch(
    `https://api.runpod.io/graphql?api_key=${apiKey}`,
    {
      headers: { "content-type": `application/json` },
      method: `POST`,
      body: JSON.stringify({
        query: `
query {
  dataCenters { id name listed location compliance gpuAvailability { id available stockStatus gpuTypeId gpuTypeDisplayName displayName } }
  gpuTypes { 
    maxGpuCount
    maxGpuCountCommunityCloud
    maxGpuCountSecureCloud
    minPodGpuCount
    id
    displayName
    manufacturer
    memoryInGb
    cudaCores
    secureCloud
    communityCloud
    securePrice
    communityPrice
    oneMonthPrice
    threeMonthPrice
    sixMonthPrice
    oneWeekPrice
    communitySpotPrice
    secureSpotPrice
   }
}
`}),
    });
  const data = await response.json() as { data: { dataCenters: DataCenter[], cpuFlavors: CpuFlavor[], gpuTypes: GpuType[] } };
  console.log(JSON.stringify(data));
  assert(data.data);
  const dataCenterId = "EU-SE-1";
  const ramThreshold = 30;
  console.log(`List available GPUs from cheapest`);
  console.log(`data center:`, dataCenterId);
  const dataCenter = data.data.dataCenters.find(d => d.id === dataCenterId);
  console.log(`data center`, !!dataCenter ? `found` : `not found`);
  const availableGpus = dataCenter?.gpuAvailability || [];
  console.log(`available GPUs in datacenter:`, availableGpus.length);
  const availablePricedGpus = availableGpus
    .map(a => ({ ...a, ...(data.data.gpuTypes.find(g => a.id === g.id)) }))
    .filter(g => (g.memoryInGb || 0) > ramThreshold)
    .sort((a, b) => (a.securePrice || 999) - (b.securePrice || 999))
  console.log(JSON.stringify(availablePricedGpus));
  console.log(`GPU to use on datacenter ${dataCenterId}, RAM > ${ramThreshold}\n${availablePricedGpus.map(g => `- ${g.id}, RAM: ${g.memoryInGb}, $: ${g.securePrice}, availability: ${g.stockStatus}`).join(`\n`)}`)

  //       body: JSON.stringify({
  //         query: `
  // query {
  //   dataCenters { id name listed gpuAvailability { id available stockStatus gpuTypeId gpuTypeDisplayName displayName } }
  // }
  // `}),
  //   });
  // const data = await response.json() as { data: { dataCenters: DataCenter[] } };
  // console.log(JSON.stringify(data));
  // assert(data.data)
  // console.log(JSON.stringify(data.data.dataCenters.find(d => d.name === "EU-SE-1")));
})();
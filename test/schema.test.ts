import { readFileSync } from "node:fs";
import assert from "node:assert";

const apiKey = readFileSync(`../.env.api.key`, { encoding: `utf-8` });
(async function () {
  const response = await fetch(
    `https://api.runpod.io/graphql`,
    {
      headers: { "content-type": `application/json` },
      method: `POST`,
      body: JSON.stringify({
        query: `query{ 
dataCenters { id gpuAvailability { stockStatus gpuTypeId id } } 
cpuFlavors {id groupId groupName minVcpu ramMultiplier} 
cpuTypes {id displayName cores threadsPerCore groupId }
gpuTypes { id memoryInGb secureCloud securePrice }
countryCodes
}`
      }),
    });
  const data = await response.json();
  console.log(JSON.stringify(data));
})();
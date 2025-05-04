import { readFileSync } from "node:fs";
import assert from "node:assert";
import { test, suite } from "node:test";
import path from "node:path";

let dirPath = ``;
try {
  dirPath = __dirname;
  console.log(`commonJS`);
} catch (error){
  console.log(`Not commonJS`);
}
try {
  dirPath = path.dirname(import.meta.filename);
  console.log(`module`);
} catch (error){
  console.log(`Not module`);
}

/**
 * The API key needs write permissions on GraphQL
 */
const apiKey = readFileSync(path.resolve(dirPath, `../.env.api.key`), { encoding: `utf-8` });

suite(`GraphQL Schema manual validation`, () => {

  test(`Partial myself validation`, async () =>{

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
        // console.log(JSON.stringify(data));
        assert(Array.isArray(data.data?.dataCenters));
        assert(Array.isArray(data.data?.cpuFlavors));
        assert(Array.isArray(data.data?.cpuTypes));
        assert(Array.isArray(data.data?.gpuTypes));
        assert(Array.isArray(data.data?.countryCodes));
      });
});
import { before, beforeEach, suite, test } from "node:test";
import assert from "node:assert";
import { optionsToString, RunpodApi } from "./runpod";
import { readFileSync } from "node:fs";
import { sampleFlavorIds, sampleGpuTypes, sampleSpecificsIds } from "./sampleValues";
import { PodFindAndDeployOnDemandInput, SpecificsInput } from "./runpod.types";

/**
 * The API key needs write permissions on GraphQL
 */
const apiKey = readFileSync(`.env.api.key`, { encoding: `utf-8` });

const testPodTemplateId = ``; // only checked if provided
const createPod = true;
let testPodId = ``; // will be stopped and terminated if supplied.

suite(`runpod`, () => {
  suite(`optionsToString`, () => {
    test(`not object`, () => {
      assert.strictEqual(
        optionsToString(
          "abc"
        ),
        "abc"
      );
    });

    test(`object of primitives`, () => {
      assert.strictEqual(
        optionsToString(
          { a: "a", b: 2, c: true }
        ),
        `{ a: "a", b: 2, c: "true" }`
      );
    });

    test(`array`, () => {
      assert.strictEqual(
        optionsToString(
          [{ a: "a", b: 2, c: true }, { a: "aa" }]
        ),
        `[{ a: "a", b: 2, c: "true" }, { a: "aa" }]`
      );
    });
    test(`nested objects`, () => {
      assert.strictEqual(
        optionsToString(
          { one: { two: { three: 3 } } }
        ),
        `{ one: { two: { three: 3 } } }`
      );
    });
  });

    let runpodApi: RunpodApi;
    beforeEach(() => {
      runpodApi = new RunpodApi({ apiKey });
    });
    test(`list endpoints`, async () => {
      const response = await runpodApi.endpointsList();
      assert(!!response.data);
      assert(!!response.data.myself);
      assert(Array.isArray(response.data.myself.endpoints));
      assert(response.data.myself.endpoints.length > 0);
    });

    test(`list gpus`, async () => {
      const response = await runpodApi.gpuList();
      assert(!!response.data);
      assert(Array.isArray(response.data.gpuTypes));
      assert(response.data.gpuTypes.length > 0);
    });

    test(`list community gpus`, async () => {
      const response = await runpodApi.gpuCommunityTypeList(
        sampleGpuTypes[1],
      );
      assert(!!response.data);
      assert(Array.isArray(response.data.gpuTypes));
      assert(response.data.gpuTypes.length > 0);
    });

    test.skip(`list secure gpus`, async () => {
      const response = await runpodApi.gpuSecureTypeList(sampleGpuTypes[0]);
      assert(Array.isArray(response.data.gpuTypes));
      assert(response.data.gpuTypes.length > 0);
      // console.log(response.data.gpuTypes);
    });

    test(`list templates`, async () => {
      const response = await runpodApi.templatesList();
      assert(!!response.data);
      assert(!!response.data.myself);
      assert(Array.isArray(response.data.myself.podTemplates));
      assert(response.data.myself.podTemplates.length > 0);
      if (testPodTemplateId)
        console.log(response.data.myself.podTemplates.find(tpl => tpl.id === testPodTemplateId));
    });

    test(`list cpu flavors`, async () => {
      const response = await runpodApi.cpuFlavorsList();
      assert(!!response.data);

      assert(!!response.data.countryCodes);
      assert(Array.isArray(response.data.countryCodes));
      assert(response.data.countryCodes.length > 0);

      assert(!!response.data.dataCenters);
      assert(Array.isArray(response.data.dataCenters));
      assert(response.data.dataCenters.length > 0);

      assert(!!response.data.cpuFlavors);
      assert(Array.isArray(response.data.cpuFlavors));
      assert(response.data.cpuFlavors.length > 0);
    });

    test(`list secure cpus`, async () => {
      const response = await runpodApi.cpuSecureTypesList(
        sampleFlavorIds[0]
      );
      assert(!!response.data);

      assert(!!response.data.cpuFlavors);
      assert(Array.isArray(response.data.cpuFlavors));
      assert(response.data.cpuFlavors.length > 0);
    });

    test(`list cpu names`, async () => {
      const response = await runpodApi.cpuNamesList();
      assert(!!response.data);

      assert(!!response.data.cpuFlavors);
      assert(Array.isArray(response.data.cpuFlavors));
      assert(response.data.cpuFlavors.length > 0);
    });

    test(`extended gpu list`, async () => {
      const response = await runpodApi.gpuExtendedList();
      assert(!!response.data);

      assert(!!response.data.countryCodes);
      assert(Array.isArray(response.data.countryCodes));
      assert(response.data.countryCodes.length > 0);

      assert(!!response.data.dataCenters);
      assert(Array.isArray(response.data.dataCenters));
      assert(response.data.dataCenters.length > 0);

      assert(!!response.data.gpuTypes);
      assert(Array.isArray(response.data.gpuTypes));
      assert(response.data.gpuTypes.length > 0);
    });

  suite(`pods`, () => {
    let runpodApi: RunpodApi;
    before(() => {
      runpodApi = new RunpodApi({ apiKey });
    });

    if (createPod) {
      suite(`deploy cpu pod`, () => {
        let podId = "";
        const cpuPodDeployOptions : Partial<PodFindAndDeployOnDemandInput>&Partial<SpecificsInput> = {

        };
        before(async () => {
          {
            const response = await runpodApi.cpuFlavorsList();
            console.log("cpu flavor list", JSON.stringify(response));
            cpuPodDeployOptions.dataCenterId = response.data.dataCenters.find(d => d.name === "EU-SE-1")?.id;
          }
          {
            const response = await runpodApi.cpuSecureTypesList("cpu3c");
            console.log("gpu extended list", JSON.stringify(response));
            // cpuPodDeployOptions.dataCenterId = response.data.dataCenters.find(d => d.name === "EU-SE-1")?.id;
            // cpuPodDeployOptions.instanceId = response.data.cpuFlavors[0]
          }
        });

      //   test(`deploy cpu pod`, async () => {
      //     const response = await runpodApi.podCreate({});
      //     console.log("response", JSON.stringify(response));
      //     assert(!!response.data);
      //     assert(!!response.data.podFindAndDeployOnDemand);
      //     assert(!!response.data.podFindAndDeployOnDemand.id);
      //     podId = response.data.podFindAndDeployOnDemand.id;
      //   });
      //   test(`get cpu pod`, async () => {
      //     const response = await runpodApi.podGet(podId);
      //     console.log("response", JSON.stringify(response));
      //     assert(!!response.data);
      //     assert(!!response.data.pod);
      //     assert.strictEqual(response.data.pod.id, podId);
      //   });
      //   test(`stop cpu pod`, async () => {
      //     const response = await runpodApi.podStop(podId);
      //     console.log("response", JSON.stringify(response));
      //     assert(!!response.data);
      //     assert(!!response.data.podStop);
      //   });
      //   test(`terminate cpu pod`, async () => {
      //     const response = await runpodApi.podTerminate(podId);
      //     console.log("response", JSON.stringify(response));
      //     assert(!!response.data);
      //     assert.strictEqual(response.data.podTerminate, null);
      //   });
      // });
      // suite(`deploy gpu pod`, () => {
      //   let podId = "";
      //   test(`deploy gpu pod`, async () => {
      //     const response = await runpodApi.podCreate({});
      //     console.log("response", JSON.stringify(response));
      //     assert(!!response.data);
      //     assert(!!response.data.podFindAndDeployOnDemand);
      //     assert(!!response.data.podFindAndDeployOnDemand.id);
      //     podId = response.data.podFindAndDeployOnDemand.id;
      //   });
      //   test(`get gpu pod`, async () => {
      //     const response = await runpodApi.podGet(podId);
      //     console.log("response", JSON.stringify(response));
      //     assert(!!response.data);
      //     assert(!!response.data.pod);
      //     assert.strictEqual(response.data.pod.id, podId);
      //   });
      //   test(`stop gpu pod`, async () => {
      //     const response = await runpodApi.podStop(podId);
      //     console.log("response", JSON.stringify(response));
      //     assert(!!response.data);
      //     assert(!!response.data.podStop);
      //   });
      //   test(`terminate gpu pod`, async () => {
      //     const response = await runpodApi.podTerminate(podId);
      //     console.log("response", JSON.stringify(response));
      //     assert(!!response.data);
      //     assert.strictEqual(response.data.podTerminate, null);
      //   });
      // });
      // suite(`deploy pod with volume`, () => {
        // let podId = "";
        // test(`deploy pod with volume`, async () => {
        //   const response = await runpodApi.podCreate({});
        //   console.log("response", JSON.stringify(response));
        //   assert(!!response.data);
        //   assert(!!response.data.podFindAndDeployOnDemand);
        //   assert(!!response.data.podFindAndDeployOnDemand.id);
        //   podId = response.data.podFindAndDeployOnDemand.id;
        // });
        // test(`get pod with volume`, async () => {
        //   const response = await runpodApi.podGet(podId);
        //   console.log("response", JSON.stringify(response));
        //   assert(!!response.data);
        //   assert(!!response.data.pod);
        //   assert.strictEqual(response.data.pod.id, podId);
        // });
        // test(`stop pod with volume`, async () => {
        //   const response = await runpodApi.podStop(podId);
        //   console.log("response", JSON.stringify(response));
        //   assert(!!response.data);
        //   assert(!!response.data.podStop);
        // });
        // test(`terminate pod with volume`, async () => {
        //   const response = await runpodApi.podTerminate(podId);
        //   console.log("response", JSON.stringify(response));
        //   assert(!!response.data);
        //   assert.strictEqual(response.data.podTerminate, null);
        // });
      });
    }

    if (testPodId) {
      suite(`test pod`, () => {
        test(`get test pod`, async () => {
          const response = await runpodApi.podGet(testPodId);
          // console.log("response", JSON.stringify(response));
          assert(!!response.data);
          assert(!!response.data.pod);
          assert.strictEqual(response.data.pod.id, testPodId);
        });

        test(`list templates direct method call`, async () => {
          const response = await runpodApi.podStop(testPodId);
          // console.log("response", JSON.stringify(response));
          assert(!!response.data);
          assert(!!response.data.podStop);
        });

        test(`terminate test pod`, async () => {
          const response = await runpodApi.podTerminate(testPodId);
          // console.log("response", JSON.stringify(response));
          assert(!!response.data);
          assert.strictEqual(response.data.podTerminate, null);
        });
      });
    }
  });
});
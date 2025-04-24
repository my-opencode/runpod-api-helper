import { before, beforeEach, suite, test } from "node:test";
import assert from "node:assert";
import { optionsToString, RunpodApi } from "./runpod";
import { readFileSync } from "node:fs";
import { sampleFlavorIds, sampleGpuTypes, sampleSpecificsIds } from "./sampleValues";
import { CreatePodResponse, DeployCpuPodOutput, PodFindAndDeployOnDemandInput, SpecificsInput } from "./runpod.types";
import { CPU_FLAVOR_IDS, DATA_CENTER_IDS, GPU_TYPE_IDS } from "./runpod.constants";

/**
 * The API key needs write permissions on GraphQL
 */
const apiKey = readFileSync(`../../.env.api.key`, { encoding: `utf-8` });

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

  // ENDPOINTS
  test(`list endpoints`, async () => {
    const response = await runpodApi.endpointsList();
    assert(!!response.data);
    assert(!!response.data.myself);
    assert(Array.isArray(response.data.myself.endpoints));
    assert(response.data.myself.endpoints.length > 0);
  });

  // GPUs
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

  test(`available gpu list`, async () => {
    const response = await runpodApi.gpuAvailabilityList(DATA_CENTER_IDS.Euse1);
    console.log(JSON.stringify(response));
    assert(!!response.data);

    assert(!!response.data.dataCenters);
    assert(Array.isArray(response.data.dataCenters));
    assert(response.data.dataCenters.length > 0);

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

  // TEMPLATES
  test(`list templates`, async () => {
    const response = await runpodApi.templatesList();
    assert(!!response.data);
    assert(!!response.data.myself);
    assert(Array.isArray(response.data.myself.podTemplates));
    assert(response.data.myself.podTemplates.length > 0);
    if (testPodTemplateId)
      console.log(response.data.myself.podTemplates.find(tpl => tpl.id === testPodTemplateId));
  });

  // CPUs
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

  // PODS
  suite(`pods`, () => {
    let runpodApi: RunpodApi;
    before(() => {
      runpodApi = new RunpodApi({ apiKey });
    });

    if (createPod) {
      suite(`cpu pod`, () => {
        let podId = "";
        let deployResponse: DeployCpuPodOutput;

        before(async () => {
          {
            deployResponse = await runpodApi.podDeployCpu({
              instanceId: `cpu3c-2-4`,
              name: `runpod-api-helper-test-pod`,
            });
            assert(!!deployResponse.data);
            assert(!!deployResponse.data.deployCpuPod);
            assert(!!deployResponse.data.deployCpuPod.id);
            podId = deployResponse.data.deployCpuPod.id;
          }
        });

        test(`deploy cpu pod`, async () => {
          // console.log("response", JSON.stringify(response));
          assert(podId);
        });
        test(`get cpu pod`, async () => {
          assert(podId);
          const response = await runpodApi.podGet(podId);
          console.log("response", JSON.stringify(response));
          assert(!!response.data);
          assert(!!response.data.pod);
          assert.strictEqual(response.data.pod.id, podId);
        });
        test(`stop cpu pod`, async () => {
          assert(podId);
          const response = await runpodApi.podStop(podId);
          console.log("response", JSON.stringify(response));
          assert(!!response.data);
          assert(!!response.data.podStop);
        });
        test(`terminate cpu pod`, async () => {
          assert(podId);
          const response = await runpodApi.podTerminate(podId);
          console.log("response", JSON.stringify(response));
          assert(!!response.data);
          assert.strictEqual(response.data.podTerminate, null);
        });
      });
      suite.skip(`gpu pod`, () => {
        let podId = "";
        let deployResponse: CreatePodResponse;

        before(async () => {
          {

          }
          {
            deployResponse = await runpodApi.podDeployGpu({
              gpuTypeId: GPU_TYPE_IDS.nvidia.A40,
              name: `runpod-api-helper-test-pod`,
              dataCenterId: DATA_CENTER_IDS.Euse1,
            });
            console.log("response", JSON.stringify(deployResponse));
            assert(!!deployResponse.data);
            assert(!!deployResponse.data.podFindAndDeployOnDemand);
            assert(!!deployResponse.data.podFindAndDeployOnDemand.id);
            podId = deployResponse.data.podFindAndDeployOnDemand.id;
          }
        });

        test(`deploy gpu pod`, async () => {
          assert(podId);
        });
        test(`get gpu pod`, async () => {
          assert(podId);
          const response = await runpodApi.podGet(podId);
          console.log("response", JSON.stringify(response));
          assert(!!response.data);
          assert(!!response.data.pod);
          assert.strictEqual(response.data.pod.id, podId);
        });
        test.skip(`stop gpu pod`, async () => {
          assert(podId);
          const response = await runpodApi.podStop(podId);
          console.log("response", JSON.stringify(response));
          assert(!!response.data);
          assert(!!response.data.podStop);
        });
        test.skip(`terminate gpu pod`, async () => {
          assert(podId);
          const response = await runpodApi.podTerminate(podId);
          console.log("response", JSON.stringify(response));
          assert(!!response.data);
          assert.strictEqual(response.data.podTerminate, null);
        });
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
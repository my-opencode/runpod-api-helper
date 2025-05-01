import { before, beforeEach, suite, test } from "node:test";
import assert from "node:assert";
import { RunpodApi } from "../runpod";
import { readFileSync } from "node:fs";
import { sampleFlavorIds } from "./sampleValues";
import { CPU_FLAVOR_IDS, DATA_CENTER_IDS, GPU_TYPE_IDS } from "../lib/runpod.constants";
import { optionsToString } from "../lib/utilities";
import { CreatePodResponse, DeployCpuPodResponse } from "../lib/runpod.responses.type";
import { GpuTypeId } from "../lib/runpod.graphql.types";

/**
 * The API key needs write permissions on GraphQL
 */
const apiKey = readFileSync(`../.env.api.key`, { encoding: `utf-8` });

const testPodTemplateId = ``; // only checked if provided
const testVolumeId = ``;
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
    const response = await runpodApi.endpoints.list();
    assert(!!response.data);
    assert(!!response.data.myself);
    assert(Array.isArray(response.data.myself.endpoints));
    assert(response.data.myself.endpoints.length > 0);
  });

  // TEMPLATES
  test(`list templates`, async () => {
    const response = await runpodApi.info.templates.list();
    // console.log(JSON.stringify(response));
    assert(!!response.data);
    assert(!!response.data.myself);
    assert(Array.isArray(response.data.myself.podTemplates));
    assert(response.data.myself.podTemplates.length > 0);
    if (testPodTemplateId)
      console.log(response.data.myself.podTemplates.find(tpl => tpl.id === testPodTemplateId));
  });
  // DATACENTERS
  test(`list datacenters`, async () => {
    const response = await runpodApi.info.dataCenters.list();
    assert(!!response.data.dataCenters);
    assert(Array.isArray(response.data.dataCenters));
    assert(response.data.dataCenters.length > 0);
  });
  // COUNTRY CODES
  test(`list country codes`, async () => {
    const response = await runpodApi.info.countryCodes.list();
    assert(!!response.data.countryCodes);
    assert(Array.isArray(response.data.countryCodes));
    assert(response.data.countryCodes.length > 0);
  });

  // GPUs
  test(`list gpus`, async () => {
    const response = await runpodApi.info.gpu.list();
    // console.log(JSON.stringify(response));
    assert(!!response.data);
    assert(Array.isArray(response.data.gpuTypes));
    assert(response.data.gpuTypes.length > 0);
  });

  test(`list community gpus`, async () => {
    const response = await runpodApi.info.gpu.listCommunity(
      GPU_TYPE_IDS.nvidia.A40
    );
    assert(!!response.data);
    assert(Array.isArray(response.data.gpuTypes));
    assert(response.data.gpuTypes.length > 0);
  });

  test.skip(`list secure gpus`, async () => {
    const response = await runpodApi.info.gpu.listSecure(
      GPU_TYPE_IDS.nvidia.A40
    );
    assert(Array.isArray(response.data.gpuTypes));
    assert(response.data.gpuTypes.length > 0);
    // console.log(response.data.gpuTypes);
  });

  test(`available gpu list`, async () => {
    const response = await runpodApi.info.gpu.listAvailable(DATA_CENTER_IDS.EuSe1);
    console.log(JSON.stringify(response));
    assert(!!response.data);
    assert(!!response.data.availableGpus);
    assert(Array.isArray(response.data.availableGpus));
    assert(response.data.availableGpus.length > 0);
  });

  // CPUs
  test(`list cpu flavors`, async () => {
    const response = await runpodApi.info.cpu.listFlavors();
    assert(!!response.data);

    assert(!!response.data.cpuFlavors);
    assert(Array.isArray(response.data.cpuFlavors));
    assert(response.data.cpuFlavors.length > 0);
  });

  test(`list secure cpus`, async () => {
    const response = await runpodApi.info.cpu.listSecure(
      sampleFlavorIds[0]
    );
    assert(!!response.data);

    assert(!!response.data.cpuFlavors);
    assert(Array.isArray(response.data.cpuFlavors));
    assert(response.data.cpuFlavors.length > 0);
  });

  test(`list cpu names`, async () => {
    const response = await runpodApi.info.cpu.listNames();
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
      suite.skip(`cpu pod`, () => {
        let podId = "";
        let deployResponse: DeployCpuPodResponse;

        before(async () => {
          {
            deployResponse = await runpodApi.pods.createCpu({
              instanceId: CPU_FLAVOR_IDS.cpu3.compute + `-2-4`, // use enum
              name: `runpod-api-helper-test-pod-cpu`,
              dockerArgs: ""
            });
            console.log(JSON.stringify(deployResponse));
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
          const response = await runpodApi.pods.get(podId);
          console.log("response", JSON.stringify(response));
          assert(!!response.data);
          assert(!!response.data.pod);
          assert.strictEqual(response.data.pod.id, podId);
        });
        test(`stop cpu pod`, async () => {
          assert(podId);
          const response = await runpodApi.pods.stop(podId);
          console.log("response", JSON.stringify(response));
          assert(!!response.data);
          assert(!!response.data.podStop);
        });
        test(`terminate cpu pod`, async () => {
          assert(podId);
          const response = await runpodApi.pods.delete(podId);
          console.log("response", JSON.stringify(response));
          assert(!!response.data);
          assert.strictEqual(response.data.podTerminate, null);
        });
      });
      suite.skip(`gpu pod`, () => {
        let podId = "";
        let deployResponse: CreatePodResponse;

        before(async () => {
          const availableGpus = (await runpodApi.info.gpu.listAvailable(DATA_CENTER_IDS.EuSe1)).data.availableGpus;
          {
            deployResponse = await runpodApi.pods.createGpu({
              gpuTypeId: availableGpus[0].gpuTypeId as GpuTypeId,
              name: `runpod-api-helper-test-pod-gpu`,
              dataCenterId: DATA_CENTER_IDS.EuSe1,
              containerDiskInGb: 50,
              deployCost: availableGpus[0].securePrice,
              imageName: "runpod/stable-diffusion:comfy-ui-6.0.0",
              volumeInGb: 0,
              volumeMountPath: "",
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
          const response = await runpodApi.pods.get(podId);
          console.log("response", JSON.stringify(response));
          assert(!!response.data);
          assert(!!response.data.pod);
          assert.strictEqual(response.data.pod.id, podId);
        });
        test(`stop gpu pod`, async () => {
          assert(podId);
          const response = await runpodApi.pods.stop(podId);
          console.log("response", JSON.stringify(response));
          assert(!!response.data);
          assert(!!response.data.podStop);
        });
        test(`terminate gpu pod`, async () => {
          assert(podId);
          const response = await runpodApi.pods.delete(podId);
          console.log("response", JSON.stringify(response));
          assert(!!response.data);
          assert.strictEqual(response.data.podTerminate, null);
        });
      });
    }
    if (createPod && testVolumeId) {
      suite(`cpu pod with volume`, () => {
        let podId = "";
        let deployResponse: DeployCpuPodResponse;

        before(async () => {
          {
            deployResponse = await runpodApi.pods.createCpu({
              instanceId: CPU_FLAVOR_IDS.cpu3.compute + `-2-4`, // use enum
              name: `runpod-api-helper-test-pod-cpu-volume`,
              dockerArgs: "",
              networkVolumeId: testVolumeId,
            });
            console.log(JSON.stringify(deployResponse));
            assert(!!deployResponse.data);
            assert(!!deployResponse.data.deployCpuPod);
            assert(!!deployResponse.data.deployCpuPod.id);
            podId = deployResponse.data.deployCpuPod.id;
          }
        });

        test(`deploy cpu pod with volume`, async () => {
          // console.log("response", JSON.stringify(response));
          assert(podId);
        });
        test(`get cpu pod with volume`, async () => {
          assert(podId);
          const response = await runpodApi.pods.get(podId);
          console.log("response", JSON.stringify(response));
          assert(!!response.data);
          assert(!!response.data.pod);
          assert.strictEqual(response.data.pod.id, podId);
          assert.strictEqual(response.data.pod.networkVolumeId, testVolumeId);
        });
        test(`stop cpu pod with volume`, async () => {
          assert(podId);
          const response = await runpodApi.pods.stop(podId);
          console.log("response", JSON.stringify(response));
          assert(!!response.data);
          assert(!!response.data.podStop);
        });
        test(`terminate cpu pod with volume`, async () => {
          assert(podId);
          const response = await runpodApi.pods.delete(podId);
          console.log("response", JSON.stringify(response));
          assert(!!response.data);
          assert.strictEqual(response.data.podTerminate, null);
        });
      });
    }

    if (testPodId) {
      suite(`test pod`, () => {
        test(`get test pod`, async () => {
          const response = await runpodApi.pods.get(testPodId);
          // console.log("response", JSON.stringify(response));
          assert(!!response.data);
          assert(!!response.data.pod);
          assert.strictEqual(response.data.pod.id, testPodId);
        });

        test(`list templates direct method call`, async () => {
          const response = await runpodApi.pods.stop(testPodId);
          // console.log("response", JSON.stringify(response));
          assert(!!response.data);
          assert(!!response.data.podStop);
        });

        test(`terminate test pod`, async () => {
          const response = await runpodApi.pods.delete(testPodId);
          // console.log("response", JSON.stringify(response));
          assert(!!response.data);
          assert.strictEqual(response.data.podTerminate, null);
        });
      });
    }
  });
});
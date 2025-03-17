import { before, beforeEach, suite, test } from "node:test";
import assert from "node:assert";
import { optionsToString, RunpodApi } from "./runpod";
import { readFileSync } from "node:fs";

const apiKey = readFileSync(`.env.api.key`, { encoding: `utf-8` });

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

  suite(`list endpoints`, () => {
    let runpodApi: RunpodApi;
    beforeEach(() => {
      runpodApi = new RunpodApi({ apiKey });
    });
    test(`list endpoints direct method call`, async () => {
      const response = await runpodApi.endpointsList();
      assert(!!response.data);
      assert(!!response.data.myself);
      assert(Array.isArray(response.data.myself.endpoints));
      assert(response.data.myself.endpoints.length > 0);
      // console.log(response.data.myself.endpoints);
    });
    // test(`list endpoints from nested object`, async () => {
    //   const response = await runpodApi.endpoints.list();
    //   assert(!!response.data);
    //   assert(!!response.data.myself);
    //   assert(Array.isArray(response.data.myself.endpoints));
    //   assert(response.data.myself.endpoints.length > 0);
    //   console.log(response.data.myself.endpoints);
    // });
  });
  suite(`list gpus`, () => {
    let runpodApi: RunpodApi;
    beforeEach(() => {
      runpodApi = new RunpodApi({ apiKey });
    });
    test(`list gpus direct method call`, async () => {
      const response = await runpodApi.gpuList();
      assert(!!response.data);
      assert(Array.isArray(response.data.gpuTypes));
      assert(response.data.gpuTypes.length > 0);
      // console.log(response.data.gpuTypes);
    });
    // test(`list gpus from nested object`, async () => {
    //   const response = await runpodApi.gpus.list();
    //   assert(!!response.data);
    //   assert(Array.isArray(response.data.gpuTypes));
    //   assert(response.data.gpuTypes.length > 0);
    //   console.log(response.data.gpuTypes);
    // });
  });
});
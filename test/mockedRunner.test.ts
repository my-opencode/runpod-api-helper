import { after, before, beforeEach, mock, suite, test } from "node:test";
const querryRunnerMock = mock.fn(() => Promise.resolve({ data: {} }));
mock.module("lib/queryRunner", {
  namedExports: {
    runRunpodGraphqlQuery: querryRunnerMock
  }
});
import assert from "node:assert";


suite(`verb methods should call query runner`, () => {
  let RunpodApi:any;
  before(async () => {
    ({RunpodApi} = await import("../runpod"));
  });
  after(() => {
    mock.restoreAll();
  });

  test(`info.dataCenters`, async (t) => {
    querryRunnerMock.mock.mockImplementation(() => Promise.resolve({ data: { dataCenters: [{ mocked: true }] } }));
    const runpodApi = new RunpodApi({ apiKey: `not a key` });
    const response = await runpodApi.info.dataCenters.list();
    // console.log("Response:", JSON.stringify(response));
    assert.strictEqual(querryRunnerMock.mock.callCount(),1);
    assert.strictEqual(response.data?.dataCenters?.[0]?.mocked, true);
  });
});

import { JsonRequestBody } from "./runpod.request.type";
import { withError } from "./utilities";

const jsonHeader = { "content-type": `application/json` };

export async function runRunpodGraphqlQuery(apiKey: string, queryOrPayload: string | JsonRequestBody, actionDescription: string) {
  const body = JSON.stringify(
    typeof queryOrPayload === `string`
      ? { query: queryOrPayload }
      : queryOrPayload
  );
  console.log("graphql request body:", body);

  try {
    const response = await fetch(
      `https://api.runpod.io/graphql` + (!apiKey ? `` : `?api_key=${apiKey}`),
      {
        headers: jsonHeader,
        method: `POST`,
        body,
      });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(withError(`Unable to ${actionDescription}.`, error));
  }
}
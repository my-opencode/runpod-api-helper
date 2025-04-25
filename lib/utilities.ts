export function withError(message: string, error: any): string {
  return `${message}\n${error instanceof Error ? error.message : String(error)}`;
}

export function optionsToString(options: any, noQuotes = false): string {
  const segments: string[] = [];
  if (typeof options !== `object`) {
    return String(options);
  } else if (Array.isArray(options)) {
    return `[${options.map(v => optionsToString(v, noQuotes)).join(`, `)}]`;
  } else {
    for (const key in options) {
      if (typeof options[key] === `object`) {
        segments.push(`${key}: ${optionsToString(options[key], noQuotes)}`);
      } else if (typeof options[key] === `number`) {
        segments.push(`${key}: ${options[key]}`);
      } else if (typeof options[key] === `string`) {
        segments.push(
          !noQuotes
            ? `${key}: ${JSON.stringify(options[key])}`
            : `${key}: ${options[key]}`
        );
      } else {
        segments.push(`${key}: "${options[key]}"`);
      }
    }
  }
  return `{ ${segments.join(`, `)} }`;
}

// stub for function to create a json to graphql compatible object from the input
// arg sample:
// const enumProperties : (keyof CreateEndpointInput)[] = [
//   "computeType", "scalerType"
// ];
// body:
// const jsonToGraphqlInput : any = {...input};
// for (const enumProperty of enumProperties) {
//   if(input[enumProperty])
//     jsonToGraphqlInput[enumProperty] = new EnumType(String(input[enumProperty]));
// }

/**
 * Mutates the target object to apply defaults from the supplied defaults object.
 * Default behavior is to apply to all falsy values. Options enable to apply to undefined only.
 */
export function applyDefaults(target: any, defaults: any, options?: { onlyUndefined?: boolean }) {
  for (const prop in defaults) {
    if (
      (!options?.onlyUndefined && !target[prop]) ||
      (!!options?.onlyUndefined && target[prop] === undefined)
    ) {
      target[prop] = defaults[prop];
    }
  }
}
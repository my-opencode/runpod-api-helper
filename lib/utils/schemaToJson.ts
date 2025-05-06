import { VariableType } from "json-to-graphql-query";

export function schemaToJson(schema: any) {
  const object: any = {};
  if (schema.kind === `Document` && Array.isArray(schema.definitions) && schema.definitions.length === 1) {
    definitionsToProperties(object, schema.definitions);
  }
  return object;
}

export function definitionsToProperties(parent: any, definitions: any) {
  for (const definition of definitions) {
    const object: any = {};
    const hasChildren = !!definition.selectionSet?.selections?.length;
    const hasArgument = !!definition.arguments?.length;
    const hasVariables = !!definition.variableDefinitions?.length;

    if (definition.kind === `OperationDefinition`) {
      parent[definition.operation] = object;
      if (definition.name) {
        object.__name = definition.name.value;
      }
      if (hasArgument) {
        object.__args = {};
        definitionsToProperties(
          object.__args,
          definition.arguments
        );
      }
    } else if (definition.kind === `Field`) {
      parent[definition.name.value] = !hasChildren ? true : object;
    } else if (definition.kind === `Argument`) {
      parent[definition.name.value] = definition.value.kind === `variable`
        ? new VariableType(definition.value?.name?.value || "unnamed")
        : definition.value?.name?.value || "unnamed";
    } else if (definition.kind === `VariableDefinition`) {
      parent[definition.variable.name.value] = variableName(definition.type);
    }
    if (hasChildren) {
      definitionsToProperties(object, definition.selectionSet.selections);
    }
    if (hasVariables) {
      object.__variables = {};
      definitionsToProperties(object.__variables, definition.variableDefinitions);
    }
  }
}

export function variableName(type:any):string {
  if(type.kind === `NonNullType`)
      return variableName(type?.type) + `!`;
  if(type.kind === `NamedType`)
    return type?.name?.value || "unnamed";
  return "unnamed";
}
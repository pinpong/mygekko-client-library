export function valuesToStringList(values: string, key: string) {
  if (values[key]) {
    return (values[key]["sumstate"]["value"] as string).slice(0, -1).split(";");
  } else {
    try {
      return (values["sumstate"]["value"] as string).slice(0, -1).split(";");
    } catch (e) {
      throw Error("Can not parse status");
    }
  }
}

export function systemFilteredByItems(system: string) {
  return Object.keys(system).filter((key) => key.includes("item"));
}

export function systemFilteredByGroup(system: string) {
  return Object.keys(system).filter((key) => key.includes("group"));
}

/// TODO: add function see gekkoInfo parsing
export function tryParseString(value: string) {}

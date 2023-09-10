export function valuesToStringList(values: string, key: string): string[] {
  try {
    if (values[key]) {
      return (values[key]["sumstate"]["value"] as string)
        .slice(0, -1)
        .split(";");
    } else {
      return (values["sumstate"]["value"] as string).slice(0, -1).split(";");
    }
  } catch (e) {
    throw new Error("Can not parse status");
  }
}

export function systemFilteredByItems(system: string): string[] {
  return Object.keys(system).filter((key) => key.includes("item"));
}

export function systemFilteredByGroup(system: string): string[] {
  return Object.keys(system).filter((key) => key.includes("group"));
}

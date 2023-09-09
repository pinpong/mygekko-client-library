import { Client } from "../../client";
import { tryParseInt } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";
import { Fireplace } from "./types";

const res = "stoven";

export class Fireplaces extends Client {
  private parseFireplaceItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);
    const item: Fireplace = {
      sumState: tryParseInt(values[4]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      temperature: tryParseInt(values[0]),
      flapOpeningLevel: tryParseInt(values[1]),
      currentState: tryParseInt(values[2]),
      workingState: tryParseInt(values[3]),
    };
    return item;
  }

  async getFireplaces(): Promise<Fireplace[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseFireplaceItem(system, status, key);
    });
  }

  async getFireplace(id: string): Promise<Fireplace> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseFireplaceItem(this.system[res], status, id);
  }
}

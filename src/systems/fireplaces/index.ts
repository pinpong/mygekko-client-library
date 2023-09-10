import { Client } from "../../client";
import { tryParseFloat } from "../../utils/numberUtils";
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
      sumState: tryParseFloat(values[4]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      temperature: tryParseFloat(values[0]),
      flapOpeningLevel: tryParseFloat(values[1]),
      currentState: tryParseFloat(values[2]),
      workingState: tryParseFloat(values[3]),
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

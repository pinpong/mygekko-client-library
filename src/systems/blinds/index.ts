import { Client } from "../../client";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { Blind, BlindState } from "./types";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";

const res = "blinds";

export class Blinds extends Client {
  private parseBlindItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);
    const item: Blind = {
      sumState: tryParseFloat(values[3]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      currentState: tryParseFloat(values[0]),
      position: tryParseFloat(values[1]),
      rotationLevel: tryParseFloat(values[2]),
      rotationRange: tryParseFloat(values[4]),
    };
    return item;
  }

  async getBlinds(): Promise<Blind[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseBlindItem(system, status, key);
    });
  }

  async getBlind(id: string): Promise<Blind> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseBlindItem(this.system[res], status, id);
  }

  async setBlindState(id: string, state: BlindState) {
    await this.changeRequest(res, id, `${state}`);
  }

  async setBlindPosition(id: string, position: number) {
    await this.changeRequest(res, id, `P${position}`);
  }

  async setBlindAngle(id: string, angle: number) {
    await this.changeRequest(res, id, `S${angle}`);
  }
}

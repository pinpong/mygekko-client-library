import { BaseSystem } from "../base";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { Blind, BlindState } from "./types";

const res = "blinds";

export class Blinds extends BaseSystem {
  private parseItem(system: string, status: string, key: string): Blind {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[3]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      currentState: tryParseFloat(values[0]),
      position: tryParseFloat(values[1]),
      rotationLevel: tryParseFloat(values[2]),
      rotationRange: tryParseFloat(values[4]),
    };
  }

  async getAll(): Promise<Blind[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<Blind> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }

  async setState(id: string, state: BlindState): Promise<void> {
    await this.client.changeRequest(res, id, `${state}`);
  }

  async setPosition(id: string, position: number): Promise<void> {
    await this.client.changeRequest(res, id, `P${position}`);
  }

  async setAngle(id: string, angle: number): Promise<void> {
    await this.client.changeRequest(res, id, `S${angle}`);
  }
}

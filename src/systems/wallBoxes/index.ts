import { Client } from "../../client";
import { WallBox, WallBoxChargeState, WallBoxUser } from "./types";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";

const res = "emobils";

export class WallBoxes extends Client {
  private parseWallBoxeItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);
    const item: WallBox = {
      sumState: tryParseFloat(values[10]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      pluggedState: tryParseFloat(values[0]),
      chargeState: tryParseFloat(values[1]),
      chargeRequestState: tryParseFloat(values[2]),
      currentChargingPower: tryParseFloat(values[3]),
      maximumChargingPower: tryParseFloat(values[4]),
      chargingPowerSetPoint: tryParseFloat(values[5]),
      electricCurrentSetPoint: tryParseFloat(values[6]),
      chargeUserName: values[7],
      chargeDurationTime: tryParseFloat(values[8]),
      currentChargingEnergy: tryParseFloat(values[9]),
      chargeStartTime: values[11],
      chargeUserIndex: tryParseFloat(values[12]),
      wallBoxUser: this.parseWallBoxUser(status, key),
    };
    return item;
  }

  private parseWallBoxUser(status: string, key: string) {
    const items: WallBoxUser[] = [];
    for (let i = 1; i < 7; i++) {
      const value = status[key][`user${i}_sumstate`]["value"];
      if (value != null) {
        items.push({
          id: i,
          totalEnergy: value,
        });
      }
    }
    return items;
  }

  async getWallBoxes(): Promise<WallBox[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseWallBoxeItem(system, status, key);
    });
  }

  async getWallBoxe(id: string): Promise<WallBox> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseWallBoxeItem(this.system[res], status, id);
  }

  async setWallBoxChargeState(id: string, state: WallBoxChargeState) {
    let value = -1;

    switch (state) {
      case WallBoxChargeState.off:
      case WallBoxChargeState.paused:
        value = -1;
        break;
      case WallBoxChargeState.on:
        value = 1;
        break;
    }
    await this.changeRequest(res, id, `${value}`);
  }

  async setWallBoxChargePower(id: string, power: number) {
    await this.changeRequest(res, id, `CS${power}`);
  }
}
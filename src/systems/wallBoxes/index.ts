import { BaseSystem } from '../base';
import { WallBox, WallBoxChargeState, WallBoxUser } from './types';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';

const res = 'emobils';

export class WallBoxes extends BaseSystem {
  private parseItem(system: string, status: string, key: string): WallBox {
    const values = valuesToStringList(status, key);

    return {
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
  }

  private parseWallBoxUser(status: string, key: string): WallBoxUser[] {
    const items: WallBoxUser[] = [];
    for (let i = 1; i < 7; i++) {
      const value = status[key][`user${i}_sumstate`]['value'];
      if (value != null) {
        items.push({
          id: i,
          totalEnergy: value,
        });
      }
    }
    return items;
  }

  async getAll(): Promise<WallBox[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<WallBox> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }

  async setChargeState(id: string, state: WallBoxChargeState): Promise<void> {
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
    await this.client.changeRequest(res, id, `${value}`);
  }

  async setChargePower(id: string, power: number): Promise<void> {
    await this.client.changeRequest(res, id, `CS${power}`);
  }
}

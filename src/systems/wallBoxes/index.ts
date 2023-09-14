import { SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { WallBox, WallBoxChargeState, WallBoxUser } from './types';

const res = SystemTypes.wallBoxes;

export class WallBoxes extends BaseSystem {
  private parseItem(config: SystemConfig, status: string, key: string): WallBox {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[10]),
      itemId: key,
      name: config[key].name,
      page: config[key].page,
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

  public async getItems(): Promise<WallBox[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  public async getItemById(itemId: string): Promise<WallBox> {
    const status = await this.getStatusById(res, itemId);
    return this.parseItem(this.client.systemConfig[res], status, itemId);
  }

  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend[]> {
    return await this.getTrendsStatus(res, startDate, endDate, count);
  }

  public async getTrendByItemId(
    itemId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    return await this.getTrendStatus(res, itemId, startDate, endDate, count);
  }

  public async setChargeState(itemId: string, state: WallBoxChargeState): Promise<void> {
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
    await this.client.changeRequest(res, itemId, `${value}`);
  }

  public async setChargePower(itemId: string, power: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `CS${power}`);
  }
}

import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { WallBox, WallBoxChargeState, WallBoxUser } from './types';

const res = SystemType.wallBoxes;

export class WallBoxes extends BaseSystem {
  /**
   * Parses the weather item.
   * @param {SystemConfig} config  the myGEKKO device configuration
   * @param {string} status the response from the status request
   * @param {string} itemId  the item id
   * @returns {WallBox} a parsed item
   */
  private parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): WallBox {
    const values = valuesToStringList(status);

    return {
      sumState: tryParseFloat(values[10]),
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
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
      wallBoxUser: this.parseWallBoxUser(status, itemId),
    };
  }

  private parseWallBoxUser(status: ItemStatusResponse, key: string): WallBoxUser[] {
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

  /**
   * Returns all items.
   * @returns {Promise<WallBox[]>} a item
   * @throws {Error}
   */
  public async getItems(): Promise<WallBox[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param {string} itemId  the item id
   * @returns {Promise<WallBox>} a item
   * @throws {Error}
   */
  public async getItemById(itemId: string): Promise<WallBox> {
    const status = await this.getStatusById(res, itemId);
    return this.parseItem(this.client.systemConfig[res], status, itemId);
  }

  /**
   * Returns all trends.
   * @param {string} startDate the start date as date string
   * @param {string} endDate the start date as date string
   * @param {number} count  the data count
   * @returns {Promise<Trend>} a trend
   * @throws {Error}
   */
  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend[]> {
    return await this.getTrendsStatuses(res, startDate, endDate, count);
  }

  /**
   * Returns a single trend by item id.
   * @param {string} itemId  the item id
   * @param {string} startDate the start date as date string
   * @param {string} endDate the start date as date string
   * @param {number} count  the data count
   * @returns {Promise<Trend>} a trend
   * @throws {Error}
   */
  public async getTrendByItemId(
    itemId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    return await this.getTrendStatus(res, itemId, startDate, endDate, count);
  }

  /**
   * Sets the charge state.
   * @param {string} itemId  the item id
   * @param {WallBoxChargeState} state the new charge state
   */
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

  /**
   * Sets the power.
   * @param {string} itemId  the item id
   * @param {number} power the new power
   */
  public async setChargePower(itemId: string, power: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `CS${power}`);
  }
}

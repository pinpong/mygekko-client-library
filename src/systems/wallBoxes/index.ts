import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { WallBox, WallBoxChargeState, WallBoxUser } from './types';

const systemType = SystemType.wallBoxes;

/**
 * @group Systems
 */
export class WallBoxes extends BaseSystem {
  /**
   * Parses the item.
   * @param config - The myGEKKO device configuration.
   * @param status - The response from the status request.
   * @param itemId - The item id.
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
   * @throws {@link ClientError}
   */
  public async getItems(): Promise<WallBox[]> {
    const status = await this.getCompleteStatus(systemType);
    return systemFilteredByItems(this.client.systemConfig[systemType]).map((key) => {
      return this.parseItem(this.client.systemConfig[systemType], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param itemId - The item id.
   * @throws {@link ClientError}
   */
  public async getItemById(itemId: string): Promise<WallBox> {
    const status = await this.getStatusById(systemType, itemId);
    return this.parseItem(this.client.systemConfig[systemType], status, itemId);
  }

  /**
   * Returns all trends.
   * @param startDate - The start date as date string.
   * @param endDate - The start date as date string.
   * @param count - The data count.
   * @throws {@link ClientError}
   */
  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend[]> {
    return await this.getTrendsStatuses(systemType, startDate, endDate, count);
  }

  /**
   * Returns a single trend by item id.
   * @param itemId - The item id.
   * @param startDate - The start date as date string.
   * @param endDate - The start date as date string.
   * @param count - The data count.
   * @throws {@link ClientError}
   */
  public async getTrendByItemId(
    itemId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    return await this.getTrendStatus(systemType, itemId, startDate, endDate, count);
  }

  /**
   * Sets the charge state.
   * @param itemId - The item id.
   * @param state - The new charge state.
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
    await this.client.changeRequest(systemType, itemId, `${value}`);
  }

  /**
   * Sets the power.
   * @param itemId - The item id.
   * @param power - The new power.
   */
  public async setChargePower(itemId: string, power: number): Promise<void> {
    await this.client.changeRequest(systemType, itemId, `CS${power}`);
  }
}

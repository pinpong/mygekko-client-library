import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { HotWaterSystem, HotWaterSystemState } from './types';

const systemType = SystemType.hotWaterSystems;

/**
 * @group Systems
 */
export class HotWaterSystems extends BaseSystem {
  /**
   * Parses the item.
   * @param config - The myGEKKO device configuration.
   * @param status - The response from the status request.
   * @param itemId - The item id.
   */
  private parseItem(
    config: SystemConfig,
    status: ItemStatusResponse,
    itemId: string
  ): HotWaterSystem {
    const values = valuesToStringList(status);

    return {
      sumState: tryParseFloat(values[7]),
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
      deviceModel: tryParseFloat(values[0]),
      coolingModeState: tryParseFloat(values[1]),
      waterTemperatureSetPoint: tryParseFloat(values[2]),
      waterTemperatureTop: tryParseFloat(values[3]),
      waterTemperatureBottom: tryParseFloat(values[4]),
      collectorTemperature: tryParseFloat(values[5]),
      currentState: tryParseFloat(values[6]),
    };
  }

  /**
   * Returns all items.
   * @throws {@link ClientError}
   */
  public async getItems(): Promise<HotWaterSystem[]> {
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
  public async getItemById(itemId: string): Promise<HotWaterSystem> {
    const status = await this.getStatusById(systemType, itemId);
    return this.parseItem(this.client.systemConfig[systemType], status, itemId);
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
   * Sets the state.
   * @param itemId - The item id.
   * @param state - The new state.
   */
  public async setState(itemId: string, state: HotWaterSystemState): Promise<void> {
    await this.client.changeRequest(systemType, itemId, `${state}`);
  }

  /**
   * Sets the temperature.
   * @param itemId - The item id.
   * @param temperatur - The new temperature.
   */
  public async setTemperature(itemId: string, temperatur: number): Promise<void> {
    await this.client.changeRequest(systemType, itemId, `T${temperatur}`);
  }
}

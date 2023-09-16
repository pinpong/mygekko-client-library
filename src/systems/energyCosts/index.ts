import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { EnergyCost } from './types';

const systemType = SystemType.energyCosts;

/**
 * @group Systems
 */
export class EnergyCosts extends BaseSystem {
  /**
   * Parses the item.
   * @param config - The myGEKKO device configuration.
   * @param status - The response from the status request.
   * @param itemId - The item id.
   */
  private parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): EnergyCost {
    const values = valuesToStringList(status);

    return {
      sumState: tryParseFloat(values[15]),
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
      currentPower: tryParseFloat(values[0]),
      totalEnergyToday: tryParseFloat(values[1]),
      totalEnergyMonth: tryParseFloat(values[2]),
      totalEnergy: tryParseFloat(values[3]),
      nominalPower: tryParseFloat(values[4]),
      energyUnit: values[5],
      powerUnit: values[6],
      totalEnergyToday0h6h: tryParseFloat(values[7]),
      totalEnergyToday6h12h: tryParseFloat(values[8]),
      totalEnergyToday12h18h: tryParseFloat(values[9]),
      totalEnergyToday18h24h: tryParseFloat(values[10]),
      totalEnergyYesterday0h6h: tryParseFloat(values[11]),
      totalEnergyYesterday6h12h: tryParseFloat(values[12]),
      totalEnergyYesterday12h18h: tryParseFloat(values[13]),
      totalEnergyYesterday18h24h: tryParseFloat(values[14]),
      totalEnergyThisYear: tryParseFloat(values[15]),
      totalEnergyInPeriod: tryParseFloat(values[16]),
      startDateTotalEnergyInPeriod: values[17],
      counterDirection: tryParseFloat(values[18]),
    };
  }

  /**
   * Returns all items.
   * @throws {@link ClientError}
   */
  public async getItems(): Promise<EnergyCost[]> {
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
  public async getItemById(itemId: string): Promise<EnergyCost> {
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
}

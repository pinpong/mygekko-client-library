import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { Analysis } from './types';

const systemType = SystemType.analyses;

/**
 * @group Systems
 */
export class Analyses extends BaseSystem {
  /**
   * Parses the item.
   * @param config - The myGEKKO device configuration.
   * @param status - The response from the status request.
   * @param itemId - The item id.
   */
  private parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): Analysis {
    const values = valuesToStringList(status);

    return {
      sumState: tryParseFloat(values[20]),
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
      analysisVariables: [
        {
          currentState: tryParseFloat(values[0]),
          type: tryParseFloat(values[1]),
          name: values[2],
          value: tryParseFloat(values[3]),
          unit: values[4],
        },
        {
          currentState: tryParseFloat(values[5]),
          type: tryParseFloat(values[6]),
          name: values[7],
          value: tryParseFloat(values[8]),
          unit: values[9],
        },
        {
          currentState: tryParseFloat(values[10]),
          type: tryParseFloat(values[11]),
          name: values[12],
          value: tryParseFloat(values[13]),
          unit: values[14],
        },
        {
          currentState: tryParseFloat(values[15]),
          type: tryParseFloat(values[16]),
          name: values[17],
          value: tryParseFloat(values[18]),
          unit: values[19],
        },
      ],
    };
  }

  /**
   * Returns all items.
   * @throws {@link ClientError}
   */
  public async getItems(): Promise<Analysis[]> {
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
  public async getItemById(itemId: string): Promise<Analysis> {
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

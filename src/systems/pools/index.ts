import { ItemStatusResponse, LocalClient, RemoteClient, SystemItemsConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { Pool, PoolWorkingMode } from './types';

/**
 * @group Systems
 */
export class Pools extends BaseSystem<Pool> {
  public constructor(client: LocalClient | RemoteClient) {
    /**
     * Parses the item.
     * @param config - The myGEKKO device configuration.
     * @param status - The response from the status request.
     * @param itemId - The item id.
     */
    function parseItem(
      config: SystemItemsConfig,
      status: ItemStatusResponse,
      itemId: string
    ): Pool {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[3]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page ?? null,
        workingMode: tryParseFloat(values[0]),
        filteringState: tryParseFloat(values[1]),
        backwashState: tryParseFloat(values[2]),
        waterTemperature: tryParseFloat(values[4]),
      };
    }

    super(client, SystemType.pools, parseItem);
  }

  /**
   * Sets the working mode.
   * @param itemId - The item id.
   * @param mode - The new working mode.
   */
  public async setWorkingMode(itemId: string, mode: PoolWorkingMode): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `M${mode}`);
  }

  /**
   * Starts the cleaning of a filter.
   * @param itemId - The item id.
   * @param filter - The filter to clean as 1-3.
   */
  public async setFilterCleaning(itemId: string, filter: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `C${filter}`);
  }

  /**
   * Sets the temperature.
   * @param itemId - The item id.
   * @param temperature - The new temperature.
   */
  public async setTemperatur(itemId: string, temperature: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `T${temperature}`);
  }
}

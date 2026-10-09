import { ItemStatusResponse, LocalClient, RemoteClient, SystemItemsConfig } from '../../client';
import { roundCommandValue } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { Logic } from './types';

/**
 * @group Systems
 */
export class Logics extends BaseSystem<Logic> {
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
    ): Logic {
      const values = valuesToStringList(status);

      return {
        sumState: null,
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page ?? null,
        value: values[0] ?? null,
      };
    }

    super(client, SystemType.alarmsLogics, parseItem);
  }

  /**
   * Sets the set point.
   * @param itemId - The item id.
   * @param value - The new set point, rounded to one decimal.
   */
  public async setSetPoint(itemId: string, value: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `S${roundCommandValue(value)}`);
  }
}

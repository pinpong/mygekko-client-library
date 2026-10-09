import { ItemStatusResponse, LocalClient, RemoteClient, SystemItemsConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { Load, LoadState } from './types';

/**
 * @group Systems
 */
export class Loads extends BaseSystem<Load> {
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
    ): Load {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[1]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page ?? null,
        currentState: tryParseFloat(values[0]),
      };
    }

    super(client, SystemType.loads, parseItem);
  }

  /**
   * Sets the state.
   * @param itemId - The item id.
   * @param state - The new state.
   */
  public async setState(itemId: string, state: LoadState): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `${state}`);
  }

  /**
   * Toggles the state.
   * @param itemId - The item id.
   */
  public async toggle(itemId: string): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `T`);
  }
}

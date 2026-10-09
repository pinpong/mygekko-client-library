import { ItemStatusResponse, LocalClient, RemoteClient, SystemItemsConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { SmsEmailItem, SmsEmailState } from './types';

/**
 * @group Systems
 */
export class SmsEmail extends BaseSystem<SmsEmailItem> {
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
    ): SmsEmailItem {
      const values = valuesToStringList(status);

      return {
        sumState: null,
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page ?? null,
        currentState: tryParseFloat(values[0]),
      };
    }

    super(client, SystemType.smsEmail, parseItem);
  }

  /**
   * Sets the state.
   * @param itemId - The item id.
   * @param state - The new state.
   */
  public async setState(itemId: string, state: SmsEmailState): Promise<void> {
    let value = 0;
    switch (state) {
      case SmsEmailState.off:
        value = 0;
        break;
      case SmsEmailState.on:
        value = 1;
        break;
    }
    await this.client.changeRequest(this.systemType, itemId, `${value}`);
  }
}

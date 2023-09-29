import { ItemStatusResponse, LocalClient, RemoteClient, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { SmsEmail, SmsEmailState } from './types';

/**
 * @group Systems
 */
export class SmsEmails extends BaseSystem<SmsEmail> {
  public constructor(client: LocalClient | RemoteClient) {
    /**
     * Parses the item.
     * @param config - The myGEKKO device configuration.
     * @param status - The response from the status request.
     * @param itemId - The item id.
     */
    function parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): SmsEmail {
      const values = valuesToStringList(status);

      return {
        sumState: null,
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page,
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
    let value = -1;
    switch (state) {
      case SmsEmailState.off:
        value = -1;
        break;
      case SmsEmailState.on:
        value = 1;
        break;
    }
    await this.client.changeRequest(this.systemType, itemId, `${value}`);
  }
}

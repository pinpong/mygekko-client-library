import { ItemStatusResponse, LocalClient, RemoteClient, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { Access, AccessState } from './types';

/**
 * @group Systems
 */
export class Accesses extends BaseSystem<Access> {
  public constructor(client: LocalClient | RemoteClient) {
    /**
     * Parses the item.
     * @param config - The myGEKKO device configuration.
     * @param status - The response from the status request.
     * @param itemId - The item id.
     */
    function parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): Access {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[1]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page,
        currentState: tryParseFloat(values[0]),
        startCondition: tryParseFloat(values[2]),
        gateRuntimePercentage: tryParseFloat(values[3]),
        accessType: tryParseFloat(values[4]),
      };
    }

    super(client, SystemType.accesses, parseItem);
  }

  public async setOpenState(itemId: string, state: AccessState): Promise<void> {
    let value = -1;
    switch (state) {
      case AccessState.close:
        value = -1;
        break;
      case AccessState.open:
        value = 1;
        break;
      case AccessState.keepOpen:
        value = 2;
        break;
    }
    await this.client.changeRequest(this.systemType, itemId, `${value}`);
  }
}

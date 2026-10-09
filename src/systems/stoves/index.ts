import { ItemStatusResponse, LocalClient, RemoteClient, SystemItemsConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { Stove } from './types';

/**
 * @group Systems
 */
export class Stoves extends BaseSystem<Stove> {
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
    ): Stove {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[4]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page ?? null,
        temperature: tryParseFloat(values[0]),
        flapOpeningLevel: tryParseFloat(values[1]),
        currentState: tryParseFloat(values[2]),
        workingState: tryParseFloat(values[3]),
      };
    }

    super(client, SystemType.stoves, parseItem);
  }
}

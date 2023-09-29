import { LocalClient, RemoteClient, SystemStatusResponse } from '../../client';
import { tryParseInt } from '../../utils/extensions/numberUtils';
import { BaseSubSystem } from '../base';
import { SystemType } from '../base/types';
import { GekkoInfoItem } from './types';

/**
 * @group Systems
 */
export class GekkoInfo extends BaseSubSystem<GekkoInfoItem> {
  public constructor(client: LocalClient | RemoteClient) {
    /**
     * Parses the item.
     * @param status - The response from the status request.
     */
    function parseItem(status: SystemStatusResponse): GekkoInfoItem {
      return {
        sumState: null,
        itemId: null,
        name: null,
        page: null,
        gekkoName: status['gekkoname']['value'],
        language: tryParseInt(status['language']['value']),
        version: tryParseInt(status['version']['value']),
        hardware: status['hardware']['value'],
      };
    }

    super(client, SystemType.energyManagers, parseItem);
  }
}

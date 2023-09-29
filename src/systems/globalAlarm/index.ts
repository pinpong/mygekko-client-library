import { LocalClient, RemoteClient, SystemStatusResponse } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { BaseSubSystem } from '../base';
import { SystemType } from '../base/types';
import { GlobalAlarmItem } from './types';

/**
 * @group Systems
 */
export class GlobalAlarm extends BaseSubSystem<GlobalAlarmItem> {
  public constructor(client: LocalClient | RemoteClient) {
    /**
     * Parses the item.
     * @param status - The response from the status request.
     */
    function parseItem(status: SystemStatusResponse): GlobalAlarmItem {
      return {
        sumState: null,
        itemId: null,
        name: null,
        page: null,
        state: tryParseFloat(status['sumstate']['value']),
      };
    }

    super(client, SystemType.energyManagers, parseItem);
  }
}

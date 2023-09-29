import { ItemStatusResponse, LocalClient, RemoteClient, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { HeatingSystem } from './types';

/**
 * @group Systems
 */
export class HeatingSystems extends BaseSystem<HeatingSystem> {
  public constructor(client: LocalClient | RemoteClient) {
    /**
     * Parses the item.
     * @param config - The myGEKKO device configuration.
     * @param status - The response from the status request.
     * @param itemId - The item id.
     */
    function parseItem(
      config: SystemConfig,
      status: ItemStatusResponse,
      itemId: string
    ): HeatingSystem {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[5]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page,
        deviceModel: tryParseFloat(values[0]),
        coolingModeState: tryParseFloat(values[1]),
        flowTemperature: tryParseFloat(values[2]),
        flowTemperatureSetPoint: tryParseFloat(values[3]),
        currentState: tryParseFloat(values[4]),
      };
    }

    super(client, SystemType.heatingSystems, parseItem);
  }
}

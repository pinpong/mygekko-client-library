import { ItemStatusResponse, LocalClient, RemoteClient, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { HotWaterCirculation } from './types';

/**
 * @group Systems
 */
export class HotWaterCirculations extends BaseSystem<HotWaterCirculation> {
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
    ): HotWaterCirculation {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[4]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page,
        pumpType: tryParseFloat(values[0]),
        currentState: tryParseFloat(values[1]),
        returnWaterTemperature: tryParseFloat(values[2]),
        returnWaterTemperatureSetPoint: tryParseFloat(values[3]),
      };
    }

    super(client, SystemType.hotWaterCirculations, parseItem);
  }
}

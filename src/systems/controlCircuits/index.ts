import { ItemStatusResponse, LocalClient, RemoteClient, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { ControlCircuit } from './types';

/**
 * @group Systems
 */
export class ControlCircuits extends BaseSystem<ControlCircuit> {
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
    ): ControlCircuit {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[2]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page,
        sensor: tryParseFloat(values[0]),
        sensorType: tryParseFloat(values[1]),
        pump1WorkingPowerLevel: tryParseFloat(values[3]),
        pump2WorkingPowerLevel: tryParseFloat(values[4]),
        pump3WorkingPowerLevel: tryParseFloat(values[5]),
      };
    }

    super(client, SystemType.controlCircuits, parseItem);
  }
}

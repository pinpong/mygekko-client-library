import { ItemStatusResponse, LocalClient, RemoteClient, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { HeatingCircuit } from './types';

/**
 * @group Systems
 */
export class HeatingCircuits extends BaseSystem<HeatingCircuit> {
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
    ): HeatingCircuit {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[8]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page,
        deviceModel: tryParseFloat(values[0]),
        flowTemperature: tryParseFloat(values[1]),
        returnFlowTemperature: tryParseFloat(values[2]),
        dewPoint: tryParseFloat(values[3]),
        pumpWorkingLevel: tryParseFloat(values[4]),
        coolingModeState: tryParseFloat(values[5]),
        flowTemperatureSetPoint: tryParseFloat(values[6]),
        valveOpeningLevel: tryParseFloat(values[7]),
        currentState: tryParseFloat(values[9]),
      };
    }

    super(client, SystemType.heatingCircuits, parseItem);
  }
}

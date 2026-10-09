import { ItemStatusResponse, LocalClient, RemoteClient, SystemItemsConfig } from '../../client';
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
      config: SystemItemsConfig,
      status: ItemStatusResponse,
      itemId: string
    ): HeatingCircuit {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[6]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page ?? null,
        deviceModel: tryParseFloat(values[0]),
        flowTemperature: tryParseFloat(values[1]),
        returnFlowTemperature: null,
        dewPoint: null,
        pumpWorkingLevel: tryParseFloat(values[2]),
        coolingModeState: null,
        flowTemperatureSetPoint: tryParseFloat(values[4]),
        valveOpeningLevel: tryParseFloat(values[5]),
        currentState: tryParseFloat(values[3]),
      };
    }

    super(client, SystemType.heatingCircuits, parseItem);
  }
}

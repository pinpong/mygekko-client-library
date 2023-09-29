import { ItemStatusResponse, LocalClient, RemoteClient, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { Sauna, SaunaWorkingMode } from './types';

/**
 * @group Systems
 */
export class Saunas extends BaseSystem<Sauna> {
  public constructor(client: LocalClient | RemoteClient) {
    /**
     * Parses the item.
     * @param config - The myGEKKO device configuration.
     * @param status - The response from the status request.
     * @param itemId - The item id.
     */
    function parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): Sauna {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[3]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page,
        workingMode: tryParseFloat(values[0]),
        currentState: tryParseFloat(values[1]),
        errorState: tryParseFloat(values[4]),
        roomTemperature: tryParseFloat(values[5]),
        roomTemperatureSetPoint: tryParseFloat(values[6]),
        burnerTemperature: tryParseFloat(values[7]),
        roomRelativeHumidityLevel: tryParseFloat(values[8]),
        roomRelativeHumiditySetPointLevel: tryParseFloat(values[9]),
      };
    }

    super(client, SystemType.saunas, parseItem);
  }

  /**
   * Sets the mode.
   * @param itemId - The item id.
   * @param mode - The new mode.
   */
  public async setMode(itemId: string, mode: SaunaWorkingMode): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `${mode}`);
  }
}

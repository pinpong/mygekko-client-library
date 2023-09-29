import { ItemStatusResponse, LocalClient, RemoteClient, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { HotWaterSystem, HotWaterSystemState } from './types';

/**
 * @group Systems
 */
export class HotWaterSystems extends BaseSystem<HotWaterSystem> {
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
    ): HotWaterSystem {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[7]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page,
        deviceModel: tryParseFloat(values[0]),
        coolingModeState: tryParseFloat(values[1]),
        waterTemperatureSetPoint: tryParseFloat(values[2]),
        waterTemperatureTop: tryParseFloat(values[3]),
        waterTemperatureBottom: tryParseFloat(values[4]),
        collectorTemperature: tryParseFloat(values[5]),
        currentState: tryParseFloat(values[6]),
      };
    }

    super(client, SystemType.hotWaterSystems, parseItem);
  }

  /**
   * Sets the state.
   * @param itemId - The item id.
   * @param state - The new state.
   */
  public async setState(itemId: string, state: HotWaterSystemState): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `${state}`);
  }

  /**
   * Sets the temperature.
   * @param itemId - The item id.
   * @param temperatur - The new temperature.
   */
  public async setTemperature(itemId: string, temperatur: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `T${temperatur}`);
  }
}

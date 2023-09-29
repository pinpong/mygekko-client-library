import { ItemStatusResponse, LocalClient, RemoteClient, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import {
  RoomTemperature,
  RoomTemperatureWorkingModeKnx,
  RoomTemperatureWorkingModeStandard,
} from './types';

/**
 * @group Systems
 */
export class RoomTemperatures extends BaseSystem<RoomTemperature> {
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
    ): RoomTemperature {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[6]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page,
        temperature: tryParseFloat(values[0]),
        temperatureSetPoint: tryParseFloat(values[1]),
        valveOpeningLevel: tryParseFloat(values[2]),
        workingMode: tryParseFloat(values[3]),
        reserved: values[4],
        temperatureAdjustment: tryParseFloat(values[5]),
        coolingModeState: tryParseFloat(values[7]),
        relativeHumidity: tryParseFloat(values[8]),
        airQualityLevel: tryParseFloat(values[8]),
        floorTemperature: tryParseFloat(values[10]),
        deviceModel: tryParseFloat(values[11]),
      };
    }

    super(client, SystemType.roomTemperatures, parseItem);
  }

  /**
   * Sets the temperature set point.
   * @param itemId - The item id.
   * @param temperature - The new temperature.
   */
  public async setTemperaturSetPoint(itemId: string, temperature: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `S${temperature}`);
  }

  /**
   * Sets the temperature adjust.
   * @param itemId - The item id.
   * @param temperature - The new temperature adjust.
   */
  public async setTemperatureAdjust(itemId: string, temperature: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `K${temperature}`);
  }

  /**
   * Sets the working mode.
   * @param itemId - The item id.
   * @param mode - The new working mode.
   */
  public async setWorkingMode(
    itemId: string,
    mode: RoomTemperatureWorkingModeStandard | RoomTemperatureWorkingModeKnx
  ): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `M${mode}`);
  }
}

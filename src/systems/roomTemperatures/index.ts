import { ItemStatusResponse, LocalClient, RemoteClient, SystemItemsConfig } from '../../client';
import { roundCommandValue, tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import {
  RoomTemperature,
  RoomTemperatureDeviceModel,
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
      config: SystemItemsConfig,
      status: ItemStatusResponse,
      itemId: string
    ): RoomTemperature {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[7]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page ?? null,
        temperature: tryParseFloat(values[0]),
        temperatureSetPoint: tryParseFloat(values[1]),
        valveOpeningLevel: tryParseFloat(values[2]),
        workingMode: tryParseFloat(values[3]),
        reserved: values[4] ?? null,
        temperatureAdjustment: tryParseFloat(values[5]),
        coolingModeState: tryParseFloat(values[6]),
        relativeHumidity: tryParseFloat(values[8]),
        airQualityLevel: tryParseFloat(values[9]),
        floorTemperature: tryParseFloat(values[10]),
        deviceModel: tryParseFloat(values[11]),
      };
    }

    super(client, SystemType.roomTemperatures, parseItem);
  }

  /**
   * Sets the temperature set point.
   * @param itemId - The item id.
   * @param temperature - The new absolute set point as C°, rounded to one decimal.
   */
  public async setTemperatureSetPoint(itemId: string, temperature: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `S${roundCommandValue(temperature)}`);
  }

  /**
   * Sets the temperature adjust.
   * @param itemId - The item id.
   * @param temperature - The new total adjustment as C°, not a step, rounded to one decimal.
   */
  public async setTemperatureAdjust(itemId: string, temperature: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `K${roundCommandValue(temperature)}`);
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

  /**
   * Returns the working modes of a device model by name, the meaning of a mode depends on the model.
   * @param deviceModel - The device model.
   */
  public getWorkingModes(deviceModel: RoomTemperatureDeviceModel | null): {
    [name: string]: number;
  } {
    if (deviceModel === RoomTemperatureDeviceModel.knx) {
      return {
        auto: RoomTemperatureWorkingModeKnx.auto,
        comfort: RoomTemperatureWorkingModeKnx.comfort,
        standby: RoomTemperatureWorkingModeKnx.standby,
        economy: RoomTemperatureWorkingModeKnx.economy,
        buildingProtection: RoomTemperatureWorkingModeKnx.buildingProtection,
      };
    }
    return {
      off: RoomTemperatureWorkingModeStandard.off,
      on: RoomTemperatureWorkingModeStandard.on,
      comfort: RoomTemperatureWorkingModeStandard.comfort,
      reduced: RoomTemperatureWorkingModeStandard.reduced,
      manual: RoomTemperatureWorkingModeStandard.manual,
      standby: RoomTemperatureWorkingModeStandard.standby,
    };
  }
}

import { ItemStatusResponse, LocalClient, RemoteClient, SystemItemsConfig } from '../../client';
import { roundCommandValue, tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { AirConditionerItem, AirConditionerState, AirConditionerWorkingMode } from './types';

/**
 * @group Systems
 */
export class AirConditioner extends BaseSystem<AirConditionerItem> {
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
    ): AirConditionerItem {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[25]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page ?? null,
        supplyAirTemperature: tryParseFloat(values[0]),
        supplyAirTemperatureSetPoint: tryParseFloat(values[1]),
        exhaustAirTemperature: tryParseFloat(values[2]),
        exhaustAirTemperatureSetPoint: tryParseFloat(values[3]),
        outsideAirTemperature: tryParseFloat(values[4]),
        outgoingAirTemperature: tryParseFloat(values[5]),
        supplyRelativeHumidityLevel: tryParseFloat(values[6]),
        supplyRelativeHumiditySetPointLevel: tryParseFloat(values[7]),
        exhaustRelativeHumidityLevel: tryParseFloat(values[8]),
        exhaustRelativeHumiditySetPointLevel: tryParseFloat(values[9]),
        airQualityLevel: tryParseFloat(values[10]),
        airQualitySetPointLevel: tryParseFloat(values[11]),
        supplyPressure: tryParseFloat(values[12]),
        supplyPressureSetPoint: tryParseFloat(values[13]),
        exhaustPressure: tryParseFloat(values[14]),
        exhaustPressureSetPoint: tryParseFloat(values[15]),
        workingLevelSetPointLevel: tryParseFloat(values[16]),
        supplyState: tryParseFloat(values[17]),
        supplyWorkingLevel: tryParseFloat(values[18]),
        supplyFlapOpeningLevel: tryParseFloat(values[19]),
        exhaustState: tryParseFloat(values[20]),
        exhaustWorkingLevel: tryParseFloat(values[21]),
        exhaustFlapOpeningLevel: tryParseFloat(values[22]),
        currentState: tryParseFloat(values[23]),
        workingMode: tryParseFloat(values[24]),
      };
    }

    super(client, SystemType.airConditioner, parseItem);
  }

  /**
   * Sets the state.
   * @param itemId - The item id.
   * @param state - The new state.
   * @throws {@link ClientError}
   */
  public async setState(itemId: string, state: AirConditionerState): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `${state}`);
  }

  /**
   * Sets the mode.
   * @param itemId - The item id.
   * @param mode - The new mode.
   * @throws {@link ClientError}
   */
  public async setMode(itemId: string, mode: AirConditionerWorkingMode): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `M${mode}`);
  }

  /**
   * Sets the power.
   * @param itemId - The item id.
   * @param power - The new power, rounded to one decimal.
   * @throws {@link ClientError}
   */
  public async setPower(itemId: string, power: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `P${roundCommandValue(power)}`);
  }

  /**
   * Sets the min flap.
   * @param itemId - The item id.
   * @param flaps - The new min flaps, rounded to one decimal.
   * @throws {@link ClientError}
   */
  public async setMinFlap(itemId: string, flaps: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `F${roundCommandValue(flaps)}`);
  }

  /**
   * Sets the air quality.
   * @param itemId - The item id.
   * @param airQuality - The new air quality, rounded to one decimal.
   * @throws {@link ClientError}
   */
  public async setAirQuality(itemId: string, airQuality: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `Q${roundCommandValue(airQuality)}`);
  }

  /**
   * Sets the humidity.
   * @param itemId - The item id.
   * @param humidity - The new humidity, rounded to one decimal.
   * @throws {@link ClientError}
   */
  public async setHumidity(itemId: string, humidity: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `H${roundCommandValue(humidity)}`);
  }

  /**
   * Sets the temperature.
   * @param itemId - The item id.
   * @param temperature - The new absolute temperature as C°, rounded to one decimal.
   */
  public async setTemperature(itemId: string, temperature: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `T${roundCommandValue(temperature)}`);
  }
}

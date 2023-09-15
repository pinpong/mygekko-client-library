import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { AirConditioner, AirConditionerState, AirConditionerWorkingMode } from './types';

const res = SystemType.airConditioner;

export class AirConditioners extends BaseSystem {
  /**
   * Parses the item
   * @param {SystemConfig} config  the myGEKKO device configuration
   * @param {string} status the response from the status request
   * @param {string} itemId  the item id
   * @returns {AirConditioner} a parsed item
   */
  private parseItem(
    config: SystemConfig,
    status: ItemStatusResponse,
    itemId: string
  ): AirConditioner {
    const values = valuesToStringList(status);

    return {
      sumState: tryParseFloat(values[25]),
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
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

  /**
   * Returns all items.
   * @returns {Promise<AirConditioner[]>} a item
   * @throws {Error}
   */
  public async getItems(): Promise<AirConditioner[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param {string} itemId  the item id
   * @returns {Promise<AirConditioner>} a item
   * @throws {Error}
   */
  public async getItemById(itemId: string): Promise<AirConditioner> {
    const status = await this.getStatusById(res, itemId);
    return this.parseItem(this.client.systemConfig[res], status, itemId);
  }

  /**
   * Returns all trends.
   * @param {string} startDate the start date as date string
   * @param {string} endDate the start date as date string
   * @param {number} count  the data count
   * @returns {Promise<Trend>} a trend
   * @throws {Error}
   */
  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend[]> {
    return await this.getTrendsStatuses(res, startDate, endDate, count);
  }

  /**
   * Sets the state.
   * @param {string} itemId  the item id
   * @param {AirConditionerState} state the new state
   * @throws {Error}
   */
  public async setState(itemId: string, state: AirConditionerState): Promise<void> {
    await this.client.changeRequest(res, itemId, `${state}`);
  }

  /**
   * Sets the mode.
   * @param {string} itemId  the item id
   * @param {AirConditionerWorkingMode} mode the new mode
   * @throws {Error}
   */
  public async setMode(itemId: string, mode: AirConditionerWorkingMode): Promise<void> {
    await this.client.changeRequest(res, itemId, `M${mode}`);
  }

  /**
   * Sets the power.
   * @param {string} itemId  the item id
   * @param {number} power the new power
   * @throws {Error}
   */
  public async setPower(itemId: string, power: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `P${power}`);
  }

  /**
   * Sets the min flap.
   * @param {string} itemId  the item id
   * @param {number} flaps the new min flaps
   * @throws {Error}
   */
  public async setMinFlap(itemId: string, flaps: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `F${flaps}`);
  }

  /**
   * Sets the air quality.
   * @param {string} itemId  the item id
   * @param {number} airQuality the new air quality
   * @throws {Error}
   */
  public async setAirQuality(itemId: string, airQuality: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `Q${airQuality}`);
  }

  /**
   * Sets the humidity.
   * @param {string} itemId  the item id
   * @param {number} humidity the new humidity
   * @throws {Error}
   */
  public async setHumidity(itemId: string, humidity: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `H${humidity}`);
  }
}

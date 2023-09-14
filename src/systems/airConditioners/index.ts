import { SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { AirConditioner, AirConditionerState, AirConditionerWorkingMode } from './types';

const res = SystemTypes.airConditioner;

export class AirConditioners extends BaseSystem {
  private parseItem(config: SystemConfig, status: string, key: string): AirConditioner {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[25]),
      itemId: key,
      name: config[key].name,
      page: config[key].page,
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
      supplyPressureValue: tryParseFloat(values[12]),
      supplyPressureSetPointValue: tryParseFloat(values[13]),
      exhaustPressureValue: tryParseFloat(values[14]),
      exhaustPressureSetPointValue: tryParseFloat(values[15]),
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

  public async getItems(): Promise<AirConditioner[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  public async getItemById(itemId: string): Promise<AirConditioner> {
    const status = await this.getStatusById(res, itemId);
    return this.parseItem(this.client.systemConfig[res], status, itemId);
  }

  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend[]> {
    return await this.getTrendsStatus(res, startDate, endDate, count);
  }

  public async setState(itemId: string, state: AirConditionerState): Promise<void> {
    await this.client.changeRequest(res, itemId, `${state}`);
  }

  public async setMode(itemId: string, mode: AirConditionerWorkingMode): Promise<void> {
    await this.client.changeRequest(res, itemId, `M${mode}`);
  }

  public async setPower(itemId: string, power: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `P${power}`);
  }

  public async setMinFlap(itemId: string, flaps: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `F${flaps}`);
  }

  public async setAirQuality(itemId: string, airQuality: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `Q${airQuality}`);
  }

  public async setHumidity(itemId: string, humidity: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `H${humidity}`);
  }
}

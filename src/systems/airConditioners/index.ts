import { Client } from "../../client";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";
import {
  AirConditioner,
  AirConditionerState,
  AirConditionerWorkingMode,
} from "./types";

const res = "air_handling_unit";

export class AirConditioners extends Client {
  private parseAirConditionersItem(
    system: string,
    status: string,
    key: string,
  ) {
    const values = valuesToStringList(status, key);
    const item: AirConditioner = {
      sumState: tryParseFloat(values[25]),
      id: key,
      name: system[key].name,
      page: system[key].page,
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
    return item;
  }

  async getAirConditioners(): Promise<AirConditioner[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseAirConditionersItem(system, status, key);
    });
  }

  async getAirConditioner(id: string): Promise<AirConditioner> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseAirConditionersItem(this.system[res], status, id);
  }

  async setAirConditionerState(id: string, state: AirConditionerState) {
    await this.changeRequest(res, id, `${state}`);
  }

  async setAirConditionerMode(id: string, mode: AirConditionerWorkingMode) {
    await this.changeRequest(res, id, `M${mode}`);
  }

  async setAirConditionerPower(id: string, power: number) {
    await this.changeRequest(res, id, `P${power}`);
  }

  async setAirConditionerAirMinFlap(id: string, flaps: number) {
    await this.changeRequest(res, id, `F${flaps}`);
  }

  async setAirConditionerAirQuality(id: string, airQuality: number) {
    await this.changeRequest(res, id, `Q${airQuality}`);
  }

  async setAirConditionerHumidity(id: string, humidity: number) {
    await this.changeRequest(res, id, `H${humidity}`);
  }
}
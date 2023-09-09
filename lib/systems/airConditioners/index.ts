import { Client } from "../../client";
import { tryParseInt } from "../../utils/numberUtils";
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
      sumState: tryParseInt(values[25]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      supplyAirTemperature: tryParseInt(values[0]),
      supplyAirTemperatureSetPoint: tryParseInt(values[1]),
      exhaustAirTemperature: tryParseInt(values[2]),
      exhaustAirTemperatureSetPoint: tryParseInt(values[3]),
      outsideAirTemperature: tryParseInt(values[4]),
      outgoingAirTemperature: tryParseInt(values[5]),
      supplyRelativeHumidityLevel: tryParseInt(values[6]),
      supplyRelativeHumiditySetPointLevel: tryParseInt(values[7]),
      exhaustRelativeHumidityLevel: tryParseInt(values[8]),
      exhaustRelativeHumiditySetPointLevel: tryParseInt(values[9]),
      airQualityLevel: tryParseInt(values[10]),
      airQualitySetPointLevel: tryParseInt(values[11]),
      supplyPressureValue: tryParseInt(values[12]),
      supplyPressureSetPointValue: tryParseInt(values[13]),
      exhaustPressureValue: tryParseInt(values[14]),
      exhaustPressureSetPointValue: tryParseInt(values[15]),
      workingLevelSetPointLevel: tryParseInt(values[16]),
      supplyState: tryParseInt(values[17]),
      supplyWorkingLevel: tryParseInt(values[18]),
      supplyFlapOpeningLevel: tryParseInt(values[19]),
      exhaustState: tryParseInt(values[20]),
      exhaustWorkingLevel: tryParseInt(values[21]),
      exhaustFlapOpeningLevel: tryParseInt(values[22]),
      currentState: tryParseInt(values[23]),
      workingMode: tryParseInt(values[24]),
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

import { Client } from "../../client";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";
import { EnergyManager } from "./types";

const res = "energymanager";

export class EnergyManagers extends Client {
  private parseEnergyManagerItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);

    const item: EnergyManager = {
      sumState: tryParseFloat(values[0]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      netMeterState: tryParseFloat(values[1]),
      solarPanelState: tryParseFloat(values[2]),
      batteryState: tryParseFloat(values[3]),
      netMeterCurrentPower: tryParseFloat(values[4]),
      currentPowerExportedToNet: tryParseFloat(values[5]),
      currentPowerFromSolarPanels: tryParseFloat(values[6]),
      currentPowerFromBattery: tryParseFloat(values[7]),
      currentPowerChargingBattery: tryParseFloat(values[8]),
      currentHomePowerConsumption: tryParseFloat(values[9]),
      currentAlternativePowerConsumption: tryParseFloat(values[10]),
      totalDailyImportedEnergyFromNet: tryParseFloat(values[11]),
      totalDailyExportedEnergyToNet: tryParseFloat(values[12]),
      totalDailyEnergyFromSolarPanels: tryParseFloat(values[13]),
      totalDailyEnergyFromBattery: tryParseFloat(values[14]),
      totalDailyEnergyChargingBattery: tryParseFloat(values[15]),
      totalDailyHomeEnergyConsumption: tryParseFloat(values[16]),
      loadSheddingState: tryParseFloat(values[17]),
      emsState: tryParseFloat(values[18]),
      batteryModel: tryParseFloat(values[19]),
      batterySoCLevel: tryParseFloat(values[20]),
      emsEnabledState: tryParseFloat(values[21]),
      maximumPowerConsumptionFromNet: tryParseFloat(values[22]),
      maximumPowerExportToNet: tryParseFloat(values[23]),
      maximumPowerSolarPanels: tryParseFloat(values[24]),
      maximumPowerBattery: tryParseFloat(values[25]),
    };
    return item;
  }

  async getEnergyManagers(): Promise<EnergyManager[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseEnergyManagerItem(system, status, key);
    });
  }

  async getEnergyManager(id: string): Promise<EnergyManager> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseEnergyManagerItem(this.system[res], status, id);
  }
}

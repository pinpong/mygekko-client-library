import { Client } from "../../client";
import { tryParseInt } from "../../utils/numberUtils";
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
      sumState: tryParseInt(values[0]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      netMeterState: tryParseInt(values[1]),
      solarPanelState: tryParseInt(values[2]),
      batteryState: tryParseInt(values[3]),
      netMeterCurrentPower: tryParseInt(values[4]),
      currentPowerExportedToNet: tryParseInt(values[5]),
      currentPowerFromSolarPanels: tryParseInt(values[6]),
      currentPowerFromBattery: tryParseInt(values[7]),
      currentPowerChargingBattery: tryParseInt(values[8]),
      currentHomePowerConsumption: tryParseInt(values[9]),
      currentAlternativePowerConsumption: tryParseInt(values[10]),
      totalDailyImportedEnergyFromNet: tryParseInt(values[11]),
      totalDailyExportedEnergyToNet: tryParseInt(values[12]),
      totalDailyEnergyFromSolarPanels: tryParseInt(values[13]),
      totalDailyEnergyFromBattery: tryParseInt(values[14]),
      totalDailyEnergyChargingBattery: tryParseInt(values[15]),
      totalDailyHomeEnergyConsumption: tryParseInt(values[16]),
      loadSheddingState: tryParseInt(values[17]),
      emsState: tryParseInt(values[18]),
      batteryModel: tryParseInt(values[19]),
      batterySoCLevel: tryParseInt(values[20]),
      emsEnabledState: tryParseInt(values[21]),
      maximumPowerConsumptionFromNet: tryParseInt(values[22]),
      maximumPowerExportToNet: tryParseInt(values[23]),
      maximumPowerSolarPanels: tryParseInt(values[24]),
      maximumPowerBattery: tryParseInt(values[25]),
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

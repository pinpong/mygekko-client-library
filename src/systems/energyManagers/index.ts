import { BaseSystem } from '../base';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { EnergyManager } from './types';

const res = 'energymanager';

export class EnergyManagers extends BaseSystem {
  private parseItem(system: string, status: string, key: string): EnergyManager {
    const values = valuesToStringList(status, key);

    return {
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
  }

  async getAll(): Promise<EnergyManager[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<EnergyManager> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }
}

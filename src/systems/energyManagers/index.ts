import { SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { EnergyManager } from './types';

const res = SystemTypes.energyManagers;

export class EnergyManagers extends BaseSystem {
  private parseItem(config: SystemConfig, status: string, key: string): EnergyManager {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[0]),
      itemId: key,
      name: config[key].name,
      page: config[key].page,
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

  public async getItems(): Promise<EnergyManager[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  public async getItemById(itemId: string): Promise<EnergyManager> {
    const status = await this.getStatusById(res, itemId);
    return this.parseItem(this.client.systemConfig[res], status, itemId);
  }

  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend[]> {
    return await this.getTrendsStatus(res, startDate, endDate, count);
  }

  public async getTrendByItemId(
    itemId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    return await this.getTrendStatus(res, itemId, startDate, endDate, count);
  }
}

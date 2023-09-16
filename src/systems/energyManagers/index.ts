import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { EnergyManager } from './types';

const systemType = SystemType.energyManagers;

/**
 * @group Systems
 */
export class EnergyManagers extends BaseSystem {
  /**
   * Parses the item.
   * @param config - The myGEKKO device configuration.
   * @param status - The response from the status request.
   * @param itemId - The item id.
   */
  private parseItem(
    config: SystemConfig,
    status: ItemStatusResponse,
    itemId: string
  ): EnergyManager {
    const values = valuesToStringList(status);

    return {
      sumState: tryParseFloat(values[0]),
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
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

  /**
   * Returns all items.
   * @throws {@link ClientError}
   */
  public async getItems(): Promise<EnergyManager[]> {
    const status = await this.getCompleteStatus(systemType);
    return systemFilteredByItems(this.client.systemConfig[systemType]).map((key) => {
      return this.parseItem(this.client.systemConfig[systemType], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param itemId - The item id.
   * @throws {@link ClientError}
   */
  public async getItemById(itemId: string): Promise<EnergyManager> {
    const status = await this.getStatusById(systemType, itemId);
    return this.parseItem(this.client.systemConfig[systemType], status, itemId);
  }

  /**
   * Returns all trends.
   * @param startDate - The start date as date string.
   * @param endDate - The start date as date string.
   * @param count - The data count.
   * @throws {@link ClientError}
   */
  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend[]> {
    return await this.getTrendsStatuses(systemType, startDate, endDate, count);
  }

  /**
   * Returns a single trend by item id.
   * @param itemId - The item id.
   * @param startDate - The start date as date string.
   * @param endDate - The start date as date string.
   * @param count - The data count.
   * @throws {@link ClientError}
   */
  public async getTrendByItemId(
    itemId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    return await this.getTrendStatus(systemType, itemId, startDate, endDate, count);
  }
}

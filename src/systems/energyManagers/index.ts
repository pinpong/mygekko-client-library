import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { EnergyManager } from './types';

const res = SystemType.energyManagers;

export class EnergyManagers extends BaseSystem {
  /**
   * Parses the item
   * @param {SystemConfig} config  the myGEKKO device configuration
   * @param {string} status the response from the status request
   * @param {string} itemId  the item id
   * @returns {EnergyManager} a parsed item
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
   * @returns {Promise<EnergyManager[]>} a item
   * @throws {Error}
   */
  public async getItems(): Promise<EnergyManager[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param {string} itemId  the item id
   * @returns {Promise<EnergyManager>} a item
   * @throws {Error}
   */
  public async getItemById(itemId: string): Promise<EnergyManager> {
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
   * Returns a single trend by item id.
   * @param {string} itemId  the item id
   * @param {string} startDate the start date as date string
   * @param {string} endDate the start date as date string
   * @param {number} count  the data count
   * @returns {Promise<Trend>} a trend
   * @throws {Error}
   */
  public async getTrendByItemId(
    itemId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    return await this.getTrendStatus(res, itemId, startDate, endDate, count);
  }
}

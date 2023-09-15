import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import {
  CoolingModeState,
  DehumidificationState,
  Vent,
  VentBypassState,
  VentLevel,
  VentWorkingModeIndividual,
  VentWorkingModePluggit,
  VentWorkingModeProxxonV1,
  VentWorkingModeProxxonV2,
  VentWorkingModeStiebelTecalor,
  VentWorkingModeWestaflex,
} from './types';

const res = SystemType.vents;

export class Vents extends BaseSystem {
  /**
   * Parses the item
   * @param {SystemConfig} config  the myGEKKO device configuration
   * @param {string} status the response from the status request
   * @param {string} itemId  the item id
   * @returns {Vent} a parsed item
   */
  private parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): Vent {
    const values = valuesToStringList(status);

    return {
      sumState: tryParseFloat(values[14]),
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
      ventLevel: tryParseFloat(values[0]),
      deviceModel: tryParseFloat(values[1]),
      workingMode: tryParseFloat(values[2]),
      bypassState: tryParseFloat(values[3]),
      maximumWorkingLevel: tryParseFloat(values[4]),
      relativeHumidity: tryParseFloat(values[5]),
      airQuality: tryParseFloat(values[6]),
      co2: tryParseFloat(values[7]),
      supplyAirTemperature: tryParseFloat(values[8]),
      exhaustAirTemperature: tryParseFloat(values[9]),
      outsideAirTemperature: tryParseFloat(values[10]),
      outgoingAirTemperature: tryParseFloat(values[11]),
      supplyAirWorkingLevel: tryParseFloat(values[12]),
      exhaustAirWorkingLevel: tryParseFloat(values[13]),
      subWorkingMode: tryParseFloat(values[15]),
      coolingModeState: tryParseFloat(values[16]),
      dehumidificationState: tryParseFloat(values[17]),
      bypassMode: tryParseFloat(values[18]),
    };
  }

  /**
   * Returns all items.
   * @returns {Promise<Vent[]>} a item
   * @throws {Error}
   */
  public async getItems(): Promise<Vent[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param {string} itemId  the item id
   * @returns {Promise<Vent>} a item
   * @throws {Error}
   */
  public async getItemById(itemId: string): Promise<Vent> {
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

  /**
   * Sets the mode.
   * @param {string} itemId  the item id
   * @param {VentWorkingModeProxxonV1 | VentWorkingModeProxxonV2 | VentWorkingModeWestaflex | VentWorkingModeStiebelTecalor | VentWorkingModeIndividual | VentWorkingModePluggit} mode the new mode
   */
  public async setMode(
    itemId: string,
    mode:
      | VentWorkingModeProxxonV1
      | VentWorkingModeProxxonV2
      | VentWorkingModeWestaflex
      | VentWorkingModeStiebelTecalor
      | VentWorkingModeIndividual
      | VentWorkingModePluggit
  ): Promise<void> {
    await this.client.changeRequest(res, itemId, `M${mode}`);
  }

  /**
   * Sets the vent lelve.
   * @param {string} itemId  the item id
   * @param  {VentLevel} ventLevel the new vent level
   */
  public async setLevel(itemId: string, ventLevel: VentLevel): Promise<void> {
    let level = -1;
    switch (ventLevel) {
      case VentLevel.off:
        level = -1;
        break;
      case VentLevel.level1:
        level = 1;
        break;
      case VentLevel.level2:
        level = 2;
        break;
      case VentLevel.level3:
        level = 3;
        break;
      case VentLevel.level4:
        level = 4;
        break;
    }
    await this.client.changeRequest(res, itemId, `${level}`);
  }

  /**
   * Sets the bypass state.
   * @param {string} itemId  the item id
   * @param {VentBypassState} state the new bypass state
   */
  public async setByPassState(itemId: string, state: VentBypassState): Promise<void> {
    await this.client.changeRequest(res, itemId, `BY${state}`);
  }

  /**
   * Sets the cooling mode state.
   * @param {string} itemId  the item id
   * @param {CoolingModeState} state the new cooling mode state
   */
  public async setCoolingModeState(itemId: string, state: CoolingModeState): Promise<void> {
    await this.client.changeRequest(res, itemId, `C${state}`);
  }

  /**
   * Sets the dehumidification state.
   * @param {string} itemId  the item id
   * @param {DehumidificationState} state the new dehumidification state
   */
  public async setDehumidificationState(
    itemId: string,
    state: DehumidificationState
  ): Promise<void> {
    await this.client.changeRequest(res, itemId, `D${state}`);
  }
}

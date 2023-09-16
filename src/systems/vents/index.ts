import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import {
  Vent,
  VentBypassState,
  VentCoolingModeState,
  VentDehumidificationState,
  VentLevel,
  VentWorkingModeIndividual,
  VentWorkingModePluggit,
  VentWorkingModeProxxonV1,
  VentWorkingModeProxxonV2,
  VentWorkingModeStiebelTecalor,
  VentWorkingModeWestaflex,
} from './types';

const systemType = SystemType.vents;

/**
 * @group Systems
 */
export class Vents extends BaseSystem {
  /**
   * Parses the item.
   * @param config - The myGEKKO device configuration.
   * @param status - The response from the status request.
   * @param itemId - The item id.
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
   * @throws {@link ClientError}
   */
  public async getItems(): Promise<Vent[]> {
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
  public async getItemById(itemId: string): Promise<Vent> {
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

  /**
   * Sets the mode.
   * @param itemId - The item id.
   * @param mode - The new mode.
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
    await this.client.changeRequest(systemType, itemId, `M${mode}`);
  }

  /**
   * Sets the vent level.
   * @param itemId - The item id.
   * @param ventLevel - The new vent level.
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
    await this.client.changeRequest(systemType, itemId, `${level}`);
  }

  /**
   * Sets the bypass state.
   * @param itemId - The item id.
   * @param state - The new bypass state.
   */
  public async setByPassState(itemId: string, state: VentBypassState): Promise<void> {
    await this.client.changeRequest(systemType, itemId, `BY${state}`);
  }

  /**
   * Sets the cooling mode state.
   * @param itemId - The item id.
   * @param state - The new cooling mode state.
   */
  public async setCoolingModeState(itemId: string, state: VentCoolingModeState): Promise<void> {
    await this.client.changeRequest(systemType, itemId, `C${state}`);
  }

  /**
   * Sets the dehumidification state.
   * @param itemId - The item id.
   * @param state - The new dehumidification state.
   */
  public async setDehumidificationState(
    itemId: string,
    state: VentDehumidificationState
  ): Promise<void> {
    await this.client.changeRequest(systemType, itemId, `D${state}`);
  }
}

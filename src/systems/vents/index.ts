import { SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
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

const res = SystemTypes.vents;

export class Vents extends BaseSystem {
  private parseItem(config: SystemConfig, status: string, key: string): Vent {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[14]),
      itemId: key,
      name: config[key].name,
      page: config[key].page,
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

  public async getItems(): Promise<Vent[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  public async getItemById(itemId: string): Promise<Vent> {
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

  public async setByPassState(itemId: string, state: VentBypassState): Promise<void> {
    await this.client.changeRequest(res, itemId, `BY${state}`);
  }

  public async setCoolingModeState(itemId: string, state: CoolingModeState): Promise<void> {
    await this.client.changeRequest(res, itemId, `C${state}`);
  }

  public async setDehumidificationState(
    itemId: string,
    state: DehumidificationState
  ): Promise<void> {
    await this.client.changeRequest(res, itemId, `D${state}`);
  }
}

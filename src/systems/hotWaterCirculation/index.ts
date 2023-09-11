import { BaseSystem } from '../base';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { HotWaterCirculation, HotWaterCirculationState } from './types';

const res = 'hotwater_circulations';

export class HotWaterCirculations extends BaseSystem {
  private parseItem(system: string, status: string, key: string): HotWaterCirculation {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[4]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      pumpType: tryParseFloat(values[0]),
      currentState: tryParseFloat(values[1]),
      returnWaterTemperature: tryParseFloat(values[2]),
      returnWaterTemperatureSetPoint: tryParseFloat(values[3]),
    };
  }

  async getAll(): Promise<HotWaterCirculation[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<HotWaterCirculation> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }

  async setState(id: string, state: HotWaterCirculationState): Promise<void> {
    await this.client.changeRequest(res, id, `${state}`);
  }
}

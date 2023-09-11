import { BaseSystem } from '../base';
import { Clock, ClockState } from './types';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';

const res = 'clocks';

export class Clocks extends BaseSystem {
  private parseItem(system: string, status: string, key: string): Clock {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[2]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      currentState: tryParseFloat(values[0]),
      startCondition: tryParseFloat(values[1]),
    };
  }

  async getAll(): Promise<Clock[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<Clock> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }

  async setState(id: string, state: ClockState): Promise<void> {
    await this.client.changeRequest(res, id, `${state}`);
  }
}

import { BaseSystem } from '../base';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { Action, ActionState } from './types';

const res = 'actions';

export class Actions extends BaseSystem {
  private parseItem(system: string, status: string, key: string): Action {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[2]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      currentState: tryParseFloat(values[0]),
      startCondition: tryParseFloat(values[1]),
      runtime: tryParseFloat(values[2]),
    };
  }

  async getAll(): Promise<Action[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<Action> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }

  async setState(id: string, state: ActionState): Promise<void> {
    await this.client.changeRequest(res, id, `${state}`);
  }
}

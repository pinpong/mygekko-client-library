import { BaseSystem } from '../base';
import { tryParseFloat } from '../../utils/numberUtils';
import { throwErrorIfSystemIsNotEnabled } from '../../utils/systemCheck';
import { GlobalAlarmItem } from './types';

const res = 'globals/alarm';

export class GlobalAlarm extends BaseSystem {
  private parseItem(status: string): GlobalAlarmItem {
    return {
      sumState: null,
      id: null,
      name: null,
      page: null,
      state: tryParseFloat(status['sumstate']['value']),
    };
  }

  async get(): Promise<GlobalAlarmItem> {
    const system = this.client.systemConfig['globals']['alarm'];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.client.systemStatusRequest(res);
    return this.parseItem(status);
  }
}

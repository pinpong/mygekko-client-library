import { BaseSystem } from '../base';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { AlarmSystem } from './types';

const res = 'alarmsystem';

export class AlarmSystems extends BaseSystem {
  private parseItem(system: string, status: string, key: string): AlarmSystem {
    const values = valuesToStringList(status, key);

    return {
      sumState: null,
      id: key,
      name: system[key].name,
      page: system[key].page,
      alarmSystemState: tryParseFloat(values[0]),
      alarmDevices: [
        {
          zone: '1',
          type: values[1],
          sharpState: tryParseFloat(values[2]),
          systemState: tryParseFloat(values[3]),
        },
        {
          zone: '2',
          type: values[4],
          sharpState: tryParseFloat(values[5]),
          systemState: tryParseFloat(values[6]),
        },
      ],
      deviceModel: tryParseFloat(values[7]),
    };
  }

  async getAll(): Promise<AlarmSystem[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<AlarmSystem> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }

  async setSharped(id: string, zone: number): Promise<void> {
    await this.client.changeRequest(res, id, `${zone}`);
  }
}

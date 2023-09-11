import { BaseSystem } from '../base';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { Sauna, SaunaWorkingMode } from './types';

const res = 'saunas';

export class Saunas extends BaseSystem {
  private parseItem(system: string, status: string, key: string): Sauna {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[3]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      workingMode: tryParseFloat(values[0]),
      currentState: tryParseFloat(values[1]),
      errorState: tryParseFloat(values[4]),
      roomTemperature: tryParseFloat(values[5]),
      roomTemperatureSetPoint: tryParseFloat(values[6]),
      burnerTemperature: tryParseFloat(values[7]),
      roomRelativeHumidityLevel: tryParseFloat(values[8]),
      roomRelativeHumiditySetPointLevel: tryParseFloat(values[9]),
    };
  }

  async getAll(): Promise<Sauna[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<Sauna> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }

  async setMode(id: string, mode: SaunaWorkingMode): Promise<void> {
    await this.client.changeRequest(res, id, `${mode}`);
  }
}

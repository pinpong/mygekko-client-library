import { BaseSystem } from '../base';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { HeatingCircuit } from './types';

const res = 'heatingcircuits';

export class HeatingCircuits extends BaseSystem {
  private parseItem(system: string, status: string, key: string): HeatingCircuit {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[8]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      deviceModel: tryParseFloat(values[0]),
      flowTemperature: tryParseFloat(values[1]),
      returnFlowTemperature: tryParseFloat(values[2]),
      dewPoint: tryParseFloat(values[3]),
      pumpWorkingLevel: tryParseFloat(values[4]),
      coolingModeState: tryParseFloat(values[5]),
      flowTemperatureSetPoint: tryParseFloat(values[6]),
      valveOpeningLevel: tryParseFloat(values[7]),
      currentState: tryParseFloat(values[9]),
    };
  }

  async getAll(): Promise<HeatingCircuit[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<HeatingCircuit> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }
}

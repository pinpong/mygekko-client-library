import { BaseSystem } from '../base';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { ControlCircuit } from './types';

const res = 'controlcircuits';

export class ControlCircuits extends BaseSystem {
  private parseItem(system: string, status: string, key: string): ControlCircuit {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[2]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      sensorValue: tryParseFloat(values[0]),
      sensorType: tryParseFloat(values[1]),
      pump1WorkingPowerLevel: tryParseFloat(values[3]),
      pump2WorkingPowerLevel: tryParseFloat(values[4]),
      pump3WorkingPowerLevel: tryParseFloat(values[5]),
    };
  }

  async getAll(): Promise<ControlCircuit[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<ControlCircuit> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }
}

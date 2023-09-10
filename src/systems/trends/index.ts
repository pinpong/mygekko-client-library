import { BaseSystem } from "../base";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { Trend } from "./types";

const res = "trends";

export class Trends extends BaseSystem {
  private parseItem(system: string, status: string, key: string): Trend {
    const values = valuesToStringList(status, key);

    return {
      sumState: tryParseFloat(values[20]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      trendsVariables: [
        {
          currentState: tryParseFloat(values[0]),
          type: tryParseFloat(values[1]),
          name: values[2],
          value: tryParseFloat(values[3]),
          unit: values[4],
        },
        {
          currentState: tryParseFloat(values[5]),
          type: tryParseFloat(values[6]),
          name: values[7],
          value: tryParseFloat(values[8]),
          unit: values[9],
        },
        {
          currentState: tryParseFloat(values[10]),
          type: tryParseFloat(values[11]),
          name: values[12],
          value: tryParseFloat(values[13]),
          unit: values[14],
        },
        {
          currentState: tryParseFloat(values[15]),
          type: tryParseFloat(values[16]),
          name: values[17],
          value: tryParseFloat(values[18]),
          unit: values[19],
        },
      ],
    };
  }

  async getAll(): Promise<Trend[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<Trend> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }
}

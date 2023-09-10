import { Client } from "../../client";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";
import { Trend } from "./types";

const res = "trends";

export class Trends extends Client {
  private parseTrendItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);
    const item: Trend = {
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
    return item;
  }

  async getTrends(): Promise<Trend[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseTrendItem(system, status, key);
    });
  }

  async getTrend(id: string): Promise<Trend> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseTrendItem(this.system[res], status, id);
  }
}

import { Client } from "../../client";
import { tryParseInt } from "../../utils/numberUtils";
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
      sumState: tryParseInt(values[20]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      trendsVariables: [
        {
          currentState: tryParseInt(values[0]),
          type: tryParseInt(values[1]),
          name: values[2],
          value: tryParseInt(values[3]),
          unit: values[4],
        },
        {
          currentState: tryParseInt(values[5]),
          type: tryParseInt(values[6]),
          name: values[7],
          value: tryParseInt(values[8]),
          unit: values[9],
        },
        {
          currentState: tryParseInt(values[10]),
          type: tryParseInt(values[11]),
          name: values[12],
          value: tryParseInt(values[13]),
          unit: values[14],
        },
        {
          currentState: tryParseInt(values[15]),
          type: tryParseInt(values[16]),
          name: values[17],
          value: tryParseInt(values[18]),
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

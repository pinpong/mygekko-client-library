import { BaseSystem } from "../base";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { Cam } from "./types";

const res = "cams";

export class Cams extends BaseSystem {
  private parseItem(system: string, status: string, key: string): Cam {
    const values = valuesToStringList(status, key);

    return {
      sumState: null,
      id: key,
      name: system[key].name,
      page: system[key].page,
      newRecordCount: tryParseFloat(values[0]),
      imageUrl: system[key].imagepath ?? null,
      streamUrl: system[key].streampath ?? null,
      cgiUrl: system[key].cgipath ?? null,
    };
  }

  async getAll(): Promise<Cam[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<Cam> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }
}

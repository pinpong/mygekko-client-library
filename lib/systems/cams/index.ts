import { Client } from "../../client";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { Cam } from "./types";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";

const res = "cams";

export class Cams extends Client {
  private parseCamItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);
    const item: Cam = {
      sumState: null,
      id: key,
      name: system[key].name,
      page: system[key].page,
      newRecordCount: tryParseFloat(values[0]),
      imageUrl: system[key].imagepath ?? null,
      streamUrl: system[key].streampath ?? null,
      cgiUrl: system[key].cgipath ?? null,
    };
    return item;
  }

  async getCams(): Promise<Cam[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);
    return systemFilteredByItems(system).map((key) => {
      return this.parseCamItem(system, status, key);
    });
  }

  async getCam(id: string): Promise<Cam> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseCamItem(this.system[res], status, id);
  }
}

import { Client } from "../../client";
import { tryParseInt } from "../../utils/numberUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";
import { GlobalAlarmItem } from "./types";

const res = "globals/alarm";

export class GlobalAlarm extends Client {
  private parseGlobalAlarmItem(status: string, key: string) {
    const item: GlobalAlarmItem = {
      sumState: null,
      id: key,
      name: null,
      page: null,
      state: tryParseInt(status["sumstate"]["value"]),
    };
    return item;
  }

  async getGlobalAlarm(): Promise<GlobalAlarmItem> {
    const system = this.system["globals"]["alarm"];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);
    return this.parseGlobalAlarmItem(status, null);
  }
}

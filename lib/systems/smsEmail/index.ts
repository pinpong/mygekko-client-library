import { Client } from "../../client";
import { SmsEmail, SmsEmailState } from "./types";
import { tryParseInt } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";

const res = "smsemail";

export class SmsEmails extends Client {
  private parseSmsEmailItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);
    const item: SmsEmail = {
      sumState: null,
      id: key,
      name: system[key].name,
      page: system[key].page,
      currentState: tryParseInt(values[0]),
    };
    return item;
  }

  async getSmsEmails(): Promise<SmsEmail[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseSmsEmailItem(system, status, key);
    });
  }

  async getSmsEmail(id: string): Promise<SmsEmail> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseSmsEmailItem(this.system[res], status, id);
  }

  async setSmsEmailState(id: string, state: SmsEmailState) {
    let value = -1;
    switch (state) {
      case SmsEmailState.off:
        value = -1;
        break;
      case SmsEmailState.on:
        value = 1;
        break;
    }
    await this.changeRequest(res, id, `${value}`);
  }
}

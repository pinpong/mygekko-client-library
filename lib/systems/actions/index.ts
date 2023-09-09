import { Client } from "../../client";
import { tryParseInt } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { Action, ActionState } from "./types";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";

const res = "actions";

export class Actions extends Client {
  private parseActionItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);
    const item: Action = {
      sumState: tryParseInt(values[2]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      currentState: tryParseInt(values[0]),
      startCondition: tryParseInt(values[1]),
    };

    return item;
  }

  async getActions(): Promise<Action[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseActionItem(system, status, key);
    });
  }

  async getAction(id: string): Promise<Action> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseActionItem(this.system[res], status, id);
  }

  async setActionState(id: string, state: ActionState) {
    await this.changeRequest(res, id, `${state}`);
  }
}

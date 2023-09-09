import { Client } from "../../client";
import { tryParseInt } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { AlarmSystem } from "./types";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";

const res = "alarmsystem";

export class AlarmSystems extends Client {
  private parseAlarmSystemItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);
    const item: AlarmSystem = {
      sumState: null,
      id: key,
      name: system[key].name,
      page: system[key].page,
      alarmSystemState: tryParseInt(values[0]),
      alarmDevices: [
        {
          type: values[1],
          sharpState: tryParseInt(values[2]),
          systemState: tryParseInt(values[3]),
        },
        {
          type: values[4],
          sharpState: tryParseInt(values[5]),
          systemState: tryParseInt(values[6]),
        },
      ],
      deviceModel: tryParseInt(values[7]),
    };
    return item;
  }

  async getAlarmSystems(): Promise<AlarmSystem[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseAlarmSystemItem(system, status, key);
    });
  }

  async getAlarmSystem(id: string): Promise<AlarmSystem> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseAlarmSystemItem(this.system[res], status, id);
  }

  async setAlarmSystemSharped(id: string, zone: number) {
    await this.changeRequest(res, id, `${zone}`);
  }
}

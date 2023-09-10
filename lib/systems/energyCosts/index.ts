import { Client } from "../../client";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";
import { EnergyCost } from "./types";

const res = "energycosts";

export class EnergyCosts extends Client {
  private parseEnergyCostsItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);

    const item: EnergyCost = {
      sumState: tryParseFloat(values[15]),
      id: key,
      name: system[key].name,
      page: system[key].page,
      currentPower: tryParseFloat(values[0]),
      totalEnergyToday: tryParseFloat(values[1]),
      totalEnergyMonth: tryParseFloat(values[2]),
      totalEnergy: tryParseFloat(values[3]),
      nominalPower: tryParseFloat(values[4]),
      energyUnit: values[5],
      powerUnit: values[6],
      totalEnergyToday0h6h: tryParseFloat(values[7]),
      totalEnergyToday6h12h: tryParseFloat(values[8]),
      totalEnergyToday12h18h: tryParseFloat(values[9]),
      totalEnergyToday18h24h: tryParseFloat(values[10]),
      totalEnergyYesterday0h6h: tryParseFloat(values[11]),
      totalEnergyYesterday6h12h: tryParseFloat(values[12]),
      totalEnergyYesterday12h18h: tryParseFloat(values[13]),
      totalEnergyYesterday18h24h: tryParseFloat(values[14]),
      totalEnergyThisYear: tryParseFloat(values[15]),
      totalEnergyInPeriod: tryParseFloat(values[16]),
      startDateTotalEnergyInPeriod: values[17],
      counterDirection: tryParseFloat(values[18]),
    };
    return item;
  }

  async getEnergyCosts(): Promise<EnergyCost[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseEnergyCostsItem(system, status, key);
    });
  }

  async getEnergyCost(id: string): Promise<EnergyCost> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseEnergyCostsItem(this.system[res], status, id);
  }
}

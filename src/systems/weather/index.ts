import { BaseSystem } from "../base";
import { tryParseFloat } from "../../utils/numberUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";
import { WeatherItem } from "./types";

const res = "globals/meteo";

export class Weather extends BaseSystem {
  private parseItem(status: string): WeatherItem {
    return {
      sumState: null,
      id: null,
      name: null,
      page: null,
      twilight: tryParseFloat(status["twilight"]["value"]),
      humidity: tryParseFloat(status["humidity"]["value"]),
      brightness: tryParseFloat(status["brightness"]["value"]),
      brightnessWest: tryParseFloat(status["brightnessw"]["value"]),
      brightnessEast: tryParseFloat(status["brightnesso"]["value"]),
      wind: tryParseFloat(status["wind"]["value"]),
      temperature: tryParseFloat(status["temperature"]["value"]),
      rain: tryParseFloat(status["rain"]["value"]),
    };
  }

  async get(): Promise<WeatherItem> {
    const system = this.client.systemConfig["globals"]["meteo"];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.client.systemStatusRequest(res);
    return this.parseItem(status);
  }
}

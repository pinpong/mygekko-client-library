import { Client } from "../../client";
import { tryParseInt } from "../../utils/numberUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";
import { WeatherItem } from "./types";

const res = "globals/meteo";

export class Weather extends Client {
  private parseWeatherItem(system: string, status: string, key: string) {
    const item: WeatherItem = {
      sumState: null,
      id: key,
      name: null,
      page: null,
      twilight: tryParseInt(status["twilight"]["value"]),
      humidity: tryParseInt(status["humidity"]["value"]),
      brightness: tryParseInt(status["brightness"]["value"]),
      brightnessWest: tryParseInt(status["brightnessw"]["value"]),
      brightnessEast: tryParseInt(status["brightnesso"]["value"]),
      wind: tryParseInt(status["wind"]["value"]),
      temperature: tryParseInt(status["temperature"]["value"]),
      rain: tryParseInt(status["rain"]["value"]),
    };
    return item;
  }

  async getWeather(): Promise<WeatherItem> {
    const system = this.system["globals"]["meteo"];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);
    return this.parseWeatherItem(system, status, null);
  }
}

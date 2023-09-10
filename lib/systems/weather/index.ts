import { Client } from "../../client";
import { tryParseFloat } from "../../utils/numberUtils";
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
      twilight: tryParseFloat(status["twilight"]["value"]),
      humidity: tryParseFloat(status["humidity"]["value"]),
      brightness: tryParseFloat(status["brightness"]["value"]),
      brightnessWest: tryParseFloat(status["brightnessw"]["value"]),
      brightnessEast: tryParseFloat(status["brightnesso"]["value"]),
      wind: tryParseFloat(status["wind"]["value"]),
      temperature: tryParseFloat(status["temperature"]["value"]),
      rain: tryParseFloat(status["rain"]["value"]),
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

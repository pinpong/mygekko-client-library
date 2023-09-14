import { throwErrorIfSystemIsNotEnabled } from '../../utils/errorUtils';
import { tryParseFloat } from '../../utils/numberUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend, TrendItem } from '../base/types';
import { WeatherItem } from './types';

const res = SystemTypes.weather;

export class Weather extends BaseSystem {
  private parseItem(status: string): WeatherItem {
    return {
      sumState: null,
      itemId: null,
      name: null,
      page: null,
      twilight: tryParseFloat(status['twilight']['value']),
      humidity: tryParseFloat(status['humidity']['value']),
      brightness: tryParseFloat(status['brightness']['value']),
      brightnessWest: tryParseFloat(status['brightnessw']['value']),
      brightnessEast: tryParseFloat(status['brightnesso']['value']),
      wind: tryParseFloat(status['wind']['value']),
      temperature: tryParseFloat(status['temperature']['value']),
      rain: tryParseFloat(status['rain']['value']),
    };
  }

  private async parseWeatherItemTrend(
    res: SystemTypes,
    item: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    const trendItems: TrendItem[] = [];

    for (const trendId of Object.keys(item)) {
      const response = await this.client.request(
        `/trend/${res}/${trendId}/status?tstart=${startDate}&tend=${endDate}&datacount=${count}&`
      );

      trendItems.push({
        trendId: trendId,
        data: response['trendData'],
        dataCount: response['datacount'],
        description: item[trendId]['description'],
        endDate: endDate,
        startDate: startDate,
        unit: item[trendId]['unit'],
      });
    }
    return {
      itemId: null,
      name: null,
      trends: trendItems,
    };
  }

  public async getItem(): Promise<WeatherItem> {
    throwErrorIfSystemIsNotEnabled(this.client.systemConfig, res);

    const status = await this.client.systemStatusRequest(res);
    return this.parseItem(status);
  }

  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend> {
    throwErrorIfSystemIsNotEnabled(this.client.systemConfig, res);

    return await this.parseWeatherItemTrend(
      'meteo' as SystemTypes,
      this.client.trendConfig['globals']['meteo'],
      startDate,
      endDate,
      count
    );
  }
}

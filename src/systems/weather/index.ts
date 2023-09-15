import { SystemStatusResponse, TrendItemResponse } from '../../client';
import { throwErrorIfSystemIsNotEnabled } from '../../utils/errorUtils';
import { tryParseFloat } from '../../utils/numberUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend, TrendItem } from '../base/types';
import { WeatherItem } from './types';

const res = SystemType.weather;

export class Weather extends BaseSystem {
  /**
   * Parses the item @param status the response from the status request
   * @param {string} status the current myGEKKO device status
   * @returns {WeatherItem} a parsed item
   */
  private parseItem(status: SystemStatusResponse): WeatherItem {
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

  /**
   * Returns parsed weather item trend.
   * @param {string} res the start date as date string
   * @param {string} item the start date as date string
   * @param {string} startDate the start date as date string
   * @param {string} endDate the start date as date string
   * @param {number} count  the data count
   * @returns {Promise<Trend>} a parsed item
   */
  private async parseWeatherItemTrend(
    res: SystemType,
    item: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    const trendItems: TrendItem[] = [];

    for (const trendId of Object.keys(item)) {
      const response = await this.client.request<TrendItemResponse>(
        `/trend/${res}/${trendId}/status?tstart=${startDate}&tend=${endDate}&datacount=${count}&`
      );

      trendItems.push({
        trendId: trendId,
        data: response.trendData,
        dataCount: response.datacount,
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

  /**
   * Returns item.
   * @returns {Promise<WeatherItem>} a item
   * @throws {Error}
   */
  public async getItem(): Promise<WeatherItem> {
    throwErrorIfSystemIsNotEnabled(this.client.systemConfig, res);

    const status = await this.client.systemStatusRequest(res);
    return this.parseItem(status);
  }

  /**
   * Returns all trends.
   * @param {string} startDate the start date as date string
   * @param {string} endDate the start date as date string
   * @param {number} count  the data count
   * @returns {Promise<Trend>} a trend
   * @throws {Error}
   */
  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend> {
    throwErrorIfSystemIsNotEnabled(this.client.systemConfig, res);

    return await this.parseWeatherItemTrend(
      'meteo' as SystemType,
      this.client.trendConfig['globals']['meteo'],
      startDate,
      endDate,
      count
    );
  }
}

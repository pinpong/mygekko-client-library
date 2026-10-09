import {
  LocalClient,
  RemoteClient,
  SubSystemStatusResponse,
  TrendDescriptions,
  TrendItemResponse,
} from '../../client';
import {
  throwErrorIfSystemIsNotEnabled,
  throwErrorIfTrendIsNotEnabled,
} from '../../utils/errors/errorUtils';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { BaseSubSystem } from '../base';
import { SystemType, Trend, TrendItem } from '../base/types';
import { WeatherItem } from './types';

/**
 * @group Systems
 */
export class Weather extends BaseSubSystem<WeatherItem> {
  public constructor(client: LocalClient | RemoteClient) {
    /**
     * Parses the item.
     * @param status - The response from the status request.
     */
    function parseItem(status: SubSystemStatusResponse): WeatherItem {
      const wind = tryParseFloat(status['wind']?.['value']);

      return {
        sumState: null,
        itemId: null,
        name: null,
        page: null,
        twilight: tryParseFloat(status['twilight']?.['value']),
        humidity: tryParseFloat(status['humidity']?.['value']),
        brightness: tryParseFloat(status['brightness']?.['value']),
        brightnessWest: tryParseFloat(status['brightnessw']?.['value']),
        brightnessEast: tryParseFloat(status['brightnesso']?.['value']),
        wind: wind === null ? null : wind * 3.6,
        temperature: tryParseFloat(status['temperature']?.['value']),
        rain: tryParseFloat(status['rain']?.['value']),
      };
    }

    super(client, SystemType.weather, parseItem);
  }

  /**
   * Returns parsed weather item trend.
   * @param systemType - The start date as date string.
   * @param item - The start date as date string.
   * @param startDate - The start date as date string.
   * @param endDate - The start date as date string.
   * @param count - The data count.
   */
  private async parseWeatherItemTrend(
    systemType: SystemType,
    item: TrendDescriptions,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    const trendItems: TrendItem[] = [];

    for (const trendId of Object.keys(item)) {
      const response = await this.client.request<TrendItemResponse>(
        `/trend/${systemType}/${trendId}/status?tstart=${startDate}&tend=${endDate}&datacount=${count}&`
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
   * @throws {@link ClientError}
   */
  public async getItem(): Promise<WeatherItem> {
    throwErrorIfSystemIsNotEnabled(this.client.systemConfig, this.systemType);

    const status = await this.client.request<SubSystemStatusResponse>('/var/meteo/status?');
    return this.parseItem(status);
  }

  /**
   * Returns all trends.
   * @param startDate - The start date as date string.
   * @param endDate - The start date as date string.
   * @param count - The data count.
   * @throws {@link ClientError}
   */
  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend> {
    throwErrorIfSystemIsNotEnabled(this.client.systemConfig, this.systemType);
    throwErrorIfTrendIsNotEnabled(this.client.trendConfig, this.systemType);

    return await this.parseWeatherItemTrend(
      'meteo' as SystemType,
      this.client.trendConfig['globals']['meteo'],
      startDate,
      endDate,
      count
    );
  }
}

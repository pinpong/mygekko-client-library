import {
  ItemStatusResponse,
  LocalClient,
  RemoteClient,
  SystemConfig,
  SystemStatusResponse,
} from '../../client';
import { CLIENT_ERROR_MESSAGES, ClientError } from '../../errors';
import {
  throwErrorIfItemIdIsNoFound,
  throwErrorIfSystemIsNotEnabled,
  throwErrorIfTrendIsNotEnabled,
} from '../../utils/errors/errorUtils';
import { systemFilteredByItems } from '../../utils/extensions/stringUtils';
import { SystemType, Trend, TrendItem } from './types';

class Base {
  /** The client instance */
  protected readonly client: LocalClient | RemoteClient;

  /**
   * The base system constructor.
   * @param client - The client.
   */
  public constructor(client: LocalClient | RemoteClient) {
    this.client = client;
  }

  /**
   * Return a parsed trend.
   * @param systemType - The system type.
   * @param item - The item.
   * @param itemId - The item id.
   * @param startDate - The start date as date string.
   * @param endDate - The start date as date string.
   * @param count - The data count.
   * @throws {@link ClientError}
   */
  protected async parseItemTrend(
    systemType: SystemType,
    item: string,
    itemId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    const trendItems: TrendItem[] = [];

    for (const trendId of Object.keys(item['trends'])) {
      const response = await this.client.getTrendByItemId(
        systemType,
        itemId,
        trendId,
        startDate,
        endDate,
        count
      );

      trendItems.push({
        trendId: trendId,
        data: response.trendData,
        dataCount: response.datacount,
        description: item['trends'][trendId]['description'],
        endDate: endDate,
        startDate: startDate,
        unit: item['trends'][trendId]['unit'],
      });
    }
    return {
      itemId: itemId,
      name: item['name'],
      trends: trendItems,
    };
  }

  /**
   * Return parsed trends.
   * @param systemType - The system type.
   * @param startDate - The start date as date string.
   * @param endDate - The start date as date string.
   * @param count - The data count.
   * @throws {@link ClientError}
   */
  protected async getTrendsStatuses(
    systemType: SystemType,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend[]> {
    throwErrorIfTrendIsNotEnabled(this.client.trendConfig, systemType);

    const items: Trend[] = [];
    for (const key of Object.keys(this.client.trendConfig[systemType])) {
      items.push(
        await this.parseItemTrend(
          systemType,
          this.client.trendConfig[systemType][key],
          key,
          startDate,
          endDate,
          count
        )
      );
    }
    return items;
  }
}

/**
 *
 */
export class BaseSystem<T> extends Base {
  /** The client instance */
  protected readonly client: LocalClient | RemoteClient;
  protected readonly systemType: SystemType;
  protected readonly parseItem: (
    config: SystemConfig,
    status: ItemStatusResponse,
    itemId: string
  ) => T;

  /**
   * The base system constructor.
   * @param client - The client.
   * @param systemType - The system type
   * @param parseItem - The function to parse the item T
   */
  public constructor(
    client: LocalClient | RemoteClient,
    systemType: SystemType,
    parseItem: (config: SystemConfig, status: ItemStatusResponse, itemId: string) => T
  ) {
    super(client);
    this.client = client;
    this.systemType = systemType;
    this.parseItem = parseItem;
  }

  /**
   * Return the complete status by system.
   * @param systemType - The system type.
   * @throws {@link ClientError}
   */
  protected async getCompleteStatus(systemType: SystemType): Promise<SystemStatusResponse> {
    throwErrorIfSystemIsNotEnabled(this.client.systemConfig, systemType);

    return await this.client.systemStatusRequest(systemType);
  }

  /**
   * Return the status by system and item id.
   * @param systemType - The system type.
   * @param itemId - The item id.
   * @throws {@link ClientError}
   */
  protected async getStatusById(
    systemType: SystemType,
    itemId: string
  ): Promise<ItemStatusResponse> {
    throwErrorIfSystemIsNotEnabled(this.client.systemConfig, systemType);
    throwErrorIfItemIdIsNoFound(this.client.trendConfig, systemType, itemId);

    return await this.client.itemStatusRequest(systemType, itemId);
  }

  /**
   * Return a parsed trend item.
   * @param systemType - The system type.
   * @param itemId - The item id.
   * @param startDate - The start date as date string.
   * @param endDate - The start date as date string.
   * @param count - The data count.
   * @throws {@link ClientError}
   */
  protected async getTrendStatus(
    systemType: SystemType,
    itemId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    throwErrorIfTrendIsNotEnabled(this.client.trendConfig, systemType);
    throwErrorIfItemIdIsNoFound(this.client.trendConfig, systemType, itemId);

    return await this.parseItemTrend(
      systemType,
      this.client.trendConfig[systemType][itemId],
      itemId,
      startDate,
      endDate,
      count
    );
  }

  /**
   * Returns all items.
   * @throws {@link ClientError}
   */
  public async getItems(): Promise<T[]> {
    const status = await this.getCompleteStatus(this.systemType);
    return systemFilteredByItems(this.client.systemConfig[this.systemType]).map((key) => {
      return this.parseItem(this.client.systemConfig[this.systemType], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param itemId - The item id.
   */
  public async getItemById(itemId: string): Promise<T> {
    const status = await this.getStatusById(this.systemType, itemId);
    return this.parseItem(this.client.systemConfig[this.systemType], status, itemId);
  }

  /**
   * Returns all trends.
   * @param startDate - The start date as date string.
   * @param endDate - The start date as date string.
   * @param count - The data count.
   * @throws {@link ClientError}
   */
  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend[]> {
    return await this.getTrendsStatuses(this.systemType, startDate, endDate, count);
  }

  /**
   * Returns a single trend by item id.
   * @param itemId - The item id.
   * @param startDate - The start date as date string.
   * @param endDate - The start date as date string.
   * @param count - The data count.
   * @throws {@link ClientError}
   */
  public async getTrendByItemId(
    itemId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    return await this.getTrendStatus(this.systemType, itemId, startDate, endDate, count);
  }

  /**
   * Sets the state.
   * @param itemId - The item id.
   * @param state - The new state.
   * @throws {@link ClientError}
   */
}

export class BaseSubSystem<T> extends Base {
  /** The client instance */
  protected readonly client: LocalClient | RemoteClient;
  protected readonly systemType: SystemType;
  protected readonly parseItem: (status: SystemStatusResponse) => T;

  /**
   * The base system constructor.
   * @param client - The client.
   * @param systemType - The system type
   * @param parseItem - The function to parse the item T
   */
  public constructor(
    client: LocalClient | RemoteClient,
    systemType: SystemType,
    parseItem: (status: SystemStatusResponse) => T
  ) {
    super(client);
    this.client = client;
    this.systemType = systemType;
    this.parseItem = parseItem;
  }

  /**
   * Returns item.
   * @throws {@link ClientError}
   */
  public async getItem(): Promise<T> {
    throwErrorIfSystemIsNotEnabled(this.client.systemConfig, this.systemType);

    const status = await this.client.systemStatusRequest(this.systemType);
    return this.parseItem(status);
  }

  /**
   * Returns all trends.
   * @param startDate - The start date as date string.
   * @param endDate - The start date as date string.
   * @param count - The data count.
   * @throws {@link ClientError}
   */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend> {
    throw new ClientError(CLIENT_ERROR_MESSAGES.TREND_NOT_SUPPORTED);
  }
}

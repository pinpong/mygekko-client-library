import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { MultiRoom, MultiRoomPlayList, MultiRoomState } from './types';

const systemType = SystemType.multiRooms;

/**
 * @group Systems
 */
export class MultiRooms extends BaseSystem {
  /**
   * Parses the item.
   * @param config - The myGEKKO device configuration.
   * @param status - The response from the status request.
   * @param itemId - The item id.
   */
  private parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): MultiRoom {
    const values = valuesToStringList(status);

    return {
      sumState: null,
      itemId: itemId,
      name: config[itemId].name,
      page: config[itemId].page,
      currentState: tryParseFloat(values[0]),
      currentVolume: tryParseFloat(values[1]),
      currentPlayingTime: tryParseFloat(values[2]),
      currentAudioTitle: values[3],
      currentPlaylistIndex: tryParseFloat(values[4]),
      playList: this.parsePlayList(values),
      currentSongIndex: tryParseFloat(values[21]),
    };
  }

  private parsePlayList(values: string[]): MultiRoomPlayList[] {
    const items: MultiRoomPlayList[] = [];
    for (let i = 5; i < 21; i++) {
      items.push({
        index: i - 5,
        name: values[i],
      });
    }
    return items;
  }

  /**
   * Returns all items.
   * @throws {@link ClientError}
   */
  public async getItems(): Promise<MultiRoom[]> {
    const status = await this.getCompleteStatus(systemType);
    return systemFilteredByItems(this.client.systemConfig[systemType]).map((key) => {
      return this.parseItem(this.client.systemConfig[systemType], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param itemId - The item id.
   * @throws {@link ClientError}
   */
  public async getItemById(itemId: string): Promise<MultiRoom> {
    const status = await this.getStatusById(systemType, itemId);
    return this.parseItem(this.client.systemConfig[systemType], status, itemId);
  }

  /**
   * Returns all trends.
   * @param startDate - The start date as date string.
   * @param endDate - The start date as date string.
   * @param count - The data count.
   * @throws {@link ClientError}
   */
  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend[]> {
    return await this.getTrendsStatuses(systemType, startDate, endDate, count);
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
    return await this.getTrendStatus(systemType, itemId, startDate, endDate, count);
  }

  /**
   * Sets the state.
   * @param itemId - The item id.
   * @param state - The new state.
   */
  public async setState(itemId: string, state: MultiRoomState): Promise<void> {
    let value = 'STOP';
    switch (state) {
      case MultiRoomState.off:
        value = 'STOP';
        break;
      case MultiRoomState.on:
        value = 'PLAY';
        break;
    }
    await this.client.changeRequest(systemType, itemId, `${value}`);
  }

  /**
   * Sets the volume.
   * @param itemId - The item id.
   * @param volume - The new volume.
   */
  public async setVolume(itemId: string, volume: number): Promise<void> {
    await this.client.changeRequest(systemType, itemId, `V${volume}`);
  }

  /**
   * Sets the previous song.
   * @param itemId - The item id.
   */
  public async setPreviousSong(itemId: string): Promise<void> {
    await this.client.changeRequest(systemType, itemId, `N-1`);
  }

  /**
   * Sets the next song.
   * @param itemId - The item id.
   */
  public async setNextSong(itemId: string): Promise<void> {
    await this.client.changeRequest(systemType, itemId, `N+1`);
  }

  /**
   * Sets the play list.
   * @param itemId - The item id.
   * @param playListIndex - The new play list index.
   */
  public async setPlayList(itemId: string, playListIndex: number): Promise<void> {
    await this.client.changeRequest(systemType, itemId, `C${playListIndex}`);
  }
}

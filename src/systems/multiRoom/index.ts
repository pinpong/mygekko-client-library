import { ItemStatusResponse, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemType, Trend } from '../base/types';
import { MultiRoom, MultiRoomState, PlayList } from './types';

const res = SystemType.multiRooms;

export class MultiRooms extends BaseSystem {
  /**
   * Parses the item
   * @param {SystemConfig} config  the myGEKKO device configuration
   * @param {string} status the response from the status request
   * @param {string} itemId  the item id
   * @returns {MultiRoom} a parsed item
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

  private parsePlayList(values: string[]): PlayList[] {
    const items: PlayList[] = [];
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
   * @returns {Promise<MultiRoom[]>} a item
   * @throws {Error}
   */
  public async getItems(): Promise<MultiRoom[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status[key], key);
    });
  }

  /**
   * Returns a single item by id.
   * @param {string} itemId  the item id
   * @returns {Promise<MultiRoom>} a item
   * @throws {Error}
   */
  public async getItemById(itemId: string): Promise<MultiRoom> {
    const status = await this.getStatusById(res, itemId);
    return this.parseItem(this.client.systemConfig[res], status, itemId);
  }

  /**
   * Returns all trends.
   * @param {string} startDate the start date as date string
   * @param {string} endDate the start date as date string
   * @param {number} count  the data count
   * @returns {Promise<Trend>} a trend
   * @throws {Error}
   */
  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend[]> {
    return await this.getTrendsStatuses(res, startDate, endDate, count);
  }

  /**
   * Returns a single trend by item id.
   * @param {string} itemId  the item id
   * @param {string} startDate the start date as date string
   * @param {string} endDate the start date as date string
   * @param {number} count  the data count
   * @returns {Promise<Trend>} a trend
   * @throws {Error}
   */
  public async getTrendByItemId(
    itemId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    return await this.getTrendStatus(res, itemId, startDate, endDate, count);
  }

  /**
   * Sets the state.
   * @param {string} itemId  the item id
   * @param {MultiRoomState} state the new state
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
    await this.client.changeRequest(res, itemId, `${value}`);
  }

  /**
   * Sets the volume.
   * @param {string} itemId  the item id
   * @param {number} volume the new volume
   */
  public async setVolume(itemId: string, volume: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `V${volume}`);
  }

  /**
   * Sets the previous song.
   * @param {string} itemId  the item id
   */
  public async setPreviousSong(itemId: string): Promise<void> {
    await this.client.changeRequest(res, itemId, `N-1`);
  }

  /**
   * Sets the next song.
   * @param {string} itemId  the item id
   */
  public async setNextSong(itemId: string): Promise<void> {
    await this.client.changeRequest(res, itemId, `N+1`);
  }

  /**
   * Sets the play list.
   * @param {string} itemId  the item id
   * @param {number} playListIndex the new play list index
   */
  public async setPlayList(itemId: string, playListIndex: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `C${playListIndex}`);
  }
}

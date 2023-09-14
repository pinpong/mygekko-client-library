import { Config } from '../../client';
import { tryParseFloat } from '../../utils/numberUtils';
import { systemFilteredByItems, valuesToStringList } from '../../utils/stringUtils';
import { BaseSystem } from '../base';
import { SystemTypes, Trend } from '../base/types';
import { MultiRoom, MultiRoomState, PlayList } from './types';

const res = SystemTypes.multiRooms;

export class MultiRooms extends BaseSystem {
  private parseItem(config: Config, status: string, key: string): MultiRoom {
    const values = valuesToStringList(status, key);

    return {
      sumState: null,
      itemId: key,
      name: config[key].name,
      page: config[key].page,
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

  public async getItems(): Promise<MultiRoom[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  public async getItemById(itemId: string): Promise<MultiRoom> {
    const status = await this.getStatusById(res, itemId);
    return this.parseItem(this.client.systemConfig[res], status, itemId);
  }

  public async getTrends(startDate: string, endDate: string, count: number): Promise<Trend[]> {
    return await this.getTrendsStatus(res, startDate, endDate, count);
  }

  public async getTrendByItemId(
    itemId: string,
    startDate: string,
    endDate: string,
    count: number
  ): Promise<Trend> {
    return await this.getTrendStatus(res, itemId, startDate, endDate, count);
  }

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

  public async setVolume(itemId: string, volume: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `V${volume}`);
  }

  public async setPreviousSong(itemId: string): Promise<void> {
    await this.client.changeRequest(res, itemId, `N-1`);
  }

  public async setNextSong(itemId: string): Promise<void> {
    await this.client.changeRequest(res, itemId, `N+1`);
  }

  public async setPlayList(itemId: string, playListIndex: number): Promise<void> {
    await this.client.changeRequest(res, itemId, `C${playListIndex}`);
  }
}

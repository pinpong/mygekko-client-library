import { ItemStatusResponse, LocalClient, RemoteClient, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { MultiRoom, MultiRoomPlayList, MultiRoomState } from './types';

/**
 * @group Systems
 */
export class MultiRooms extends BaseSystem<MultiRoom> {
  public constructor(client: LocalClient | RemoteClient) {
    /**
     * Parse the playlist item
     * @param values - The status response values
     */
    function parsePlayList(values: string[]): MultiRoomPlayList[] {
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
     * Parses the item.
     * @param config - The myGEKKO device configuration.
     * @param status - The response from the status request.
     * @param itemId - The item id.
     */
    function parseItem(
      config: SystemConfig,
      status: ItemStatusResponse,
      itemId: string
    ): MultiRoom {
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
        playList: parsePlayList(values),
        currentSongIndex: tryParseFloat(values[21]),
      };
    }

    super(client, SystemType.multiRooms, parseItem);
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
    await this.client.changeRequest(this.systemType, itemId, `${value}`);
  }

  /**
   * Sets the volume.
   * @param itemId - The item id.
   * @param volume - The new volume.
   */
  public async setVolume(itemId: string, volume: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `V${volume}`);
  }

  /**
   * Sets the previous song.
   * @param itemId - The item id.
   */
  public async setPreviousSong(itemId: string): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `N-1`);
  }

  /**
   * Sets the next song.
   * @param itemId - The item id.
   */
  public async setNextSong(itemId: string): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `N+1`);
  }

  /**
   * Sets the play list.
   * @param itemId - The item id.
   * @param playListIndex - The new play list index.
   */
  public async setPlayList(itemId: string, playListIndex: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `C${playListIndex}`);
  }
}

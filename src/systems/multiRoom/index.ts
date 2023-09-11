import { BaseSystem } from "../base";
import { MultiRoom, MultiRoomState, PlayList } from "./types";
import { tryParseFloat } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";

const res = "multirooms";

export class MultiRooms extends BaseSystem {
  private parseItem(system: string, status: string, key: string): MultiRoom {
    const values = valuesToStringList(status, key);

    return {
      sumState: null,
      id: key,
      name: system[key].name,
      page: system[key].page,
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

  async getAll(): Promise<MultiRoom[]> {
    const status = await this.getCompleteStatus(res);
    return systemFilteredByItems(this.client.systemConfig[res]).map((key) => {
      return this.parseItem(this.client.systemConfig[res], status, key);
    });
  }

  async getById(id: string): Promise<MultiRoom> {
    const status = await this.getStatusById(res, id);
    return this.parseItem(this.client.systemConfig[res], status, id);
  }

  async setState(id: string, state: MultiRoomState): Promise<void> {
    let value = "STOP";
    switch (state) {
      case MultiRoomState.off:
        value = "STOP";
        break;
      case MultiRoomState.on:
        value = "PLAY";
        break;
    }
    await this.client.changeRequest(res, id, `${value}`);
  }

  async setVolume(id: string, volume: number): Promise<void> {
    await this.client.changeRequest(res, id, `V${volume}`);
  }

  async setPreviousSong(id: string): Promise<void> {
    await this.client.changeRequest(res, id, `N-1`);
  }

  async setNextSong(id: string): Promise<void> {
    await this.client.changeRequest(res, id, `N+1`);
  }

  async setPlayList(id: string, playListIndex: number): Promise<void> {
    await this.client.changeRequest(res, id, `C${playListIndex}`);
  }
}

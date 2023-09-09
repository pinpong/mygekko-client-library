import { Client } from "../../client";
import { MultiRoom, MultiRoomState } from "./types";
import { tryParseInt } from "../../utils/numberUtils";
import {
  systemFilteredByItems,
  valuesToStringList,
} from "../../utils/stringUtils";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";

const res = "multirooms";

export class MultiRooms extends Client {
  private parseMultiRoomItem(system: string, status: string, key: string) {
    const values = valuesToStringList(status, key);
    const item: MultiRoom = {
      sumState: null,
      id: key,
      name: system[key].name,
      page: system[key].page,
      currentState: tryParseInt(values[0]),
      currentVolume: tryParseInt(values[1]),
      currentPlayingTime: tryParseInt(values[2]),
      currentAudioTitle: values[3],
      currentPlaylistIndex: tryParseInt(values[4]),
      currentSongIndex: tryParseInt(values[22]),
    };

    for (let i = 0; i < 5; i++) {
      item.playList.push({ index: i, name: values[i] });
    }

    return item;
  }

  async getMultiRooms(): Promise<MultiRoom[]> {
    const system = this.system[res];
    throwErrorIfSystemIsNotEnabled(system);

    const status = await this.systemStatusRequest(res);

    return systemFilteredByItems(system).map((key) => {
      return this.parseMultiRoomItem(system, status, key);
    });
  }

  async getMultiRoom(id: string): Promise<MultiRoom> {
    throwErrorIfSystemIsNotEnabled(this.system[res]);

    const status = await this.itemStatusRequest(res, id);
    return this.parseMultiRoomItem(this.system[res], status, id);
  }

  async setMultiRoomState(id: string, state: MultiRoomState) {
    let value = "STOP";
    switch (state) {
      case MultiRoomState.off:
        value = "STOP";
        break;
      case MultiRoomState.on:
        value = "PLAY";
        break;
    }
    await this.changeRequest(res, id, `${value}`);
  }

  async setMultiRoomVolume(id: string, volume: number) {
    await this.changeRequest(res, id, `V${volume}`);
  }

  async setMultiRoomPreviousSong(id: string) {
    await this.changeRequest(res, id, `N-1`);
  }

  async setMultiRoomNextSong(id: string) {
    await this.changeRequest(res, id, `N+1`);
  }

  async setMultiRoomPlayList(id: string, playListIndex: number) {
    await this.changeRequest(res, id, `C${playListIndex}`);
  }
}

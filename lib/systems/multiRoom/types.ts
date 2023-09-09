import { BaseSystem } from "../base/types";

export type MultiRoom = BaseSystem & {
  currentState?: MultiRoomState;
  currentVolume?: number;
  currentPlayingTime?: number;
  currentAudioTitle?: string;
  currentPlaylistIndex?: number;
  playList?: PlayList[];
  currentSongIndex?: number;
};

export enum MultiRoomState {
  "off" = 0,
  "on" = 1,
}

export type PlayList = {
  index: number;
  name?: string;
};

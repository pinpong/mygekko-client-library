import { BaseSystemType } from '../base/types';

export type MultiRoom = BaseSystemType & {
  currentState: MultiRoomState | null;
  currentVolume: number | null;
  currentPlayingTime: number | null;
  currentAudioTitle: string | null;
  currentPlaylistIndex: number | null;
  playList: PlayList[] | null;
  currentSongIndex: number | null;
};

export enum MultiRoomState {
  'off' = 0,
  'on' = 1,
}

export type PlayList = {
  index: number | null;
  name: string | null;
};

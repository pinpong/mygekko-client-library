import { BaseSystemType } from '../base/types';

export type MultiRoom = BaseSystemType & {
  /** The current state */
  currentState: MultiRoomState | null;
  /** The current volume as 0-100 % */
  currentVolume: number | null;
  /** The current playing time as 0-... */
  currentPlayingTime: number | null;
  /** The current audio title */
  currentAudioTitle: string | null;
  /** The current play list indes */
  currentPlaylistIndex: number | null;
  /** The current play list as {@link PlayList[]} */
  playList: PlayList[] | null;
  /** The current song index */
  currentSongIndex: number | null;
};

/** The multiroom states */
export enum MultiRoomState {
  'off' = 0,
  'on' = 1,
}

/** The play list item */
export type PlayList = {
  /** The play list index */
  index: number | null;
  /** The play list name */
  name: string | null;
};

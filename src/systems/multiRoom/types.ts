import { BaseSystemType } from '../base/types';

/** @group Systems */
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
  /** The current play list */
  playList: MultiRoomPlayList[] | null;
  /** The current song index */
  currentSongIndex: number | null;
};

/**
 * The multiroom states.
 * @group Systems
 */
export enum MultiRoomState {
  'off' = 0,
  'on' = 1,
}

/** The play list item */
/** @group Systems */
export type MultiRoomPlayList = {
  /** The play list index */
  index: number | null;
  /** The play list name */
  name: string | null;
};

import { ItemStatusResponse, LocalClient, RemoteClient, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { Blind, BlindState } from './types';

/**
 * @group Systems
 */
export class Blinds extends BaseSystem<Blind> {
  public constructor(client: LocalClient | RemoteClient) {
    /**
     * Parses the item.
     * @param config - The myGEKKO device configuration.
     * @param status - The response from the status request.
     * @param itemId - The item id.
     */
    function parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): Blind {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[3]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page,
        currentState: tryParseFloat(values[0]),
        position: tryParseFloat(values[1]),
        rotationLevel: tryParseFloat(values[2]),
        rotationRange: tryParseFloat(values[4]),
      };
    }

    super(client, SystemType.blinds, parseItem);
  }

  /**
   * Sets the state.
   * @param itemId - The item id.
   * @param state - The new state.
   * @throws {@link ClientError}
   */
  public async setState(itemId: string, state: BlindState): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `${state}`);
  }

  /**
   * Sets the position.
   * @param itemId - The item id.
   * @param position - The new position.
   * @throws {@link ClientError}
   */
  public async setPosition(itemId: string, position: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `P${position}`);
  }

  /**
   * Sets the angle.
   * @param itemId - The item id.
   * @param angle - The new angle.
   * @throws {@link ClientError}
   */
  public async setAngle(itemId: string, angle: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `S${angle}`);
  }
}

import { ItemStatusResponse, LocalClient, RemoteClient, SystemItemsConfig } from '../../client';
import { roundCommandValue, tryParseFloat } from '../../utils/extensions/numberUtils';
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
    function parseItem(
      config: SystemItemsConfig,
      status: ItemStatusResponse,
      itemId: string
    ): Blind {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[3]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page ?? null,
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
   * @param position - The new position, rounded to one decimal.
   * @throws {@link ClientError}
   */
  public async setPosition(itemId: string, position: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `P${roundCommandValue(position)}`);
  }

  /**
   * Sets the angle.
   * @param itemId - The item id.
   * @param angle - The new angle, rounded to one decimal.
   * @throws {@link ClientError}
   */
  public async setAngle(itemId: string, angle: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `S${roundCommandValue(angle)}`);
  }

  /**
   * Toggles the state.
   * @param itemId - The item id.
   */
  public async toggle(itemId: string): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `T`);
  }
}

import { ItemStatusResponse, LocalClient, RemoteClient, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { Light, LightState } from './types';

/**
 * @group Systems
 */
export class Lights extends BaseSystem<Light> {
  public constructor(client: LocalClient | RemoteClient) {
    /**
     * Parses the item.
     * @param config - The myGEKKO device configuration.
     * @param status - The response from the status request.
     * @param itemId - The item id.
     */
    function parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): Light {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[4]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page,
        currentState: tryParseFloat(values[0]),
        dimLevel: tryParseFloat(values[1]),
        rgbColor: tryParseFloat(values[2]),
        tunableWhiteLevel: tryParseFloat(values[3]),
      };
    }

    super(client, SystemType.lights, parseItem);
  }

  /**
   * Sets the state.
   * @param itemId - The item id.
   * @param state - The new state.
   */
  public async setState(itemId: string, state: LightState): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `${state}`);
  }

  /**
   * Sets the dim level.
   * @param itemId - The item id.
   * @param dimLevel - The new dim level.
   */
  public async setDimLevel(itemId: string, dimLevel: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `D${dimLevel}`);
  }

  /**
   * Sets the tunable white level.
   * @param itemId - The item id.
   * @param tunableWhiteLevel - The new tunable white level.
   */
  public async setTunableWhiteLevel(itemId: string, tunableWhiteLevel: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `TW${tunableWhiteLevel}`);
  }

  /**
   * Sets the color.
   * @param itemId - The item id.
   * @param color - The new color.
   */
  public async setColor(itemId: string, color: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `C${color}`);
  }
}

import { ItemStatusResponse, LocalClient, RemoteClient, SystemItemsConfig } from '../../client';
import { roundCommandValue, tryParseFloat } from '../../utils/extensions/numberUtils';
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
    function parseItem(
      config: SystemItemsConfig,
      status: ItemStatusResponse,
      itemId: string
    ): Light {
      const values = valuesToStringList(status);
      const dimLevel = tryParseFloat(values[1]);

      return {
        sumState: tryParseFloat(values[4]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page ?? null,
        currentState: tryParseFloat(values[0]),
        // the device reports dim levels outside of 0-100 at times
        dimLevel: dimLevel === null ? null : Math.min(Math.max(dimLevel, 0), 100),
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
   * @param dimLevel - The new dim level as 0-100 %, rounded to one decimal.
   */
  public async setDimLevel(itemId: string, dimLevel: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `D${roundCommandValue(dimLevel)}`);
  }

  /**
   * Sets the tunable white level.
   * @param itemId - The item id.
   * @param tunableWhiteLevel - The new tunable white level as 0-100 % from warm to cold, rounded to one decimal.
   */
  public async setTunableWhiteLevel(itemId: string, tunableWhiteLevel: number): Promise<void> {
    await this.client.changeRequest(
      this.systemType,
      itemId,
      `TW${roundCommandValue(tunableWhiteLevel)}`
    );
  }

  /**
   * Sets the color.
   * @param itemId - The item id.
   * @param color - The new color as 24 bit rgb decimal, see rgbToDecimal.
   */
  public async setColor(itemId: string, color: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `C${color}`);
  }

  /**
   * Toggles the state.
   * @param itemId - The item id.
   */
  public async toggle(itemId: string): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `T`);
  }
}

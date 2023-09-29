import { ItemStatusResponse, LocalClient, RemoteClient, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { AlarmSystem } from './types';

/**
 * Parses the item.
 * @param config - The myGEKKO device configuration.
 * @param status - The response from the status request.
 * @param itemId - The item id.
 */
/**
 * @group Systems
 */
export class AlarmSystems extends BaseSystem<AlarmSystem> {
  public constructor(client: LocalClient | RemoteClient) {
    /**
     * Parses the item.
     * @param config - The myGEKKO device configuration.
     * @param status - The response from the status request.
     * @param itemId - The item id.
     */
    function parseItem(
      config: SystemConfig,
      status: ItemStatusResponse,
      itemId: string
    ): AlarmSystem {
      const values = valuesToStringList(status);

      return {
        sumState: null,
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page,
        alarmSystemState: tryParseFloat(values[0]),
        alarmDevices: [
          {
            zone: '1',
            type: values[1],
            sharpState: tryParseFloat(values[2]),
            systemState: tryParseFloat(values[3]),
          },
          {
            zone: '2',
            type: values[4],
            sharpState: tryParseFloat(values[5]),
            systemState: tryParseFloat(values[6]),
          },
        ],
        deviceModel: tryParseFloat(values[7]),
      };
    }

    super(client, SystemType.alarmSystem, parseItem);
  }

  /**
   * Sets the state.
   * @param itemId - The item id.
   * @param zone - The zone.
   * @throws {@link ClientError}
   */
  public async setSharped(itemId: string, zone: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `${zone}`);
  }
}

import { ItemStatusResponse, LocalClient, RemoteClient, SystemItemsConfig } from '../../client';
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
      config: SystemItemsConfig,
      status: ItemStatusResponse,
      itemId: string
    ): AlarmSystem {
      const values = valuesToStringList(status);

      return {
        sumState: null,
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page ?? null,
        alarmSystemState: tryParseFloat(values[0]),
        alarmDevices: [
          {
            zone: config[itemId].zone1 ?? '1',
            deviceStatus: tryParseFloat(values[1]),
            sharpState: tryParseFloat(values[2]),
            systemState: tryParseFloat(values[3]),
          },
          {
            zone: config[itemId].zone2 ?? '2',
            deviceStatus: tryParseFloat(values[4]),
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
   * @param zone - The zone to sharp as 1-2, the device documents no command to unsharp.
   * @throws {@link ClientError}
   */
  public async setSharped(itemId: string, zone: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `${zone}`);
  }
}

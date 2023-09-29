import { ItemStatusResponse, LocalClient, RemoteClient, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { Camera } from './types';

/**
 * @group Systems
 */
export class Cameras extends BaseSystem<Camera> {
  public constructor(client: LocalClient | RemoteClient) {
    /**
     * Parses the item.
     * @param config - The myGEKKO device configuration.
     * @param status - The response from the status request.
     * @param itemId - The item id.
     */
    function parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): Camera {
      const values = valuesToStringList(status);

      return {
        sumState: null,
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page,
        newRecordCount: tryParseFloat(values[0]),
        imageUrl: config[itemId]['imagepath'] ?? null,
        streamUrl: config[itemId]['streampath'] ?? null,
        cgiUrl: config[itemId]['cgipath'] ?? null,
      };
    }

    super(client, SystemType.cameras, parseItem);
  }
}

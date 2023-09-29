import { ItemStatusResponse, LocalClient, RemoteClient, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { Analysis } from './types';

/**
 * @group Systems
 */
export class Analyses extends BaseSystem<Analysis> {
  public constructor(client: LocalClient | RemoteClient) {
    /**
     * Parses the item.
     * @param config - The myGEKKO device configuration.
     * @param status - The response from the status request.
     * @param itemId - The item id.
     */
    function parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): Analysis {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[20]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page,
        analysisVariables: [
          {
            currentState: tryParseFloat(values[0]),
            type: tryParseFloat(values[1]),
            name: values[2],
            value: tryParseFloat(values[3]),
            unit: values[4],
          },
          {
            currentState: tryParseFloat(values[5]),
            type: tryParseFloat(values[6]),
            name: values[7],
            value: tryParseFloat(values[8]),
            unit: values[9],
          },
          {
            currentState: tryParseFloat(values[10]),
            type: tryParseFloat(values[11]),
            name: values[12],
            value: tryParseFloat(values[13]),
            unit: values[14],
          },
          {
            currentState: tryParseFloat(values[15]),
            type: tryParseFloat(values[16]),
            name: values[17],
            value: tryParseFloat(values[18]),
            unit: values[19],
          },
        ],
      };
    }

    super(client, SystemType.analyses, parseItem);
  }
}

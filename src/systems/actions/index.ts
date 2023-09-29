import { ItemStatusResponse, LocalClient, RemoteClient, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { Action, ActionState } from './types';

/**
 * @group Systems
 */
export class Actions extends BaseSystem<Action> {
  public constructor(client: LocalClient | RemoteClient) {
    /**
     * Parses the item.
     * @param config - The myGEKKO device configuration.
     * @param status - The response from the status request.
     * @param itemId - The item id.
     */
    function parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): Action {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[2]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page,
        currentState: tryParseFloat(values[0]),
        startCondition: tryParseFloat(values[1]),
      };
    }

    super(client, SystemType.actions, parseItem);
  }

  /**
   * Sets the state.
   * @param itemId - The item id.
   * @param state - The new state.
   * @throws {@link ClientError}
   */
  public async setState(itemId: string, state: ActionState): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `${state}`);
  }
}

import { ItemStatusResponse, LocalClient, RemoteClient, SystemItemsConfig } from '../../client';
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
    function parseItem(
      config: SystemItemsConfig,
      status: ItemStatusResponse,
      itemId: string
    ): Action {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[2]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page ?? null,
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
    let value = -1;
    switch (state) {
      case ActionState.off:
        value = -1;
        break;
      case ActionState.on:
        value = 1;
        break;
    }
    await this.client.changeRequest(this.systemType, itemId, `${value}`);
  }

  /**
   * Toggles the state.
   * @param itemId - The item id.
   */
  public async toggle(itemId: string): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `T`);
  }
}

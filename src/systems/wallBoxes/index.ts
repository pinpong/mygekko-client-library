import { ItemStatusResponse, LocalClient, RemoteClient, SystemItemsConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { WallBox, WallBoxChargeState, WallBoxUser } from './types';

/**
 * @group Systems
 */
export class WallBoxes extends BaseSystem<WallBox> {
  public constructor(client: LocalClient | RemoteClient) {
    /**
     * Parse the wall box user item.
     * @param status - The status response
     */
    function parseWallBoxUser(status: ItemStatusResponse): WallBoxUser[] {
      const items: WallBoxUser[] = [];
      for (let i = 1; i < 7; i++) {
        const value = status[`user${i}_sumstate`]?.value;
        if (value != null) {
          items.push({
            id: i,
            totalEnergy: tryParseFloat(value.split(';')[0]),
          });
        }
      }
      return items;
    }
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
    ): WallBox {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[10]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page ?? null,
        pluggedState: tryParseFloat(values[0]),
        chargeState: tryParseFloat(values[1]),
        chargeRequestState: tryParseFloat(values[2]),
        currentChargingPower: tryParseFloat(values[3]),
        maximumChargingPower: tryParseFloat(values[4]),
        chargingPowerSetPoint: tryParseFloat(values[5]),
        electricCurrentSetPoint: tryParseFloat(values[6]),
        chargeUserName: values[7],
        chargeDurationTime: values[8],
        currentChargingEnergy: values[9],
        chargeStartTime: values[11],
        chargeUserIndex: tryParseFloat(values[12]),
        wallBoxUser: parseWallBoxUser(status),
      };
    }

    super(client, SystemType.wallBoxes, parseItem);
  }

  /**
   * Sets the charge state.
   * @param itemId - The item id.
   * @param state - The new charge state.
   */
  public async setChargeState(itemId: string, state: WallBoxChargeState): Promise<void> {
    let value = -1;

    switch (state) {
      case WallBoxChargeState.off:
      case WallBoxChargeState.paused:
        value = -1;
        break;
      case WallBoxChargeState.on:
        value = 1;
        break;
    }
    await this.client.changeRequest(this.systemType, itemId, `${value}`);
  }

  /**
   * Sets the power.
   * @param itemId - The item id.
   * @param power - The new power.
   */
  public async setChargePower(itemId: string, power: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `CS${power}`);
  }
}

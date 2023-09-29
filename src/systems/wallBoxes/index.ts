import { ItemStatusResponse, LocalClient, RemoteClient, SystemConfig } from '../../client';
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
     * @param itemId - The item id
     */
    function parseWallBoxUser(status: ItemStatusResponse, itemId: string): WallBoxUser[] {
      const items: WallBoxUser[] = [];
      for (let i = 1; i < 7; i++) {
        const value = status[itemId][`user${i}_sumstate`]['value'];
        if (value != null) {
          items.push({
            id: i,
            totalEnergy: value,
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
    function parseItem(config: SystemConfig, status: ItemStatusResponse, itemId: string): WallBox {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[10]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page,
        pluggedState: tryParseFloat(values[0]),
        chargeState: tryParseFloat(values[1]),
        chargeRequestState: tryParseFloat(values[2]),
        currentChargingPower: tryParseFloat(values[3]),
        maximumChargingPower: tryParseFloat(values[4]),
        chargingPowerSetPoint: tryParseFloat(values[5]),
        electricCurrentSetPoint: tryParseFloat(values[6]),
        chargeUserName: values[7],
        chargeDurationTime: tryParseFloat(values[8]),
        currentChargingEnergy: tryParseFloat(values[9]),
        chargeStartTime: values[11],
        chargeUserIndex: tryParseFloat(values[12]),
        wallBoxUser: parseWallBoxUser(status, itemId),
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

import { ItemStatusResponse, LocalClient, RemoteClient, SystemItemsConfig } from '../../client';
import { roundCommandValue, tryParseFloat } from '../../utils/extensions/numberUtils';
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
            totalEnergy: tryParseFloat(value),
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
        chargeUserName: values[7] ?? null,
        chargeDurationTime: values[8] ?? null,
        currentChargingEnergy: values[9] ?? null,
        chargeStartTime: values[11] ?? null,
        chargeUserIndex: values[12] ?? null,
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
    let value = 0;

    switch (state) {
      case WallBoxChargeState.off:
        value = 0;
        break;
      case WallBoxChargeState.on:
        value = 1;
        break;
      case WallBoxChargeState.paused:
        value = 2;
        break;
    }
    await this.client.changeRequest(this.systemType, itemId, `${value}`);
  }

  /**
   * Sets the power.
   * @param itemId - The item id.
   * @param power - The new absolute charging power as kilowatt, rounded to one decimal.
   */
  public async setChargePower(itemId: string, power: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `CS${roundCommandValue(power)}`);
  }

  /**
   * Resets the history of a user.
   * @param itemId - The item id.
   * @param user - The user as 1-20.
   */
  public async resetUserHistory(itemId: string, user: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `R${user}`);
  }

  /**
   * Starts a partial charge.
   * @param itemId - The item id.
   * @param energy - The energy to charge as kilowatt-hour, rounded to one decimal.
   */
  public async startPartialCharge(itemId: string, energy: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `P${roundCommandValue(energy)}`);
  }

  /**
   * Logs a user in.
   * @param itemId - The item id.
   * @param user - The user as 1-20.
   */
  public async loginUser(itemId: string, user: number): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `LI${user}`);
  }

  /**
   * Logs the current user out.
   * @param itemId - The item id.
   */
  public async logoutUser(itemId: string): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `LO`);
  }
}

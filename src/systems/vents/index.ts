import { ItemStatusResponse, LocalClient, RemoteClient, SystemItemsConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import {
  Vent,
  VentBypassState,
  VentCoolingModeState,
  VentDehumidificationState,
  VentDeviceModel,
  VentLevel,
  VentWorkingModeIndividual,
  VentWorkingModePluggit,
  VentWorkingModeProxxonV1,
  VentWorkingModeProxxonV2,
  VentWorkingModeStiebelTecalor,
  VentWorkingModeWestaflex,
} from './types';

/**
 * @group Systems
 */
export class Vents extends BaseSystem<Vent> {
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
    ): Vent {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[14]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page ?? null,
        ventLevel: tryParseFloat(values[0]),
        deviceModel: tryParseFloat(values[1]),
        workingMode: tryParseFloat(values[2]),
        bypassState: tryParseFloat(values[3]),
        maximumWorkingLevel: tryParseFloat(values[4]),
        relativeHumidity: tryParseFloat(values[5]),
        airQuality: tryParseFloat(values[6]),
        co2: tryParseFloat(values[7]),
        supplyAirTemperature: tryParseFloat(values[8]),
        exhaustAirTemperature: tryParseFloat(values[9]),
        outsideAirTemperature: tryParseFloat(values[10]),
        outgoingAirTemperature: tryParseFloat(values[11]),
        supplyAirWorkingLevel: tryParseFloat(values[12]),
        exhaustAirWorkingLevel: tryParseFloat(values[13]),
        subWorkingMode: tryParseFloat(values[15]),
        coolingModeState: tryParseFloat(values[16]),
        dehumidificationState: tryParseFloat(values[17]),
        bypassMode: tryParseFloat(values[18]),
      };
    }

    super(client, SystemType.vents, parseItem);
  }

  /**
   * Sets the mode.
   * @param itemId - The item id.
   * @param mode - The new mode.
   */
  public async setMode(
    itemId: string,
    mode:
      | VentWorkingModeProxxonV1
      | VentWorkingModeProxxonV2
      | VentWorkingModeWestaflex
      | VentWorkingModeStiebelTecalor
      | VentWorkingModeIndividual
      | VentWorkingModePluggit
  ): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `M${mode}`);
  }

  /**
   * Sets the vent level.
   * @param itemId - The item id.
   * @param ventLevel - The new vent level.
   */
  public async setLevel(itemId: string, ventLevel: VentLevel): Promise<void> {
    let level = -1;
    switch (ventLevel) {
      case VentLevel.off:
        level = -1;
        break;
      case VentLevel.level1:
        level = 1;
        break;
      case VentLevel.level2:
        level = 2;
        break;
      case VentLevel.level3:
        level = 3;
        break;
      case VentLevel.level4:
        level = 4;
        break;
    }
    await this.client.changeRequest(this.systemType, itemId, `${level}`);
  }

  /**
   * Sets the bypass state.
   * @param itemId - The item id.
   * @param state - The new bypass state.
   */
  public async setByPassState(itemId: string, state: VentBypassState): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `BY${state}`);
  }

  /**
   * Sets the cooling mode state.
   * @param itemId - The item id.
   * @param state - The new cooling mode state.
   */
  public async setCoolingModeState(itemId: string, state: VentCoolingModeState): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `C${state}`);
  }

  /**
   * Sets the dehumidification state.
   * @param itemId - The item id.
   * @param state - The new dehumidification state.
   */
  public async setDehumidificationState(
    itemId: string,
    state: VentDehumidificationState
  ): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `D${state}`);
  }

  /**
   * Toggles the state.
   * @param itemId - The item id.
   */
  public async toggle(itemId: string): Promise<void> {
    await this.client.changeRequest(this.systemType, itemId, `T`);
  }

  /**
   * Returns the working modes of a device model by name, the meaning of a mode depends on the model.
   * @param deviceModel - The device model.
   */
  public getWorkingModes(deviceModel: VentDeviceModel | null): { [name: string]: number } {
    switch (deviceModel) {
      case VentDeviceModel.pluggit:
        return {
          auto: VentWorkingModePluggit.auto,
          manual: VentWorkingModePluggit.manual,
          pluggitAuto: VentWorkingModePluggit.pluggitAuto,
          pluggitWeek: VentWorkingModePluggit.pluggitWeek,
        };
      case VentDeviceModel.zimmermannV2:
        return {
          off: VentWorkingModeProxxonV2.off,
          ecoSummer: VentWorkingModeProxxonV2.ecoSummer,
          ecoWinter: VentWorkingModeProxxonV2.ecoWinter,
          comfort: VentWorkingModeProxxonV2.comfort,
          ovenOperation: VentWorkingModeProxxonV2.ovenOperation,
        };
      default:
        return { off: VentWorkingModeIndividual.off, on: VentWorkingModeIndividual.on };
    }
  }

  /**
   * Checks if the level of a vent can be set in its current working mode.
   * @param item - The item.
   */
  public isLevelSupported(item: Pick<Vent, 'deviceModel' | 'workingMode'>): boolean {
    if (item.deviceModel === VentDeviceModel.zimmermannV2) {
      return (
        item.workingMode === VentWorkingModeProxxonV2.ecoSummer ||
        item.workingMode === VentWorkingModeProxxonV2.ecoWinter
      );
    }
    return item.deviceModel !== null;
  }

  /**
   * Checks if a vent can be switched off by its level.
   * @param item - The item.
   */
  public isLevelOffSupported(
    item: Pick<Vent, 'deviceModel' | 'workingMode' | 'ventLevel'>
  ): boolean {
    if (item.deviceModel === VentDeviceModel.zimmermannV2) {
      return item.workingMode === VentWorkingModeProxxonV2.off || item.ventLevel === VentLevel.off;
    }
    return item.deviceModel !== null;
  }

  /**
   * Checks if the bypass state of a vent can be set.
   * @param item - The item.
   */
  public isBypassSupported(item: Pick<Vent, 'deviceModel'>): boolean {
    return (
      item.deviceModel === VentDeviceModel.standard || item.deviceModel === VentDeviceModel.pluggit
    );
  }

  /**
   * Checks if the cooling mode of a vent can be set in its current working mode.
   * @param item - The item.
   */
  public isCoolingSupported(item: Pick<Vent, 'deviceModel' | 'workingMode'>): boolean {
    if (item.deviceModel === VentDeviceModel.zimmermannV2) {
      return (
        item.workingMode === VentWorkingModeProxxonV2.comfort ||
        item.workingMode === VentWorkingModeProxxonV2.ecoSummer
      );
    }
    return this.isBypassSupported(item);
  }
}

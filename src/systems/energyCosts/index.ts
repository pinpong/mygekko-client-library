import { ItemStatusResponse, LocalClient, RemoteClient, SystemConfig } from '../../client';
import { tryParseFloat } from '../../utils/extensions/numberUtils';
import { valuesToStringList } from '../../utils/extensions/stringUtils';
import { BaseSystem } from '../base';
import { SystemType } from '../base/types';
import { EnergyCost } from './types';

/**
 * @group Systems
 */
export class EnergyCosts extends BaseSystem<EnergyCost> {
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
    ): EnergyCost {
      const values = valuesToStringList(status);

      return {
        sumState: tryParseFloat(values[15]),
        itemId: itemId,
        name: config[itemId].name,
        page: config[itemId].page,
        currentPower: tryParseFloat(values[0]),
        totalEnergyToday: tryParseFloat(values[1]),
        totalEnergyMonth: tryParseFloat(values[2]),
        totalEnergy: tryParseFloat(values[3]),
        nominalPower: tryParseFloat(values[4]),
        energyUnit: values[5],
        powerUnit: values[6],
        totalEnergyToday0h6h: tryParseFloat(values[7]),
        totalEnergyToday6h12h: tryParseFloat(values[8]),
        totalEnergyToday12h18h: tryParseFloat(values[9]),
        totalEnergyToday18h24h: tryParseFloat(values[10]),
        totalEnergyYesterday0h6h: tryParseFloat(values[11]),
        totalEnergyYesterday6h12h: tryParseFloat(values[12]),
        totalEnergyYesterday12h18h: tryParseFloat(values[13]),
        totalEnergyYesterday18h24h: tryParseFloat(values[14]),
        totalEnergyThisYear: tryParseFloat(values[15]),
        totalEnergyInPeriod: tryParseFloat(values[16]),
        startDateTotalEnergyInPeriod: values[17],
        counterDirection: tryParseFloat(values[18]),
      };
    }

    super(client, SystemType.energyCosts, parseItem);
  }
}

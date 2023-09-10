import { Client } from "../../index";
import { throwErrorIfSystemIsNotEnabled } from "../../utils/systemCheck";

export class BaseSystem {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  protected async getCompleteStatus(res: string): Promise<string> {
    throwErrorIfSystemIsNotEnabled(this.client.systemConfig[res]);

    return await this.client.systemStatusRequest(res);
  }

  protected async getStatusById(res: string, id: string): Promise<string> {
    throwErrorIfSystemIsNotEnabled(this.client.systemConfig[res]);

    return await this.client.itemStatusRequest(res, id);
  }
}

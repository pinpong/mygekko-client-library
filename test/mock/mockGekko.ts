/// <reference types="node" />
import axios, { AxiosError } from 'axios';
import { readFileSync } from 'fs';
import { createServer, Server } from 'http';
import { join } from 'path';

import { LocalClient } from '../../src';

/** The data served by the mocked myGEKKO device. */
export type MockGekkoData = {
  /** The system config, served for /var */
  config: object;
  /** The trend config, served for /trend */
  trend: object;
  /** The status values by system, served for /var/system/status */
  status: object;
};

/** A command received by the mocked myGEKKO device. */
export type MockGekkoCommand = {
  /** The system the command was sent to */
  system: string;
  /** The item the command was sent to */
  itemId: string;
  /** The sent value */
  value: string;
  /** Whether the value matches the command format the item documents */
  documented: boolean;
};

/** The response of the mocked myGEKKO device. */
export type MockGekkoResponse = {
  /** The http status */
  status: number;
  /** The response body */
  data: unknown;
};

/** The system config of a device by system and item. */
export type MockGekkoConfig = {
  [system: string]: { [itemId: string]: { [name: string]: { format?: string } } };
};

/**
 * Loads a fixture.
 * @param name - The file name of the fixture.
 */
function fixture(name: string): unknown {
  return JSON.parse(readFileSync(join(__dirname, '../fixtures', name), 'utf8'));
}

/**
 * Loads the demo data, the config documents the formats of the device dump.
 */
export function demoData(): MockGekkoData {
  return fixture('demo.json') as MockGekkoData;
}

/**
 * Loads the system config dumped from a real device.
 */
export function discoverData(): MockGekkoConfig {
  return fixture('discover.json') as MockGekkoConfig;
}

/**
 * Returns the node below the path or undefined if not found.
 * @param node - The node to start from.
 * @param path - The keys to follow.
 */
function find(node: unknown, path: string[]): unknown {
  for (const key of path) {
    if (typeof node !== 'object' || node === null) {
      return undefined;
    }
    node = (node as { [key: string]: unknown })[key];
  }
  return node;
}

/**
 * Checks if the value matches a command format like `-1|1|T|P55.4|Mx (Stop|Start|Toggle|Position|Mode)`.
 * @param format - The command format of the item.
 * @param value - The sent value.
 */
function isDocumented(format: unknown, value: string): boolean {
  if (typeof format !== 'string') {
    return false;
  }
  return format
    .split(' (')[0]
    .split('|')
    .some((token) => {
      const prefix = token.match(/^([A-Za-z]+?)(?:[-+]?\d|x$)/)?.[1];
      return (
        token === value ||
        (prefix !== undefined && new RegExp(`^${prefix}[-+]?\\d+(\\.\\d+)?$`).test(value))
      );
    });
}

/**
 * A mocked myGEKKO device answering the query api with demo data.
 */
export class MockGekko {
  /** The commands received so far */
  public readonly commands: MockGekkoCommand[] = [];
  /** The http status every request fails with, null to answer normally */
  public failWith: number | null = null;
  /** The number of upcoming requests that run into a timeout, only with the installed mock */
  public timeouts = 0;
  private readonly data: MockGekkoData;

  /**
   * The mock constructor.
   * @param data - The data to serve, the demo data by default.
   */
  public constructor(data: MockGekkoData = demoData()) {
    this.data = data;
  }

  /**
   * Answers a request like the device.
   * @param url - The request url or path including the query.
   */
  public handle(url: string): MockGekkoResponse {
    if (this.failWith !== null) {
      return { status: this.failWith, data: '' };
    }

    const [root, ...path] = new URL(url, 'http://mock').pathname
      .replace(/^\/api\/v1/, '')
      .split('/')
      .filter((segment) => segment.length);

    // TODO: serve /trend/system/item/trend/status, the demo data has no trend config and values yet
    if (root === 'trend' && !path.length) {
      return { status: 200, data: this.data.trend };
    }
    if (root === 'var' && !path.length) {
      return { status: 200, data: this.data.config };
    }
    if (root === 'var' && path[path.length - 1] === 'status') {
      const status = find(this.data.status, path.slice(0, -1));
      if (status !== undefined) {
        return { status: 200, data: status };
      }
    }
    if (root === 'var' && path.slice(-2).join('/') === 'scmd/set') {
      const item = path.slice(0, -2);
      const command = find(this.data.config, [...item, 'scmd']);
      const value = url.match(/[?&]value=([^&]*)/)?.[1];
      if (command !== undefined && value !== undefined) {
        this.commands.push({
          system: item.slice(0, -1).join('/'),
          itemId: item[item.length - 1],
          value: decodeURIComponent(value),
          documented: isDocumented(
            find(command, ['format']) ?? find(command, ['value']),
            decodeURIComponent(value)
          ),
        });
        return { status: 200, data: 'OK' };
      }
    }
    return { status: 404, data: '' };
  }

  /**
   * Answers all axios get requests until the jest mocks are restored.
   */
  public install(): void {
    jest.spyOn(axios, 'get').mockImplementation(async (url: string) => {
      if (this.timeouts > 0) {
        this.timeouts--;
        throw new AxiosError('timeout exceeded', 'ECONNABORTED', undefined, {});
      }
      const response = this.handle(url);
      if (response.status !== 200) {
        throw Object.assign(new AxiosError(`Request failed with status code ${response.status}`), {
          response,
        });
      }
      return response;
    });
  }

  /**
   * Installs the mock and returns an initialized client.
   */
  public async createClient(): Promise<LocalClient> {
    this.install();
    const client = new LocalClient({ ip: 'mock', username: 'test', password: 'test' });
    await client.initialize();
    return client;
  }

  /**
   * Serves the mock as http server, use the address as ip of a local client.
   * @param port - The port to listen on, a free one by default.
   */
  public listen(port = 0): Promise<Server> {
    const server = createServer((request, response) => {
      const { status, data } = this.handle(request.url ?? '/');
      response.writeHead(status, {
        'Content-Type': typeof data === 'string' ? 'text/plain' : 'application/json',
      });
      response.end(typeof data === 'string' ? data : JSON.stringify(data));
    });
    return new Promise((resolve) => server.listen(port, '127.0.0.1', () => resolve(server)));
  }
}

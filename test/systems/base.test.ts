import { jest } from '@jest/globals';

import { CLIENT_ERROR_MESSAGES } from '../../src';
import { LocalClient, SystemConfig, TrendConfig } from '../../src/client';

/**
 * Creates a local client with stubbed system and trend configurations.
 * @param systemConfig - The system configuration.
 * @param trendConfig - The trend configuration.
 */
function createClient(systemConfig: SystemConfig, trendConfig: TrendConfig): LocalClient {
  const client = new LocalClient({ ip: '127.0.0.1', username: 'test', password: 'test' });
  jest.spyOn(client, 'systemConfig', 'get').mockReturnValue(systemConfig);
  jest.spyOn(client, 'trendConfig', 'get').mockReturnValue(trendConfig);
  jest.spyOn(client, 'itemStatusRequest').mockResolvedValue({ sumstate: { value: '0;50;0;0;0;' } });
  return client;
}

test('getItemById validates the item id against the system config', async () => {
  const client = createClient(
    JSON.parse('{"blinds": {"item0": {"name": "Blind", "page": "Page"}}}'),
    JSON.parse('{"blinds": {}}')
  );

  await expect(client.blinds.getItemById('item0')).resolves.toMatchObject({
    itemId: 'item0',
    name: 'Blind',
    position: 50,
  });
  await expect(client.blinds.getItemById('item1')).rejects.toThrow(
    CLIENT_ERROR_MESSAGES.ITEM_ID_NOT_FOUND
  );
});

test('getItemById works without any trend configuration', async () => {
  const client = createClient(
    JSON.parse('{"blinds": {"item0": {"name": "Blind", "page": "Page"}}}'),
    JSON.parse('{}')
  );

  await expect(client.blinds.getItemById('item0')).resolves.toMatchObject({ itemId: 'item0' });
});

import { CLIENT_ERROR } from '../../src/errors';
import { SystemTypes } from '../../src/systems/base/types';
import {
  throwErrorIfItemIdIsNoAvailable,
  throwErrorIfSystemIsNotEnabled,
  throwErrorIfTrendIsNotAvailable,
} from '../../src/utils/errorUtils';

test('throwErrorIfSystemIsNotEnabled', () => {
  expect(() =>
    throwErrorIfSystemIsNotEnabled(JSON.parse('{"blinds": {"item0":{}}}'), SystemTypes.blinds)
  ).not.toThrow();
  expect(() =>
    throwErrorIfSystemIsNotEnabled('{"blinds": {"item0":{}}}', SystemTypes.lights)
  ).toThrow(CLIENT_ERROR.SYSTEM_NOT_SUPPORTED);
  expect(() => throwErrorIfSystemIsNotEnabled('', SystemTypes.blinds)).toThrow(
    CLIENT_ERROR.SYSTEM_NOT_INITIALIZED
  );
});

test('throwErrorIfTrendIsNotAvailable', () => {
  expect(() =>
    throwErrorIfTrendIsNotAvailable(JSON.parse('{"blinds": {"item0":{}}}'), SystemTypes.blinds)
  ).not.toThrow();
  expect(() =>
    throwErrorIfTrendIsNotAvailable('{"blinds": {"item0":{}}}', SystemTypes.lights)
  ).toThrow(CLIENT_ERROR.TREND_NOT_SUPPORTED);
  expect(() => throwErrorIfTrendIsNotAvailable('', SystemTypes.blinds)).toThrow(
    CLIENT_ERROR.SYSTEM_NOT_INITIALIZED
  );
});

test('throwErrorIfItemIdIsNoAvailable', () => {
  expect(() =>
    throwErrorIfItemIdIsNoAvailable(
      JSON.parse('{"blinds": {"item0":{}}}'),
      SystemTypes.blinds,
      'item0'
    )
  ).not.toThrow();

  expect(() =>
    throwErrorIfItemIdIsNoAvailable(
      JSON.parse('{"globals": {"meteo": {"item0":{}}}}'),
      SystemTypes.weather,
      'item0'
    )
  ).not.toThrow();

  expect(() =>
    throwErrorIfItemIdIsNoAvailable(
      JSON.parse('{"blinds": {"item0":{}}}'),
      SystemTypes.blinds,
      'item3'
    )
  ).toThrow(CLIENT_ERROR.ITEM_ID_NOT_FOUND);

  expect(() =>
    throwErrorIfItemIdIsNoAvailable(
      JSON.parse('{"globals": {"meteo": {"item0":{}}}}'),
      SystemTypes.weather,
      'item3'
    )
  ).toThrow(CLIENT_ERROR.ITEM_ID_NOT_FOUND);
});

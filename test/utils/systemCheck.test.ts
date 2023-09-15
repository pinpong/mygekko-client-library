import { CLIENT_ERROR } from '../../src/errors';
import { SystemType } from '../../src/systems/base/types';
import {
  throwErrorIfItemIdIsNoFound,
  throwErrorIfSystemIsNotEnabled,
  throwErrorIfTrendIsNotEnabled,
} from '../../src/utils/errorUtils';

test('throwErrorIfSystemIsNotEnabled', () => {
  expect(() =>
    throwErrorIfSystemIsNotEnabled(JSON.parse('{"blinds": {"item0":{}}}'), SystemType.blinds)
  ).not.toThrow();
  expect(() =>
    throwErrorIfSystemIsNotEnabled('{"blinds": {"item0":{}}}', SystemType.lights)
  ).toThrow(CLIENT_ERROR.SYSTEM_NOT_SUPPORTED);
  expect(() => throwErrorIfSystemIsNotEnabled('', SystemType.blinds)).toThrow(
    CLIENT_ERROR.SYSTEM_NOT_INITIALIZED
  );
});

test('throwErrorIfTrendIsNotAvailable', () => {
  expect(() =>
    throwErrorIfTrendIsNotEnabled(JSON.parse('{"blinds": {"item0":{}}}'), SystemType.blinds)
  ).not.toThrow();
  expect(() =>
    throwErrorIfTrendIsNotEnabled('{"blinds": {"item0":{}}}', SystemType.lights)
  ).toThrow(CLIENT_ERROR.TREND_NOT_SUPPORTED);
  expect(() => throwErrorIfTrendIsNotEnabled('', SystemType.blinds)).toThrow(
    CLIENT_ERROR.SYSTEM_NOT_INITIALIZED
  );
});

test('throwErrorIfItemIdIsNoAvailable', () => {
  expect(() =>
    throwErrorIfItemIdIsNoFound(JSON.parse('{"blinds": {"item0":{}}}'), SystemType.blinds, 'item0')
  ).not.toThrow();

  expect(() =>
    throwErrorIfItemIdIsNoFound(
      JSON.parse('{"globals": {"meteo": {"item0":{}}}}'),
      SystemType.weather,
      'item0'
    )
  ).not.toThrow();

  expect(() =>
    throwErrorIfItemIdIsNoFound(JSON.parse('{"blinds": {"item0":{}}}'), SystemType.blinds, 'item3')
  ).toThrow(CLIENT_ERROR.ITEM_ID_NOT_FOUND);

  expect(() =>
    throwErrorIfItemIdIsNoFound(
      JSON.parse('{"globals": {"meteo": {"item0":{}}}}'),
      SystemType.weather,
      'item3'
    )
  ).toThrow(CLIENT_ERROR.ITEM_ID_NOT_FOUND);
});

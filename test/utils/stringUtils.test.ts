import { CLIENT_ERROR_MESSAGES } from '../../src';
import {
  systemFilteredByGroup,
  systemFilteredByItems,
  valuesToStringList,
} from '../../src/utils/extensions/stringUtils';

test('valuesToStringList', () => {
  expect(valuesToStringList(JSON.parse('{"sumstate":{"value":"0;0;3;kW;10.001;"}}'))).toEqual([
    '0',
    '0',
    '3',
    'kW',
    '10.001',
  ]);
  expect(valuesToStringList({ sumstate: { value: '0;0;3;C°;199.999;' } })).toEqual([
    '0',
    '0',
    '3',
    'C°',
    '199.999',
  ]);
  expect(valuesToStringList({ sumstate: { value: '0;100.00;50;0;90' } })).toEqual([
    '0',
    '100.00',
    '50',
    '0',
    '90',
  ]);

  expect(() => {
    valuesToStringList(JSON.parse('{}'));
  }).toThrow(CLIENT_ERROR_MESSAGES.CANNOT_PARSE_STATUS);
});

test('systemFilteredByItems', () => {
  expect(
    systemFilteredByItems(
      JSON.parse(
        '{"item0":{"sumstate":{"value":"0;0;3;C°;199.999;"}}, "group0":{"sumstate":{"value":"0;"}}}'
      )
    )
  ).toEqual(['item0']);
  expect(systemFilteredByItems('test')).toEqual([]);
});

test('systemFilteredByGroup', () => {
  expect(
    systemFilteredByGroup(
      JSON.parse(
        '{"item0":{"sumstate":{"value":"0;0;3;C°;199.999;"}}, "group0":{"sumstate":{"value":"0;"}}}'
      )
    )
  ).toEqual(['group0']);
  expect(systemFilteredByGroup('test')).toEqual([]);
});

import { CLIENT_ERROR } from '../../src/errors';
import {
  systemFilteredByGroup,
  systemFilteredByItems,
  valuesToStringList,
} from '../../src/utils/stringUtils';

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

  expect(() => {
    valuesToStringList(JSON.parse('{}'));
  }).toThrow(CLIENT_ERROR.CANNOT_PARSE_STATUS);
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

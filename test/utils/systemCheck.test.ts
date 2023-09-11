import { throwErrorIfSystemIsNotEnabled } from '../../src/utils/systemCheck';
import { CLIENT_ERROR } from '../../src/errors';

test('throwErrorIfSystemIsNotEnabled', () => {
  expect(() => throwErrorIfSystemIsNotEnabled('test')).not.toThrow();
  expect(() => throwErrorIfSystemIsNotEnabled(null)).toThrow(CLIENT_ERROR.SYSTEM_NOT_ENABLED);
  expect(() => throwErrorIfSystemIsNotEnabled(undefined)).toThrow(CLIENT_ERROR.SYSTEM_NOT_ENABLED);
});

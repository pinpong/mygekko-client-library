import { throwErrorIfSystemIsNotEnabled } from '../../src/utils/systemCheck';
import { CLIENT_ERROR } from '../../src/errors';

test('throwErrorIfSystemIsNotEnabled', () => {
  expect(() =>
    throwErrorIfSystemIsNotEnabled(JSON.parse('{"blinds": {"item0":{}}}'), ['blinds'])
  ).not.toThrow();
  expect(() => throwErrorIfSystemIsNotEnabled('', ['blinds'])).toThrow(
    CLIENT_ERROR.SYSTEM_NOT_INITIALIZED
  );
});

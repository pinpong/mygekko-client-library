import { throwErrorIfSystemIsNotEnabled } from "../../lib/utils/systemCheck";

test("throwErrorIfSystemIsNotEnabled", () => {
  expect(() => throwErrorIfSystemIsNotEnabled("test")).not.toThrow();
  expect(() => throwErrorIfSystemIsNotEnabled(null)).toThrow(
    "System not enabled",
  );
  expect(() => throwErrorIfSystemIsNotEnabled(undefined)).toThrow(
    "System not enabled",
  );
});

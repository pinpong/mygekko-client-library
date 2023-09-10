import {
  systemFilteredByGroup,
  systemFilteredByItems,
  valuesToStringList,
} from "../../src/utils/stringUtils";

test("valuesToStringList", () => {
  expect(
    valuesToStringList(
      JSON.parse('{"sumstate":{"value":"0;0;3;kW;10.001;"}}'),
      null,
    ),
  ).toEqual(["0", "0", "3", "kW", "10.001"]);
  expect(
    valuesToStringList(
      JSON.parse('{"item0":{"sumstate":{"value":"0;0;3;C°;199.999;"}}}'),
      "item0",
    ),
  ).toEqual(["0", "0", "3", "C°", "199.999"]);

  expect(() => {
    valuesToStringList(
      JSON.parse('{"item0":{"sumstate":{"value":"0;0;0;0;0;"}}}'),
      "item1",
    );
  }).toThrow("Can not parse status");
});

test("systemFilteredByItems", () => {
  expect(
    systemFilteredByItems(
      JSON.parse(
        '{"item0":{"sumstate":{"value":"0;0;3;C°;199.999;"}}, "group0":{"sumstate":{"value":"0;"}}}',
      ),
    ),
  ).toEqual(["item0"]);
  expect(systemFilteredByItems("test")).toEqual([]);
});

test("systemFilteredByGroup", () => {
  expect(
    systemFilteredByGroup(
      JSON.parse(
        '{"item0":{"sumstate":{"value":"0;0;3;C°;199.999;"}}, "group0":{"sumstate":{"value":"0;"}}}',
      ),
    ),
  ).toEqual(["group0"]);
  expect(systemFilteredByGroup("test")).toEqual([]);
});

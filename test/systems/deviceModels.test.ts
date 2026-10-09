import { RoomTemperatureDeviceModel, VentDeviceModel } from '../../src';
import { MockGekko } from '../mock/mockGekko';

afterEach(() => {
  jest.restoreAllMocks();
});

test('working modes by device model', async () => {
  const { vents, roomTemperatures } = await new MockGekko().createClient();

  expect(vents.getWorkingModes(VentDeviceModel.standard)).toEqual({ off: 0, on: 1 });
  expect(vents.getWorkingModes(VentDeviceModel.zimmermannV1)).toEqual({ off: 0, on: 1 });
  expect(vents.getWorkingModes(VentDeviceModel.pluggit)).toEqual({
    auto: 0,
    manual: 1,
    pluggitAuto: 2,
    pluggitWeek: 3,
  });
  expect(vents.getWorkingModes(VentDeviceModel.zimmermannV2)).toEqual({
    off: 0,
    ecoSummer: 1,
    ecoWinter: 2,
    comfort: 3,
    ovenOperation: 4,
  });
  expect(vents.getWorkingModes(null)).toEqual({ off: 0, on: 1 });

  expect(roomTemperatures.getWorkingModes(RoomTemperatureDeviceModel.standard)).toEqual({
    off: 1,
    on: 2,
    comfort: 8,
    reduced: 16,
    manual: 64,
    standby: 256,
  });
  expect(roomTemperatures.getWorkingModes(RoomTemperatureDeviceModel.knx)).toEqual({
    auto: 0,
    comfort: 1,
    standby: 2,
    economy: 3,
    buildingProtection: 4,
  });
  expect(roomTemperatures.getWorkingModes(null)).toEqual(
    roomTemperatures.getWorkingModes(RoomTemperatureDeviceModel.standard)
  );
});

test('vent commands by device model', async () => {
  const { vents } = await new MockGekko().createClient();
  const vent = (
    deviceModel: number | null,
    workingMode = 0,
    ventLevel = 1
  ): { deviceModel: number | null; workingMode: number; ventLevel: number } => ({
    deviceModel,
    workingMode,
    ventLevel,
  });

  expect(vents.isLevelSupported(vent(VentDeviceModel.standard))).toBe(true);
  expect(vents.isLevelSupported(vent(VentDeviceModel.zimmermannV2, 0))).toBe(false);
  expect(vents.isLevelSupported(vent(VentDeviceModel.zimmermannV2, 1))).toBe(true);
  expect(vents.isLevelSupported(vent(VentDeviceModel.zimmermannV2, 2))).toBe(true);
  expect(vents.isLevelSupported(vent(VentDeviceModel.zimmermannV2, 3))).toBe(false);
  expect(vents.isLevelSupported(vent(null))).toBe(false);

  expect(vents.isLevelOffSupported(vent(VentDeviceModel.westaflex))).toBe(true);
  expect(vents.isLevelOffSupported(vent(VentDeviceModel.zimmermannV2, 1, 2))).toBe(false);
  expect(vents.isLevelOffSupported(vent(VentDeviceModel.zimmermannV2, 0, 2))).toBe(true);
  expect(vents.isLevelOffSupported(vent(VentDeviceModel.zimmermannV2, 1, 0))).toBe(true);

  expect(vents.isBypassSupported(vent(VentDeviceModel.standard))).toBe(true);
  expect(vents.isBypassSupported(vent(VentDeviceModel.pluggit))).toBe(true);
  expect(vents.isBypassSupported(vent(VentDeviceModel.zimmermannV1))).toBe(false);
  expect(vents.isBypassSupported(vent(VentDeviceModel.zimmermannV2))).toBe(false);
  expect(vents.isBypassSupported(vent(VentDeviceModel.stiebelLWZ))).toBe(false);

  expect(vents.isCoolingSupported(vent(VentDeviceModel.pluggit))).toBe(true);
  expect(vents.isCoolingSupported(vent(VentDeviceModel.westaflex))).toBe(false);
  expect(vents.isCoolingSupported(vent(VentDeviceModel.zimmermannV2, 3))).toBe(true);
  expect(vents.isCoolingSupported(vent(VentDeviceModel.zimmermannV2, 1))).toBe(true);
  expect(vents.isCoolingSupported(vent(VentDeviceModel.zimmermannV2, 2))).toBe(false);
});

/// TODO: mock a gekko instance?
import { LocalClient, RemoteClient } from "../../src";

test("remote client", async () => {
  const client = new RemoteClient({
    username: "test",
    gekkoId: "test",
    apiKey: "test",
  });

  client.accesses.getAll();

  await expect(async () => await client.initialize()).rejects.toThrow();
});

test("local client", async () => {
  const client = new LocalClient({
    ip: "127.0.1",
    username: "test",
    password: "test",
  });

  await expect(async () => await client.initialize()).rejects.toThrow();
});

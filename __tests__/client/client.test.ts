/// TODO: mock a gekko instance?
import { LocalClient, RemoteClient } from "../../src";

test("remote client", async () => {
  const client = new RemoteClient({
    username: "test",
    gekkoId: "test",
    apiKey: "test",
  });

  /*
      try {
        const blinds = client.blinds.getAll();
        console.error(blinds);
        await client.blinds.setPosition("item0", 75);
      } catch (e) {
        console.log(e);
      }
     */

  await expect(async () => await client.initialize()).rejects.toThrow();
});

test("local client", async () => {
  const client = new LocalClient({
    ip: "127.0.1",
    username: "test",
    password: "test",
  });

  /*
      try {
        const blinds = client.blinds.getAll();
        console.error(blinds);
        await client.blinds.setPosition("item0", 75);
      } catch (e) {
        console.log(e);
      }
     */

  await expect(async () => await client.initialize()).rejects.toThrow();
});

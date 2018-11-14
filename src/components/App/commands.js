import UUID from "uuid";

let redisInstances = {};
let callbackQueue = {};

class RedisInstance {
  constructor(uuid) {
    this.uuid = uuid;
  }

  send(command, ...args) {
    let callbackUuid = UUID.v4();
    callbackQueue[callbackUuid] = args.length === 2 ? args[1] : args[0];

    window.ipcRenderer.send("redis-command", {
      args: args.length === 2 ? args[1] : [],
      command: command,
      uuid: this.uuid,
      queue: callbackUuid
    });
  }
}

window.ipcRenderer.on("redis-command", (event, message) => {
  const callback = callbackQueue[message.queue];

  console.log(`RENDERER - Got command ${ message.command } (${ message.queue }) - callback: ${ callback ? "yes" : "no" }`);

  if (callback) {
    callback(message.error, message.result);
    delete callbackQueue[message.queue];
  }
});

export const Commands = {
  createClient: (options) => {
    const message = window.ipcRenderer.sendSync("redis-command", {
      command: "createClient",
      args: [options]
    });

    redisInstances[message.uuid] = new RedisInstance(message.uuid);
    return redisInstances[message.uuid];
  }
};

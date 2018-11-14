import UUID from "uuid";

class RedisInstance {
  constructor(uuid) {
    this.uuid = uuid;
    this.callbackQueue = [];

    window.ipcRenderer.on("redis-command", (event, message) => {
      if (message.uuid !== this.uuid) {
        return;
      }

      const callback = this.callbackQueue.find(callback => callback.queue === message.queue);

      console.log(`RENDERER - Got command ${ message.command } (${ message.queue }) - callback: ${ callback ? "yes" : "no" }`);

      if (callback) {
        this.callbackQueue = this.callbackQueue.filter(callback => callback.uuid !== message.queue);
        callback.callback(message.error, message.result);
      }
    });
  }

  send(command, ...args) {
    let callbackUuid = UUID.v4();

    this.callbackQueue.push({
      queue: callbackUuid,
      callback: args.length === 2 ? args[1] : args[0]
    });

    window.ipcRenderer.send("redis-command", {
      args: args.length === 2 ? args[1] : [],
      command: command,
      uuid: this.uuid,
      queue: callbackUuid
    });
  }
}

export const Redis = {
  createClient: (options) => {
    const message = window.ipcRenderer.sendSync("redis-command", {
      command: "createClient",
      args: [options]
    });

    return new RedisInstance(message.uuid);
  }
};
